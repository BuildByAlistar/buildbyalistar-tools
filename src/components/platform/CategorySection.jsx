import { ArrowRight, FileText, ImageIcon, LayoutTemplate, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import ToolCard from "./ToolCard";
import { getModuleTheme } from "./theme";

const iconMap = {
  templates: LayoutTemplate,
  pdf: FileText,
  image: ImageIcon,
  content: PenSquare,
};

export default function CategorySection({ category }) {
  const Icon = iconMap[category.id] || LayoutTemplate;
  const theme = getModuleTheme(category.id);
  const [featuredTool, ...secondaryTools] = category.tools;

  return (
    <section className="premium-panel p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${theme.iconWrap}`}>
            <Icon size={20} />
          </div>
          <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>{category.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">{category.label}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">{category.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {category.collections.map((item) => (
              <span key={item} className={`rounded-full border px-3 py-1 text-xs font-medium ${theme.pill}`}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={category.path}
          className={`inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 text-sm font-semibold transition ${theme.ghostButton}`}
        >
          Open {category.label}
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-7 grid items-stretch gap-4 xl:grid-cols-[1.16fr_0.84fr]">
        <ToolCard tool={featuredTool} themeId={category.id} featured />
        <div className="grid gap-4">
          {secondaryTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} themeId={category.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
