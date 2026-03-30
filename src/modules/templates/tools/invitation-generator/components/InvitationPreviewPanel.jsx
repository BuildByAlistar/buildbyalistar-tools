import {
  getInvitationLayoutStyle,
  getInvitationPreviewTheme,
  invitationSectionDefinitions,
} from "../invitationConfig";
import { getMediaByRole, getSingleMediaByRole } from "../invitationModel";

const previewCanvasBaseClassName = "mx-auto w-full px-3 py-3 sm:px-5 sm:py-5 xl:px-6 xl:py-6";

const splitLines = (value = "") =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const formatDate = (value = "") => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatTime = (value = "") => {
  if (!value) {
    return "";
  }

  const [hours, minutes] = value.split(":");
  if (!hours) {
    return value;
  }

  const date = new Date();
  date.setHours(Number(hours), Number(minutes || 0));
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export default function InvitationPreviewPanel({ template, previewCanvasClassName = "max-w-[1360px]" }) {
  const layoutStyle = getInvitationLayoutStyle(template.layoutStyle);
  const previewTheme = getInvitationPreviewTheme(template.previewTheme);
  const heroImage = getSingleMediaByRole(template, "cover");
  const logoImage = getSingleMediaByRole(template, "logo");
  const hostImage = getSingleMediaByRole(template, "host-photo");
  const venueImage = getSingleMediaByRole(template, "venue-photo");
  const galleryImages = getMediaByRole(template, "gallery");
  const videoMedia = getSingleMediaByRole(template, "video");

  const showSection = (sectionId) => Boolean(template.enabledSections[sectionId]);
  const formattedDate = formatDate(template.eventDate);
  const formattedStartTime = formatTime(template.eventTime);
  const formattedEndTime = formatTime(template.endTime);
  const timeRange = [formattedStartTime, formattedEndTime].filter(Boolean).join(" - ");

  const renderSection = (sectionId) => {
    if (!showSection(sectionId) || sectionId === "hero") {
      return null;
    }

    switch (sectionId) {
      case "eventSummary":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Event summary</h3>
              <p className="invitation-preview-section-copy">
                {template.shortMessage || "A short overview that sets the tone for the invitation."}
              </p>
            </div>
            {venueImage?.url ? (
              <div className="invitation-preview-media">
                <img src={venueImage.url} alt={venueImage.name || "Venue"} />
              </div>
            ) : null}
          </section>
        );
      case "hostMessage":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Host note</h3>
              <p className="invitation-preview-section-copy">
                {template.notes || "Add a warm note from the host to personalize the invitation."}
              </p>
            </div>
            {hostImage?.url ? (
              <div className="invitation-preview-media">
                <img src={hostImage.url} alt={hostImage.name || "Host"} />
              </div>
            ) : null}
          </section>
        );
      case "invitationMessage":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Invitation message</h3>
              <p className="invitation-preview-section-copy">
                {template.longMessage || "Add the full invitation message here."}
              </p>
            </div>
          </section>
        );
      case "dateTime":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Date and time</h3>
              <div className="invitation-preview-meta-grid">
                <div>
                  <p className="invitation-preview-meta-label">Date</p>
                  <p className="invitation-preview-meta-value">{formattedDate || "Add event date"}</p>
                </div>
                <div>
                  <p className="invitation-preview-meta-label">Time</p>
                  <p className="invitation-preview-meta-value">{timeRange || "Add event time"}</p>
                </div>
                <div>
                  <p className="invitation-preview-meta-label">Timezone</p>
                  <p className="invitation-preview-meta-value">{template.timezone || "Timezone"}</p>
                </div>
              </div>
            </div>
          </section>
        );
      case "venue":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Venue</h3>
              <p className="invitation-preview-section-copy">
                {template.venueName || "Venue name"}{" "}
                {template.addressLine ? `- ${template.addressLine}` : ""}
                {template.city ? `, ${template.city}` : ""}
                {template.country ? `, ${template.country}` : ""}
              </p>
            </div>
          </section>
        );
      case "map":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Map link</h3>
              <div className="invitation-preview-cta-row">
                <a
                  className="invitation-preview-link"
                  href={template.mapLink || template.links?.mapLink || "#"}
                >
                  View location map
                </a>
              </div>
            </div>
          </section>
        );
      case "schedule":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Schedule</h3>
              <div className="invitation-preview-list">
                {splitLines(template.schedule).length ? (
                  splitLines(template.schedule).map((item) => (
                    <div key={item} className="invitation-preview-list-item">
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="invitation-preview-section-copy">Add a simple event schedule.</p>
                )}
              </div>
            </div>
          </section>
        );
      case "highlights":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Highlights</h3>
              <div className="invitation-preview-grid">
                {splitLines(template.highlights).length ? (
                  splitLines(template.highlights).map((item) => (
                    <div key={item} className="invitation-preview-card">
                      <p>{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="invitation-preview-section-copy">Add highlights to make the invite shine.</p>
                )}
              </div>
            </div>
          </section>
        );
      case "gallery":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Gallery</h3>
              {galleryImages.length ? (
                <div className="invitation-preview-gallery">
                  {galleryImages.map((image) => (
                    <img key={image.id} src={image.url} alt={image.name || "Gallery"} />
                  ))}
                </div>
              ) : (
                <p className="invitation-preview-section-copy">Upload gallery images to add atmosphere.</p>
              )}
            </div>
          </section>
        );
      case "video":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Video</h3>
              {videoMedia?.url ? (
                <div className="invitation-preview-video">
                  <video controls playsInline preload="metadata">
                    <source src={videoMedia.url} type={videoMedia.mimeType || "video/mp4"} />
                  </video>
                </div>
              ) : (
                <p className="invitation-preview-section-copy">Upload a short video to accompany the invite.</p>
              )}
            </div>
          </section>
        );
      case "dressCode":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Dress code</h3>
              <p className="invitation-preview-section-copy">
                {template.dressCode || "Add a dress code so guests know what to expect."}
              </p>
            </div>
          </section>
        );
      case "rsvp":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-cta">
              <div>
                <p className="invitation-preview-kicker">RSVP</p>
                <h3 className="invitation-preview-cta-title">Confirm your attendance</h3>
                <p className="invitation-preview-section-copy">
                  {template.cta || "Let us know if you can join us for this event."}
                </p>
              </div>
              <div className="invitation-preview-cta-row">
                <a
                  className="invitation-preview-link"
                  href={template.links?.rsvpLink || "#"}
                >
                  RSVP now
                </a>
                <div className="invitation-preview-meta">
                  <p>{template.rsvpContact || "RSVP contact"}</p>
                  <p>{template.rsvpDeadline ? `By ${formatDate(template.rsvpDeadline)}` : "RSVP deadline"}</p>
                </div>
              </div>
            </div>
          </section>
        );
      case "footerNote":
        return (
          <section key={sectionId} className="invitation-preview-section">
            <div className="invitation-preview-section-header">
              <h3 className="invitation-preview-section-title">Closing note</h3>
              <p className="invitation-preview-section-copy">
                {template.notes || "Add a closing note or gratitude message."}
              </p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <section className="premium-panel relative overflow-hidden p-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,114,182,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />
      <div className={`${previewCanvasBaseClassName} ${previewCanvasClassName}`}>
        <div className={`invitation-preview-shell ${layoutStyle.className} ${previewTheme.className}`}>
          <div className="invitation-preview-canvas">
            {showSection("hero") ? (
              <header className="invitation-preview-hero">
                <div className="invitation-preview-hero-content">
                  <div className="invitation-preview-hero-header">
                    {logoImage?.url ? <img src={logoImage.url} alt={logoImage.name || "Logo"} className="invitation-preview-logo" /> : null}
                    <span className="invitation-preview-kicker">
                      {template.invitationGoal || template.invitationType.replace("-", " ")}
                    </span>
                  </div>
                  <h2 className="invitation-preview-title">{template.title || "Invitation"}</h2>
                  <p className="invitation-preview-subtitle">{template.subtitle || "You are invited"}</p>
                  <div className="invitation-preview-meta">
                    <span>{formattedDate || "Event date"}</span>
                    <span>{timeRange || "Event time"}</span>
                    <span>{template.venueName || "Venue name"}</span>
                  </div>
                </div>
                {heroImage?.url ? (
                  <div className="invitation-preview-hero-media">
                    <img src={heroImage.url} alt={heroImage.name || "Cover"} />
                  </div>
                ) : null}
              </header>
            ) : null}

            <main className="invitation-preview-body">
              {invitationSectionDefinitions.map((section) => renderSection(section.id))}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
