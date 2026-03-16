import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const sanitizeFileName = (fileName = "video") =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function uploadProposalVideo({ file, userId, timestamp = Date.now() }) {
  if (!file) {
    throw new Error("No video file selected.");
  }

  if (!userId) {
    throw new Error("You must be signed in to upload a proposal video.");
  }

  const safeFileName = sanitizeFileName(file.name || "proposal-demo.mp4") || "proposal-demo.mp4";
  const storagePath = `proposal-videos/${userId}/${timestamp}-${safeFileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "video/mp4",
  });

  const videoUrl = await getDownloadURL(storageRef);

  return {
    videoUrl,
    videoName: file.name || safeFileName,
    videoType: file.type || "video/mp4",
    storagePath,
  };
}

export default uploadProposalVideo;
