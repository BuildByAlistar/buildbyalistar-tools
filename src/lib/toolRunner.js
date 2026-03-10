import {
  ENDPOINT_TYPES,
  GEMINI_FUNCTION_URL,
  getProvider,
  getProviderAdapter,
} from "./providers";

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
    meta: {
      provider: "gemini",
      status: "live",
    },
  };
};

const runProviderAdapter = async (tool) => {
  const adapter = getProviderAdapter(tool.provider);
  if (!adapter) {
    return {
      type: "text",
      output: `${tool.name} is not executable yet because provider "${tool.provider}" is not configured.`,
      meta: {
        provider: tool.provider,
        status: "unconfigured",
      },
    };
  }

  return adapter(tool);
};

export async function runTool({ tool, values }) {
  if (!tool?.enabled) {
    throw new Error(`${tool?.name || "This tool"} is currently disabled.`);
  }

  const provider = getProvider(tool.provider);
  if (!provider) {
    return {
      type: "text",
      output: `${tool.name} cannot run yet because provider "${tool.provider}" is undefined in provider config.`,
      meta: {
        provider: tool.provider,
        status: "provider-missing",
      },
    };
  }

  switch (tool.endpointType) {
    case ENDPOINT_TYPES.GEMINI_FUNCTION:
      return runGeminiFunction(tool, values);

    case ENDPOINT_TYPES.PROVIDER_ADAPTER:
    case ENDPOINT_TYPES.PROVIDER_PLACEHOLDER:
      return runProviderAdapter(tool, values);

    default:
      return {
        type: "text",
        output: `${tool.name} cannot run because endpoint type "${tool.endpointType}" is not supported yet.`,
        meta: {
          provider: tool.provider,
          status: "endpoint-unsupported",
        },
      };
  }
}
