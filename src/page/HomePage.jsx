import React from "react";
import { Link } from "react-router-dom";
import tools from "../data/tools";
import { useAuth } from "../context/useAuth";

const categoryOrder = [
  "AI Writing Tools",
  "PDF Tools",
  "AI Image Tools",
  "Marketing Tools",
  "Business Tools",
];

const badgeStyles = {
  FREE: "text-green-500 bg-green-900",
  PRO: "text-purple-400 bg-purple-950",
  LIVE: "text-emerald-500 bg-emerald-900",
  "COMING SOON": "text-gray-400 bg-gray-800",
};

const ToolCard = ({ tool }) => {
  const cardContent = (
    <div
      className={`group border rounded-2xl p-6 transition ${
        tool.enabled ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600" : "bg-zinc-900/40 border-zinc-800 opacity-70"
      }`}
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="text-lg font-bold leading-tight">{tool.name}</h3>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${badgeStyles[tool.badge] || "bg-zinc-800 text-zinc-300"}`}>
          {tool.badge}
        </div>
      </div>

      <p className="text-zinc-400 mb-4 min-h-12">{tool.description}</p>
      <p className="text-xs text-zinc-500 mb-6">Provider: {tool.provider}</p>
      <span className="text-white font-semibold">{tool.enabled ? "Open tool →" : "Unavailable"}</span>
    </div>
  );

  if (!tool.enabled) {
    return cardContent;
  }

  return <Link to={tool.route}>{cardContent}</Link>;
};

export default function HomePage() {
  const { user, logout } = useAuth();

  const toolGroups = tools.reduce((groups, tool) => {
    if (!groups[tool.category]) {
      groups[tool.category] = [];
    }

    groups[tool.category].push(tool);
    return groups;
  }, {});

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <nav className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <div className="font-bold">ToolSphere</div>
          {user ? (
            <button onClick={logout} className="bg-purple-600 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-purple-600 px-4 py-2 rounded">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-4 text-center">AI ToolSphere</h1>
        <p className="text-zinc-400 text-center mb-16">Config-powered AI tools platform. Add tools from data, not hardcoded pages.</p>

        {categoryOrder.map((category) => {
          const categoryTools = toolGroups[category] || [];
          if (!categoryTools.length) {
            return null;
          }

          return (
            <section key={category} className="mb-14">
              <h2 className="text-2xl font-bold mb-7">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
