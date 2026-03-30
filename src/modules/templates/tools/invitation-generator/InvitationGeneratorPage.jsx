import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/useAuth";
import generateInvitationContent from "../../../../lib/aiInvitationGenerator";
import exportInvitationToHTML from "../../../../lib/exportInvitationToHTML";
import saveInvitationDraft from "../../../../lib/saveInvitationDraft";
import uploadInvitationMedia from "../../../../lib/uploadInvitationMedia";
import { loadTemplateRecord, touchTemplateRecord } from "../../../../lib/templateLibrary";
import InvitationActionBar from "./components/InvitationActionBar";
import InvitationEditorPanel from "./components/InvitationEditorPanel";
import InvitationMediaPanel from "./components/InvitationMediaPanel";
import InvitationPreviewPanel from "./components/InvitationPreviewPanel";
import {
  applyGeneratedInvitationContent,
  applyInvitationTypeDefaults,
  applyMediaAsset,
  buildInvitationAIPayload,
  createInitialInvitationState,
  createInvitationMedia,
  removeMediaAsset,
  updateInvitationField,
  updateInvitationSectionEnabled,
} from "./invitationModel";
import { getInvitationTypeConfig } from "./invitationConfig";

const builderLayout = {
  workspaceGrid:
    "grid gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1.25fr)] 2xl:grid-cols-[minmax(360px,420px)_minmax(0,1.5fr)]",
  editorPanel:
    "premium-panel-strong p-5 sm:p-6 xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto",
  previewCanvas: "max-w-[1380px]",
};

const createInvitationDraftId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `invitation-${Date.now()}`;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export default function InvitationGeneratorPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState(() => createInitialInvitationState());
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [invitationDraftId, setInvitationDraftId] = useState(createInvitationDraftId);
  const templateId = searchParams.get("templateId");

  useEffect(() => {
    if (!templateId || !user) {
      return;
    }

    let isMounted = true;
    setStatusMessage("Loading template...");

    loadTemplateRecord({ recordId: templateId })
      .then((record) => {
        if (!isMounted) {
          return;
        }
        if (!record || record.ownerId !== user.uid || record.templateType !== "invitation") {
          setStatusMessage("");
          return;
        }
        setTemplate(record.data || createInitialInvitationState());
        setInvitationDraftId(record.id);
        setStatusMessage("Template loaded from library.");
        touchTemplateRecord(record.id);
      })
      .catch(() => {
        if (isMounted) {
          setStatusMessage("");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [templateId, user]);

  const handleFieldChange = (field, value) => {
    setTemplate((current) => updateInvitationField(current, field, value));
  };

  const handleInvitationTypeChange = (value) => {
    setTemplate((current) => applyInvitationTypeDefaults(current, value));
  };

  const handleSectionToggle = (sectionId, enabled) => {
    setTemplate((current) => updateInvitationSectionEnabled(current, sectionId, enabled));
  };

  const handleImageUpload = (role) => async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    const media = createInvitationMedia({
      role,
      url: dataUrl,
      name: file.name,
      mimeType: file.type,
      type: "image",
    });

    setTemplate((current) => applyMediaAsset(current, media));
  };

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const assets = await Promise.all(
      files.map(async (file) =>
        createInvitationMedia({
          role: "gallery",
          url: await readFileAsDataUrl(file),
          name: file.name,
          mimeType: file.type,
          type: "image",
        })
      )
    );

    setTemplate((current) => assets.reduce((next, media) => applyMediaAsset(next, media), current));
  };

  const handleVideoUpload = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    setErrorMessage("");

    if (!user) {
      setErrorMessage("Sign in to upload invitation videos.");
      event.target.value = "";
      return;
    }

    setIsUploadingVideo(true);
    setStatusMessage("Uploading video...");

    try {
      const uploadedVideo = await uploadInvitationMedia({
        file,
        userId: user.uid,
      });

      const videoMedia = createInvitationMedia({
        role: "video",
        url: uploadedVideo.mediaUrl,
        name: uploadedVideo.mediaName,
        mimeType: uploadedVideo.mediaType,
        storagePath: uploadedVideo.storagePath,
        type: "video",
      });

      const nextTemplate = applyMediaAsset(template, videoMedia);
      await saveInvitationDraft({
        draftId: invitationDraftId,
        userId: user.uid,
        invitation: nextTemplate,
      });

      setTemplate(nextTemplate);
      setStatusMessage("Video uploaded and attached to your invitation.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(error.message || "Video upload failed.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleRemoveMedia = (mediaId) => {
    setTemplate((current) => removeMediaAsset(current, mediaId));
  };

  const handleGenerateWithAI = async () => {
    const config = getInvitationTypeConfig(template.invitationType);

    setIsGeneratingAI(true);
    setStatusMessage("Generating invitation content...");
    setErrorMessage("");

    try {
      const payload = buildInvitationAIPayload(template, config);
      const generatedContent = await generateInvitationContent(payload);
      setTemplate((current) => applyGeneratedInvitationContent(current, generatedContent));
      setStatusMessage("AI content generated and added to your invitation.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(error.message || "Failed to generate invitation content.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      setErrorMessage("Sign in to save invitation drafts.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("Saving invitation draft...");
    setErrorMessage("");

    try {
      await saveInvitationDraft({
        draftId: invitationDraftId,
        userId: user.uid,
        invitation: template,
      });
      setStatusMessage("Invitation draft saved.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(error.message || "Failed to save invitation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportHtml = () => {
    const html = exportInvitationToHTML(template);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeFileName = (template.title || "invitation")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    anchor.href = objectUrl;
    anchor.download = `${safeFileName || "invitation"}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
    setStatusMessage("Invitation HTML exported.");
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="premium-panel p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="premium-kicker">Templates / AI Invitation Studio</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                Design premium invitations with a creative builder
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
                Select an invitation type, edit dynamic fields, and generate a share-ready invitation with a premium live preview.
              </p>
            </div>

            <Link to="/templates" className="premium-button-secondary">
              <ArrowLeft size={16} />
              Back to Templates
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["AI-assisted invites", "Dynamic event fields", "Premium preview", "HTML export"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-medium text-fuchsia-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[32px] border border-fuchsia-400/15 bg-fuchsia-400/10 p-6 shadow-[0_18px_50px_rgba(236,72,153,0.14)]">
          <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-100/75">Invitation studio</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Creative Event Builder</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Generate event-ready invitation pages with dynamic layouts, AI messaging, and exportable HTML.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Invitation type</p>
              <p className="mt-2 text-sm font-medium text-white">{template.invitationType.replace("-", " ")}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Layout style</p>
              <p className="mt-2 text-sm font-medium text-white">{template.layoutStyle.replace("-", " ")}</p>
            </div>
          </div>
        </aside>
      </section>

      <div className={builderLayout.workspaceGrid}>
        <section className={builderLayout.editorPanel}>
          <InvitationEditorPanel
            template={template}
            onFieldChange={handleFieldChange}
            onInvitationTypeChange={handleInvitationTypeChange}
            onSectionToggle={handleSectionToggle}
          />

          <div className="mt-6 space-y-5">
            <InvitationMediaPanel
              template={template}
              onImageUpload={handleImageUpload}
              onGalleryUpload={handleGalleryUpload}
              onVideoUpload={handleVideoUpload}
              onRemoveMedia={handleRemoveMedia}
              isUploadingVideo={isUploadingVideo}
            />
          </div>

          <InvitationActionBar
            isGeneratingAI={isGeneratingAI}
            isSaving={isSaving}
            onGenerateWithAI={handleGenerateWithAI}
            onSaveDraft={handleSaveDraft}
            onExportHtml={handleExportHtml}
            statusMessage={statusMessage}
            errorMessage={errorMessage}
          />
        </section>

        <InvitationPreviewPanel template={template} previewCanvasClassName={builderLayout.previewCanvas} />
      </div>
    </div>
  );
}
