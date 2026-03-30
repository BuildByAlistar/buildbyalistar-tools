const nowIso = () => new Date().toISOString();

const syncedTopLevelFields = {
  overview: "overview",
  requiredItems: "requiredItems",
  notes: "notes",
  warnings: "warnings",
  resources: "resources",
  cta: "cta",
};

const createStepId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `step-${Date.now()}-${Math.round(Math.random() * 10000)}`;

export const instructionPresets = [
  {
    id: "internal-sop",
    label: "Internal SOP",
    description: "Standard operating procedure for internal teams.",
    defaults: {
      title: "Internal SOP: Task Workflow",
      subtitle: "A repeatable guide for consistent execution.",
      audience: "Operations team",
      overview:
        "This SOP outlines the exact steps to deliver the workflow consistently. Use it to onboard new teammates or reinforce quality.",
      requiredItems:
        "Shared drive access\nApproved templates\nLogin credentials\nTime tracker",
      steps: [
        {
          title: "Prepare the workspace",
          description: "Open the shared folder, duplicate the latest SOP checklist, and confirm timeline ownership.",
          note: "Use the most recent checklist version.",
        },
        {
          title: "Execute the core task",
          description: "Follow the checklist in order, documenting any deviations for team review.",
          tip: "Batch similar tasks to reduce context switching.",
        },
        {
          title: "Close out and report",
          description: "Mark completion, add a short summary, and notify the lead via Slack.",
          warning: "Do not close tasks without confirming quality review.",
        },
      ],
      notes:
        "Keep this SOP updated after every retrospective so new team members always see the latest process.",
      warnings:
        "Never skip QA checks. Escalate any blockers within the first 30 minutes.",
      resources:
        "SOP checklist - https://example.com/sop\nTeam hub - https://example.com/team-hub",
      cta: "Confirm completion in the ops tracker.",
      enabledSections: {
        overview: true,
        requiredItems: true,
        steps: true,
        notes: true,
        warnings: true,
        resources: true,
        images: true,
        video: true,
        cta: true,
      },
    },
  },
  {
    id: "client-handover",
    label: "Client Handover Guide",
    description: "Client-facing walkthrough for delivery and next steps.",
    defaults: {
      title: "Client Handover Guide",
      subtitle: "Everything you need to take over with confidence.",
      audience: "Client stakeholders",
      overview:
        "This handover guide covers the key steps, assets, and contacts needed to continue delivery without disruption.",
      requiredItems:
        "Project credentials\nFinal assets folder\nClient contact list\nSupport schedule",
      steps: [
        {
          title: "Review deliverables",
          description: "Open the delivery folder and review each finalized asset against the checklist.",
          note: "Highlight any open feedback items.",
        },
        {
          title: "Confirm handover meeting",
          description: "Schedule the handover call and review responsibilities with key stakeholders.",
          tip: "Invite both primary and backup owners.",
        },
        {
          title: "Activate support window",
          description: "Document the support period and escalation path for the first 30 days post-handover.",
          warning: "Escalate critical issues within 4 hours.",
        },
      ],
      notes:
        "Keep all shared links in one place so clients can onboard faster.",
      warnings:
        "Do not share credentials outside the approved contact list.",
      resources:
        "Delivery folder - https://example.com/delivery\nSupport portal - https://example.com/support",
      cta: "Confirm receipt and schedule the first check-in.",
      enabledSections: {
        overview: true,
        requiredItems: true,
        steps: true,
        notes: true,
        warnings: true,
        resources: true,
        images: true,
        video: true,
        cta: true,
      },
    },
  },
  {
    id: "product-walkthrough",
    label: "Product Walkthrough",
    description: "Step-by-step product or feature walkthrough.",
    defaults: {
      title: "Product Walkthrough",
      subtitle: "A guided tour of the core workflow.",
      audience: "New users",
      overview:
        "Use this walkthrough to help users activate quickly and understand the primary workflow end-to-end.",
      requiredItems:
        "Login access\nDemo data set\nSample project\nKnowledge base link",
      steps: [
        {
          title: "Sign in and set up",
          description: "Create your profile, add your team, and configure your first workspace.",
          tip: "Use the template project to save time.",
        },
        {
          title: "Complete your first task",
          description: "Follow the step prompts to generate your first output and review the results.",
          note: "This is the fastest path to activation.",
        },
        {
          title: "Review insights",
          description: "Check the dashboard metrics to see the impact of your first workflow.",
          warning: "Only share dashboards with approved collaborators.",
        },
      ],
      notes:
        "If you get stuck, share a quick screen recording with support.",
      warnings:
        "Keep sensitive data out of shared demo workspaces.",
      resources:
        "Help center - https://example.com/help\nVideo library - https://example.com/videos",
      cta: "Start your first workflow now.",
      enabledSections: {
        overview: true,
        requiredItems: true,
        steps: true,
        notes: false,
        warnings: false,
        resources: true,
        images: true,
        video: true,
        cta: true,
      },
    },
  },
];

export const instructionSectionDefinitions = [
  { id: "overview", label: "Overview", kind: "richText", enabled: true },
  { id: "requiredItems", label: "Required Tools & Materials", kind: "list", enabled: true },
  { id: "steps", label: "Step-by-Step Instructions", kind: "steps", enabled: true },
  { id: "notes", label: "Notes & Tips", kind: "richText", enabled: true },
  { id: "warnings", label: "Warnings", kind: "richText", enabled: true },
  { id: "resources", label: "Resources", kind: "resources", enabled: true },
  { id: "images", label: "Screenshots & Images", kind: "gallery", enabled: true },
  { id: "video", label: "Video Walkthrough", kind: "video", enabled: true },
  { id: "cta", label: "Final CTA", kind: "cta", enabled: true },
];

export const instructionSectionFields = instructionSectionDefinitions.map((section) => ({
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

export function createInstructionStep(overrides = {}) {
  return {
    id: createStepId(),
    stepNumber: overrides.stepNumber ?? 1,
    title: "",
    description: "",
    image: createTemplateMedia(),
    note: "",
    tip: "",
    warning: "",
    ...overrides,
  };
}

const getPresetById = (presetId) =>
  instructionPresets.find((preset) => preset.id === presetId) || instructionPresets[0];

function createDefaultSections(preset) {
  const sectionEnabled = preset?.defaults?.enabledSections || {};

  return instructionSectionDefinitions.map((section) => ({
    ...section,
    enabled: sectionEnabled[section.id] ?? section.enabled,
    content: preset?.defaults?.[section.id] || "",
  }));
}

export function createInitialTemplateState(presetId = instructionPresets[0].id) {
  const createdAt = nowIso();
  const preset = getPresetById(presetId);
  const sections = createDefaultSections(preset);
  const presetSteps = preset?.defaults?.steps || [];

  return {
    templateType: "instruction",
    guideType: preset?.label || "Instruction Guide",
    title: preset?.defaults?.title || "Instruction Guide",
    subtitle: preset?.defaults?.subtitle || "A structured guide for consistent delivery.",
    audience: preset?.defaults?.audience || "Team members",
    overview: preset?.defaults?.overview || sections.find((section) => section.id === "overview")?.content || "",
    requiredItems:
      preset?.defaults?.requiredItems ||
      sections.find((section) => section.id === "requiredItems")?.content ||
      "",
    steps: presetSteps.length
      ? presetSteps.map((step, index) => createInstructionStep({ stepNumber: index + 1, ...step }))
      : [createInstructionStep({ stepNumber: 1 }), createInstructionStep({ stepNumber: 2 })],
    images: [],
    video: createTemplateMedia(),
    notes: preset?.defaults?.notes || sections.find((section) => section.id === "notes")?.content || "",
    warnings: preset?.defaults?.warnings || sections.find((section) => section.id === "warnings")?.content || "",
    resources: preset?.defaults?.resources || sections.find((section) => section.id === "resources")?.content || "",
    cta: preset?.defaults?.cta || sections.find((section) => section.id === "cta")?.content || "",
    links: [],
    sections,
    theme: {
      id: "instruction-default",
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

export function applyInstructionPreset(template, presetId) {
  const preset = getPresetById(presetId);
  const sections = createDefaultSections(preset);
  const steps = (preset?.defaults?.steps || []).map((step, index) =>
    createInstructionStep({ stepNumber: index + 1, ...step })
  );

  return withUpdatedTimestamp({
    ...template,
    guideType: preset?.label || template.guideType,
    title: preset?.defaults?.title || template.title,
    subtitle: preset?.defaults?.subtitle || template.subtitle,
    audience: preset?.defaults?.audience || template.audience,
    overview: preset?.defaults?.overview || template.overview,
    requiredItems: preset?.defaults?.requiredItems || template.requiredItems,
    notes: preset?.defaults?.notes || template.notes,
    warnings: preset?.defaults?.warnings || template.warnings,
    resources: preset?.defaults?.resources || template.resources,
    cta: preset?.defaults?.cta || template.cta,
    steps: steps.length ? steps : template.steps,
    sections,
  });
}

export function applyGeneratedInstructionContent(template, generatedContent = {}) {
  let nextTemplate = template;

  if (generatedContent.title) {
    nextTemplate = updateTemplateField(nextTemplate, "title", generatedContent.title);
  }
  if (generatedContent.subtitle) {
    nextTemplate = updateTemplateField(nextTemplate, "subtitle", generatedContent.subtitle);
  }
  if (generatedContent.audience) {
    nextTemplate = updateTemplateField(nextTemplate, "audience", generatedContent.audience);
  }

  nextTemplate = updateTemplateSectionContent(
    nextTemplate,
    "overview",
    generatedContent.overview || generatedContent.summary || ""
  );
  nextTemplate = updateTemplateSectionContent(
    nextTemplate,
    "requiredItems",
    generatedContent.requiredItems || generatedContent.features || ""
  );
  nextTemplate = updateTemplateSectionContent(
    nextTemplate,
    "notes",
    generatedContent.notes || generatedContent.solution || ""
  );
  nextTemplate = updateTemplateSectionContent(
    nextTemplate,
    "warnings",
    generatedContent.warnings || generatedContent.problem || ""
  );
  nextTemplate = updateTemplateSectionContent(
    nextTemplate,
    "resources",
    generatedContent.resources || generatedContent.pricing || ""
  );
  nextTemplate = updateTemplateSectionContent(
    nextTemplate,
    "cta",
    generatedContent.cta || ""
  );

  if (Array.isArray(generatedContent.steps)) {
    const nextSteps = generatedContent.steps.map((step, index) =>
      createInstructionStep({
        stepNumber: index + 1,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "",
        note: step.note || "",
        tip: step.tip || "",
        warning: step.warning || "",
      })
    );
    nextTemplate = withUpdatedTimestamp({
      ...nextTemplate,
      steps: nextSteps.length ? nextSteps : nextTemplate.steps,
    });
  }

  return nextTemplate;
}

export function applyInstructionImages(template, mediaList) {
  return withUpdatedTimestamp({
    ...template,
    images: Array.isArray(mediaList) ? mediaList.map((item) => createTemplateMedia(item)) : [],
  });
}

export function appendInstructionImages(template, mediaList) {
  const safeList = Array.isArray(mediaList) ? mediaList : [];
  if (!safeList.length) {
    return template;
  }

  return withUpdatedTimestamp({
    ...template,
    images: [...template.images, ...safeList.map((item) => createTemplateMedia(item))],
  });
}

export function applyVideoMedia(template, media) {
  return withUpdatedTimestamp({
    ...template,
    video: createTemplateMedia(media),
  });
}

export function updateInstructionStep(template, stepId, updates = {}) {
  const nextSteps = template.steps.map((step, index) =>
    step.id === stepId
      ? {
          ...step,
          ...updates,
          stepNumber: index + 1,
        }
      : {
          ...step,
          stepNumber: index + 1,
        }
  );

  return withUpdatedTimestamp({
    ...template,
    steps: nextSteps,
  });
}

export function addInstructionStep(template) {
  const nextSteps = [...template.steps, createInstructionStep({ stepNumber: template.steps.length + 1 })];
  return withUpdatedTimestamp({
    ...template,
    steps: nextSteps,
  });
}

export function removeInstructionStep(template, stepId) {
  const nextSteps = template.steps.filter((step) => step.id !== stepId);
  return withUpdatedTimestamp({
    ...template,
    steps: nextSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    })),
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

const legacySectionMap = {
  summary: "overview",
  features: "requiredItems",
  pricing: "resources",
  cta: "cta",
};

export function normalizeInstructionTemplate(rawTemplate) {
  const base = createInitialTemplateState();
  if (!rawTemplate) {
    return base;
  }

  const nextTemplate = {
    ...base,
    ...rawTemplate,
    templateType: "instruction",
    guideType: rawTemplate.guideType || rawTemplate.businessType || base.guideType,
    title: rawTemplate.title || base.title,
    subtitle: rawTemplate.subtitle || base.subtitle,
    audience: rawTemplate.audience || rawTemplate.clientName || base.audience,
    overview: rawTemplate.overview || rawTemplate.summary || base.overview,
    requiredItems: rawTemplate.requiredItems || rawTemplate.features || base.requiredItems,
    notes: rawTemplate.notes || rawTemplate.solution || base.notes,
    warnings: rawTemplate.warnings || rawTemplate.problem || base.warnings,
    resources: rawTemplate.resources || rawTemplate.pricing || base.resources,
    cta: rawTemplate.cta || base.cta,
    steps: Array.isArray(rawTemplate.steps) && rawTemplate.steps.length
      ? rawTemplate.steps.map((step, index) => createInstructionStep({ stepNumber: index + 1, ...step }))
      : base.steps,
    images: Array.isArray(rawTemplate.images) ? rawTemplate.images : base.images,
    video: rawTemplate.video || base.video,
    links: rawTemplate.links || base.links,
  };

  if (Array.isArray(rawTemplate.sections) && rawTemplate.sections.length) {
    nextTemplate.sections = base.sections.map((section) => {
      const matching = rawTemplate.sections.find((item) => item.id === section.id);
      const legacyMatch = rawTemplate.sections.find((item) => legacySectionMap[item.id] === section.id);

      return {
        ...section,
        enabled: matching?.enabled ?? legacyMatch?.enabled ?? section.enabled,
        content:
          matching?.content ||
          legacyMatch?.content ||
          nextTemplate[section.id] ||
          section.content ||
          "",
      };
    });
  } else {
    nextTemplate.sections = base.sections.map((section) => ({
      ...section,
      enabled: rawTemplate?.toggles?.[section.id] ?? section.enabled,
      content: nextTemplate[section.id] || section.content || "",
    }));
  }

  return nextTemplate;
}

export function toLegacyInstructionPayload(template) {
  const overviewSection = getSectionById(template, "overview");
  const requiredItemsSection = getSectionById(template, "requiredItems");
  const notesSection = getSectionById(template, "notes");
  const warningsSection = getSectionById(template, "warnings");
  const resourcesSection = getSectionById(template, "resources");
  const ctaSection = getSectionById(template, "cta");
  const stepsSection = getSectionById(template, "steps");
  const imagesSection = getSectionById(template, "images");
  const videoSection = getSectionById(template, "video");
  const primaryImage = getPrimaryImage(template);
  const video = getTemplateVideo(template);

  return {
    templateType: template.templateType,
    title: template.title,
    guideType: template.guideType,
    subtitle: template.subtitle,
    audience: template.audience,
    overview: overviewSection?.content || template.overview,
    requiredItems: requiredItemsSection?.content || template.requiredItems,
    steps: template.steps || [],
    notes: notesSection?.content || template.notes,
    warnings: warningsSection?.content || template.warnings,
    resources: resourcesSection?.content || template.resources,
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
      overview: overviewSection?.enabled ?? true,
      requiredItems: requiredItemsSection?.enabled ?? true,
      steps: stepsSection?.enabled ?? true,
      notes: notesSection?.enabled ?? true,
      warnings: warningsSection?.enabled ?? true,
      resources: resourcesSection?.enabled ?? true,
      images: imagesSection?.enabled ?? true,
      video: videoSection?.enabled ?? true,
      cta: ctaSection?.enabled ?? true,
    },
  };
}
