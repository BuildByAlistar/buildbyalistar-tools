export default function TemplateMediaRenderer({ media, variant = "hero" }) {
  if (!media?.url) {
    return null;
  }

  if (variant === "video") {
    return (
      <>
        <div className="template-preview-media-video">
          <video controls playsInline preload="metadata" className="aspect-video w-full">
            <source src={media.url} type={media.type || "video/mp4"} />
          </video>
        </div>
        {media.name ? <p className="mt-4 text-sm text-slate-500">{media.name}</p> : null}
      </>
    );
  }

  return (
    <div className="template-preview-media border border-white/15 bg-white/[0.08]">
      <img
        src={media.url}
        alt={media.name || "Template preview"}
        className="h-72 w-full object-cover sm:h-96 xl:h-[32rem]"
      />
    </div>
  );
}
