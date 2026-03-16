export const PROVIDERS = {
  gemini: {
    id: "gemini",
    label: "Gemini",
    status: "live",
    supportsLiveExecution: true,
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    status: "planned",
    supportsLiveExecution: false,
  },
  picsart: {
    id: "picsart",
    label: "PicsArt",
    status: "planned",
    supportsLiveExecution: false,
  },
  adobe: {
    id: "adobe",
    label: "Adobe",
    status: "partial-live",
    supportsLiveExecution: true,
  },
};

export const ENDPOINT_TYPES = {
  GEMINI_FUNCTION: "gemini-function",
  PROVIDER_ADAPTER: "provider-adapter",
  PROVIDER_PLACEHOLDER: "provider-placeholder",
};

export const GEMINI_FUNCTION_URL = "https://generatetext-mzlimmikka-uc.a.run.app";

const ADOBE_FUNCTIONS_BASE_URL =
  import.meta.env.VITE_ADOBE_FUNCTIONS_BASE_URL || "https://us-central1-ai-toolsphere.cloudfunctions.net";

export const ADOBE_FUNCTION_URLS = {
  "merge-pdf": `${ADOBE_FUNCTIONS_BASE_URL}/mergePdf`,
  "compress-pdf": `${ADOBE_FUNCTIONS_BASE_URL}/compressPdf`,
};

const getProviderLabel = (providerId) => PROVIDERS[providerId]?.label || providerId || "Unknown provider";

const createPlaceholderAdapter = (providerId) => async (tool) => ({
  type: "text",
  output:
    tool.action?.placeholderMessage ||
    `${tool.name} is configured for ${getProviderLabel(providerId)} and will be activated once backend wiring is complete.`,
  meta: {
    provider: providerId,
    status: "placeholder",
  },
});

export const providerAdapters = {
  adobe: null,
  picsart: createPlaceholderAdapter("picsart"),
  openai: createPlaceholderAdapter("openai"),
};

export const getProviderAdapter = (providerId) => providerAdapters[providerId] || null;
export const getProvider = (providerId) => PROVIDERS[providerId] || null;
