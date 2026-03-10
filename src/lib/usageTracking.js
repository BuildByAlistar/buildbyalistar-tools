import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureUserUsageProfile(user) {
  if (!user?.uid) {
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return;
  }

  await setDoc(userRef, {
    email: user.email || "",
    plan: "free",
    credits: 10,
    createdAt: serverTimestamp(),
  });
}

export async function trackToolRun({ userId, toolId, provider }) {
  if (!userId || !toolId || !provider) {
    return;
  }

  await addDoc(collection(db, "toolRuns"), {
    userId,
    toolId,
    provider,
    timestamp: serverTimestamp(),
  });
}
