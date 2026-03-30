const typeBackgrounds = {
  proposal: "from-blue-500/20 via-sky-500/10 to-purple-500/20",
  invitation: "from-amber-400/20 via-rose-400/10 to-fuchsia-400/20",
  email: "from-slate-100/80 via-white/60 to-slate-100/80",
  instruction: "from-cyan-500/20 via-sky-500/10 to-emerald-500/20",
};

const typeLabels = {
  proposal: "Proposal",
  invitation: "Invitation",
  email: "Email",
  instruction: "Instruction",
};

export default function TemplatePreviewRenderer({ templateType, title, subtitle, isFeatured = false }) {
  const background = typeBackgrounds[templateType] || "from-slate-400/10 via-slate-500/5 to-slate-400/10";
  const label = typeLabels[templateType] || "Template";
  const previewHeight = isFeatured ? "min-h-[180px]" : "min-h-[150px]";

  if (templateType === "proposal") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${background} ${previewHeight}`}>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.16),transparent)]" />
        <div className="relative flex h-full flex-col gap-3 p-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200/80">{label}</span>
          <div className="h-2.5 w-3/4 rounded-full bg-white/30" />
          <div className="grid gap-2">
            <div className="h-2 w-full rounded-full bg-white/20" />
            <div className="h-2 w-5/6 rounded-full bg-white/15" />
            <div className="h-2 w-2/3 rounded-full bg-white/15" />
          </div>
          <div className="mt-auto inline-flex w-fit rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
            CTA
          </div>
        </div>
      </div>
    );
  }

  if (templateType === "invitation") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${background} ${previewHeight}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">{label}</span>
            <div className="mt-2 text-sm font-semibold text-white">{title || "Event Invitation"}</div>
            <div className="mt-1 text-xs text-white/70">{subtitle || "Hosted by..."}</div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded-lg bg-white/25" />
            <div className="h-9 w-20 rounded-lg bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  if (templateType === "email") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${background} ${previewHeight}`}>
        <div className="relative h-full rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
            <span>From</span>
            <span>Inbox</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-800">{title || "Subject line"}</div>
          <div className="mt-2 space-y-1">
            <div className="h-2 w-full rounded-full bg-slate-200" />
            <div className="h-2 w-5/6 rounded-full bg-slate-200" />
            <div className="h-2 w-2/3 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (templateType === "instruction") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${background} ${previewHeight}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_55%)]" />
        <div className="relative flex h-full flex-col gap-3 p-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">{label}</span>
          <div className="mt-1 text-sm font-semibold text-white">{title || "Instruction Guide"}</div>
          <div className="h-2 w-4/5 rounded-full bg-white/25" />
          <div className="grid gap-2">
            <div className="h-2 w-full rounded-full bg-white/20" />
            <div className="h-2 w-3/4 rounded-full bg-white/15" />
          </div>
          <div className="mt-auto flex gap-2">
            <div className="h-8 w-16 rounded-lg bg-white/25" />
            <div className="h-8 w-20 rounded-lg bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${background} ${previewHeight}`}>
      <div className="relative flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-white/70">
        Template preview
      </div>
    </div>
  );
}
