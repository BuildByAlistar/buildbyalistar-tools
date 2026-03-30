const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatTextBlock = (value = "") =>
  escapeHtml(value)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");

const splitLines = (value = "") =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const getMediaByRole = (mediaAssets = [], role) =>
  mediaAssets.filter((asset) => asset.role === role);

const getSingleMediaByRole = (mediaAssets = [], role) =>
  mediaAssets.find((asset) => asset.role === role) || null;

const layoutTokens = {
  "elegant-classic": {
    pageBg: "#fdfbf8",
    heroGradient: "linear-gradient(135deg,#0f172a 0%,#5b3b22 50%,#b08968 100%)",
    accent: "#b08968",
    text: "#111827",
    muted: "#4b5563",
    surface: "#ffffff",
    ctaBg: "#0f172a",
    ctaText: "#ffffff",
  },
  "modern-party": {
    pageBg: "#f8fafc",
    heroGradient: "linear-gradient(135deg,#0f172a 0%,#7c3aed 45%,#ec4899 100%)",
    accent: "#ec4899",
    text: "#0f172a",
    muted: "#475569",
    surface: "#ffffff",
    ctaBg: "#ec4899",
    ctaText: "#0f172a",
  },
  "corporate-premium": {
    pageBg: "#f7faff",
    heroGradient: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#38bdf8 100%)",
    accent: "#2563eb",
    text: "#0f172a",
    muted: "#4b5563",
    surface: "#ffffff",
    ctaBg: "#2563eb",
    ctaText: "#ffffff",
  },
  "luxury-dark": {
    pageBg: "#0b0f1a",
    heroGradient: "linear-gradient(135deg,#020617 0%,#111827 55%,#1f2937 100%)",
    accent: "#facc15",
    text: "#f8fafc",
    muted: "#cbd5f5",
    surface: "#111827",
    ctaBg: "#facc15",
    ctaText: "#111827",
  },
};

const defaultTokens = layoutTokens["elegant-classic"];

export function exportInvitationToHTML(invitation = {}) {
  const {
    title = "Invitation",
    subtitle = "",
    invitationType = "",
    eventDate = "",
    eventTime = "",
    endTime = "",
    timezone = "",
    venueName = "",
    addressLine = "",
    city = "",
    country = "",
    shortMessage = "",
    longMessage = "",
    highlights = "",
    schedule = "",
    dressCode = "",
    notes = "",
    cta = "",
    rsvpContact = "",
    rsvpDeadline = "",
    enabledSections = {},
    layoutStyle = "elegant-classic",
    mediaAssets = [],
    links = {},
  } = invitation;

  const tokens = layoutTokens[layoutStyle] || defaultTokens;
  const coverImage = getSingleMediaByRole(mediaAssets, "cover");
  const logoImage = getSingleMediaByRole(mediaAssets, "logo");
  const galleryImages = getMediaByRole(mediaAssets, "gallery");
  const videoMedia = getSingleMediaByRole(mediaAssets, "video");

  const sections = [];

  if (enabledSections.eventSummary) {
    sections.push(`
      <section class="section">
        <h2>Event summary</h2>
        ${formatTextBlock(shortMessage || "Add a short event summary.")}
      </section>
    `);
  }

  if (enabledSections.invitationMessage) {
    sections.push(`
      <section class="section">
        <h2>Invitation message</h2>
        ${formatTextBlock(longMessage || "Add the full invitation message.")}
      </section>
    `);
  }

  if (enabledSections.dateTime) {
    sections.push(`
      <section class="section">
        <h2>Date and time</h2>
        <div class="meta-grid">
          <div>
            <p class="meta-label">Date</p>
            <p>${escapeHtml(eventDate || "Event date")}</p>
          </div>
          <div>
            <p class="meta-label">Time</p>
            <p>${escapeHtml([eventTime, endTime].filter(Boolean).join(" - ") || "Event time")}</p>
          </div>
          <div>
            <p class="meta-label">Timezone</p>
            <p>${escapeHtml(timezone || "Timezone")}</p>
          </div>
        </div>
      </section>
    `);
  }

  if (enabledSections.venue) {
    sections.push(`
      <section class="section">
        <h2>Venue</h2>
        ${formatTextBlock(`${venueName || "Venue name"} ${addressLine || ""} ${city || ""} ${country || ""}`.trim())}
      </section>
    `);
  }

  if (enabledSections.highlights) {
    const highlightItems = splitLines(highlights);
    sections.push(`
      <section class="section">
        <h2>Highlights</h2>
        ${
          highlightItems.length
            ? `<div class="grid">${highlightItems
                .map((item) => `<div class="card">${escapeHtml(item)}</div>`)
                .join("")}</div>`
            : "<p>Add highlights to make the invitation shine.</p>"
        }
      </section>
    `);
  }

  if (enabledSections.schedule) {
    const scheduleItems = splitLines(schedule);
    sections.push(`
      <section class="section">
        <h2>Schedule</h2>
        ${
          scheduleItems.length
            ? `<ul>${scheduleItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : "<p>Add a simple agenda or schedule.</p>"
        }
      </section>
    `);
  }

  if (enabledSections.gallery) {
    sections.push(`
      <section class="section">
        <h2>Gallery</h2>
        ${
          galleryImages.length
            ? `<div class="gallery">${galleryImages
                .map((image) => `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.name || "Gallery image")}" />`)
                .join("")}</div>`
            : "<p>Upload gallery images to add atmosphere.</p>"
        }
      </section>
    `);
  }

  if (enabledSections.video && videoMedia?.url) {
    sections.push(`
      <section class="section">
        <h2>Video</h2>
        <div class="video-frame">
          <video controls playsinline preload="metadata">
            <source src="${escapeHtml(videoMedia.url)}" type="${escapeHtml(videoMedia.mimeType || "video/mp4")}" />
          </video>
        </div>
      </section>
    `);
  }

  if (enabledSections.dressCode) {
    sections.push(`
      <section class="section">
        <h2>Dress code</h2>
        ${formatTextBlock(dressCode || "Add dress code guidance for guests.")}
      </section>
    `);
  }

  if (enabledSections.rsvp) {
    sections.push(`
      <section class="section cta">
        <h2>RSVP</h2>
        ${formatTextBlock(cta || "Confirm your attendance for the event.")}
        <div class="cta-row">
          <a class="cta-button" href="${escapeHtml(links?.rsvpLink || "#")}">RSVP now</a>
          <div class="cta-meta">
            <p>${escapeHtml(rsvpContact || "RSVP contact")}</p>
            <p>${escapeHtml(rsvpDeadline || "RSVP deadline")}</p>
          </div>
        </div>
      </section>
    `);
  }

  if (enabledSections.footerNote) {
    sections.push(`
      <section class="section">
        <h2>Closing note</h2>
        ${formatTextBlock(notes || "Add a closing note or gratitude message.")}
      </section>
    `);
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
        --page-bg: ${tokens.pageBg};
        --surface: ${tokens.surface};
        --text: ${tokens.text};
        --muted: ${tokens.muted};
        --accent: ${tokens.accent};
        --cta-bg: ${tokens.ctaBg};
        --cta-text: ${tokens.ctaText};
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: "Inter", Arial, sans-serif;
        background: var(--page-bg);
        color: var(--text);
      }

      .page {
        max-width: 1080px;
        margin: 0 auto;
        padding: 48px 20px 72px;
      }

      .hero {
        border-radius: 32px;
        padding: 40px;
        color: #fff;
        background: ${tokens.heroGradient};
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
      }

      .hero-header {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .hero-logo {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.4);
      }

      .hero-kicker {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 12px;
        opacity: 0.75;
      }

      h1 {
        margin: 14px 0 10px;
        font-size: clamp(32px, 5vw, 56px);
        line-height: 1.05;
      }

      .hero-subtitle {
        font-size: 18px;
        max-width: 620px;
        opacity: 0.9;
        line-height: 1.6;
      }

      .hero-meta {
        margin-top: 16px;
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        font-size: 14px;
      }

      .hero-media {
        margin-top: 24px;
      }

      .hero-media img {
        width: 100%;
        border-radius: 24px;
        max-height: 360px;
        object-fit: cover;
        border: 1px solid rgba(255,255,255,0.2);
      }

      .section {
        padding: 36px 0;
        border-top: 1px solid rgba(148,163,184,0.24);
      }

      .section h2 {
        margin: 0 0 16px;
        font-size: 26px;
      }

      .section p,
      .section li {
        margin: 0;
        font-size: 16px;
        line-height: 1.75;
        color: var(--muted);
      }

      .section p + p {
        margin-top: 12px;
      }

      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .card {
        background: var(--surface);
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
      }

      .meta-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .meta-label {
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.2em;
        color: var(--accent);
        margin-bottom: 8px;
      }

      .gallery {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .gallery img {
        width: 100%;
        border-radius: 18px;
        object-fit: cover;
        height: 160px;
      }

      .video-frame {
        border-radius: 20px;
        overflow: hidden;
        background: #0f172a;
        aspect-ratio: 16 / 9;
      }

      .video-frame video {
        width: 100%;
        height: 100%;
      }

      .cta {
        background: var(--surface);
        border-radius: 28px;
        padding: 28px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
      }

      .cta-row {
        margin-top: 18px;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
      }

      .cta-button {
        display: inline-block;
        padding: 12px 22px;
        border-radius: 999px;
        background: var(--cta-bg);
        color: var(--cta-text);
        text-decoration: none;
        font-weight: 600;
      }

      .cta-meta p {
        margin: 0;
        font-size: 14px;
      }

      @media (max-width: 720px) {
        .page {
          padding: 28px 16px 48px;
        }

        .hero {
          padding: 28px;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <div class="hero-header">
          ${logoImage?.url ? `<img class="hero-logo" src="${escapeHtml(logoImage.url)}" alt="${escapeHtml(logoImage.name || "Logo")}" />` : ""}
          <span class="hero-kicker">${escapeHtml(invitationType || "Invitation")}</span>
        </div>
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="hero-subtitle">${escapeHtml(subtitle)}</p>` : ""}
        <div class="hero-meta">
          <span>${escapeHtml(eventDate || "Event date")}</span>
          <span>${escapeHtml([eventTime, endTime].filter(Boolean).join(" - ") || "Event time")}</span>
          <span>${escapeHtml(venueName || "Venue")}</span>
        </div>
        ${
          coverImage?.url
            ? `<div class="hero-media"><img src="${escapeHtml(coverImage.url)}" alt="${escapeHtml(coverImage.name || "Cover")}" /></div>`
            : ""
        }
      </section>

      ${sections.join("")}
    </main>
  </body>
</html>`;
}

export default exportInvitationToHTML;
