export default function TemplateSaveExportControls({
  disabled,
  onRefreshPreview,
  onDownloadHtml,
}) {
  return (
    <>
      <button
        type="button"
        onClick={onRefreshPreview}
        disabled={disabled}
        className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Refresh Preview
      </button>
      <button
        type="button"
        onClick={onDownloadHtml}
        disabled={disabled}
        className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Download HTML
      </button>
    </>
  );
}
