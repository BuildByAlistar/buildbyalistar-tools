import { emailBlockDefinitions, getEmailTypeConfig } from "./emailConfig";

const nowIso = () => new Date().toISOString();

const createBlockId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `block-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const createImageId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `image-${Date.now()}-${Math.round(Math.random() * 1000)}`;

export const createEmailImage = (overrides = {}) => ({
  id: createImageId(),
  url: "",
  name: "",
  role: "",
  type: "image",
  mimeType: "",
  note: "",
  ...overrides,
});

const buildBlocks = (blockOrder = [], existingBlocks = []) => {
  const existingMap = existingBlocks.reduce((acc, block) => {
    acc[block.key] = block;
    return acc;
  }, {});

  return blockOrder.map((key) => {
    const definition = emailBlockDefinitions[key] || {
      label: key,
      placeholder: "",
      kind: "text",
    };
    const existing = existingMap[key];

    return {
      id: existing?.id || createBlockId(),
      key,
      label: definition.label,
      kind: definition.kind || "text",
      placeholder: definition.placeholder || "",
      content: existing?.content || "",
      enabled: true,
    };
  });
};

const updateByPath = (obj, path, value) => {
  if (!path.includes(".")) {
    return { ...obj, [path]: value };
  }

  const [root, ...rest] = path.split(".");
  const nestedPath = rest.join(".");

  return {
    ...obj,
    [root]: updateByPath(obj[root] || {}, nestedPath, value),
  };
};

export const createInitialEmailState = (emailType = "marketing") => {
  const config = getEmailTypeConfig(emailType);
  const createdAt = nowIso();
  const starterCopy = config.starterCopy || {};

  const blocks = buildBlocks(config.blockOrder || []);

  const seededBlocks = blocks.map((block) => ({
    ...block,
    content: starterCopy[block.key] || block.content,
  }));

  return {
    templateType: "email",
    emailType,
    subject: starterCopy.subject || "",
    previewText: starterCopy.previewText || "",
    senderName: "",
    senderCompany: "",
    audienceType: "",
    tone: config.defaultTone || "friendly",
    goal: "",
    productName: "",
    offerDetails: "",
    messageBlocks: seededBlocks,
    cta: "Learn more",
    links: {
      primaryLink: "",
      secondaryLink: "",
      unsubscribeLink: "",
    },
    images: [],
    layoutStyle: config.recommendedLayoutStyle || "minimal-clean",
    createdAt,
    updatedAt: createdAt,
  };
};

const withUpdatedTimestamp = (template) => ({
  ...template,
  updatedAt: nowIso(),
});

export const updateEmailField = (template, field, value) =>
  withUpdatedTimestamp(updateByPath(template, field, value));

export const updateEmailBlockContent = (template, blockId, value) =>
  withUpdatedTimestamp({
    ...template,
    messageBlocks: template.messageBlocks.map((block) =>
      block.id === blockId ? { ...block, content: value } : block
    ),
  });

export const applyEmailTypeDefaults = (template, emailType) => {
  const config = getEmailTypeConfig(emailType);
  const starterCopy = config.starterCopy || {};

  return withUpdatedTimestamp({
    ...template,
    emailType,
    tone: config.defaultTone || template.tone,
    layoutStyle: config.recommendedLayoutStyle || template.layoutStyle,
    subject: template.subject || starterCopy.subject || template.subject,
    previewText: template.previewText || starterCopy.previewText || template.previewText,
    messageBlocks: buildBlocks(config.blockOrder || [], template.messageBlocks).map((block) => ({
      ...block,
      content: block.content || starterCopy[block.key] || "",
    })),
  });
};

export const applyGeneratedEmailContent = (template, generated = {}) => {
  const nextTemplate = {
    ...template,
    subject: generated.subject || template.subject,
    previewText: generated.previewText || template.previewText,
    cta: generated.cta || template.cta,
    tone: generated.tone || template.tone,
  };

  const generatedBlocks = Array.isArray(generated.messageBlocks) ? generated.messageBlocks : [];
  if (generatedBlocks.length) {
    const mappedBlocks = template.messageBlocks.map((block) => {
      const match = generatedBlocks.find((item) => item.key === block.key || item.label === block.label);
      return match?.content ? { ...block, content: match.content } : block;
    });

    return withUpdatedTimestamp({ ...nextTemplate, messageBlocks: mappedBlocks });
  }

  const fallbackBody = generated.body || generated.emailBody || generated.message || "";
  if (fallbackBody) {
    const firstBlock = template.messageBlocks[0];
    const mappedBlocks = template.messageBlocks.map((block) =>
      block.id === firstBlock?.id ? { ...block, content: fallbackBody } : block
    );
    return withUpdatedTimestamp({ ...nextTemplate, messageBlocks: mappedBlocks });
  }

  return withUpdatedTimestamp(nextTemplate);
};

export const applyEmailImage = (template, image) => {
  const filtered = template.images.filter((asset) => asset.role !== image.role);
  return withUpdatedTimestamp({
    ...template,
    images: [...filtered, createEmailImage(image)],
  });
};

export const removeEmailImage = (template, imageId) =>
  withUpdatedTimestamp({
    ...template,
    images: template.images.filter((image) => image.id !== imageId),
  });

export const clearEmailImages = (template) =>
  withUpdatedTimestamp({
    ...template,
    images: [],
  });

export const getEmailImageByRole = (template, role) =>
  template.images.find((asset) => asset.role === role) || null;

export const buildEmailAIPayload = (template, config) => ({
  tool: "email-generator",
  emailType: template.emailType,
  subject: template.subject,
  previewText: template.previewText,
  senderName: template.senderName,
  senderCompany: template.senderCompany,
  audienceType: template.audienceType,
  tone: template.tone,
  goal: template.goal,
  productName: template.productName,
  offerDetails: template.offerDetails,
  messageBlocks: template.messageBlocks.map((block) => ({
    key: block.key,
    label: block.label,
    content: block.content,
    kind: block.kind,
  })),
  cta: template.cta,
  links: template.links,
  aiGuidance: config.aiGuidance || "",
});
