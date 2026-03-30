import { getSectionContent, instructionPresets, instructionSectionFields } from "../templateModel";

export default function TemplateEditorPanel({
  template,
  inputClassName,
  textareaClassName,
  isUploadingVideo,
  onFieldChange,
  onSectionChange,
  onSectionToggle,
  onPresetChange,
  onStepChange,
  onStepAdd,
  onStepRemove,
  onStepImageUpload,
  onImageUpload,
  onVideoUpload,
}) {
  const presetValue =
    instructionPresets.find((preset) => preset.label === template.guideType)?.id ||
    instructionPresets[0].id;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Instruction editor</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          Build a structured instruction guide while the live preview updates beside it.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Template Type</span>
              <input className={inputClassName} value={template.templateType} readOnly />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Preset</span>
              <select className={inputClassName} value={presetValue} onChange={onPresetChange}>
                {instructionPresets.map((preset) => (
                  <option key={preset.id} value={preset.id} className="bg-slate-950 text-white">
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Guide Type</span>
              <input className={inputClassName} value={template.guideType} onChange={onFieldChange("guideType")} />
            </label>

            <label className="block sm:col-span-2 xl:col-span-1">
              <span className="mb-2 block text-sm font-medium text-slate-200">Title</span>
              <input className={inputClassName} value={template.title} onChange={onFieldChange("title")} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Subtitle</span>
              <input className={inputClassName} value={template.subtitle} onChange={onFieldChange("subtitle")} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Audience</span>
              <input className={inputClassName} value={template.audience} onChange={onFieldChange("audience")} />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Overview</span>
              <textarea className={textareaClassName} value={template.overview} onChange={onSectionChange("overview")} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Required Tools & Materials</span>
              <textarea
                className={textareaClassName}
                value={getSectionContent(template, "requiredItems")}
                onChange={onSectionChange("requiredItems")}
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Step-by-step</h3>
              <p className="mt-2 text-sm text-slate-400">Define each step, with optional notes, tips, and warnings.</p>
            </div>
            <button
              type="button"
              onClick={onStepAdd}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-300/40 hover:bg-white/5"
            >
              Add step
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {template.steps.map((step, index) => (
              <div key={step.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                    Step {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => onStepRemove(step.id)}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200/80 transition hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>

                <label className="mt-3 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Step title</span>
                  <input
                    className={inputClassName}
                    value={step.title}
                    onChange={onStepChange(step.id, "title")}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Description</span>
                  <textarea
                    className={textareaClassName}
                    value={step.description}
                    onChange={onStepChange(step.id, "description")}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Note</span>
                  <textarea
                    className={`${inputClassName} min-h-[84px] resize-y`}
                    value={step.note}
                    onChange={onStepChange(step.id, "note")}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Tip</span>
                  <textarea
                    className={`${inputClassName} min-h-[84px] resize-y`}
                    value={step.tip}
                    onChange={onStepChange(step.id, "tip")}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Warning</span>
                  <textarea
                    className={`${inputClassName} min-h-[84px] resize-y`}
                    value={step.warning}
                    onChange={onStepChange(step.id, "warning")}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Step image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
                    onChange={onStepImageUpload(step.id)}
                  />
                  {step.image?.name ? (
                    <p className="mt-2 text-xs text-slate-400">Attached: {step.image.name}</p>
                  ) : null}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Notes & Tips</span>
              <textarea
                className={textareaClassName}
                value={getSectionContent(template, "notes")}
                onChange={onSectionChange("notes")}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Warnings</span>
              <textarea
                className={textareaClassName}
                value={getSectionContent(template, "warnings")}
                onChange={onSectionChange("warnings")}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Resources</span>
              <textarea
                className={textareaClassName}
                value={getSectionContent(template, "resources")}
                onChange={onSectionChange("resources")}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Final CTA</span>
              <textarea
                className={`${inputClassName} min-h-[96px] resize-y`}
                value={template.cta}
                onChange={onSectionChange("cta")}
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Video Walkthrough (optional)</span>
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
              <span className="mb-2 block text-sm font-medium text-slate-200">Screenshots & Images (optional)</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
                onChange={onImageUpload}
                multiple
              />
              {template.images?.length ? (
                <p className="mt-2 text-xs text-slate-400">{template.images.length} image(s) attached</p>
              ) : null}
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Sections</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {instructionSectionFields.map((section) => {
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
