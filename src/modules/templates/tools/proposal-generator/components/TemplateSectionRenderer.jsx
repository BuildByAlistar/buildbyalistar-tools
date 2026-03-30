import TemplateMediaRenderer from "./TemplateMediaRenderer";

const splitTextLines = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const isLikelyLink = (value = "") =>
  value.startsWith("http://") || value.startsWith("https://") || value.startsWith("www.");

const formatLink = (value = "") => {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
};

export default function TemplateSectionRenderer({ section, template, isFirst = false }) {
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
            {section.label || "Complete the workflow"}
          </h3>
          <p className="mx-auto mt-5 max-w-[62ch] whitespace-pre-line text-base leading-8 text-slate-300">
            {section.content || "Share the next action you want the reader to take."}
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Complete this guide
          </button>
        </div>
      </section>
    );
  }

  if (section.kind === "list") {
    const items = splitTextLines(section.content);

    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            Highlight the tools, materials, or prerequisites needed to complete this workflow.
          </p>
        </div>

        <div className="template-preview-feature-grid">
          {items.length ? (
            items.map((item, index) => (
              <div key={item} className="template-preview-feature-item">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/70">
                  Item {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-6 text-lg font-medium leading-8 text-slate-800">{item}</p>
              </div>
            ))
          ) : (
            <p className="template-preview-section-copy">
              Add the required tools and materials for this guide.
            </p>
          )}
        </div>
      </section>
    );
  }

  if (section.kind === "steps") {
    const steps = template.steps || [];

    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            Break the workflow into clear, ordered actions with supporting notes and visuals.
          </p>
        </div>

        <div className="instruction-step-list">
          {steps.length ? (
            steps.map((step, index) => (
              <article key={step.id || `${index}`} className="instruction-step-card">
                <div className="instruction-step-index">Step {step.stepNumber || index + 1}</div>
                <h4 className="instruction-step-title">{step.title || `Step ${index + 1}`}</h4>
                <p className="instruction-step-desc">
                  {step.description || "Add the details for this step."}
                </p>

                {step.image?.url ? (
                  <div className="instruction-step-media">
                    <img src={step.image.url} alt={step.image.name || step.title || "Step visual"} />
                  </div>
                ) : null}

                {(step.note || step.tip || step.warning) ? (
                  <div className="instruction-step-callouts">
                    {step.note ? (
                      <div className="instruction-callout instruction-callout-note">
                        <strong>Note</strong>
                        <p>{step.note}</p>
                      </div>
                    ) : null}
                    {step.tip ? (
                      <div className="instruction-callout instruction-callout-tip">
                        <strong>Tip</strong>
                        <p>{step.tip}</p>
                      </div>
                    ) : null}
                    {step.warning ? (
                      <div className="instruction-callout instruction-callout-warning">
                        <strong>Warning</strong>
                        <p>{step.warning}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <p className="template-preview-section-copy">Add steps to guide the reader through the process.</p>
          )}
        </div>
      </section>
    );
  }

  if (section.kind === "resources") {
    const items = splitTextLines(section.content);

    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            Share supporting links, documents, and references that help the reader complete the work.
          </p>
        </div>

        <div className="instruction-resource-list">
          {items.length ? (
            items.map((item) =>
              isLikelyLink(item) ? (
                <a key={item} href={formatLink(item)} className="instruction-resource-link">
                  {item}
                </a>
              ) : (
                <div key={item} className="instruction-resource-item">
                  {item}
                </div>
              )
            )
          ) : (
            <p className="template-preview-section-copy">Add resource links or references.</p>
          )}
        </div>
      </section>
    );
  }

  if (section.kind === "gallery") {
    const images = template.images || [];

    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            Add screenshots or reference images to make the instructions easier to follow.
          </p>
        </div>

        {images.length ? (
          <div className="instruction-gallery">
            {images.map((image) => (
              <img key={image.url} src={image.url} alt={image.name || "Instruction screenshot"} />
            ))}
          </div>
        ) : (
          <p className="template-preview-section-copy">Upload images to provide visual context.</p>
        )}
      </section>
    );
  }

  if (section.kind === "video") {
    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            Walk through the process with a recorded screen share or demo.
          </p>
        </div>

        {template.video?.url ? (
          <TemplateMediaRenderer media={template.video} variant="video" />
        ) : (
          <p className="template-preview-section-copy">Upload a walkthrough video to embed here.</p>
        )}
      </section>
    );
  }

  if (section.id === "warnings") {
    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            {section.content || "Share any critical warnings or constraints."}
          </p>
        </div>
        {section.content ? (
          <div className="instruction-callout instruction-callout-warning">
            <strong>Warning</strong>
            <p>{section.content}</p>
          </div>
        ) : null}
      </section>
    );
  }

  if (section.id === "notes") {
    return (
      <section className={sectionClassName}>
        <div className="max-w-4xl">
          <h3 className="template-preview-section-title">{section.label}</h3>
          <p className="template-preview-section-copy">
            {section.content || "Add helpful notes or tips for the reader."}
          </p>
        </div>
        {section.content ? (
          <div className="instruction-callout instruction-callout-note">
            <strong>Note</strong>
            <p>{section.content}</p>
          </div>
        ) : null}
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
