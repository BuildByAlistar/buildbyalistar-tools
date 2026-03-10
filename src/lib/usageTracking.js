import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureUserUsageProfile(user) {
  if (!user?.uid) {
    console.warn("[usage-tracking] Skipping usage profile initialization: missing user id");
    return null;
  }

  const userRef = doc(db, "users", user.uid);

  try {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        plan: "free",
        credits: 10,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      },
      { merge: true },
    );

    console.info("[usage-tracking] Upserted user profile", { uid: user.uid });
    return userRef;
  } catch (error) {
    console.error("[usage-tracking] Failed to upsert user profile", {
      uid: user.uid,
      errorCode: error?.code,
      errorMessage: error?.message,
      error,
    });
    return null;
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

  const userProfileRef = await ensureUserUsageProfile(user);
  if (!userProfileRef) {
    console.warn("[usage-tracking] User profile write did not complete before tool run tracking", {
      uid: userId,
      toolId,
      provider,
    });
  }

  try {
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
      errorCode: error?.code,
      errorMessage: error?.message,
      error,
    });
    return null;
  }
}
