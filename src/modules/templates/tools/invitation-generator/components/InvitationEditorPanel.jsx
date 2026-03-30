import {
  getInvitationFieldSets,
  getVisibleInvitationFieldGroups,
  invitationFieldDefinitions,
  invitationSectionDefinitions,
  invitationTypeOptions,
  layoutStyleOptions,
  previewThemeOptions,
} from "../invitationConfig";

const inputClassName =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400";

const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

const getValueByPath = (obj, path) => {
  if (!path.includes(".")) {
    return obj?.[path] ?? "";
  }

  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "";
};

export default function InvitationEditorPanel({
  template,
  onFieldChange,
  onInvitationTypeChange,
  onSectionToggle,
}) {
  const { required, optional } = getInvitationFieldSets(template.invitationType);
  const visibleGroups = getVisibleInvitationFieldGroups(template.invitationType);

  const renderField = (fieldKey) => {
    const definition = invitationFieldDefinitions[fieldKey];

    if (!definition) {
      return null;
    }

    if (!template.rsvpRequired && fieldKey !== "rsvpRequired" && fieldKey.startsWith("rsvp")) {
      return null;
    }

    if (!template.rsvpRequired && fieldKey.startsWith("links.rsvpLink")) {
      return null;
    }

    const value = getValueByPath(template, fieldKey);
    const isRequired = required.has(fieldKey);
    const isOptional = optional.has(fieldKey);

    const label = (
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
        {definition.label}
        {isRequired ? (
          <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fuchsia-200">
            Required
          </span>
        ) : null}
        {isOptional && !isRequired ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            Optional
          </span>
        ) : null}
      </span>
    );

    if (definition.type === "textarea") {
      return (
        <label key={fieldKey} className="block">
          {label}
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
          {label}
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

    if (definition.type === "checkbox") {
      return (
        <label key={fieldKey} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onFieldChange(fieldKey, event.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-fuchsia-500 focus:ring-fuchsia-500"
          />
          <span>{definition.label}</span>
        </label>
      );
    }

    return (
      <label key={fieldKey} className="block">
        {label}
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
        <h2 className="text-2xl font-semibold text-white">Invitation editor</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          Start with the invitation type, then shape the invitation story and layout.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">Invitation type</span>
            <select
              className={inputClassName}
              value={template.invitationType}
              onChange={(event) => onInvitationTypeChange(event.target.value)}
            >
              {invitationTypeOptions.map((option) => (
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Layout and theme</h3>
            <p className="mt-2 text-xs text-slate-400">Choose a visual style and preview theme.</p>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Layout style</span>
              <select
                className={inputClassName}
                value={template.layoutStyle}
                onChange={(event) => onFieldChange("layoutStyle", event.target.value)}
              >
                {layoutStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Preview theme</span>
              <select
                className={inputClassName}
                value={template.previewTheme}
                onChange={(event) => onFieldChange("previewTheme", event.target.value)}
              >
                {previewThemeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Sections</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {invitationSectionDefinitions.map((section) => (
              <label
                key={section.id}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={Boolean(template.enabledSections[section.id])}
                  onChange={(event) => onSectionToggle(section.id, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-fuchsia-500 focus:ring-fuchsia-500"
                />
                <span>{section.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
