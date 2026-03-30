const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatText = (value = "") =>
  escapeHtml(value)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 12px;line-height:1.6;">${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");

const splitLines = (value = "") =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const getImageByRole = (images = [], role) =>
  images.find((asset) => asset.role === role) || null;

const layoutTokens = {
  "minimal-clean": {
    background: "#f5f7fb",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#475569",
    accent: "#0f172a",
    button: "#0f172a",
    buttonText: "#ffffff",
  },
  "marketing-bold": {
    background: "#f7f5ff",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#475569",
    accent: "#7c3aed",
    button: "#ec4899",
    buttonText: "#0f172a",
  },
  "corporate-simple": {
    background: "#f3f6fb",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#4b5563",
    accent: "#2563eb",
    button: "#2563eb",
    buttonText: "#ffffff",
  },
  "newsletter-grid": {
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#475569",
    accent: "#10b981",
    button: "#10b981",
    buttonText: "#0f172a",
  },
};

const defaultTokens = layoutTokens["minimal-clean"];

const renderBlock = (block) => {
  const content = block.content || block.placeholder || "";

  if (block.kind === "list") {
    const items = splitLines(content);
    const listItems = items.length
      ? items.map((item) => `<li style="margin:0 0 8px;line-height:1.6;">${escapeHtml(item)}</li>`).join("")
      : `<li style="margin:0 0 8px;line-height:1.6;">Add list items.</li>`;

    return `
      <tr>
        <td style="padding:0 0 18px;">
          <p style="margin:0 0 10px;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">${escapeHtml(
            block.label
          )}</p>
          <ul style="margin:0;padding-left:18px;color:inherit;">${listItems}</ul>
        </td>
      </tr>
    `;
  }

  return `
    <tr>
      <td style="padding:0 0 18px;">
        <p style="margin:0 0 10px;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">${escapeHtml(
          block.label
        )}</p>
        ${formatText(content || "Add your message.")}
      </td>
    </tr>
  `;
};

export function exportEmailToHTML(template = {}) {
  const {
    subject = "Email subject",
    previewText = "",
    senderName = "",
    senderCompany = "",
    audienceType = "",
    messageBlocks = [],
    cta = "Learn more",
    links = {},
    images = [],
    layoutStyle = "minimal-clean",
  } = template;

  const tokens = layoutTokens[layoutStyle] || defaultTokens;
  const headerImage = getImageByRole(images, "header");
  const inlineImage = getImageByRole(images, "inline");
  const safePreview = escapeHtml(previewText);
  const safeSubject = escapeHtml(subject);

  const blockRows = messageBlocks.map((block) => renderBlock(block)).join("");

  const ctaRow = `
    <tr>
      <td style="padding:8px 0 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="border-radius:999px;background:${tokens.button};">
              <a href="${escapeHtml(links?.primaryLink || "#")}" style="display:inline-block;padding:12px 22px;font-weight:600;color:${tokens.buttonText};text-decoration:none;">
                ${escapeHtml(cta || "Learn more")}
              </a>
            </td>
          </tr>
        </table>
        ${
          links?.secondaryLink
            ? `<p style="margin:12px 0 0;font-size:13px;"><a href="${escapeHtml(
                links.secondaryLink
              )}" style="color:${tokens.accent};text-decoration:none;">Secondary link</a></p>`
            : ""
        }
        ${
          links?.unsubscribeLink
            ? `<p style="margin:12px 0 0;font-size:12px;color:${tokens.muted};"><a href="${escapeHtml(
                links.unsubscribeLink
              )}" style="color:${tokens.muted};text-decoration:underline;">Unsubscribe</a></p>`
            : ""
        }
      </td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeSubject}</title>
  </head>
  <body style="margin:0;background:${tokens.background};">
    <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;color:${tokens.background};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${safePreview}
    </span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${tokens.background};">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background:${tokens.surface};border-radius:24px;overflow:hidden;font-family:Arial,sans-serif;color:${tokens.text};">
            <tr>
              <td style="padding:24px 28px 8px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${tokens.muted};">From</p>
                <p style="margin:6px 0 0;font-size:14px;font-weight:600;">
                  ${escapeHtml(senderName || "Sender Name")}${senderCompany ? ` · ${escapeHtml(senderCompany)}` : ""}
                </p>
                <p style="margin:12px 0 0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${tokens.muted};">To</p>
                <p style="margin:6px 0 0;font-size:14px;font-weight:600;">${escapeHtml(audienceType || "Audience")}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 28px 8px;">
                <h1 style="margin:0 0 8px;font-size:22px;line-height:1.2;">${safeSubject}</h1>
                ${
                  safePreview
                    ? `<p style="margin:0;font-size:14px;color:${tokens.muted};">${safePreview}</p>`
                    : ""
                }
              </td>
            </tr>
            ${
              headerImage?.url
                ? `<tr><td style="padding:16px 28px 0;"><img src="${escapeHtml(
                    headerImage.url
                  )}" alt="${escapeHtml(headerImage.name || "Header image")}" style="width:100%;border-radius:18px;display:block;" /></td></tr>`
                : ""
            }
            <tr>
              <td style="padding:20px 28px 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${blockRows}
                </table>
              </td>
            </tr>
            ${
              inlineImage?.url
                ? `<tr><td style="padding:0 28px 16px;"><img src="${escapeHtml(
                    inlineImage.url
                  )}" alt="${escapeHtml(inlineImage.name || "Inline image")}" style="width:100%;border-radius:16px;display:block;" /></td></tr>`
                : ""
            }
            <tr>
              <td style="padding:0 28px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  ${ctaRow}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export default exportEmailToHTML;
