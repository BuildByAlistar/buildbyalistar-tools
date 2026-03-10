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
    status: "planned",
    supportsLiveExecution: false,
  },
};

export const ENDPOINT_TYPES = {
  GEMINI_FUNCTION: "gemini-function",
  PROVIDER_ADAPTER: "provider-adapter",
  PROVIDER_PLACEHOLDER: "provider-placeholder",
};

export const GEMINI_FUNCTION_URL = "https://generatetext-mzlimmikka-uc.a.run.app";

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
  adobe: createPlaceholderAdapter("adobe"),
  picsart: createPlaceholderAdapter("picsart"),
  openai: createPlaceholderAdapter("openai"),
};

export const getProviderAdapter = (providerId) => providerAdapters[providerId] || null;
export const getProvider = (providerId) => PROVIDERS[providerId] || null;
