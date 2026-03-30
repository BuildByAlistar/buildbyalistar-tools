const defaultToggles = {
  overview: true,
  requiredItems: true,
  steps: true,
  notes: true,
  warnings: true,
  resources: true,
  images: true,
  video: true,
  cta: true,
};

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

const formatInlineText = (value = "") => escapeHtml(value).replace(/\n/g, "<br />");

const formatBulletItems = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const isLikelyLink = (value = "") =>
  value.startsWith("http://") || value.startsWith("https://") || value.startsWith("www.");

const formatLink = (value = "") => {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
};

const getVideoMarkup = (videoUrl = "", videoType = "video/mp4") => {
  if (!videoUrl) {
    return "";
  }

  const safeUrl = escapeHtml(videoUrl.trim());
  const safeType = escapeHtml(videoType || "video/mp4");
  return `<video controls playsinline preload="metadata"><source src="${safeUrl}" type="${safeType}" />Your browser does not support embedded video.</video>`;
};

const renderStep = (step, index) => {
  const stepTitle = escapeHtml(step.title || `Step ${index + 1}`);
  const stepDescription = formatInlineText(step.description || "Add step details here.");
  const stepImage = step.image?.url ? escapeHtml(step.image.url) : "";
  const stepImageAlt = escapeHtml(step.image?.name || step.title || "Step visual");
  const noteMarkup = step.note
    ? `<div class="callout note"><strong>Note</strong><p>${formatInlineText(step.note)}</p></div>`
    : "";
  const tipMarkup = step.tip
    ? `<div class="callout tip"><strong>Tip</strong><p>${formatInlineText(step.tip)}</p></div>`
    : "";
  const warningMarkup = step.warning
    ? `<div class="callout warning"><strong>Warning</strong><p>${formatInlineText(step.warning)}</p></div>`
    : "";

  return `
    <article class="step-card">
      <div class="step-index">Step ${step.stepNumber || index + 1}</div>
      <h3>${stepTitle}</h3>
      <p>${stepDescription}</p>
      ${stepImage ? `<img src="${stepImage}" alt="${stepImageAlt}" />` : ""}
      ${noteMarkup}${tipMarkup}${warningMarkup}
    </article>
  `;
};

export function exportProposalToHTML(instruction = {}) {
  const {
    title = "Instruction Guide",
    guideType = "Instruction Guide",
    subtitle = "",
    audience = "",
    overview = "",
    requiredItems = "",
    steps = [],
    notes = "",
    warnings = "",
    resources = "",
    cta = "",
    videoUrl = "",
    videoType = "video/mp4",
    images = [],
    toggles = defaultToggles,
  } = instruction;

  const mergedToggles = { ...defaultToggles, ...toggles };
  const safeTitle = escapeHtml(title);
  const safeGuideType = escapeHtml(guideType);
  const safeSubtitle = formatInlineText(subtitle);
  const safeAudience = escapeHtml(audience);
  const safeOverview = formatTextBlock(overview);
  const safeNotes = formatTextBlock(notes);
  const safeWarnings = formatTextBlock(warnings);
  const safeCta = formatTextBlock(cta);
  const requiredItemsList = formatBulletItems(requiredItems);
  const resourceItems = formatBulletItems(resources);
  const videoMarkup = getVideoMarkup(videoUrl, videoType);
  const imageGallery = Array.isArray(images) ? images : [];

  const sections = [
    mergedToggles.overview
      ? `
        <section class="card">
          <h2>Overview</h2>
          ${safeOverview || "<p>Add an overview for the instruction guide.</p>"}
        </section>
      `
      : "",
    mergedToggles.requiredItems
      ? `
        <section class="card">
          <h2>Required tools & materials</h2>
          ${
            requiredItemsList.length
              ? `<ul>${requiredItemsList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : "<p>Add the tools or materials needed.</p>"
          }
        </section>
      `
      : "",
    mergedToggles.steps
      ? `
        <section class="card">
          <h2>Step-by-step instructions</h2>
          <div class="step-grid">
            ${
              steps.length
                ? steps.map((step, index) => renderStep(step, index)).join("")
                : "<p>Add the steps for this guide.</p>"
            }
          </div>
        </section>
      `
      : "",
    mergedToggles.notes
      ? `
        <section class="card">
          <h2>Notes & tips</h2>
          ${safeNotes || "<p>Add helpful notes or tips.</p>"}
        </section>
      `
      : "",
    mergedToggles.warnings
      ? `
        <section class="card warning-card">
          <h2>Warnings</h2>
          ${safeWarnings || "<p>Add warnings or constraints.</p>"}
        </section>
      `
      : "",
    mergedToggles.resources
      ? `
        <section class="card">
          <h2>Resources</h2>
          ${
            resourceItems.length
              ? `<div class="resource-list">${resourceItems
                  .map((item) =>
                    isLikelyLink(item)
                      ? `<a href="${formatLink(item)}">${escapeHtml(item)}</a>`
                      : `<div class="resource-item">${escapeHtml(item)}</div>`
                  )
                  .join("")}</div>`
              : "<p>Add resource links or references.</p>"
          }
        </section>
      `
      : "",
    mergedToggles.images
      ? `
        <section class="card">
          <h2>Screenshots & images</h2>
          ${
            imageGallery.length
              ? `<div class="gallery">${imageGallery
                  .map(
                    (image) =>
                      `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.name || "Instruction image")}" />`
                  )
                  .join("")}</div>`
              : "<p>Add screenshots to support the walkthrough.</p>"
          }
        </section>
      `
      : "",
    mergedToggles.video
      ? `
        <section class="card">
          <h2>Video walkthrough</h2>
          ${videoMarkup ? `<div class="video-frame">${videoMarkup}</div>` : "<p>Add a walkthrough video.</p>"}
        </section>
      `
      : "",
    mergedToggles.cta
      ? `
        <section class="card cta-card">
          <h2>Next step</h2>
          ${safeCta || "<p>Confirm the next step for the reader.</p>"}
          <a class="cta-button" href="mailto:?subject=${encodeURIComponent(title)}">Complete the guide</a>
        </section>
      `
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7fb;
        --surface: #ffffff;
        --surface-alt: #eef2ff;
        --text: #172033;
        --muted: #5f6b84;
        --border: #dbe4f0;
        --primary: #0ea5e9;
        --primary-dark: #0284c7;
        --warning: #f97316;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: linear-gradient(180deg, #f8fbff 0%, var(--bg) 100%);
        color: var(--text);
      }

      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 48px 20px 72px;
      }

      .hero {
        background: linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%);
        border-radius: 28px;
        padding: 40px;
        color: #ffffff;
        box-shadow: 0 20px 50px rgba(14, 165, 233, 0.18);
      }

      .eyebrow {
        margin: 0 0 12px;
        font-size: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.72);
      }

      h1 {
        margin: 0 0 14px;
        font-size: clamp(32px, 5vw, 54px);
        line-height: 1.05;
      }

      .hero-copy {
        max-width: 720px;
        font-size: 18px;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.88);
      }

      .hero-meta {
        margin-top: 16px;
        font-size: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
      }

      .grid {
        display: grid;
        gap: 20px;
        margin-top: 28px;
      }

      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 28px;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
      }

      .card h2 {
        margin: 0 0 14px;
        font-size: 24px;
      }

      .card p,
      .card li {
        margin: 0;
        font-size: 16px;
        line-height: 1.75;
        color: var(--muted);
      }

      .card p + p {
        margin-top: 14px;
      }

      .card ul {
        margin: 0;
        padding-left: 20px;
        display: grid;
        gap: 12px;
      }

      .step-grid {
        display: grid;
        gap: 16px;
      }

      .step-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 20px;
        background: #f8fafc;
      }

      .step-index {
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--primary);
        font-weight: 700;
      }

      .step-card h3 {
        margin: 10px 0 8px;
        font-size: 20px;
      }

      .step-card img {
        width: 100%;
        margin-top: 14px;
        border-radius: 16px;
        border: 1px solid var(--border);
        max-height: 320px;
        object-fit: cover;
      }

      .callout {
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: #ffffff;
        border: 1px solid var(--border);
      }

      .callout strong {
        display: block;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        margin-bottom: 4px;
      }

      .callout.warning strong {
        color: var(--warning);
      }

      .warning-card {
        border-color: rgba(249, 115, 22, 0.4);
        background: #fff7ed;
      }

      .resource-list {
        display: grid;
        gap: 10px;
      }

      .resource-list a,
      .resource-item {
        display: inline-flex;
        align-items: center;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid var(--border);
        color: var(--primary-dark);
        text-decoration: none;
        font-weight: 600;
        background: #f8fafc;
      }

      .gallery {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .gallery img {
        width: 100%;
        border-radius: 16px;
        border: 1px solid var(--border);
        max-height: 220px;
        object-fit: cover;
      }

      .video-frame {
        overflow: hidden;
        border-radius: 20px;
        background: #0f172a;
        aspect-ratio: 16 / 9;
      }

      .video-frame iframe,
      .video-frame video {
        width: 100%;
        height: 100%;
        border: 0;
      }

      .cta-card {
        background: var(--surface-alt);
      }

      .cta-button {
        display: inline-block;
        margin-top: 20px;
        padding: 14px 22px;
        border-radius: 999px;
        background: var(--primary);
        color: #ffffff;
        font-weight: 700;
        text-decoration: none;
      }

      .cta-button:hover {
        background: var(--primary-dark);
      }

      @media (max-width: 720px) {
        .page {
          padding: 28px 16px 48px;
        }

        .hero,
        .card {
          padding: 24px;
          border-radius: 20px;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <p class="eyebrow">${safeGuideType}</p>
        <h1>${safeTitle}</h1>
        <div class="hero-copy">
          <p>${safeSubtitle || "A structured instruction guide built for clarity and speed."}</p>
        </div>
        ${safeAudience ? `<div class="hero-meta">Audience: ${safeAudience}</div>` : ""}
      </section>

      <div class="grid">
        ${sections}
      </div>
    </main>
  </body>
</html>`;
}

export default exportProposalToHTML;
