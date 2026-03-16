export const mainNavigation = [
  { label: "Home", path: "/" },
  { label: "Templates", path: "/templates" },
  { label: "PDF", path: "/pdf" },
  { label: "Image", path: "/image" },
  { label: "Content", path: "/content" },
];

export const toolCategories = [
  {
    id: "templates",
    label: "Templates",
    path: "/templates",
    eyebrow: "Reusable Systems",
    title: "Launch faster with reusable formats and structured builders.",
    description: "Curated starting points for proposals, decks, landing pages, and internal delivery templates.",
    collections: ["Sales templates", "Client delivery packs", "Brand-ready starters"],
    featuredRoute: "/templates/proposal-generator",
    featuredLabel: "Open AI Proposal Generator",
    tools: [
      {
        name: "AI Proposal Generator",
        description: "Generate client-ready proposals with editable sections, live preview, and HTML export.",
        status: "Live",
        route: "/templates/proposal-generator",
        badge: "Featured",
      },
      {
        name: "Landing Page Starter",
        description: "Reusable page structure for product launches, service funnels, and promo campaigns.",
        status: "Soon",
        badge: "Template",
      },
      {
        name: "Pricing Sheet Builder",
        description: "Assemble polished pricing layouts for services, retainers, and packaged offers.",
        status: "Soon",
        badge: "Template",
      },
    ],
  },
  {
    id: "pdf",
    label: "PDF",
    path: "/pdf",
    eyebrow: "Document Utilities",
    title: "Handle document workflows from one organized workspace.",
    description: "Fast PDF tooling for teams that need compression, merging, extraction, and clean exports.",
    collections: ["Client documents", "Operations docs", "Batch processing"],
    featuredLabel: "Browse PDF tools",
    tools: [
      {
        name: "Merge PDF",
        description: "Combine multiple documents into a single polished file with ordered output.",
        status: "Soon",
        badge: "Utility",
      },
      {
        name: "Compress PDF",
        description: "Reduce file size for email, upload, and archive workflows without redesigning the source.",
        status: "Soon",
        badge: "Utility",
      },
      {
        name: "OCR Extract",
        description: "Pull searchable text from scanned files and image-based documents.",
        status: "Soon",
        badge: "Utility",
      },
    ],
  },
  {
    id: "image",
    label: "Image",
    path: "/image",
    eyebrow: "Visual Production",
    title: "Prepare image workflows that feel fast, visual, and export-ready.",
    description: "A clean space for asset processing, preview-heavy tooling, and creative production utilities.",
    collections: ["Marketing assets", "Social media packs", "Brand clean-up"],
    featuredLabel: "Explore image tools",
    tools: [
      {
        name: "Background Remover",
        description: "Cleanly isolate product shots, profile images, and creative assets for design use.",
        status: "Soon",
        badge: "Image",
      },
      {
        name: "Social Resize Studio",
        description: "Create fast exports for multiple aspect ratios without rebuilding the layout.",
        status: "Soon",
        badge: "Image",
      },
      {
        name: "Image Upscaler",
        description: "Improve output quality for small assets before presenting or publishing.",
        status: "Soon",
        badge: "Image",
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    path: "/content",
    eyebrow: "Writing Systems",
    title: "Group copywriting and AI-assisted writing flows into one product surface.",
    description: "Structured writing tools for headlines, bios, briefs, and reusable growth content systems.",
    collections: ["Campaign writing", "Profile content", "Editorial prep"],
    featuredLabel: "Open content tools",
    tools: [
      {
        name: "Headline Generator",
        description: "Generate sharper hooks and titles for product launches, ads, and landing pages.",
        status: "Soon",
        badge: "Writing",
      },
      {
        name: "Bio Writer",
        description: "Produce polished personal or business bios for websites, profiles, and outbound use.",
        status: "Soon",
        badge: "Writing",
      },
      {
        name: "Content Brief Builder",
        description: "Turn lightweight inputs into structured article, video, or campaign briefs.",
        status: "Soon",
        badge: "Writing",
      },
    ],
  },
];

export const homepageStats = [
  { label: "Modules", value: "4" },
  { label: "Tools mapped", value: "12" },
  { label: "Live routes", value: "7" },
];

export const dashboardRecentTools = [
  {
    name: "AI Proposal Generator",
    category: "Templates",
    lastUsed: "2 hours ago",
    route: "/templates/proposal-generator",
  },
  {
    name: "Compress PDF",
    category: "PDF",
    lastUsed: "Yesterday",
    route: "/pdf",
  },
  {
    name: "Background Remover",
    category: "Image",
    lastUsed: "3 days ago",
    route: "/image",
  },
];

export const dashboardSavedOutputs = [
  {
    name: "Client Proposal Draft",
    meta: "HTML export",
    updatedAt: "Today",
  },
  {
    name: "Pricing Overview Pack",
    meta: "Template snapshot",
    updatedAt: "Yesterday",
  },
  {
    name: "Q2 Campaign Brief",
    meta: "Content draft",
    updatedAt: "This week",
  },
];

export const dashboardQuickActions = [
  {
    label: "Open proposal generator",
    route: "/templates/proposal-generator",
  },
  {
    label: "Browse template library",
    route: "/templates",
  },
  {
    label: "Review PDF tools",
    route: "/pdf",
  },
];

export function getCategoryById(categoryId) {
  return toolCategories.find((category) => category.id === categoryId);
}
