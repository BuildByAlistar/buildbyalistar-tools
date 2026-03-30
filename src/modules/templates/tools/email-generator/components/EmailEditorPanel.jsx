import {
  emailBlockDefinitions,
  emailFieldDefinitions,
  emailTypeOptions,
  getVisibleEmailFieldGroups,
} from "../emailConfig";
import EmailLayoutSelector from "./EmailLayoutSelector";

const inputClassName =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400";

const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

const getValueByPath = (obj, path) => {
  if (!path.includes(".")) {
    return obj?.[path] ?? "";
  }

  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "";
};

export default function EmailEditorPanel({
  template,
  onFieldChange,
  onEmailTypeChange,
  onBlockChange,
  onImageUpload,
  onImageRemove,
}) {
  const visibleGroups = getVisibleEmailFieldGroups(template.emailType);

  const renderField = (fieldKey) => {
    const definition = emailFieldDefinitions[fieldKey];
    if (!definition) {
      return null;
    }

    const value = getValueByPath(template, fieldKey);

    if (definition.type === "textarea") {
      return (
        <label key={fieldKey} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">{definition.label}</span>
          <textarea
            className={textareaClassName}
            rows={definition.rows || 4}
            value={value}
            placeholder={definition.placeholder}
            onChange={(event) => onFieldChange(fieldKey, event.target.value)}
          />
        </label>
      );
    }

    if (definition.type === "select") {
      return (
        <label key={fieldKey} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">{definition.label}</span>
          <select
            className={inputClassName}
            value={value}
            onChange={(event) => onFieldChange(fieldKey, event.target.value)}
          >
            <option value="">Select {definition.label.toLowerCase()}</option>
            {(definition.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      );
    }

    return (
      <label key={fieldKey} className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">{definition.label}</span>
        <input
          className={inputClassName}
          type={definition.type || "text"}
          value={value}
          placeholder={definition.placeholder}
          onChange={(event) => onFieldChange(fieldKey, event.target.value)}
        />
      </label>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Email editor</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          Choose an email type and craft a structured message that reads like a real email.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Email type</span>
            <select
              className={inputClassName}
              value={template.emailType}
              onChange={(event) => onEmailTypeChange(event.target.value)}
            >
              {emailTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visibleGroups.map((group) => (
          <div key={group.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">{group.label}</h3>
              <p className="mt-2 text-xs text-slate-400">{group.description}</p>
            </div>
            <div className="space-y-4">{group.fields.map((field) => renderField(field))}</div>
          </div>
        ))}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Email layout</h3>
            <p className="mt-2 text-xs text-slate-400">Pick a layout style for the email preview.</p>
          </div>
          <EmailLayoutSelector value={template.layoutStyle} onChange={(value) => onFieldChange("layoutStyle", value)} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Message blocks</h3>
            <p className="mt-2 text-xs text-slate-400">These blocks change based on the email type.</p>
          </div>
          <div className="space-y-4">
            {template.messageBlocks.map((block) => (
              <label key={block.id} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">{block.label}</span>
                <textarea
                  className={textareaClassName}
                  rows={block.kind === "list" ? 4 : 5}
                  value={block.content}
                  placeholder={emailBlockDefinitions[block.key]?.placeholder || block.placeholder}
                  onChange={(event) => onBlockChange(block.id, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Email images</h3>
            <p className="mt-2 text-xs text-slate-400">Optional header or inline image for the email body.</p>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Header image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-emerald-400"
                onChange={onImageUpload("header")}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Inline image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-emerald-400"
                onChange={onImageUpload("inline")}
              />
            </label>
            <button
              type="button"
              onClick={onImageRemove}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:border-rose-400/40 hover:text-rose-200"
            >
              Clear images
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
