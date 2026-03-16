const nowIso = () => new Date().toISOString();

const syncedTopLevelFields = {
  summary: "summary",
  features: "features",
  pricing: "pricing",
  cta: "cta",
};

export const proposalSectionDefinitions = [
  { id: "summary", label: "Overview", kind: "richText", enabled: true },
  { id: "problem", label: "Problem", kind: "richText", enabled: true },
  { id: "solution", label: "Solution", kind: "richText", enabled: true },
  { id: "features", label: "Features", kind: "list", enabled: true },
  { id: "pricing", label: "Pricing", kind: "list", enabled: true },
  { id: "cta", label: "CTA", kind: "cta", enabled: true },
];

export const proposalSectionFields = proposalSectionDefinitions.map((section) => ({
  key: section.id,
  label: section.label,
}));

export function createTemplateMedia(overrides = {}) {
  return {
    type: "",
    url: "",
    name: "",
    note: "",
    aiExplanation: "",
    storagePath: "",
    ...overrides,
  };
}

function createDefaultSections() {
  return [
    {
      id: "summary",
      label: "Overview",
      kind: "richText",
      enabled: true,
      content:
        "A polished proposal experience that helps your team present scope, timelines, and next steps in one client-ready document.",
    },
    {
      id: "problem",
      label: "Problem",
      kind: "richText",
      enabled: true,
      content:
        "Clients often struggle with unclear project framing, inconsistent presentation, and too much friction between proposal review and final approval.",
    },
    {
      id: "solution",
      label: "Solution",
      kind: "richText",
      enabled: true,
      content:
        "This proposal system creates a cleaner delivery experience with stronger positioning, clearer structure, and a format that helps stakeholders understand the value quickly.",
    },
    {
      id: "features",
      label: "Features",
      kind: "list",
      enabled: true,
      content: "Interactive proposal layout\nResponsive design\nClient-ready HTML export\nEmbedded video walkthrough",
    },
    {
      id: "pricing",
      label: "Pricing",
      kind: "list",
      enabled: true,
      content: "Starter Package - $1,500\nGrowth Package - $3,500\nCustom Enterprise Scope - Contact for quote",
    },
    {
      id: "cta",
      label: "CTA",
      kind: "cta",
      enabled: true,
      content: "Approve the proposal to start delivery.",
    },
  ];
}

export function createInitialTemplateState() {
  const createdAt = nowIso();
  const sections = createDefaultSections();

  return {
    templateType: "proposal",
    title: "AI Proposal System",
    clientName: "Acme Client",
    businessType: "Consulting and Client Delivery",
    summary: sections.find((section) => section.id === "summary")?.content || "",
    features: sections.find((section) => section.id === "features")?.content || "",
    pricing: sections.find((section) => section.id === "pricing")?.content || "",
    cta: sections.find((section) => section.id === "cta")?.content || "",
    images: [],
    video: createTemplateMedia(),
    links: [],
    sections,
    theme: {
      id: "proposal-default",
      accent: "cyan",
      surface: "light",
    },
    createdAt,
    updatedAt: createdAt,
  };
}

function withUpdatedTimestamp(template) {
  return {
    ...template,
    updatedAt: nowIso(),
  };
}

function syncTopLevelField(template, sectionId, value) {
  const topLevelField = syncedTopLevelFields[sectionId];

  if (!topLevelField) {
    return template;
  }

  return {
    ...template,
    [topLevelField]: value,
  };
}

export function updateTemplateField(template, field, value) {
  const nextTemplate = {
    ...template,
    [field]: value,
  };

  return withUpdatedTimestamp(nextTemplate);
}

export function updateTemplateSectionContent(template, sectionId, value) {
  const nextTemplate = {
    ...template,
    sections: template.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            content: value,
          }
        : section
    ),
  };

  return withUpdatedTimestamp(syncTopLevelField(nextTemplate, sectionId, value));
}

export function updateTemplateSectionEnabled(template, sectionId, enabled) {
  return withUpdatedTimestamp({
    ...template,
    sections: template.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            enabled,
          }
        : section
    ),
  });
}

export function applyGeneratedProposalContent(template, generatedContent) {
  let nextTemplate = template;

  nextTemplate = updateTemplateSectionContent(nextTemplate, "summary", generatedContent.overview || "");
  nextTemplate = updateTemplateSectionContent(nextTemplate, "problem", generatedContent.problem || "");
  nextTemplate = updateTemplateSectionContent(nextTemplate, "solution", generatedContent.solution || "");
  nextTemplate = updateTemplateSectionContent(nextTemplate, "features", generatedContent.features || "");
  nextTemplate = updateTemplateSectionContent(nextTemplate, "pricing", generatedContent.pricing || "");
  nextTemplate = updateTemplateSectionContent(nextTemplate, "cta", generatedContent.cta || "");

  return nextTemplate;
}

export function applyPrimaryImage(template, media) {
  return withUpdatedTimestamp({
    ...template,
    images: media?.url ? [createTemplateMedia(media)] : [],
  });
}

export function applyVideoMedia(template, media) {
  return withUpdatedTimestamp({
    ...template,
    video: createTemplateMedia(media),
  });
}

export function getSectionById(template, sectionId) {
  return template.sections.find((section) => section.id === sectionId);
}

export function getSectionContent(template, sectionId) {
  return getSectionById(template, sectionId)?.content || "";
}

export function getPrimaryImage(template) {
  return template.images[0] || null;
}

export function getTemplateVideo(template) {
  return template.video?.url ? template.video : null;
}

export function toLegacyProposalPayload(template) {
  const summarySection = getSectionById(template, "summary");
  const problemSection = getSectionById(template, "problem");
  const solutionSection = getSectionById(template, "solution");
  const featuresSection = getSectionById(template, "features");
  const pricingSection = getSectionById(template, "pricing");
  const ctaSection = getSectionById(template, "cta");
  const primaryImage = getPrimaryImage(template);
  const video = getTemplateVideo(template);

  return {
    templateType: template.templateType,
    title: template.title,
    projectName: template.title,
    clientName: template.clientName,
    businessType: template.businessType,
    summary: template.summary,
    overview: summarySection?.content || template.summary,
    problem: problemSection?.content || "",
    solution: solutionSection?.content || "",
    features: featuresSection?.content || template.features,
    pricing: pricingSection?.content || template.pricing,
    cta: ctaSection?.content || template.cta,
    images: template.images,
    imageDataUrl: primaryImage?.url || "",
    video: video || createTemplateMedia(),
    videoUrl: video?.url || "",
    videoName: video?.name || "",
    videoType: video?.type || "video/mp4",
    storagePath: video?.storagePath || "",
    links: template.links,
    sections: template.sections,
    theme: template.theme,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    toggles: {
      overview: summarySection?.enabled ?? true,
      problem: problemSection?.enabled ?? true,
      solution: solutionSection?.enabled ?? true,
      features: featuresSection?.enabled ?? true,
      pricing: pricingSection?.enabled ?? true,
      cta: ctaSection?.enabled ?? true,
    },
  };
}
