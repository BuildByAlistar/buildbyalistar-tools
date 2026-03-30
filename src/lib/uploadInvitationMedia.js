import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const sanitizeFileName = (fileName = "media") =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function uploadInvitationMedia({ file, userId, role = "video", timestamp = Date.now() }) {
  if (!file) {
    throw new Error("No media file selected.");
  }

  if (!userId) {
    throw new Error("You must be signed in to upload invitation media.");
  }

  const safeFileName = sanitizeFileName(file.name || "invitation-media") || "invitation-media";
  const storagePath = `invitation-media/${userId}/${role}/${timestamp}-${safeFileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "application/octet-stream",
  });

  const mediaUrl = await getDownloadURL(storageRef);

  return {
    mediaUrl,
    mediaName: file.name || safeFileName,
    mediaType: file.type || "application/octet-stream",
    storagePath,
    role,
  };
}

export default uploadInvitationMedia;
