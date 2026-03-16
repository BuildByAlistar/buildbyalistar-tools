import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { getModuleTheme } from "./theme";

function ToolCardBody({ tool, theme, featured }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.pill}`}>
            {tool.badge}
          </div>
          <h3 className={`mt-4 font-semibold text-white ${featured ? "text-2xl sm:text-[1.7rem]" : "text-xl"}`}>{tool.name}</h3>
        </div>
        <div
          className={[
            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            tool.status === "Live"
              ? "border border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
              : "border border-white/10 bg-white/5 text-slate-300",
          ].join(" ")}
        >
          {tool.status}
        </div>
      </div>

      <p className={`mt-4 leading-7 text-slate-300 ${featured ? "text-base" : "text-sm"}`}>{tool.description}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className={`text-sm font-medium ${theme.accentText}`}>{tool.route ? "Open tool" : "Coming soon"}</span>
        {tool.route ? (
          <ArrowRight size={18} className={`transition group-hover:translate-x-1 ${theme.accentText}`} />
        ) : (
          <Clock3 size={18} className="text-slate-500" />
        )}
      </div>
    </>
  );
}

export default function ToolCard({ tool, themeId = "default", featured = false }) {
  const theme = getModuleTheme(themeId);
  const className = [
    "group flex h-full flex-col justify-between rounded-[28px] border border-white/12 bg-slate-950/58 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.24)] transition duration-200",
    featured ? "min-h-[19rem] p-7 sm:p-8" : "min-h-[15.75rem]",
    theme.hoverBorder,
    theme.hoverBg,
    "hover:-translate-y-1",
  ].join(" ");

  if (tool.route) {
    return (
      <Link to={tool.route} className={className}>
        <ToolCardBody tool={tool} theme={theme} featured={featured} />
      </Link>
    );
  }

  return (
    <article className={className}>
      <ToolCardBody tool={tool} theme={theme} featured={featured} />
    </article>
  );
}
