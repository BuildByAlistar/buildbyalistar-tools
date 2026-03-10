import { ENDPOINT_TYPES, GEMINI_FUNCTION_URL, PROVIDERS } from "./providers";

export const applyPromptTemplate = (template, values) =>
  template.replace(/{{\s*([\w-]+)\s*}}/g, (_, key) => values[key] || "");

const runGeminiFunction = async (tool, values) => {
  const prompt = applyPromptTemplate(tool.promptTemplate, values);

  const res = await fetch(GEMINI_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return {
    type: "text",
    output: data?.reply || "(empty)",
  };
};

const runProviderPlaceholder = async (tool) => {
  const provider = PROVIDERS[tool.provider];

  throw new Error(
    `${tool.name} requires ${provider?.label || tool.provider} provider integration and is not live yet.`,
  );
};

export async function runTool({ tool, values }) {
  switch (tool.endpointType) {
    case ENDPOINT_TYPES.GEMINI_FUNCTION:
      return runGeminiFunction(tool, values);

    case ENDPOINT_TYPES.PROVIDER_PLACEHOLDER:
      return runProviderPlaceholder(tool, values);

    default:
      throw new Error(`Unsupported endpoint type: ${tool.endpointType}`);
  }
}
