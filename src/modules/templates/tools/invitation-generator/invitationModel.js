import { getInvitationTypeConfig, invitationSectionDefinitions } from "./invitationConfig";

const nowIso = () => new Date().toISOString();

const createMediaId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `media-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const mediaRoleRules = {
  cover: { single: true },
  gallery: { single: false },
  logo: { single: true },
  "host-photo": { single: true },
  "venue-photo": { single: true },
  video: { single: true },
  "map-reference": { single: true },
};

export const createInvitationMedia = (overrides = {}) => ({
  id: createMediaId(),
  type: "",
  url: "",
  name: "",
  note: "",
  aiExplanation: "",
  storagePath: "",
  mimeType: "",
  title: "",
  role: "",
  ...overrides,
});

const buildEnabledSections = (sectionIds = []) =>
  invitationSectionDefinitions.reduce((acc, section) => {
    acc[section.id] = sectionIds.includes(section.id);
    return acc;
  }, {});

const starterLinks = {
  rsvpLink: "",
  websiteLink: "",
  registrationLink: "",
  whatsappLink: "",
};

export const createInitialInvitationState = (invitationType = "birthday") => {
  const config = getInvitationTypeConfig(invitationType);
  const createdAt = nowIso();
  const starterCopy = config.starterCopy || {};

  return {
    templateType: "invitation",
    invitationType,
    title: starterCopy.title || "Invitation",
    subtitle: starterCopy.subtitle || "",
    hostName: "",
    organizerName: "",
    companyName: "",
    audienceType: "",
    invitationGoal: "",
    eventDate: "",
    eventTime: "",
    endTime: "",
    timezone: "",
    venueName: "",
    addressLine: "",
    mapLink: "",
    city: "",
    country: "",
    rsvpRequired: true,
    rsvpContact: "",
    rsvpDeadline: "",
    dressCode: "",
    themeStyle: "",
    tone: config.defaultTone || "warm",
    shortMessage: starterCopy.shortMessage || "",
    longMessage: "",
    highlights: "",
    schedule: "",
    notes: "",
    cta: "",
    links: { ...starterLinks },
    mediaAssets: [],
    enabledSections: buildEnabledSections(config.enabledSections || []),
    layoutStyle: config.recommendedLayoutStyle || "elegant-classic",
    previewTheme: config.recommendedPreviewTheme || "soft",
    createdAt,
    updatedAt: createdAt,
  };
};

const withUpdatedTimestamp = (template) => ({
  ...template,
  updatedAt: nowIso(),
});

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

export const updateInvitationField = (template, field, value) =>
  withUpdatedTimestamp(updateByPath(template, field, value));

export const updateInvitationSectionEnabled = (template, sectionId, enabled) =>
  withUpdatedTimestamp({
    ...template,
    enabledSections: {
      ...template.enabledSections,
      [sectionId]: enabled,
    },
  });

export const applyInvitationTypeDefaults = (template, invitationType) => {
  const config = getInvitationTypeConfig(invitationType);
  const starterCopy = config.starterCopy || {};

  return withUpdatedTimestamp({
    ...template,
    invitationType,
    tone: config.defaultTone || template.tone,
    layoutStyle: config.recommendedLayoutStyle || template.layoutStyle,
    previewTheme: config.recommendedPreviewTheme || template.previewTheme,
    enabledSections: buildEnabledSections(config.enabledSections || []),
    title: template.title || starterCopy.title || template.title,
    subtitle: template.subtitle || starterCopy.subtitle || template.subtitle,
    shortMessage: template.shortMessage || starterCopy.shortMessage || template.shortMessage,
  });
};

export const applyGeneratedInvitationContent = (template, generated = {}) =>
  withUpdatedTimestamp({
    ...template,
    title: generated.title || template.title,
    subtitle: generated.subtitle || template.subtitle,
    shortMessage: generated.shortMessage || template.shortMessage,
    longMessage: generated.longMessage || template.longMessage,
    highlights: generated.highlights || template.highlights,
    schedule: generated.schedule || template.schedule,
    dressCode: generated.dressCode || template.dressCode,
    notes: generated.hostNote || generated.notes || template.notes,
    cta: generated.cta || template.cta,
    rsvpContact: generated.rsvpContact || template.rsvpContact,
    tone: generated.tone || template.tone,
  });

export const applyMediaAsset = (template, media) => {
  const rule = mediaRoleRules[media.role] || { single: true };

  if (rule.single) {
    const filtered = template.mediaAssets.filter((asset) => asset.role !== media.role);
    return withUpdatedTimestamp({
      ...template,
      mediaAssets: [...filtered, createInvitationMedia(media)],
    });
  }

  return withUpdatedTimestamp({
    ...template,
    mediaAssets: [...template.mediaAssets, createInvitationMedia(media)],
  });
};

export const removeMediaAsset = (template, mediaId) =>
  withUpdatedTimestamp({
    ...template,
    mediaAssets: template.mediaAssets.filter((asset) => asset.id !== mediaId),
  });

export const getMediaByRole = (template, role) =>
  template.mediaAssets.filter((asset) => asset.role === role);

export const getSingleMediaByRole = (template, role) =>
  template.mediaAssets.find((asset) => asset.role === role) || null;

export const buildInvitationAIPayload = (template, config) => ({
  tool: "invitation-generator",
  invitationType: template.invitationType,
  tone: template.tone,
  audienceType: template.audienceType,
  invitationGoal: template.invitationGoal,
  themeStyle: template.themeStyle,
  eventDate: template.eventDate,
  eventTime: template.eventTime,
  endTime: template.endTime,
  timezone: template.timezone,
  venueName: template.venueName,
  addressLine: template.addressLine,
  city: template.city,
  country: template.country,
  hostName: template.hostName,
  organizerName: template.organizerName,
  companyName: template.companyName,
  rsvpRequired: template.rsvpRequired,
  rsvpContact: template.rsvpContact,
  rsvpDeadline: template.rsvpDeadline,
  dressCode: template.dressCode,
  shortMessage: template.shortMessage,
  longMessage: template.longMessage,
  highlights: template.highlights,
  schedule: template.schedule,
  notes: template.notes,
  cta: template.cta,
  enabledSections: template.enabledSections,
  aiGuidance: config.aiGuidance || "",
});
