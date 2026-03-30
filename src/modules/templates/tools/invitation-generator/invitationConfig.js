export const invitationTypeOptions = [
  { value: "birthday", label: "Birthday", description: "Celebrate a personal milestone with a warm invite." },
  { value: "home-party", label: "Home Party", description: "Casual gathering with host and house details." },
  { value: "office-party", label: "Office Party", description: "Team celebration with company and RSVP details." },
  { value: "corporate-event", label: "Corporate Event", description: "Professional event with agenda and speakers." },
  { value: "product-launch", label: "Product Launch", description: "Launch-focused invite with brand messaging." },
  { value: "wedding", label: "Wedding / Engagement", description: "Elegant invite for ceremonies and receptions." },
  { value: "dinner-invite", label: "Dinner Invite", description: "Intimate dinner invitation with host details." },
  { value: "baby-shower", label: "Baby Shower", description: "Celebration invite with registry and theme notes." },
  { value: "graduation", label: "Graduation", description: "Academic milestone celebration invite." },
  { value: "holiday", label: "Holiday / Festive Event", description: "Seasonal gathering or festive celebration." },
  { value: "vip-event", label: "VIP Event", description: "Exclusive invite with premium tone." },
  { value: "business-meeting", label: "Business Meeting", description: "Formal meeting invite with agenda." },
  { value: "networking", label: "Networking Event", description: "Industry mixer or networking meet-up." },
  { value: "workshop", label: "Workshop / Seminar", description: "Educational invite with sessions and speakers." },
  { value: "custom", label: "Custom Invitation", description: "Flexible invite for any occasion." },
];

export const toneOptions = [
  { value: "formal", label: "Formal" },
  { value: "warm", label: "Warm" },
  { value: "festive", label: "Festive" },
  { value: "luxury", label: "Luxury" },
  { value: "business", label: "Business" },
  { value: "minimal", label: "Minimal" },
];

export const audienceTypeOptions = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "employees", label: "Employees" },
  { value: "clients", label: "Clients" },
  { value: "vip-guests", label: "VIP guests" },
  { value: "public", label: "Public" },
];

export const invitationGoalOptions = [
  { value: "celebration", label: "Celebration" },
  { value: "announcement", label: "Announcement" },
  { value: "launch", label: "Launch" },
  { value: "gathering", label: "Gathering" },
  { value: "networking", label: "Networking" },
  { value: "education", label: "Education" },
];

export const layoutStyleOptions = [
  { value: "elegant-classic", label: "Elegant Classic" },
  { value: "modern-party", label: "Modern Party" },
  { value: "corporate-premium", label: "Corporate Premium" },
  { value: "luxury-dark", label: "Luxury Dark" },
];

export const previewThemeOptions = [
  { value: "soft", label: "Soft" },
  { value: "festive", label: "Festive" },
  { value: "minimal", label: "Minimal" },
  { value: "midnight", label: "Midnight" },
];

export const invitationSectionDefinitions = [
  { id: "hero", label: "Hero" },
  { id: "eventSummary", label: "Event summary" },
  { id: "hostMessage", label: "Host note" },
  { id: "invitationMessage", label: "Invitation message" },
  { id: "dateTime", label: "Date and time" },
  { id: "venue", label: "Venue" },
  { id: "map", label: "Map link" },
  { id: "schedule", label: "Schedule" },
  { id: "highlights", label: "Highlights" },
  { id: "gallery", label: "Gallery" },
  { id: "video", label: "Video" },
  { id: "dressCode", label: "Dress code" },
  { id: "rsvp", label: "RSVP" },
  { id: "footerNote", label: "Footer note" },
];

export const invitationFieldDefinitions = {
  invitationType: {
    label: "Invitation type",
    type: "select",
    options: invitationTypeOptions,
  },
  title: {
    label: "Event title",
    placeholder: "An evening to celebrate",
  },
  subtitle: {
    label: "Subtitle",
    placeholder: "Hosted by...",
  },
  hostName: {
    label: "Host name",
    placeholder: "Name of host or couple",
  },
  organizerName: {
    label: "Organizer name",
    placeholder: "Event organizer",
  },
  companyName: {
    label: "Company name",
    placeholder: "Company or brand",
  },
  audienceType: {
    label: "Audience type",
    type: "select",
    options: audienceTypeOptions,
  },
  invitationGoal: {
    label: "Invitation goal",
    type: "select",
    options: invitationGoalOptions,
  },
  eventDate: {
    label: "Event date",
    type: "date",
  },
  eventTime: {
    label: "Event time",
    type: "time",
  },
  endTime: {
    label: "End time",
    type: "time",
  },
  timezone: {
    label: "Timezone",
    placeholder: "GMT, UTC, EST, PST",
  },
  venueName: {
    label: "Venue name",
    placeholder: "Venue or location name",
  },
  addressLine: {
    label: "Address line",
    placeholder: "Street address",
  },
  city: {
    label: "City",
    placeholder: "City",
  },
  country: {
    label: "Country",
    placeholder: "Country",
  },
  mapLink: {
    label: "Map link",
    placeholder: "Google Maps or location link",
  },
  rsvpRequired: {
    label: "RSVP required",
    type: "checkbox",
  },
  rsvpContact: {
    label: "RSVP contact",
    placeholder: "Email or phone for RSVP",
  },
  rsvpDeadline: {
    label: "RSVP deadline",
    type: "date",
  },
  dressCode: {
    label: "Dress code",
    placeholder: "Cocktail, formal, smart casual",
  },
  themeStyle: {
    label: "Theme style",
    placeholder: "Florals, modern, minimal",
  },
  tone: {
    label: "Tone",
    type: "select",
    options: toneOptions,
  },
  shortMessage: {
    label: "Short message",
    type: "textarea",
    rows: 3,
    placeholder: "A short invitation intro.",
  },
  longMessage: {
    label: "Invitation message",
    type: "textarea",
    rows: 6,
    placeholder: "Full invitation details and narrative.",
  },
  highlights: {
    label: "Highlights",
    type: "textarea",
    rows: 4,
    placeholder: "Live music\nCocktail hour\nSpecial guests",
  },
  schedule: {
    label: "Schedule",
    type: "textarea",
    rows: 4,
    placeholder: "6:00 PM - Welcome\n7:00 PM - Dinner",
  },
  notes: {
    label: "Host note",
    type: "textarea",
    rows: 3,
    placeholder: "Any extra host note for guests.",
  },
  cta: {
    label: "CTA wording",
    type: "textarea",
    rows: 3,
    placeholder: "Confirm attendance by RSVP.",
  },
  "links.rsvpLink": {
    label: "RSVP link",
    placeholder: "RSVP form or website link",
  },
  "links.websiteLink": {
    label: "Website link",
    placeholder: "Optional event website",
  },
  "links.registrationLink": {
    label: "Registration link",
    placeholder: "Ticket or registration link",
  },
  "links.whatsappLink": {
    label: "WhatsApp link",
    placeholder: "WhatsApp contact link",
  },
};

export const invitationFieldGroups = [
  {
    id: "basics",
    label: "Event basics",
    description: "Core event identity and timing.",
    fields: ["title", "subtitle", "invitationGoal", "eventDate", "eventTime", "endTime", "timezone"],
  },
  {
    id: "hosts",
    label: "Host or organizer",
    description: "People or brands behind the invite.",
    fields: ["hostName", "organizerName", "companyName"],
  },
  {
    id: "venue",
    label: "Venue and location",
    description: "Where the event will take place.",
    fields: ["venueName", "addressLine", "city", "country", "mapLink"],
  },
  {
    id: "audience",
    label: "Audience and tone",
    description: "Audience context, tone, and theme.",
    fields: ["audienceType", "tone", "themeStyle", "dressCode"],
  },
  {
    id: "message",
    label: "Invitation message",
    description: "Main invitation copy and messaging.",
    fields: ["shortMessage", "longMessage", "notes", "cta"],
  },
  {
    id: "details",
    label: "Highlights and schedule",
    description: "Key highlights and agenda.",
    fields: ["highlights", "schedule"],
  },
  {
    id: "rsvp",
    label: "RSVP settings",
    description: "How guests should respond.",
    fields: ["rsvpRequired", "rsvpContact", "rsvpDeadline", "links.rsvpLink"],
  },
  {
    id: "links",
    label: "External links",
    description: "Additional event links.",
    fields: ["links.websiteLink", "links.registrationLink", "links.whatsappLink"],
  },
];

export const invitationTypeConfig = {
  birthday: {
    defaultTone: "festive",
    requiredFields: ["title", "hostName", "eventDate", "eventTime", "venueName", "addressLine"],
    optionalFields: ["subtitle", "themeStyle", "dressCode", "audienceType", "highlights", "rsvpContact"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "gallery", "rsvp", "footerNote"],
    recommendedLayoutStyle: "modern-party",
    recommendedPreviewTheme: "festive",
    aiGuidance:
      "Playful and warm. Emphasize celebration, fun details, and a friendly RSVP request.",
    starterCopy: {
      title: "Birthday Celebration",
      subtitle: "You are invited to celebrate",
      shortMessage: "Join us for a birthday celebration filled with fun, music, and surprises.",
    },
  },
  "home-party": {
    defaultTone: "warm",
    requiredFields: ["hostName", "eventDate", "eventTime", "addressLine"],
    optionalFields: ["themeStyle", "dressCode", "rsvpContact", "notes"],
    enabledSections: ["hero", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "modern-party",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Casual and friendly. Include host name, house vibe, and simple RSVP instructions.",
    starterCopy: {
      title: "Home Party",
      subtitle: "Hosted by friends and family",
    },
  },
  "office-party": {
    defaultTone: "festive",
    requiredFields: ["companyName", "eventDate", "eventTime", "venueName", "addressLine", "organizerName"],
    optionalFields: ["dressCode", "rsvpDeadline", "rsvpContact", "highlights"],
    enabledSections: ["hero", "eventSummary", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "corporate-premium",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Professional but celebratory. Mention team spirit, company tone, and RSVP deadline.",
    starterCopy: {
      title: "Office Party",
      subtitle: "Celebrate with the team",
    },
  },
  "corporate-event": {
    defaultTone: "business",
    requiredFields: ["title", "companyName", "eventDate", "eventTime", "venueName", "addressLine"],
    optionalFields: ["subtitle", "schedule", "highlights", "organizerName", "rsvpDeadline"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "schedule", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "corporate-premium",
    recommendedPreviewTheme: "minimal",
    aiGuidance:
      "Executive and clear. Focus on purpose, agenda, and RSVP expectations.",
    starterCopy: {
      title: "Corporate Event",
      subtitle: "A private executive briefing",
    },
  },
  "product-launch": {
    defaultTone: "business",
    requiredFields: ["title", "companyName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["subtitle", "highlights", "schedule", "rsvpContact", "links.registrationLink"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "schedule", "rsvp", "footerNote"],
    recommendedLayoutStyle: "corporate-premium",
    recommendedPreviewTheme: "festive",
    aiGuidance:
      "Launch-focused and energetic. Highlight the release moment and call to action.",
    starterCopy: {
      title: "Product Launch",
      subtitle: "Join us for the reveal",
    },
  },
  wedding: {
    defaultTone: "formal",
    requiredFields: ["title", "hostName", "eventDate", "eventTime", "venueName", "addressLine"],
    optionalFields: ["subtitle", "dressCode", "rsvpDeadline", "notes"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "gallery", "dressCode", "rsvp", "footerNote"],
    recommendedLayoutStyle: "elegant-classic",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Elegant, warm, and romantic. Include family notes and formal RSVP tone.",
    starterCopy: {
      title: "Wedding Invitation",
      subtitle: "Together with their families",
    },
  },
  "dinner-invite": {
    defaultTone: "warm",
    requiredFields: ["title", "hostName", "eventDate", "eventTime", "venueName", "addressLine"],
    optionalFields: ["dressCode", "notes", "rsvpContact"],
    enabledSections: ["hero", "invitationMessage", "dateTime", "venue", "rsvp", "footerNote"],
    recommendedLayoutStyle: "elegant-classic",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Intimate and welcoming. Mention host, date, and RSVP contact.",
    starterCopy: {
      title: "Dinner Invitation",
      subtitle: "Please join us for dinner",
    },
  },
  "baby-shower": {
    defaultTone: "warm",
    requiredFields: ["title", "hostName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["themeStyle", "notes", "rsvpContact"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "elegant-classic",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Gentle and celebratory. Mention gifts or registry details if supplied.",
    starterCopy: {
      title: "Baby Shower",
      subtitle: "Celebrating a new arrival",
    },
  },
  graduation: {
    defaultTone: "festive",
    requiredFields: ["title", "hostName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["highlights", "rsvpContact", "notes"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "modern-party",
    recommendedPreviewTheme: "festive",
    aiGuidance:
      "Proud and upbeat. Emphasize the milestone and RSVP.",
    starterCopy: {
      title: "Graduation Celebration",
      subtitle: "Join us to celebrate",
    },
  },
  holiday: {
    defaultTone: "festive",
    requiredFields: ["title", "eventDate", "eventTime", "venueName"],
    optionalFields: ["hostName", "themeStyle", "dressCode", "rsvpContact"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "modern-party",
    recommendedPreviewTheme: "festive",
    aiGuidance:
      "Seasonal and cheerful. Mention theme and dress code.",
    starterCopy: {
      title: "Holiday Gathering",
      subtitle: "Celebrate the season with us",
    },
  },
  "vip-event": {
    defaultTone: "luxury",
    requiredFields: ["title", "companyName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["subtitle", "dressCode", "rsvpContact", "rsvpDeadline", "notes"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "luxury-dark",
    recommendedPreviewTheme: "midnight",
    aiGuidance:
      "Exclusive and premium. Emphasize limited access and VIP tone.",
    starterCopy: {
      title: "VIP Invitation",
      subtitle: "An exclusive evening",
    },
  },
  "business-meeting": {
    defaultTone: "business",
    requiredFields: ["title", "organizerName", "companyName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["schedule", "highlights", "rsvpContact"],
    enabledSections: ["hero", "eventSummary", "dateTime", "venue", "schedule", "rsvp", "footerNote"],
    recommendedLayoutStyle: "corporate-premium",
    recommendedPreviewTheme: "minimal",
    aiGuidance:
      "Clear and efficient. Include agenda and RSVP.",
    starterCopy: {
      title: "Business Meeting",
      subtitle: "Agenda and session overview",
    },
  },
  networking: {
    defaultTone: "business",
    requiredFields: ["title", "organizerName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["companyName", "highlights", "rsvpContact", "notes"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "corporate-premium",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Professional and welcoming. Encourage conversation and RSVPs.",
    starterCopy: {
      title: "Networking Night",
      subtitle: "Connect with peers and leaders",
    },
  },
  workshop: {
    defaultTone: "business",
    requiredFields: ["title", "organizerName", "eventDate", "eventTime", "venueName"],
    optionalFields: ["schedule", "highlights", "rsvpContact", "notes"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "schedule", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "corporate-premium",
    recommendedPreviewTheme: "minimal",
    aiGuidance:
      "Educational and structured. Highlight sessions and learning outcomes.",
    starterCopy: {
      title: "Workshop Session",
      subtitle: "Hands-on learning event",
    },
  },
  custom: {
    defaultTone: "warm",
    requiredFields: ["title", "eventDate", "eventTime"],
    optionalFields: ["subtitle", "hostName", "venueName", "addressLine", "rsvpContact", "highlights", "notes"],
    enabledSections: ["hero", "eventSummary", "invitationMessage", "dateTime", "venue", "highlights", "rsvp", "footerNote"],
    recommendedLayoutStyle: "elegant-classic",
    recommendedPreviewTheme: "soft",
    aiGuidance:
      "Flexible and friendly. Use details provided to craft the invite.",
    starterCopy: {
      title: "Custom Invitation",
      subtitle: "You are invited",
    },
  },
};

export const layoutStyleThemes = [
  { value: "elegant-classic", className: "invitation-style-elegant-classic" },
  { value: "modern-party", className: "invitation-style-modern-party" },
  { value: "corporate-premium", className: "invitation-style-corporate-premium" },
  { value: "luxury-dark", className: "invitation-style-luxury-dark" },
];

export const previewThemes = [
  { value: "soft", className: "invitation-theme-soft" },
  { value: "festive", className: "invitation-theme-festive" },
  { value: "minimal", className: "invitation-theme-minimal" },
  { value: "midnight", className: "invitation-theme-midnight" },
];

export const getInvitationTypeConfig = (invitationType) =>
  invitationTypeConfig[invitationType] || invitationTypeConfig.custom;

export const getInvitationLayoutStyle = (layoutStyle) =>
  layoutStyleThemes.find((style) => style.value === layoutStyle) || layoutStyleThemes[0];

export const getInvitationPreviewTheme = (previewTheme) =>
  previewThemes.find((theme) => theme.value === previewTheme) || previewThemes[0];

export const getInvitationFieldSets = (invitationType) => {
  const config = getInvitationTypeConfig(invitationType);
  return {
    required: new Set(config.requiredFields || []),
    optional: new Set(config.optionalFields || []),
  };
};

export const getVisibleInvitationFieldGroups = (invitationType) => {
  const { required, optional } = getInvitationFieldSets(invitationType);
  const visible = new Set([...required, ...optional]);

  return invitationFieldGroups
    .map((group) => ({
      ...group,
      fields: group.fields.filter((field) => visible.has(field)),
    }))
    .filter((group) => group.fields.length);
};
