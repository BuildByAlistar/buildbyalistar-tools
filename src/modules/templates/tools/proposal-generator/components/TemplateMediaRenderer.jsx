export default function TemplateMediaRenderer({ media, variant = "hero" }) {
  if (!media?.url) {
    return null;
  }

  if (variant === "video") {
    return (
      <>
        <div className="mt-5 overflow-hidden rounded-[24px] bg-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
          <video controls playsInline preload="metadata" className="aspect-video w-full">
            <source src={media.url} type={media.type || "video/mp4"} />
          </video>
        </div>
        {media.name ? <p className="mt-3 text-sm text-slate-500">{media.name}</p> : null}
      </>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-[24px] border border-white/20 bg-white/10">
      <img src={media.url} alt={media.name || "Template preview"} className="h-64 w-full object-cover" />
    </div>
  );
}
