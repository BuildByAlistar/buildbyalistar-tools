const defaultToggles = {
  overview: true,
  problem: true,
  solution: true,
  features: true,
  pricing: true,
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

const formatBulletItems = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const getVideoMarkup = (videoUrl = "", videoType = "video/mp4") => {
  if (!videoUrl) {
    return "";
  }

  const safeUrl = escapeHtml(videoUrl.trim());
  const safeType = escapeHtml(videoType || "video/mp4");
  return `<video controls playsinline preload="metadata"><source src="${safeUrl}" type="${safeType}" />Your browser does not support embedded video.</video>`;
};

export function exportProposalToHTML(proposal = {}) {
  const {
    projectName = "Untitled Proposal",
    businessType = "",
    clientName = "",
    overview = "",
    problem = "",
    solution = "",
    features = "",
    pricing = "",
    cta = "",
    videoUrl = "",
    videoType = "video/mp4",
    imageDataUrl = "",
    toggles = defaultToggles,
  } = proposal;

  const mergedToggles = { ...defaultToggles, ...toggles };
  const safeProjectName = escapeHtml(projectName);
  const safeBusinessType = escapeHtml(businessType);
  const safeClientName = escapeHtml(clientName);
  const safeOverview = formatTextBlock(overview);
  const safeProblem = formatTextBlock(problem);
  const safeSolution = formatTextBlock(solution);
  const safeCta = formatTextBlock(cta);
  const featureItems = formatBulletItems(features);
  const pricingItems = formatBulletItems(pricing);
  const videoMarkup = getVideoMarkup(videoUrl, videoType);
  const safeImageUrl = imageDataUrl ? escapeHtml(imageDataUrl) : "";

  const sections = [
    mergedToggles.overview
      ? `
        <section class="card">
          <h2>Overview</h2>
          ${safeOverview || "<p>Add a short project overview to introduce the opportunity.</p>"}
        </section>
      `
      : "",
    mergedToggles.problem
      ? `
        <section class="card">
          <h2>Problem</h2>
          ${safeProblem || `<p>${safeClientName || "Your client"} needs a proposal that clearly explains the current challenge, the opportunity, and the business impact of solving it now.</p>`}
        </section>
      `
      : "",
    mergedToggles.solution
      ? `
        <section class="card">
          <h2>Solution</h2>
          ${safeSolution || `<p>${safeBusinessType || "This engagement"} will be delivered as a structured solution with clear milestones, polished client communication, and practical execution support.</p>`}
        </section>
      `
      : "",
    mergedToggles.features
      ? `
        <section class="card">
          <h2>Features</h2>
          ${
            featureItems.length
              ? `<ul>${featureItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : "<p>Add feature lines to highlight the scope.</p>"
          }
        </section>
      `
      : "",
    mergedToggles.pricing
      ? `
        <section class="card">
          <h2>Pricing</h2>
          ${
            pricingItems.length
              ? `<ul>${pricingItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : "<p>Add pricing details, package options, or payment terms.</p>"
          }
        </section>
      `
      : "",
    videoMarkup
      ? `
        <section class="card">
          <h2>Video Walkthrough</h2>
          <div class="video-frame">${videoMarkup}</div>
        </section>
      `
      : "",
    mergedToggles.cta
      ? `
        <section class="card cta-card">
          <h2>Next Step</h2>
          ${safeCta || "<p>Review the proposal and confirm the preferred package so we can move into delivery.</p>"}
          <a class="cta-button" href="mailto:?subject=${encodeURIComponent(projectName)}">Approve Proposal</a>
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
    <title>${safeProjectName}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7fb;
        --surface: #ffffff;
        --surface-alt: #eef4ff;
        --text: #172033;
        --muted: #5f6b84;
        --border: #dbe4f0;
        --primary: #2563eb;
        --primary-dark: #1d4ed8;
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
        background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
        border-radius: 28px;
        padding: 40px;
        color: #ffffff;
        box-shadow: 0 20px 50px rgba(37, 99, 235, 0.18);
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
        max-width: 700px;
        font-size: 18px;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.88);
      }

      .hero-media {
        margin-top: 28px;
      }

      .hero-media img {
        width: 100%;
        max-height: 320px;
        object-fit: cover;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.18);
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
        <p class="eyebrow">${safeBusinessType || "Proposal"}</p>
        <h1>${safeProjectName}</h1>
        <div class="hero-copy">
          <p>Prepared for ${safeClientName || "your client"}.</p>
        </div>
        ${
          safeImageUrl
            ? `<div class="hero-media"><img src="${safeImageUrl}" alt="${safeProjectName} preview" /></div>`
            : ""
        }
      </section>

      <div class="grid">
        ${sections}
      </div>
    </main>
  </body>
</html>`;
}

export default exportProposalToHTML;
