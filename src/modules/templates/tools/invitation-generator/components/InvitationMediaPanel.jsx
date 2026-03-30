import { getMediaByRole } from "../invitationModel";

export default function InvitationMediaPanel({
  template,
  onImageUpload,
  onGalleryUpload,
  onVideoUpload,
  onRemoveMedia,
  isUploadingVideo,
}) {
  const cover = getMediaByRole(template, "cover");
  const logo = getMediaByRole(template, "logo");
  const host = getMediaByRole(template, "host-photo");
  const venue = getMediaByRole(template, "venue-photo");
  const gallery = getMediaByRole(template, "gallery");
  const video = getMediaByRole(template, "video");

  const renderChips = (items) =>
    items.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200"
      >
        <span className="truncate">{item.name || item.title || "Media item"}</span>
        <button
          type="button"
          onClick={() => onRemoveMedia(item.id)}
          className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:border-rose-400/40 hover:text-rose-200"
        >
          Remove
        </button>
      </div>
    ));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Media assets</h3>
        <p className="mt-2 text-xs text-slate-400">Upload cover, gallery, and optional video media.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Cover image</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-fuchsia-400"
            onChange={onImageUpload("cover")}
          />
          <div className="mt-3 space-y-2">{renderChips(cover)}</div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Logo or brand image</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-fuchsia-400"
            onChange={onImageUpload("logo")}
          />
          <div className="mt-3 space-y-2">{renderChips(logo)}</div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Host photo</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-fuchsia-400"
            onChange={onImageUpload("host-photo")}
          />
          <div className="mt-3 space-y-2">{renderChips(host)}</div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Venue photo</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-fuchsia-400"
            onChange={onImageUpload("venue-photo")}
          />
          <div className="mt-3 space-y-2">{renderChips(venue)}</div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Gallery images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-fuchsia-400"
            onChange={onGalleryUpload}
          />
          <div className="mt-3 space-y-2">{renderChips(gallery)}</div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Video (optional)</span>
          <input
            type="file"
            accept="video/*"
            className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-fuchsia-400"
            onChange={onVideoUpload}
            disabled={isUploadingVideo}
          />
          <div className="mt-3 space-y-2">{renderChips(video)}</div>
        </label>
      </div>
    </div>
  );
}
