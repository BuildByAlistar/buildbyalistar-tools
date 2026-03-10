import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureUserUsageProfile(user) {
  if (!user?.uid) {
    console.warn("Skipping usage profile initialization: missing user id");
    return null;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userRef;
    }

    await setDoc(userRef, {
      email: user.email || "",
      plan: "free",
      credits: 10,
      createdAt: serverTimestamp(),
    });

    return userRef;
  } catch (error) {
    console.error("Failed to ensure usage profile", error);
    throw error;
  }
}

export async function trackToolRun({ userId, toolId, provider }) {
  if (!userId || !toolId || !provider) {
    console.warn("Skipping tool run tracking due to missing fields", { userId: Boolean(userId), toolId: Boolean(toolId), provider: Boolean(provider) });
    return null;
  }

  try {
    return await addDoc(collection(db, "toolRuns"), {
      userId,
      toolId,
      provider,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to write tool run tracking", error);
    throw error;
  }
}
