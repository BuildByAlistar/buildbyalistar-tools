import TemplateMediaRenderer from "./TemplateMediaRenderer";
import TemplateSectionRenderer from "./TemplateSectionRenderer";
import { getPrimaryImage } from "../templateModel";

const previewCanvasBaseClassName = "mx-auto w-full px-3 py-3 sm:px-5 sm:py-5 xl:px-6 xl:py-6";

export default function TemplatePreviewPanel({
  template,
  previewCanvasClassName = "max-w-[1360px]",
}) {
  const primaryImage = getPrimaryImage(template);
  const enabledSections = template.sections.filter((section) => section.enabled);

  return (
    <section className="premium-panel relative overflow-hidden p-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_28%)]" />

      <div className={`${previewCanvasBaseClassName} ${previewCanvasClassName}`}>
        <div className="template-preview-shell">
          <div className="template-preview-window">
            <div className="template-preview-browser">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="template-preview-browser-address">
                LIVE INSTRUCTION PREVIEW
              </div>
            </div>

            <div className="template-preview-page">
              <header className="template-preview-hero">
                <p className="template-preview-hero-kicker">{template.guideType || "Instruction Guide"}</p>
                <h2 className="template-preview-hero-title">{template.title || "Instruction Guide"}</h2>
                <p className="template-preview-hero-copy">
                  {template.subtitle || "A polished step-by-step guide for consistent execution."}
                </p>
                <p className="template-preview-hero-meta">
                  For {template.audience || "your team"}
                </p>
                <TemplateMediaRenderer media={primaryImage} />
              </header>

              <main className="template-preview-main">
                {enabledSections.map((section, index) => (
                  <TemplateSectionRenderer
                    key={section.id}
                    section={section}
                    template={template}
                    isFirst={index === 0}
                  />
                ))}
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
