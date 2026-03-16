import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CategorySection from "../../components/platform/CategorySection";
import { homepageStats, toolCategories } from "../../data/toolCatalog";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="premium-panel p-7 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            <Sparkles size={16} />
            Premium tools platform
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
            Toolsphere brings every workflow into one calm, polished product surface.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            BuildByAlistar.Hub now feels like a real platform home with focused modules for templates, PDF, image, and
            content tools, all under one premium navigation and route system.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/templates/proposal-generator"
              className="premium-button-primary"
            >
              Open AI Proposal Generator
              <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="premium-button-secondary">
              View dashboard
            </Link>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {toolCategories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="flex h-full min-h-[12rem] flex-col rounded-[28px] border border-white/10 bg-slate-950/50 p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-slate-900"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{category.label}</p>
                <p className="mt-3 text-lg font-semibold text-white">{category.tools[0].name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{category.tools[0].description}</p>
                <span className="mt-auto pt-4 text-sm font-medium text-cyan-200">Explore module</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="premium-panel-strong p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
              <Layers3 size={20} />
            </div>
            <div>
              <p className="premium-kicker">Platform snapshot</p>
              <h2 className="text-2xl font-semibold text-white">Live structure</h2>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {homepageStats.map((item) => (
              <div key={item.label} className="premium-soft-panel p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-5 shadow-[0_12px_40px_rgba(34,211,238,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Featured launch path</p>
            <p className="mt-3 text-lg font-semibold text-white">Templates and the AI Proposal Generator lead the current product story.</p>
          </div>
        </aside>
      </section>

      <div className="space-y-6">
        {toolCategories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
