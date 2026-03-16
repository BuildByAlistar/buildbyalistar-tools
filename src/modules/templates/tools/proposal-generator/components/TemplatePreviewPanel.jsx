import TemplateMediaRenderer from "./TemplateMediaRenderer";
import TemplateSectionRenderer from "./TemplateSectionRenderer";
import { getPrimaryImage, getTemplateVideo } from "../templateModel";

export default function TemplatePreviewPanel({ template }) {
  const primaryImage = getPrimaryImage(template);
  const video = getTemplateVideo(template);
  const enabledSections = template.sections.filter((section) => section.enabled);

  return (
    <section className="premium-panel p-0">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-[28px] bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="bg-gradient-to-br from-slate-900 via-cyan-700 to-sky-400 px-6 py-10 text-white sm:px-10">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-50/80">{template.businessType || "Template"}</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{template.title || "Untitled Template"}</h2>
              <p className="mt-4 max-w-4xl text-base leading-7 text-cyan-50/85">Prepared for {template.clientName || "your client"}.</p>
              <TemplateMediaRenderer media={primaryImage} />
            </div>

            <div className="space-y-6 bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
              {enabledSections.map((section) => (
                <TemplateSectionRenderer key={section.id} section={section} />
              ))}

              {video?.url ? (
                <article className="rounded-[24px] bg-white p-6 shadow-sm">
                  <h3 className="text-2xl font-semibold text-slate-900">Video</h3>
                  <TemplateMediaRenderer media={video} variant="video" />
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
