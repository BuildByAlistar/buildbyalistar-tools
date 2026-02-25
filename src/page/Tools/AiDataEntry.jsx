import React from "react";

const STREAMLIT_URL = "https://ai-toolsphere.onrender.com";

export default function AiDataEntry() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-white">AI Data Entry</h1>

        <a
          href={STREAMLIT_URL}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          Open in new tab
        </a>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
        <iframe
          title="AI Data Entry"
          src={STREAMLIT_URL}
          className="w-full"
          style={{ height: "80vh", border: 0 }}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}