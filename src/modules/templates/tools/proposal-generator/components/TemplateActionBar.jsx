import TemplateSaveExportControls from "./TemplateSaveExportControls";

export default function TemplateActionBar({
  isGeneratingAI,
  onGenerateWithAI,
  onRefreshPreview,
  onDownloadHtml,
  statusMessage,
  uploadError,
}) {
  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onGenerateWithAI}
          disabled={isGeneratingAI}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGeneratingAI ? "Generating..." : "Generate with AI"}
        </button>
        <TemplateSaveExportControls
          disabled={isGeneratingAI}
          onRefreshPreview={onRefreshPreview}
          onDownloadHtml={onDownloadHtml}
        />
      </div>

      {statusMessage ? <p className="mt-4 text-sm text-emerald-400">{statusMessage}</p> : null}
      {uploadError ? <p className="mt-2 text-sm text-rose-400">{uploadError}</p> : null}
    </>
  );
}
