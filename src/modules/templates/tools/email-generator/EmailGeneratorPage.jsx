import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/useAuth";
import generateEmailContent from "../../../../lib/aiEmailGenerator";
import exportEmailToHTML from "../../../../lib/exportEmailToHTML";
import saveEmailDraft from "../../../../lib/saveEmailDraft";
import { loadTemplateRecord, touchTemplateRecord } from "../../../../lib/templateLibrary";
import EmailActionBar from "./components/EmailActionBar";
import EmailEditorPanel from "./components/EmailEditorPanel";
import EmailPreviewPanel from "./components/EmailPreviewPanel";
import {
  applyEmailImage,
  applyEmailTypeDefaults,
  applyGeneratedEmailContent,
  buildEmailAIPayload,
  clearEmailImages,
  createEmailImage,
  createInitialEmailState,
  updateEmailBlockContent,
  updateEmailField,
} from "./emailModel";
import { getEmailTypeConfig } from "./emailConfig";

const builderLayout = {
  workspaceGrid:
    "grid gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1.15fr)] 2xl:grid-cols-[minmax(360px,420px)_minmax(0,1.35fr)]",
  editorPanel:
    "premium-panel-strong p-5 sm:p-6 xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto",
  previewCanvas: "max-w-[1280px]",
};

const createEmailDraftId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `email-${Date.now()}`;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export default function EmailGeneratorPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState(() => createInitialEmailState());
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailDraftId, setEmailDraftId] = useState(createEmailDraftId);
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
        if (!record || record.ownerId !== user.uid || record.templateType !== "email") {
          setStatusMessage("");
          return;
        }
        setTemplate(record.data || createInitialEmailState());
        setEmailDraftId(record.id);
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
    setTemplate((current) => updateEmailField(current, field, value));
  };

  const handleEmailTypeChange = (value) => {
    setTemplate((current) => applyEmailTypeDefaults(current, value));
  };

  const handleBlockChange = (blockId, value) => {
    setTemplate((current) => updateEmailBlockContent(current, blockId, value));
  };

  const handleImageUpload = (role) => async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    const image = createEmailImage({
      role,
      url: dataUrl,
      name: file.name,
      mimeType: file.type,
    });

    setTemplate((current) => applyEmailImage(current, image));
  };

  const handleClearImages = () => {
    setTemplate((current) => clearEmailImages(current));
  };

  const handleGenerateWithAI = async () => {
    const config = getEmailTypeConfig(template.emailType);

    setIsGeneratingAI(true);
    setStatusMessage("Generating email content...");
    setErrorMessage("");

    try {
      const payload = buildEmailAIPayload(template, config);
      const generatedContent = await generateEmailContent(payload);
      setTemplate((current) => applyGeneratedEmailContent(current, generatedContent));
      setStatusMessage("AI content generated and added to your email.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(error.message || "Failed to generate email content.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      setErrorMessage("Sign in to save email drafts.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("Saving email draft...");
    setErrorMessage("");

    try {
      await saveEmailDraft({
        draftId: emailDraftId,
        userId: user.uid,
        email: template,
      });
      setStatusMessage("Email draft saved.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(error.message || "Failed to save email draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportHtml = () => {
    const html = exportEmailToHTML(template);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeFileName = (template.subject || "email")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    anchor.href = objectUrl;
    anchor.download = `${safeFileName || "email"}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
    setStatusMessage("Email HTML exported.");
  };

  const handleCopyHtml = async () => {
    try {
      const html = exportEmailToHTML(template);
      await navigator.clipboard.writeText(html);
      setStatusMessage("HTML copied to clipboard.");
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(error.message || "Failed to copy HTML.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="premium-panel p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="premium-kicker">Templates / AI Email Studio</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                Craft inbox-ready emails with a smart writing studio
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
                Choose an email type, shape the message blocks, and generate a polished email that stays compact and readable.
              </p>
            </div>

            <Link to="/templates" className="premium-button-secondary">
              <ArrowLeft size={16} />
              Back to Templates
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["AI writing blocks", "Inbox-ready preview", "HTML export", "Copy to clipboard"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[32px] border border-emerald-400/15 bg-emerald-400/10 p-6 shadow-[0_18px_50px_rgba(16,185,129,0.12)]">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-100/75">Email studio</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Inbox Messaging Builder</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Create professional email layouts with dynamic blocks, AI copy, and email-safe HTML exports.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email type</p>
              <p className="mt-2 text-sm font-medium text-white">{template.emailType.replace("-", " ")}</p>
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
          <EmailEditorPanel
            template={template}
            onFieldChange={handleFieldChange}
            onEmailTypeChange={handleEmailTypeChange}
            onBlockChange={handleBlockChange}
            onImageUpload={handleImageUpload}
            onImageRemove={handleClearImages}
          />

          <EmailActionBar
            isGeneratingAI={isGeneratingAI}
            isSaving={isSaving}
            onGenerateWithAI={handleGenerateWithAI}
            onSaveDraft={handleSaveDraft}
            onCopyHtml={handleCopyHtml}
            onExportHtml={handleExportHtml}
            statusMessage={statusMessage}
            errorMessage={errorMessage}
          />
        </section>

        <EmailPreviewPanel template={template} previewCanvasClassName={builderLayout.previewCanvas} />
      </div>
    </div>
  );
}
