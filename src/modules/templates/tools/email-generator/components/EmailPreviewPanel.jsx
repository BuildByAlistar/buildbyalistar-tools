import { useState } from "react";
import { getEmailLayoutStyle } from "../emailConfig";
import { getEmailImageByRole } from "../emailModel";

const previewCanvasBaseClassName = "mx-auto w-full px-3 py-3 sm:px-5 sm:py-5 xl:px-6 xl:py-6";

const splitLines = (value = "") =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export default function EmailPreviewPanel({ template, previewCanvasClassName = "max-w-[1260px]" }) {
  const [viewMode, setViewMode] = useState("desktop");
  const layoutStyle = getEmailLayoutStyle(template.layoutStyle);
  const headerImage = getEmailImageByRole(template, "header");
  const inlineImage = getEmailImageByRole(template, "inline");
  const isNewsletter = template.layoutStyle === "newsletter-grid";

  const containerClassName =
    viewMode === "mobile" ? "email-preview-frame email-preview-frame-mobile" : "email-preview-frame";

  return (
    <section className="premium-panel relative overflow-hidden p-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />

      <div className={`${previewCanvasBaseClassName} ${previewCanvasClassName}`}>
        <div className={`email-preview-shell ${layoutStyle.className}`}>
          <div className="email-preview-toolbar">
            <div>
              <p className="email-preview-toolbar-title">Email preview</p>
              <p className="email-preview-toolbar-subtitle">Inbox-ready layout</p>
            </div>
            <div className="email-preview-toggle">
              <button
                type="button"
                className={viewMode === "desktop" ? "email-preview-toggle-active" : "email-preview-toggle-button"}
                onClick={() => setViewMode("desktop")}
              >
                Desktop
              </button>
              <button
                type="button"
                className={viewMode === "mobile" ? "email-preview-toggle-active" : "email-preview-toggle-button"}
                onClick={() => setViewMode("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>

          <div className={containerClassName}>
            <div className="email-preview-card">
              <div className="email-preview-header">
                <div>
                  <p className="email-preview-label">From</p>
                  <p className="email-preview-value">
                    {(template.senderName || "Sender Name") + (template.senderCompany ? ` · ${template.senderCompany}` : "")}
                  </p>
                </div>
                <div>
                  <p className="email-preview-label">To</p>
                  <p className="email-preview-value">{template.audienceType || "Audience"}</p>
                </div>
              </div>

              <div className="email-preview-subject">
                <h3>{template.subject || "Your email subject line"}</h3>
                <p>{template.previewText || "Preview text shows here to give more context."}</p>
              </div>

              {headerImage?.url ? (
                <div className="email-preview-hero">
                  <img src={headerImage.url} alt={headerImage.name || "Header"} />
                </div>
              ) : null}

              <div className={isNewsletter ? "email-preview-body email-preview-body-grid" : "email-preview-body"}>
                {template.messageBlocks.map((block) => (
                  <div key={block.id} className="email-preview-block">
                    <p className="email-preview-block-title">{block.label}</p>
                    {block.kind === "list" ? (
                      <ul>
                        {splitLines(block.content).length ? (
                          splitLines(block.content).map((item) => <li key={item}>{item}</li>)
                        ) : (
                          <li>{block.placeholder || "Add list items."}</li>
                        )}
                      </ul>
                    ) : (
                      <p>{block.content || block.placeholder || "Add your message."}</p>
                    )}
                  </div>
                ))}

                {inlineImage?.url ? (
                  <div className="email-preview-inline-image">
                    <img src={inlineImage.url} alt={inlineImage.name || "Inline"} />
                  </div>
                ) : null}

                <div className="email-preview-cta">
                  <a href={template.links?.primaryLink || "#"} className="email-preview-cta-button">
                    {template.cta || "Call to action"}
                  </a>
                  <div className="email-preview-cta-links">
                    {template.links?.secondaryLink ? <a href={template.links.secondaryLink}>Secondary link</a> : null}
                    {template.links?.unsubscribeLink ? <a href={template.links.unsubscribeLink}>Unsubscribe</a> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
