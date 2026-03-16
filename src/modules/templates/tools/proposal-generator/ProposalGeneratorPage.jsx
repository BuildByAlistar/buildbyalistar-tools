import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/useAuth";
import generateProposalContent from "../../../../lib/aiProposalGenerator";
import exportProposalToHTML from "../../../../lib/exportProposalToHTML";
import saveProposalDraft from "../../../../lib/saveProposalDraft";
import uploadProposalVideo from "../../../../lib/uploadProposalVideo";
import TemplateActionBar from "./components/TemplateActionBar";
import TemplateEditorPanel from "./components/TemplateEditorPanel";
import TemplatePreviewPanel from "./components/TemplatePreviewPanel";
import {
  applyGeneratedProposalContent,
  applyPrimaryImage,
  applyVideoMedia,
  createInitialTemplateState,
  createTemplateMedia,
  toLegacyProposalPayload,
  updateTemplateField,
  updateTemplateSectionContent,
  updateTemplateSectionEnabled,
} from "./templateModel";

const inputClassName =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400";

const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

const createProposalDraftId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `proposal-${Date.now()}`;

const buildPersistedTemplatePayload = (template) => ({
  ...template,
  ...toLegacyProposalPayload(template),
});

export default function ProposalGeneratorPage() {
  const { user } = useAuth();
  const [template, setTemplate] = useState(createInitialTemplateState);
  const [statusMessage, setStatusMessage] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const [proposalDraftId] = useState(createProposalDraftId);

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
    const [file] = event.target.files || [];

    if (!file) {
      setTemplate((current) => applyPrimaryImage(current, null));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextImage = createTemplateMedia({
        type: file.type || "image/*",
        url: typeof reader.result === "string" ? reader.result : "",
        name: file.name,
      });

      setTemplate((current) => applyPrimaryImage(current, nextImage));
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
      setVideoUploadError("Sign in to upload a proposal demo video.");
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
      setStatusMessage("Video uploaded and attached to your proposal.");
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
    setStatusMessage("Generating proposal content...");

    try {
      const generatedContent = await generateProposalContent({
        projectName: template.title,
        businessType: template.businessType,
        clientName: template.clientName,
      });

      setTemplate((current) => applyGeneratedProposalContent(current, generatedContent));
      setStatusMessage("AI content generated and added to your proposal.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDownloadHtml = () => {
    const exportPayload = toLegacyProposalPayload(template);
    const html = exportProposalToHTML(exportPayload);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeFileName = (template.title || "proposal")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    anchor.href = objectUrl;
    anchor.download = `${safeFileName || "proposal"}.html`;
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
              <p className="premium-kicker">Templates / AI Proposal Generator</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                Create polished client proposals in one workspace
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
                Draft proposal sections, preview the final output live, and export an HTML version for delivery.
              </p>
            </div>

            <Link to="/templates" className="premium-button-secondary">
              <ArrowLeft size={16} />
              Back to Templates
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["AI-assisted draft", "Live preview", "HTML export", "Reusable template engine"].map((item) => (
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
          <h2 className="mt-3 text-2xl font-semibold text-white">Proposal Studio</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            The working master template engine for structured proposal generation, media-rich delivery, and reusable future template types.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Template type</p>
              <p className="mt-2 text-sm font-medium text-white">{template.templateType}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Output</p>
              <p className="mt-2 text-sm font-medium text-white">Live preview, saved draft data, downloadable HTML</p>
            </div>
          </div>
        </aside>
      </section>

      <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
        <section className="premium-panel-strong p-6">
          <TemplateEditorPanel
            template={template}
            inputClassName={inputClassName}
            textareaClassName={textareaClassName}
            isUploadingVideo={isUploadingVideo}
            onFieldChange={updateField}
            onSectionChange={updateSection}
            onSectionToggle={updateSectionToggle}
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

        <TemplatePreviewPanel template={template} />
      </div>
    </div>
  );
}
