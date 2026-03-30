import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveTemplateRecord } from "./templateLibrary";

export async function saveProposalDraft({ draftId, userId, proposal }) {
  if (!draftId) {
    throw new Error("A proposal draft id is required.");
  }

  if (!userId) {
    throw new Error("A signed-in user is required to save proposal drafts.");
  }

  const draftRef = doc(db, "proposalDrafts", draftId);

  await setDoc(
    draftRef,
    {
      ...proposal,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  try {
    const thumbnail = proposal?.imageDataUrl || proposal?.images?.[0]?.url || "";
    await saveTemplateRecord({
      recordId: draftId,
      templateType: "proposal",
      title: proposal?.title || proposal?.projectName || "Proposal",
      subtitle: proposal?.clientName || "",
      description: proposal?.summary || proposal?.overview || "",
      toolKey: "proposal-generator",
      ownerId: userId,
      status: "draft",
      tags: ["proposal"],
      thumbnail,
      theme: proposal?.theme || null,
      data: proposal,
    });
  } catch (error) {
    console.warn("[templateLibrary] Proposal save failed", error);
  }

  return draftId;
}

export default saveProposalDraft;
