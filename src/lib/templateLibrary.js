import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "templateLibrary";

const normalizeTemplateRecord = (snapshot) => {
  if (!snapshot?.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || null,
    lastOpenedAt: data.lastOpenedAt?.toDate?.() || data.lastOpenedAt || null,
  };
};

export async function saveTemplateRecord({
  recordId,
  templateType,
  title = "",
  subtitle = "",
  description = "",
  toolKey = "",
  ownerId = "",
  status = "draft",
  tags = [],
  thumbnail = "",
  theme = null,
  data = {},
  favorite = false,
  archived = false,
}) {
  if (!ownerId) {
    throw new Error("Owner id is required to save templates.");
  }

  const templatesRef = collection(db, COLLECTION_NAME);
  const templateRef = recordId ? doc(templatesRef, recordId) : doc(templatesRef);
  const existingSnapshot = await getDoc(templateRef);

  const payload = {
    id: templateRef.id,
    templateType,
    title,
    subtitle,
    description,
    toolKey,
    ownerId,
    status,
    tags,
    thumbnail,
    theme,
    data,
    favorite,
    archived,
    updatedAt: serverTimestamp(),
  };

  if (existingSnapshot.exists()) {
    await setDoc(templateRef, payload, { merge: true });
  } else {
    await setDoc(
      templateRef,
      {
        ...payload,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("template-library-updated", { detail: { id: templateRef.id } }));
  }

  return templateRef.id;
}

export async function updateTemplateRecord(recordId, updates = {}) {
  if (!recordId) {
    throw new Error("Template id is required.");
  }

  const templateRef = doc(db, COLLECTION_NAME, recordId);
  await updateDoc(templateRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("template-library-updated", { detail: { id: recordId } }));
  }
}

export async function touchTemplateRecord(recordId) {
  if (!recordId) {
    return;
  }

  const templateRef = doc(db, COLLECTION_NAME, recordId);
  await updateDoc(templateRef, {
    lastOpenedAt: serverTimestamp(),
  });
}

export async function loadTemplateRecord({ recordId }) {
  if (!recordId) {
    throw new Error("Template id is required.");
  }

  const templateRef = doc(db, COLLECTION_NAME, recordId);
  const snapshot = await getDoc(templateRef);
  return normalizeTemplateRecord(snapshot);
}

export async function loadUserTemplates({
  ownerId,
  includeArchived = false,
} = {}) {
  if (!ownerId) {
    throw new Error("Owner id is required to load templates.");
  }

  const templatesRef = collection(db, COLLECTION_NAME);
  const constraints = [where("ownerId", "==", ownerId), orderBy("updatedAt", "desc")];

  if (!includeArchived) {
    constraints.unshift(where("archived", "==", false));
  }

  const templatesQuery = query(templatesRef, ...constraints);
  const snapshots = await getDocs(templatesQuery);

  return snapshots.docs.map(normalizeTemplateRecord).filter(Boolean);
}

export async function duplicateTemplateRecord(recordId, ownerId) {
  const record = await loadTemplateRecord({ recordId });
  if (!record) {
    throw new Error("Template not found.");
  }

  return saveTemplateRecord({
    templateType: record.templateType,
    title: `${record.title || "Untitled"} (Copy)`,
    subtitle: record.subtitle || "",
    description: record.description || "",
    toolKey: record.toolKey,
    ownerId: ownerId || record.ownerId,
    status: "draft",
    tags: record.tags || [],
    thumbnail: record.thumbnail || "",
    theme: record.theme || null,
    data: record.data || {},
  });
}

export async function archiveTemplateRecord(recordId, archived = true) {
  await updateTemplateRecord(recordId, { archived });
}

export async function favoriteTemplateRecord(recordId, favorite = true) {
  await updateTemplateRecord(recordId, { favorite });
}

export async function deleteTemplateRecord(recordId) {
  if (!recordId) {
    throw new Error("Template id is required.");
  }

  const templateRef = doc(db, COLLECTION_NAME, recordId);
  await deleteDoc(templateRef);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("template-library-updated", { detail: { id: recordId } }));
  }
}
