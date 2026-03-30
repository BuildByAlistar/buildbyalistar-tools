const splitTextLines = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const parsePricingItem = (item = "") => {
  const separators = [" - ", ": "];

  for (const separator of separators) {
    if (item.includes(separator)) {
      const [title, ...rest] = item.split(separator);

      return {
        title: title.trim(),
        value: rest.join(separator).trim(),
      };
    }
  }

  return {
    title: item.trim(),
    value: "",
  };
};

export default function TemplateSectionRenderer({ section, isFirst = false }) {
  if (!section?.enabled) {
    return null;
  }

  const sectionClassName = `template-preview-section${isFirst ? " border-t-0 pt-0" : ""}`;

  if (section.kind === "cta") {
    return (
      <section className={sectionClassName}>
        <div className="template-preview-cta">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/72">Next step</p>
          <h3 className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.04em] sm:text-[2.4rem]">
            {section.label === "CTA" ? "Ready to Move Forward?" : section.label}
          </h3>
          <p className="mx-auto mt-5 max-w-[62ch] whitespace-pre-line text-base leading-8 text-slate-300">
            {section.content || "Add the next step you want the client to take."}
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Approve Proposal
          </button>
        </div>
      </section>
    );
  }

  if (section.kind === "list") {
    const items = splitTextLines(section.content);
    const isPricing = section.id === "pricing";

    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            {isPricing
              ? "Present package options with a cleaner structure that is easier to compare and approve."
              : "Highlight the key deliverables and capabilities in a clearer multi-column layout."}
          </p>
        </div>

        <div className={isPricing ? "template-preview-pricing-grid" : "template-preview-feature-grid"}>
          {items.length ? (
            items.map((item, index) => {
              const pricingItem = parsePricingItem(item);

              return isPricing ? (
                <div key={item} className="template-preview-pricing-item">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/70">
                      Package {String(index + 1).padStart(2, "0")}
                    </p>
                    <h4 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                      {pricingItem.title || "Pricing option"}
                    </h4>
                  </div>
                  <div className="mt-8 border-t border-slate-200/80 pt-5">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Investment</p>
                    <p className="mt-3 text-lg font-semibold text-slate-800">
                      {pricingItem.value || item}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={item} className="template-preview-feature-item">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/70">
                    Feature {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-6 text-lg font-medium leading-8 text-slate-800">{item}</p>
                </div>
              );
            })
          ) : (
            <p className="template-preview-section-copy">Add {section.label.toLowerCase()} details to fill this section.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClassName}>
      <div className="max-w-4xl">
        <h3 className="template-preview-section-title">{section.label}</h3>
      </div>
      <p className="template-preview-section-copy">
        {section.content || `Add ${section.label.toLowerCase()} content.`}
      </p>
    </section>
  );
}
