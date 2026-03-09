import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ToolCard = ({ title, status, description, pro, comingSoon, link }) => {

  const getStatusBadge = () => {

    if (comingSoon) {
      return <div className="text-xs font-bold text-gray-500 bg-gray-700 px-2 py-1 rounded-full">COMING SOON</div>;
    }

    if (status === "FREE") {
      return <div className="text-xs font-bold text-green-500 bg-green-900 px-2 py-1 rounded-full">FREE</div>;
    }

    if (status === "PRO") {
      return <div className="text-xs font-bold text-purple-500 bg-purple-900 px-2 py-1 rounded-full">PRO</div>;
    }

    if (status === "LIVE") {
      return <div className="text-xs font-bold text-emerald-500 bg-emerald-900 px-2 py-1 rounded-full">LIVE</div>;
    }

    return null;
  };

  const cardContent = (

    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {getStatusBadge()}
      </div>

      <p className="text-zinc-400 mb-6">{description}</p>

      <span className="text-white font-semibold">
        Open tool →
      </span>

    </div>

  );

  if (pro || comingSoon) {
    return cardContent;
  }

  return <Link to={link}>{cardContent}</Link>;

};

export default function HomePage() {

  const { user, logout } = useAuth();

  return (

    <div className="bg-zinc-950 min-h-screen text-white">

      <nav className="border-b border-zinc-800">

        <div className="container mx-auto px-6 py-4 flex justify-between">

          <div className="font-bold">
            ToolSphere
          </div>

          {user ? (

            <button
              onClick={logout}
              className="bg-purple-600 px-4 py-2 rounded"
            >
              Logout
            </button>

          ) : (

            <Link
              to="/login"
              className="bg-purple-600 px-4 py-2 rounded"
            >
              Login
            </Link>

          )}

        </div>

      </nav>

      <main className="container mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold mb-16 text-center">
          AI ToolSphere
        </h1>

        <section className="mb-16">

          <h2 className="text-2xl font-bold mb-8">
            AI Writing Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <ToolCard
              title="Bio Writer"
              status="FREE"
              description="Craft a professional bio instantly."
              link="/tools/bio-writer"
            />

            <ToolCard
              title="Headline Generator"
              status="FREE"
              description="Generate scroll stopping headlines."
              comingSoon
            />

            <ToolCard
              title="Content Repurposer"
              status="PRO"
              description="Turn one content into many formats."
              pro
            />

          </div>

        </section>

        <section>

          <h2 className="text-2xl font-bold mb-8">
            PDF Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <ToolCard
              title="Merge PDF"
              status="LIVE"
              description="Combine multiple PDFs."
              comingSoon
            />

            <ToolCard
              title="Compress PDF"
              status="LIVE"
              description="Reduce PDF file size."
              comingSoon
            />

            <ToolCard
              title="OCR PDF"
              status="LIVE"
              description="Extract text from scanned PDF."
              comingSoon
            />

          </div>

        </section>

      </main>

    </div>

  );

}