import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveTemplateRecord } from "./templateLibrary";

export async function saveEmailDraft({ draftId, userId, email }) {
  if (!draftId) {
    throw new Error("An email draft id is required.");
  }

  if (!userId) {
    throw new Error("A signed-in user is required to save email drafts.");
  }

  const draftRef = doc(db, "emailDrafts", draftId);

  await setDoc(
    draftRef,
    {
      ...email,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  try {
    const headerImage = email?.images?.find((asset) => asset.role === "header");
    const description =
      email?.previewText ||
      email?.messageBlocks?.find((block) => block.content)?.content ||
      "";
    await saveTemplateRecord({
      recordId: draftId,
      templateType: "email",
      title: email?.subject || "Email",
      subtitle: email?.previewText || "",
      description,
      toolKey: "email-generator",
      ownerId: userId,
      status: "draft",
      tags: ["email"],
      thumbnail: headerImage?.url || "",
      theme: {
        layoutStyle: email?.layoutStyle || "",
      },
      data: email,
    });
  } catch (error) {
    console.warn("[templateLibrary] Email save failed", error);
  }

  return draftId;
}

export default saveEmailDraft;
