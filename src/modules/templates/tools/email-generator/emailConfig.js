export const emailTypeOptions = [
  { value: "marketing", label: "Marketing Email", description: "Campaign and promotion emails." },
  { value: "cold-outreach", label: "Cold Outreach", description: "Short, direct outreach for new leads." },
  { value: "follow-up", label: "Follow-up Email", description: "Polite follow-up after a touchpoint." },
  { value: "newsletter", label: "Newsletter", description: "Multi-section update for subscribers." },
  { value: "product-launch", label: "Product Launch Email", description: "Launch-focused announcement email." },
  { value: "sales", label: "Sales Email", description: "Lead conversion and offer email." },
  { value: "welcome", label: "Welcome Email", description: "Warm onboarding or welcome message." },
  { value: "event", label: "Event Email", description: "Event invite and details email." },
  { value: "announcement", label: "Announcement Email", description: "Company or product announcements." },
  { value: "custom", label: "Custom Email", description: "Flexible structure for any email." },
];

export const toneOptions = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "bold", label: "Bold" },
  { value: "concise", label: "Concise" },
  { value: "premium", label: "Premium" },
  { value: "minimal", label: "Minimal" },
];

export const audienceTypeOptions = [
  { value: "leads", label: "Leads" },
  { value: "customers", label: "Customers" },
  { value: "subscribers", label: "Subscribers" },
  { value: "partners", label: "Partners" },
  { value: "employees", label: "Employees" },
  { value: "public", label: "Public" },
];

export const layoutStyleOptions = [
  { value: "minimal-clean", label: "Minimal Clean" },
  { value: "marketing-bold", label: "Marketing Bold" },
  { value: "corporate-simple", label: "Corporate Simple" },
  { value: "newsletter-grid", label: "Newsletter Grid" },
];

export const emailBlockDefinitions = {
  headline: {
    label: "Headline",
    placeholder: "A bold headline that captures attention.",
    kind: "text",
  },
  intro: {
    label: "Intro",
    placeholder: "Start with a clear, friendly opener.",
    kind: "text",
  },
  problem: {
    label: "Problem",
    placeholder: "Briefly define the pain point.",
    kind: "text",
  },
  solution: {
    label: "Solution",
    placeholder: "Describe the solution or offer.",
    kind: "text",
  },
  offer: {
    label: "Offer",
    placeholder: "Highlight the offer or value.",
    kind: "text",
  },
  story: {
    label: "Story",
    placeholder: "Share the narrative behind the update.",
    kind: "text",
  },
  benefits: {
    label: "Benefits",
    placeholder: "Benefit one\nBenefit two\nBenefit three",
    kind: "list",
  },
  updates: {
    label: "Updates",
    placeholder: "Update one\nUpdate two\nUpdate three",
    kind: "list",
  },
  spotlight: {
    label: "Spotlight",
    placeholder: "Feature a highlight or story.",
    kind: "text",
  },
  status: {
    label: "Status update",
    placeholder: "Recap the current status or previous touchpoint.",
    kind: "text",
  },
  proof: {
    label: "Social proof",
    placeholder: "Add proof, testimonials, or results.",
    kind: "text",
  },
  details: {
    label: "Details",
    placeholder: "Important details or logistics.",
    kind: "text",
  },
  agenda: {
    label: "Agenda",
    placeholder: "Intro\nDemo\nQ&A",
    kind: "list",
  },
  welcome: {
    label: "Welcome note",
    placeholder: "Welcome the reader and set expectations.",
    kind: "text",
  },
  nextSteps: {
    label: "Next steps",
    placeholder: "What happens next for the reader.",
    kind: "text",
  },
  closing: {
    label: "Closing",
    placeholder: "End with a friendly closing line.",
    kind: "text",
  },
  signature: {
    label: "Signature",
    placeholder: "Best,\nYour Name",
    kind: "text",
  },
  body: {
    label: "Body",
    placeholder: "Main email body content.",
    kind: "text",
  },
};

export const emailTypeConfig = {
  marketing: {
    defaultTone: "bold",
    blockOrder: ["headline", "offer", "benefits", "closing"],
    recommendedLayoutStyle: "marketing-bold",
    requiredFields: ["subject", "previewText", "productName", "offerDetails"],
    optionalFields: ["audienceType", "goal", "cta", "links.primaryLink"],
    aiGuidance: "Energetic, benefit-forward, highlight urgency and CTA.",
    starterCopy: {
      subject: "Introducing our newest offer",
      previewText: "A quick look at what’s new and why it matters.",
      headline: "Fresh release, real results",
    },
  },
  "cold-outreach": {
    defaultTone: "professional",
    blockOrder: ["intro", "problem", "solution", "closing", "signature"],
    recommendedLayoutStyle: "corporate-simple",
    requiredFields: ["subject", "previewText", "senderName"],
    optionalFields: ["audienceType", "goal", "cta", "links.primaryLink"],
    aiGuidance: "Short, respectful, personalized, and clear CTA.",
    starterCopy: {
      subject: "Quick idea for your team",
      previewText: "A short note with one clear takeaway.",
      intro: "Hi there, I noticed something that could help your team.",
    },
  },
  "follow-up": {
    defaultTone: "professional",
    blockOrder: ["intro", "status", "nextSteps", "closing", "signature"],
    recommendedLayoutStyle: "corporate-simple",
    requiredFields: ["subject", "previewText"],
    optionalFields: ["audienceType", "cta", "links.primaryLink"],
    aiGuidance: "Polite, concise recap with a clear next step.",
    starterCopy: {
      subject: "Following up on my last note",
      previewText: "Quick follow-up to keep momentum moving.",
      status: "Sharing a quick update since our last conversation.",
    },
  },
  newsletter: {
    defaultTone: "friendly",
    blockOrder: ["intro", "updates", "spotlight", "closing"],
    recommendedLayoutStyle: "newsletter-grid",
    requiredFields: ["subject", "previewText"],
    optionalFields: ["links.secondaryLink", "links.primaryLink"],
    aiGuidance: "Friendly, structured, easy-to-scan updates.",
    starterCopy: {
      subject: "This month’s highlights",
      previewText: "Updates, insights, and what’s next.",
      intro: "Here’s what we’ve been working on lately.",
    },
  },
  "product-launch": {
    defaultTone: "bold",
    blockOrder: ["headline", "story", "benefits", "closing"],
    recommendedLayoutStyle: "marketing-bold",
    requiredFields: ["subject", "previewText", "productName"],
    optionalFields: ["offerDetails", "cta", "links.primaryLink"],
    aiGuidance: "Launch tone, exciting, CTA-driven.",
    starterCopy: {
      subject: "Product launch: ready to meet what’s next",
      previewText: "Meet the new release built for your team.",
      headline: "The launch is here",
    },
  },
  sales: {
    defaultTone: "professional",
    blockOrder: ["intro", "offer", "proof", "closing", "signature"],
    recommendedLayoutStyle: "marketing-bold",
    requiredFields: ["subject", "previewText", "offerDetails"],
    optionalFields: ["productName", "cta", "links.primaryLink"],
    aiGuidance: "Value-focused, benefit proof, and direct CTA.",
    starterCopy: {
      subject: "A better way to hit your numbers",
      previewText: "Here’s the offer built for your goals.",
      offer: "We put together a package tailored to your team’s targets.",
    },
  },
  welcome: {
    defaultTone: "friendly",
    blockOrder: ["welcome", "nextSteps", "closing", "signature"],
    recommendedLayoutStyle: "minimal-clean",
    requiredFields: ["subject", "previewText", "senderName"],
    optionalFields: ["links.primaryLink", "links.secondaryLink"],
    aiGuidance: "Warm, supportive, clear onboarding next steps.",
    starterCopy: {
      subject: "Welcome aboard",
      previewText: "Here’s how to get started quickly.",
      welcome: "We’re glad you’re here. Here’s what to do next.",
    },
  },
  event: {
    defaultTone: "professional",
    blockOrder: ["headline", "details", "agenda", "closing"],
    recommendedLayoutStyle: "corporate-simple",
    requiredFields: ["subject", "previewText"],
    optionalFields: ["cta", "links.primaryLink"],
    aiGuidance: "Clear event details, timing, and RSVP guidance.",
    starterCopy: {
      subject: "You’re invited to our upcoming event",
      previewText: "Details and agenda inside.",
      details: "Join us for a live session with the team.",
    },
  },
  announcement: {
    defaultTone: "professional",
    blockOrder: ["headline", "details", "closing"],
    recommendedLayoutStyle: "corporate-simple",
    requiredFields: ["subject", "previewText"],
    optionalFields: ["cta", "links.primaryLink"],
    aiGuidance: "Direct announcement with key details and CTA.",
    starterCopy: {
      subject: "Important update",
      previewText: "A quick announcement from our team.",
      headline: "We have something to share",
    },
  },
  custom: {
    defaultTone: "friendly",
    blockOrder: ["intro", "body", "closing"],
    recommendedLayoutStyle: "minimal-clean",
    requiredFields: ["subject", "previewText"],
    optionalFields: ["cta", "links.primaryLink"],
    aiGuidance: "Flexible, use provided details.",
    starterCopy: {
      subject: "A note from our team",
      previewText: "Quick update and next steps.",
      intro: "Sharing a quick note with you today.",
    },
  },
};

export const emailFieldDefinitions = {
  emailType: { label: "Email type", type: "select", options: emailTypeOptions },
  subject: { label: "Subject line", placeholder: "Subject line" },
  previewText: { label: "Preview text", placeholder: "Short preheader text" },
  senderName: { label: "Sender name", placeholder: "Your name" },
  senderCompany: { label: "Sender company", placeholder: "Company or brand" },
  audienceType: { label: "Audience type", type: "select", options: audienceTypeOptions },
  tone: { label: "Tone", type: "select", options: toneOptions },
  goal: { label: "Goal", placeholder: "Primary goal for this email" },
  productName: { label: "Product name", placeholder: "Product or offer name" },
  offerDetails: { label: "Offer details", type: "textarea", rows: 3, placeholder: "Offer specifics, pricing, or details." },
  cta: { label: "CTA text", placeholder: "Book a demo" },
  "links.primaryLink": { label: "Primary link", placeholder: "https://..." },
  "links.secondaryLink": { label: "Secondary link", placeholder: "https://..." },
  "links.unsubscribeLink": { label: "Unsubscribe link", placeholder: "https://..." },
};

export const emailFieldGroups = [
  {
    id: "basics",
    label: "Email basics",
    description: "Subject and preview text.",
    fields: ["subject", "previewText"],
  },
  {
    id: "sender",
    label: "Sender details",
    description: "Who the email is coming from.",
    fields: ["senderName", "senderCompany"],
  },
  {
    id: "audience",
    label: "Audience and tone",
    description: "Context and writing style.",
    fields: ["audienceType", "tone", "goal"],
  },
  {
    id: "offer",
    label: "Offer and product",
    description: "Optional offer details and product context.",
    fields: ["productName", "offerDetails"],
  },
  {
    id: "cta",
    label: "Call to action",
    description: "CTA button text.",
    fields: ["cta"],
  },
  {
    id: "links",
    label: "Links",
    description: "Links for CTA and unsubscribe.",
    fields: ["links.primaryLink", "links.secondaryLink", "links.unsubscribeLink"],
  },
];

export const layoutStyleThemes = [
  { value: "minimal-clean", className: "email-style-minimal-clean" },
  { value: "marketing-bold", className: "email-style-marketing-bold" },
  { value: "corporate-simple", className: "email-style-corporate-simple" },
  { value: "newsletter-grid", className: "email-style-newsletter-grid" },
];

export const getEmailTypeConfig = (emailType) => emailTypeConfig[emailType] || emailTypeConfig.custom;

export const getEmailLayoutStyle = (layoutStyle) =>
  layoutStyleThemes.find((style) => style.value === layoutStyle) || layoutStyleThemes[0];

export const getVisibleEmailFieldGroups = () => emailFieldGroups;
