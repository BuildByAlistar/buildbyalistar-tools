import { getSectionContent, proposalSectionFields } from "../templateModel";

export default function TemplateEditorPanel({
  template,
  inputClassName,
  textareaClassName,
  isUploadingVideo,
  onFieldChange,
  onSectionChange,
  onSectionToggle,
  onImageUpload,
  onVideoUpload,
}) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Template editor</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Shape the content on the left and review the live template output on the right.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Template Type</span>
          <input className={inputClassName} value={template.templateType} readOnly />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Title</span>
          <input className={inputClassName} value={template.title} onChange={onFieldChange("title")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Business Type</span>
          <input className={inputClassName} value={template.businessType} onChange={onFieldChange("businessType")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Client Name</span>
          <input className={inputClassName} value={template.clientName} onChange={onFieldChange("clientName")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Summary</span>
          <textarea className={textareaClassName} value={template.summary} onChange={onSectionChange("summary")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Problem</span>
          <textarea className={textareaClassName} value={getSectionContent(template, "problem")} onChange={onSectionChange("problem")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Solution</span>
          <textarea className={textareaClassName} value={getSectionContent(template, "solution")} onChange={onSectionChange("solution")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Features</span>
          <textarea className={textareaClassName} value={template.features} onChange={onSectionChange("features")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Pricing</span>
          <textarea className={textareaClassName} value={template.pricing} onChange={onSectionChange("pricing")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">CTA</span>
          <textarea className={`${inputClassName} min-h-[96px] resize-y`} value={template.cta} onChange={onSectionChange("cta")} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Proposal Demo Video (optional)</span>
          <input
            type="file"
            accept="video/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
            onChange={onVideoUpload}
            disabled={isUploadingVideo}
          />
          {template.video?.name ? <p className="mt-2 text-xs text-slate-400">Uploaded: {template.video.name}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Image Upload (optional)</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
            onChange={onImageUpload}
          />
        </label>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Sections</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {proposalSectionFields.map((section) => {
            const currentSection = template.sections.find((item) => item.id === section.key);

            return (
              <label
                key={section.key}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={currentSection?.enabled ?? true}
                  onChange={onSectionToggle(section.key)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                <span>{section.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}
