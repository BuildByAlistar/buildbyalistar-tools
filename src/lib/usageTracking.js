import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureUserUsageProfile(user) {
  if (!user?.uid) {
    console.warn("[usage-tracking] Skipping usage profile initialization: missing user id");
    return null;
  }

  try {
    console.info("[usage-tracking] Ensuring user profile", { uid: user.uid });
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.info("[usage-tracking] User profile already exists", { uid: user.uid });
      return userRef;
    }

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      plan: "free",
      credits: 10,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    console.info("[usage-tracking] Created user profile", { uid: user.uid });

    return userRef;
  } catch (error) {
    console.error("[usage-tracking] Failed to ensure usage profile", { uid: user?.uid, error });
    throw error;
  }
}

export async function trackToolRun({ user, toolId, provider }) {
  const userId = user?.uid;

  if (!userId || !toolId || !provider) {
    console.warn("[usage-tracking] Skipping tool run tracking due to missing fields", {
      userId: Boolean(userId),
      toolId: Boolean(toolId),
      provider: Boolean(provider),
    });
    return null;
  }

  try {
    await ensureUserUsageProfile(user);

    const toolRunRef = await addDoc(collection(db, "toolRuns"), {
      uid: userId,
      userId,
      toolId,
      provider,
      status: "success",
      createdAt: serverTimestamp(),
    });

    console.info("[usage-tracking] Tracked tool run", {
      docId: toolRunRef.id,
      uid: userId,
      toolId,
      provider,
    });

    return toolRunRef;
  } catch (error) {
    console.error("[usage-tracking] Failed to write tool run tracking", {
      uid: userId,
      toolId,
      provider,
      error,
    });
    throw error;
  }
}
