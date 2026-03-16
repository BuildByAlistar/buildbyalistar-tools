import { ArrowRight, FileText, ImageIcon, LayoutTemplate, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategoryById } from "../../data/toolCatalog";
import ToolCard from "./ToolCard";
import { getModuleTheme } from "./theme";

const iconMap = {
  templates: LayoutTemplate,
  pdf: FileText,
  image: ImageIcon,
  content: PenSquare,
};

export default function ModuleWorkspacePage({ categoryId }) {
  const category = getCategoryById(categoryId);
  const featuredTool = category?.tools[0];
  const secondaryTools = category?.tools.slice(1) || [];
  const Icon = iconMap[category?.id] || LayoutTemplate;
  const theme = getModuleTheme(categoryId);

  if (!category) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="premium-panel p-7 sm:p-9">
          <div className={`inline-flex h-13 w-13 items-center justify-center rounded-2xl ${theme.iconWrap}`}>
            <Icon size={24} />
          </div>
          <p className={`mt-5 text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>{category.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">{category.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {category.collections.map((item) => (
              <span key={item} className={`rounded-full border px-3 py-1 text-xs font-medium ${theme.pill}`}>
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={featuredTool?.route || category.path}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition ${theme.solidButton}`}
            >
              {category.featuredLabel}
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard"
              className={`inline-flex items-center rounded-full border px-6 py-2.5 text-sm font-semibold transition ${theme.ghostButton}`}
            >
              Open dashboard
            </Link>
          </div>
        </div>

        <aside className="premium-panel-strong p-7">
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>Collections</p>
          <div className="mt-5 space-y-3">
            {category.collections.map((item) => (
              <div key={item} className={`rounded-[24px] border px-5 py-3.5 text-sm font-medium text-slate-200 ${theme.softPanel}`}>
                {item}
              </div>
            ))}
          </div>

          {featuredTool ? (
            <div className={`mt-6 rounded-[28px] border p-5 ${theme.featuredPanel}`}>
              <p className="text-xs uppercase tracking-[0.22em] text-white/75">Featured tool</p>
              <p className="mt-3 text-lg font-semibold text-white">{featuredTool.name}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{featuredTool.description}</p>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        {featuredTool ? <ToolCard tool={featuredTool} themeId={category.id} featured /> : null}
        <div className="grid gap-4">
          {secondaryTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} themeId={category.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
