export default function InvitationActionBar({
  isGeneratingAI,
  isSaving,
  onGenerateWithAI,
  onSaveDraft,
  onExportHtml,
  statusMessage,
  errorMessage,
}) {
  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onGenerateWithAI}
          disabled={isGeneratingAI}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition duration-200 hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-400/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGeneratingAI ? "Generating..." : "Generate with AI"}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isGeneratingAI || isSaving}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save draft"}
        </button>
        <button
          type="button"
          onClick={onExportHtml}
          disabled={isGeneratingAI}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition duration-200 hover:-translate-y-0.5 hover:border-fuchsia-300/35 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Export HTML
        </button>
      </div>

      {statusMessage ? <p className="mt-4 text-sm text-emerald-400">{statusMessage}</p> : null}
      {errorMessage ? <p className="mt-2 text-sm text-rose-400">{errorMessage}</p> : null}
    </>
  );
}
