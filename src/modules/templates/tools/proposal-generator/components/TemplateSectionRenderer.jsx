const splitTextLines = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export default function TemplateSectionRenderer({ section }) {
  if (!section?.enabled) {
    return null;
  }

  if (section.kind === "cta") {
    return (
      <article className="rounded-[24px] bg-slate-900 p-6 text-white shadow-sm">
        <h3 className="text-2xl font-semibold">{section.label === "CTA" ? "Ready to Move Forward?" : section.label}</h3>
        <p className="mt-4 max-w-4xl whitespace-pre-line text-base leading-7 text-slate-300">
          {section.content || "Add the next step you want the client to take."}
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Approve Proposal
        </button>
      </article>
    );
  }

  if (section.kind === "list") {
    const items = splitTextLines(section.content);
    const gridClassName =
      section.id === "features" ? "mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "mt-5 grid gap-3";
    const itemClassName =
      section.id === "pricing"
        ? "rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-4 text-sm font-medium text-slate-700"
        : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700";

    return (
      <article className="rounded-[24px] bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-900">{section.label}</h3>
        <div className={gridClassName}>
          {items.length ? (
            items.map((item) => (
              <div key={item} className={itemClassName}>
                {item}
              </div>
            ))
          ) : (
            <p className="text-base leading-7 text-slate-600">Add {section.label.toLowerCase()} details to fill this section.</p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-[24px] bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-slate-900">{section.label}</h3>
      <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-600">
        {section.content || `Add ${section.label.toLowerCase()} content.`}
      </p>
    </article>
  );
}
