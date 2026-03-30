import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/useAuth";
import generateProposalContent from "../../../../lib/aiProposalGenerator";
import exportProposalToHTML from "../../../../lib/exportProposalToHTML";
import saveProposalDraft from "../../../../lib/saveProposalDraft";
import uploadProposalVideo from "../../../../lib/uploadProposalVideo";
import { loadTemplateRecord, touchTemplateRecord } from "../../../../lib/templateLibrary";
import TemplateActionBar from "./components/TemplateActionBar";
import TemplateEditorPanel from "./components/TemplateEditorPanel";
import TemplatePreviewPanel from "./components/TemplatePreviewPanel";
import {
  addInstructionStep,
  applyGeneratedInstructionContent,
  applyInstructionImages,
  applyInstructionPreset,
  appendInstructionImages,
  applyVideoMedia,
  createInitialTemplateState,
  createTemplateMedia,
  normalizeInstructionTemplate,
  removeInstructionStep,
  toLegacyInstructionPayload,
  updateTemplateField,
  updateTemplateSectionContent,
  updateTemplateSectionEnabled,
  updateInstructionStep,
} from "./templateModel";

const inputClassName =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400";

const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

const builderLayout = {
  workspaceGrid:
    "grid gap-6 xl:grid-cols-[minmax(320px,360px)_minmax(0,1.2fr)] 2xl:grid-cols-[minmax(340px,380px)_minmax(0,1.45fr)]",
  editorPanel:
    "premium-panel-strong p-5 sm:p-6 xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto",
  previewCanvas: "max-w-[1360px]",
};

const createInstructionDraftId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `instruction-${Date.now()}`;

const buildPersistedTemplatePayload = (template) => ({
  ...template,
  ...toLegacyInstructionPayload(template),
});

export default function ProposalGeneratorPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState(createInitialTemplateState);
  const [statusMessage, setStatusMessage] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const [proposalDraftId, setProposalDraftId] = useState(createInstructionDraftId);
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
        if (
          !record ||
          record.ownerId !== user.uid ||
          (record.templateType !== "instruction" && record.templateType !== "proposal")
        ) {
          setStatusMessage("");
          return;
        }
        setTemplate(normalizeInstructionTemplate(record.data || createInitialTemplateState()));
        setProposalDraftId(record.id);
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

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setTemplate((current) => updateTemplateField(current, field, value));
  };

  const updateSection = (sectionId) => (event) => {
    const { value } = event.target;
    setTemplate((current) => updateTemplateSectionContent(current, sectionId, value));
  };

  const updateSectionToggle = (sectionId) => (event) => {
    const { checked } = event.target;
    setTemplate((current) => updateTemplateSectionEnabled(current, sectionId, checked));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      setTemplate((current) => applyInstructionImages(current, []));
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(
                createTemplateMedia({
                  type: file.type || "image/*",
                  url: typeof reader.result === "string" ? reader.result : "",
                  name: file.name,
                })
              );
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((mediaList) => {
      setTemplate((current) => appendInstructionImages(current, mediaList));
    });
  };

  const handleStepImageUpload = (stepId) => (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextImage = createTemplateMedia({
        type: file.type || "image/*",
        url: typeof reader.result === "string" ? reader.result : "",
        name: file.name,
      });

      setTemplate((current) => updateInstructionStep(current, stepId, { image: nextImage }));
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    setVideoUploadError("");

    if (!user) {
      setStatusMessage("");
      setVideoUploadError("Sign in to upload a walkthrough video.");
      event.target.value = "";
      return;
    }

    setIsUploadingVideo(true);
    setStatusMessage("Uploading video...");

    try {
      const uploadedVideo = await uploadProposalVideo({
        file,
        userId: user.uid,
      });

      const videoMedia = createTemplateMedia({
        type: uploadedVideo.videoType || "video/mp4",
        url: uploadedVideo.videoUrl,
        name: uploadedVideo.videoName,
        storagePath: uploadedVideo.storagePath,
      });

      const nextTemplate = applyVideoMedia(template, videoMedia);

      await saveProposalDraft({
        draftId: proposalDraftId,
        userId: user.uid,
        proposal: buildPersistedTemplatePayload(nextTemplate),
      });

      setTemplate(nextTemplate);
      setStatusMessage("Video uploaded and attached to your guide.");
    } catch (error) {
      setStatusMessage("");
      setVideoUploadError(error.message || "Video upload failed.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleGenerateProposal = () => {
    setStatusMessage("Preview refreshed and ready to share.");
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    setStatusMessage("Generating instruction content...");

    try {
      const generatedContent = await generateProposalContent({
        projectName: template.title,
        guideType: template.guideType,
        audience: template.audience,
        subtitle: template.subtitle,
      });

      setTemplate((current) => applyGeneratedInstructionContent(current, generatedContent));
      setStatusMessage("AI content generated and added to your instruction guide.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDownloadHtml = () => {
    const exportPayload = toLegacyInstructionPayload(template);
    const html = exportProposalToHTML(exportPayload);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeFileName = (template.title || "instruction")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    anchor.href = objectUrl;
    anchor.download = `${safeFileName || "instruction"}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
    setStatusMessage("HTML file downloaded.");
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="premium-panel p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="premium-kicker">Templates / Instruction Builder</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                Create polished instruction guides in one workspace
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
                Draft step-by-step instructions, preview the final output live, and export HTML for handover.
              </p>
            </div>

            <Link to="/templates" className="premium-button-secondary">
              <ArrowLeft size={16} />
              Back to Templates
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["AI-assisted draft", "Live preview", "HTML export", "Reusable SOP engine"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[32px] border border-cyan-400/15 bg-cyan-400/10 p-6 shadow-[0_18px_50px_rgba(34,211,238,0.08)]">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/75">Featured template tool</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Instruction Studio</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            The master template engine for SOPs, training guides, and handover documentation with media-rich output.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Template type</p>
              <p className="mt-2 text-sm font-medium text-white">{template.templateType}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Output</p>
              <p className="mt-2 text-sm font-medium text-white">Live preview, saved draft data, exportable HTML</p>
            </div>
          </div>
        </aside>
      </section>

      <div className={builderLayout.workspaceGrid}>
        <section className={builderLayout.editorPanel}>
          <TemplateEditorPanel
            template={template}
            inputClassName={inputClassName}
            textareaClassName={textareaClassName}
            isUploadingVideo={isUploadingVideo}
            onFieldChange={updateField}
            onSectionChange={updateSection}
            onSectionToggle={updateSectionToggle}
            onPresetChange={(event) => {
              const selectedPresetId = event.target.value;
              setTemplate((current) => applyInstructionPreset(current, selectedPresetId));
            }}
            onStepChange={(stepId, field) => (event) => {
              const { value } = event.target;
              setTemplate((current) => updateInstructionStep(current, stepId, { [field]: value }));
            }}
            onStepAdd={() => setTemplate((current) => addInstructionStep(current))}
            onStepRemove={(stepId) => setTemplate((current) => removeInstructionStep(current, stepId))}
            onStepImageUpload={handleStepImageUpload}
            onImageUpload={handleImageUpload}
            onVideoUpload={handleVideoUpload}
          />

          <TemplateActionBar
            isGeneratingAI={isGeneratingAI}
            onGenerateWithAI={handleGenerateWithAI}
            onRefreshPreview={handleGenerateProposal}
            onDownloadHtml={handleDownloadHtml}
            statusMessage={statusMessage}
            uploadError={videoUploadError}
          />
        </section>

        <TemplatePreviewPanel template={template} previewCanvasClassName={builderLayout.previewCanvas} />
      </div>
    </div>
  );
}
