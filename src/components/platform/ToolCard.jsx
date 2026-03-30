import { ArrowRight, Clock3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getModuleTheme } from "./theme";

const templateAccentMap = {
  "/templates/proposal-generator": {
    gradient: "bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20",
    glow: "hover:shadow-[0_30px_80px_rgba(59,130,246,0.25)]",
    border: "border-blue-400/20",
  },
  "/templates/invitation-generator": {
    gradient: "bg-gradient-to-br from-amber-400/20 via-rose-400/10 to-fuchsia-400/20",
    glow: "hover:shadow-[0_30px_80px_rgba(251,191,36,0.22)]",
    border: "border-amber-300/20",
  },
  "/templates/email-generator": {
    gradient: "bg-gradient-to-br from-slate-200/15 via-white/10 to-slate-900/70",
    glow: "hover:shadow-[0_30px_80px_rgba(148,163,184,0.22)]",
    border: "border-slate-200/20",
  },
  "/templates/library": {
    gradient: "bg-gradient-to-br from-teal-400/20 via-emerald-400/10 to-cyan-400/20",
    glow: "hover:shadow-[0_30px_80px_rgba(45,212,191,0.22)]",
    border: "border-teal-300/20",
  },
};

const getTemplateAccent = (tool) => {
  if (!tool?.route) {
    return null;
  }

  return templateAccentMap[tool.route] || null;
};

function ToolCardHero({ tool, theme, onOpen }) {
  return (
    <div className="flex h-full flex-col justify-between gap-6 lg:flex-row lg:items-center">
      <div className="flex-1">
        <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.pill}`}>
          Featured
        </div>
        <h3 className="mt-5 max-w-md text-3xl font-semibold text-white sm:text-[2.35rem]">
          {tool.name}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-200">{tool.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={tool.route || "/templates"}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
          >
            Create New
          </Link>
          <Link
            to="/templates/library"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
          >
            Open Templates
          </Link>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/60">
          <span>Proposal</span>
          <span>Preview</span>
        </div>
        <div className="mt-4 h-3 w-3/4 rounded-full bg-white/25" />
        <div className="mt-3 grid gap-2">
          <div className="h-2 w-full rounded-full bg-white/15" />
          <div className="h-2 w-5/6 rounded-full bg-white/15" />
          <div className="h-2 w-4/6 rounded-full bg-white/15" />
        </div>
        <div className="mt-5 flex gap-2">
          <div className="h-10 w-16 rounded-lg bg-white/20" />
          <div className="h-10 w-24 rounded-lg bg-white/15" />
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75"
        >
          Quick open
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

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
  const navigate = useNavigate();
  const isTemplates = themeId === "templates";
  const isHero = isTemplates && featured && tool.route === "/templates/proposal-generator";
  const accent = isTemplates ? getTemplateAccent(tool) : null;
  const className = [
    "group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border bg-slate-950/58 p-6 shadow-[0_22px_60px_rgba(2,6,23,0.35)] transition duration-200",
    accent?.gradient || "",
    accent?.border || "border-white/12",
    accent?.glow || "hover:shadow-[0_26px_70px_rgba(2,6,23,0.35)]",
    isHero ? "min-h-[24rem] p-7 sm:p-9" : featured ? "min-h-[19rem] p-7 sm:p-8" : "min-h-[15.25rem]",
    theme.hoverBorder,
    theme.hoverBg,
    "hover:-translate-y-1 hover:scale-[1.01]",
  ].join(" ");

  if (isHero) {
    return (
      <article
        className={className}
        role="button"
        tabIndex={0}
        onClick={() => navigate(tool.route)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            navigate(tool.route);
          }
        }}
      >
        <ToolCardHero tool={tool} theme={theme} onOpen={() => navigate(tool.route)} />
      </article>
    );
  }

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
