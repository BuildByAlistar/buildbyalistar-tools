import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveTemplateRecord } from "./templateLibrary";

export async function saveProposalDraft({ draftId, userId, proposal }) {
  if (!draftId) {
    throw new Error("An instruction draft id is required.");
  }

  if (!userId) {
    throw new Error("A signed-in user is required to save instruction drafts.");
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
      templateType: "instruction",
      title: proposal?.title || proposal?.projectName || "Instruction Guide",
      subtitle: proposal?.subtitle || proposal?.guideType || "",
      description: proposal?.overview || proposal?.summary || "",
      toolKey: "proposal-generator",
      ownerId: userId,
      status: "draft",
      tags: ["instruction", "guide", "sop"],
      thumbnail,
      theme: proposal?.theme || null,
      data: proposal,
    });
  } catch (error) {
    console.warn("[templateLibrary] Instruction save failed", error);
  }

  return draftId;
}

export default saveProposalDraft;
