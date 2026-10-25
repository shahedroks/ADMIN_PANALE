import { doc, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";

import { db } from "@/lib/firebase";

type ModerateAction = "approve" | "hide" | "reject" | "request_edit";

const statusMap: Record<ModerateAction, string> = {
  approve: "approved",
  hide: "hidden",
  reject: "rejected",
  request_edit: "pending",
};

export async function moderateItemFirestore(
  itemId: string,
  action: ModerateAction,
  note?: string,
  moderatorUid?: string,
): Promise<void> {
  await updateDoc(doc(db, "items", itemId), {
    status: statusMap[action],
    updatedAt: serverTimestamp(),
    moderatedAt: serverTimestamp(),
    ...(moderatorUid ? { moderatedBy: moderatorUid } : {}),
    ...(note ? { moderationNote: note } : {}),
    ...(action === "request_edit"
      ? {
          flagKind: "edit_requested",
          flagMessage: note ?? "Please update your listing.",
        }
      : {}),
  });
}

export async function moderateItemBatchFirestore(
  itemIds: string[],
  action: ModerateAction,
  moderatorUid?: string,
): Promise<void> {
  const batch = writeBatch(db);
  for (const itemId of itemIds) {
    batch.update(doc(db, "items", itemId), {
      status: statusMap[action],
      updatedAt: serverTimestamp(),
      moderatedAt: serverTimestamp(),
      ...(moderatorUid ? { moderatedBy: moderatorUid } : {}),
    });
  }
  await batch.commit();
}
