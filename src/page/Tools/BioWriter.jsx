import React, { useState } from "react";

const FUNCTION_URL = "https://generatetext-mzlimmikka-uc.a.run.app";

export default function BioWriter() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBio = async () => {
    try {
      setLoading(true);
      setError("");
      setOutput("");

      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a professional bio based on this input:\n\n${prompt}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setOutput(data?.reply || "(empty)");
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Bio Writer</h1>
          <p className="text-zinc-400">
            Enter a short description and generate a professional bio.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Describe yourself
          </label>

          <textarea
            placeholder="Example: I am an insurance advisor with 7 years of experience helping families and businesses choose the right coverage..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500 p-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={generateBio}
              disabled={loading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-xl transition"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            {loading && <span className="text-sm text-zinc-400">Please wait...</span>}
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300 p-4">
              Error: {error}
            </div>
          ) : null}
        </div>

        {output ? (
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="whitespace-pre-wrap text-zinc-100 leading-7">
              {output}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}