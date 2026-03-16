import { ArrowRight, Clock3, FolderOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { dashboardQuickActions, dashboardRecentTools, dashboardSavedOutputs } from "../../data/toolCatalog";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="premium-panel p-7 sm:p-10">
          <p className="premium-kicker">Dashboard</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
            {user?.displayName ? `${user.displayName.split(" ")[0]}'s workspace` : "Your workspace at a glance."}
          </h1>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="premium-soft-panel p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Recent tools</p>
              <p className="mt-3 text-3xl font-semibold text-white">{dashboardRecentTools.length}</p>
            </div>
            <div className="premium-soft-panel p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Saved outputs</p>
              <p className="mt-3 text-3xl font-semibold text-white">{dashboardSavedOutputs.length}</p>
            </div>
            <div className="premium-soft-panel p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Quick actions</p>
              <p className="mt-3 text-3xl font-semibold text-white">{dashboardQuickActions.length}</p>
            </div>
          </div>
        </div>

        <aside className="premium-panel-strong p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
            <Sparkles size={20} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">Quick actions</h2>
          <div className="mt-6 space-y-3">
            {dashboardQuickActions.map((action) => (
              <Link
                key={action.label}
                to={action.route}
                className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/10"
              >
                {action.label}
                <ArrowRight size={16} className="text-cyan-200" />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="premium-panel p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Recent tools used</p>
              <h2 className="text-2xl font-semibold text-white">Pick up where you left off</h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {dashboardRecentTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.route}
                className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-950/50 px-5 py-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{tool.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{tool.category}</p>
                </div>
                <span className="text-sm font-medium text-cyan-200">{tool.lastUsed}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="premium-panel-strong p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
              <FolderOpen size={18} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Saved outputs</p>
              <h2 className="text-2xl font-semibold text-white">Recent files</h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {dashboardSavedOutputs.map((item) => (
              <div key={item.name} className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5">
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <div className="mt-2 flex items-center justify-between gap-4 text-sm text-slate-400">
                  <span>{item.meta}</span>
                  <span>{item.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
