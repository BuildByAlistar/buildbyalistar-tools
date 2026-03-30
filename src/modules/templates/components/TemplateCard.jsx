import { Copy, MoreVertical, Star, Trash2 } from "lucide-react";
import TemplatePreviewRenderer from "./TemplatePreviewRenderer";

const badgeStyles = {
  proposal: "border-blue-400/30 bg-blue-400/10 text-blue-100",
  invitation: "border-rose-400/30 bg-rose-400/10 text-rose-100",
  email: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
};

export default function TemplateCard({
  template,
  isFeatured = false,
  onOpen,
  onDuplicate,
  onDelete,
  onFavorite,
}) {
  const badgeClassName = badgeStyles[template.templateType] || "border-white/10 bg-white/5 text-slate-200";
  const cardSizeClass = isFeatured ? "min-h-[360px] sm:col-span-2" : "min-h-[320px]";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onOpen();
        }
      }}
      className={[
        "group premium-panel-strong relative flex h-full cursor-pointer flex-col gap-4 p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_26px_70px_rgba(2,6,23,0.45)]",
        cardSizeClass,
      ].join(" ")}
    >
      <TemplatePreviewRenderer
        templateType={template.templateType}
        title={template.title}
        subtitle={template.subtitle}
        isFeatured={isFeatured}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${badgeClassName}`}>
            {template.templateType}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-white">{template.title || "Untitled template"}</h3>
          <p className="mt-2 text-sm text-slate-300">{template.description || template.subtitle || "No description yet."}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          className={`rounded-full border px-2.5 py-2 text-xs transition ${
            template.favorite ? "border-amber-400/40 text-amber-200" : "border-white/10 text-slate-300"
          }`}
        >
          <Star size={14} fill={template.favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Updated {template.updatedAtLabel}
        </p>
        <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDuplicate();
            }}
            className="rounded-full border border-white/10 p-2 text-slate-200"
          >
            <Copy size={14} />
          </button>
          <details className="relative">
            <summary
              onClick={(event) => event.stopPropagation()}
              className="list-none rounded-full border border-white/10 p-2 text-slate-200"
            >
              <MoreVertical size={14} />
            </summary>
            <div
              className="absolute right-0 z-10 mt-2 w-36 rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-xs text-slate-200 shadow-[0_18px_40px_rgba(2,6,23,0.45)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-rose-200 hover:bg-white/5"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}
