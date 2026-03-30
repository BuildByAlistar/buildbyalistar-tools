import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveTemplateRecord } from "./templateLibrary";

export async function saveInvitationDraft({ draftId, userId, invitation }) {
  if (!draftId) {
    throw new Error("An invitation draft id is required.");
  }

  if (!userId) {
    throw new Error("A signed-in user is required to save invitation drafts.");
  }

  const draftRef = doc(db, "invitationDrafts", draftId);

  await setDoc(
    draftRef,
    {
      ...invitation,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  try {
    const coverImage = invitation?.mediaAssets?.find((asset) => asset.role === "cover");
    await saveTemplateRecord({
      recordId: draftId,
      templateType: "invitation",
      title: invitation?.title || "Invitation",
      subtitle: invitation?.subtitle || "",
      description: invitation?.shortMessage || invitation?.longMessage || "",
      toolKey: "invitation-generator",
      ownerId: userId,
      status: "draft",
      tags: ["invitation"],
      thumbnail: coverImage?.url || "",
      theme: {
        layoutStyle: invitation?.layoutStyle || "",
        previewTheme: invitation?.previewTheme || "",
      },
      data: invitation,
    });
  } catch (error) {
    console.warn("[templateLibrary] Invitation save failed", error);
  }

  return draftId;
}

export default saveInvitationDraft;
