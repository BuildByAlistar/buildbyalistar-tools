import { layoutStyleOptions } from "../emailConfig";

const inputClassName =
  "w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400";

export default function EmailLayoutSelector({ value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">Layout style</span>
      <select className={inputClassName} value={value} onChange={(event) => onChange(event.target.value)}>
        {layoutStyleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
