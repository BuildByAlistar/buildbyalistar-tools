import { ADOBE_FUNCTION_URLS, ENDPOINT_TYPES, GEMINI_FUNCTION_URL, getProvider } from "./providers";
import { trackToolRun } from "./usageTracking";

export const applyPromptTemplate = (template, values) =>
  template.replace(/{{\s*([\w-]+)\s*}}/g, (_, key) => values[key] || "");

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "").split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });

const serializeFile = async (file) => ({
  name: file.name,
  type: file.type,
  base64: await fileToBase64(file),
});

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

const runAdobeAdapter = async (tool, values) => {
  const operation = tool?.action?.operation;
  const endpoint = ADOBE_FUNCTION_URLS[operation];

  if (!operation || !endpoint) {
    throw new Error(`${tool.name} is not executable yet because Adobe operation is not configured.`);
  }

  let body;
  if (operation === "merge-pdf") {
    body = {
      files: await Promise.all((values.files || []).map(serializeFile)),
    };
  } else if (operation === "compress-pdf") {
    body = {
      file: await serializeFile(values.file),
      compressionLevel: values.compressionLevel || "medium",
    };
  } else {
    throw new Error(`${tool.name} Adobe operation is not supported yet.`);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Adobe request failed");
  }

  if (!data?.fileBase64 || !data?.fileName) {
    throw new Error("Adobe service returned an invalid response.");
  }

  return {
    type: "file",
    output: {
      fileName: data.fileName,
      mimeType: data.mimeType || "application/pdf",
      fileBase64: data.fileBase64,
    },
    meta: {
      provider: "adobe",
      status: "live",
      operation,
    },
  };
};

const runProviderAdapter = async (tool, values) => {
  if (tool.provider === "adobe") {
    return runAdobeAdapter(tool, values);
  }

  return {
    type: "text",
    output: `${tool.name} is configured for ${tool.provider} and will be activated once backend wiring is complete.`,
    meta: {
      provider: tool.provider,
      status: "placeholder",
    },
  };
};

export async function runTool({ tool, values, userId }) {
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

  let result;

  switch (tool.endpointType) {
    case ENDPOINT_TYPES.GEMINI_FUNCTION:
      result = await runGeminiFunction(tool, values);
      break;

    case ENDPOINT_TYPES.PROVIDER_ADAPTER:
    case ENDPOINT_TYPES.PROVIDER_PLACEHOLDER:
      result = await runProviderAdapter(tool, values);
      break;

    default:
      result = {
        type: "text",
        output: `${tool.name} cannot run because endpoint type "${tool.endpointType}" is not supported yet.`,
        meta: {
          provider: tool.provider,
          status: "endpoint-unsupported",
        },
      };
      break;
  }

  trackToolRun({
    userId,
    toolId: tool.id,
    provider: result?.meta?.provider || tool.provider,
  }).catch((error) => {
    console.error("Failed to track tool run", error);
  });

  return result;
}
