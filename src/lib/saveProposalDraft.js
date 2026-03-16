import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

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

  return draftId;
}

export default saveProposalDraft;
