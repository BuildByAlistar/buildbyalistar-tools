import React, { useMemo, useState } from "react";
import { runTool } from "../../lib/toolRunner";

const badgeStyles = {
  FREE: "text-green-500 bg-green-900",
  PRO: "text-purple-400 bg-purple-950",
  LIVE: "text-emerald-500 bg-emerald-900",
  "COMING SOON": "text-gray-400 bg-gray-800",
};

function FieldInput({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <textarea
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        rows={field.rows || 6}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500 p-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white p-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-4">
        <input
          type="file"
          accept={field.accept}
          multiple={field.multiple}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onChange(field.id, field.multiple ? files : files[0] || null);
          }}
          className="w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-purple-600"
        />
      </div>
    );
  }

  return (
    <input
      type={field.type || "text"}
      placeholder={field.placeholder}
      value={value || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500 p-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
    />
  );
}

export default function DynamicToolRenderer({ tool }) {
  const initialValues = useMemo(
    () =>
      tool.fields.reduce((acc, field) => {
        acc[field.id] = field.type === "file" ? (field.multiple ? [] : null) : "";
        return acc;
      }, {}),
    [tool.fields],
  );

  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isSubmitDisabled = loading || tool.fields.some((field) => {
    if (!field.required) {
      return false;
    }

    if (field.type === "file") {
      const fileValue = values[field.id];
      return field.multiple ? !fileValue?.length : !fileValue;
    }

    return !(values[field.id] || "").trim();
  });

  const handleFieldChange = (fieldId, value) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setCopied(false);
      setResult(null);

      const toolResult = await runTool({ tool, values });
      setResult(toolResult);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    const outputText = result?.type === "text" ? result.output : "";
    if (!outputText) {
      return;
    }

    await navigator.clipboard.writeText(outputText);
    setCopied(true);
  };

  const downloadFile = () => {
    if (result?.type !== "file") {
      return;
    }

    const { fileBase64, mimeType, fileName } = result.output;
    const bytes = atob(fileBase64);
    const buffer = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) {
      buffer[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([buffer], { type: mimeType || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName || "result.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{tool.pageTitle || tool.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${badgeStyles[tool.badge] || "bg-zinc-800 text-zinc-300"}`}>
              {tool.badge}
            </span>
          </div>
          <p className="text-zinc-400">{tool.pageDescription || tool.description}</p>
          <p className="text-xs text-zinc-500 mt-2">Provider: {tool.provider}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {tool.fields.map((field) => (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-3">{field.label}</label>
              <FieldInput field={field} value={values[field.id]} onChange={handleFieldChange} />
            </div>
          ))}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={isSubmitDisabled}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-xl transition"
            >
              {loading ? "Running..." : tool.comingSoon ? "Run Preview" : "Generate"}
            </button>
            {loading && <span className="text-sm text-zinc-400">Processing your file. Please wait...</span>}
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-amber-700 bg-amber-950/50 text-amber-300 p-4">
              {error}
            </div>
          ) : null}
        </div>

        {result?.type === "text" && result.output ? (
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Result</h2>
              <button
                type="button"
                onClick={copyResult}
                className="text-sm px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700"
              >
                {copied ? "Copied" : "Copy result"}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-100 leading-7">{result.output}</div>
          </div>
        ) : null}

        {result?.type === "file" ? (
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Your file is ready</h2>
            <p className="text-zinc-400 mb-4">Download your processed PDF safely to your device.</p>
            <button
              type="button"
              onClick={downloadFile}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition"
            >
              Download {result.output.fileName}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
