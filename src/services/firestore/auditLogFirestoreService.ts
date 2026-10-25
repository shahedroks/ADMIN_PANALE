import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export async function writeAuditLogClient(params: {
  action: string;
  targetType: string;
  targetId: string;
  note?: string;
}): Promise<void> {
  const actorUid = auth.currentUser?.uid;
  if (!actorUid) return;
  await addDoc(collection(db, "audit_logs"), {
    ...params,
    actorUid,
    createdAt: serverTimestamp(),
  });
}
