import { deleteField, doc, serverTimestamp, updateDoc } from "firebase/firestore";

import type { UserRestrictionSettings } from "@/features/user-detail/types";
import { auth, db } from "@/lib/firebase";

export async function restrictUserFirestore(userId: string): Promise<void> {
  const moderatorUid = auth.currentUser?.uid;
  await updateDoc(doc(db, "users", userId), {
    accountStatus: "restricted",
    restriction: {
      manualReview: true,
      allowChat: false,
      allowListings: false,
      note: "",
    },
    updatedAt: serverTimestamp(),
    ...(moderatorUid ? { restrictedBy: moderatorUid } : {}),
    restrictedAt: serverTimestamp(),
  });
}

export async function banUserFirestore(userId: string, note = ""): Promise<void> {
  const moderatorUid = auth.currentUser?.uid;
  await updateDoc(doc(db, "users", userId), {
    accountStatus: "banned",
    banNote: note,
    updatedAt: serverTimestamp(),
    ...(moderatorUid ? { bannedBy: moderatorUid } : {}),
    bannedAt: serverTimestamp(),
  });
}

export async function liftRestrictionFirestore(userId: string): Promise<void> {
  const moderatorUid = auth.currentUser?.uid;
  await updateDoc(doc(db, "users", userId), {
    accountStatus: "active",
    restriction: deleteField(),
    updatedAt: serverTimestamp(),
    ...(moderatorUid ? { liftedBy: moderatorUid } : {}),
    liftedAt: serverTimestamp(),
  });
}

export async function saveUserRestrictionSettingsFirestore(
  userId: string,
  settings: UserRestrictionSettings,
): Promise<void> {
  const moderatorUid = auth.currentUser?.uid;
  const partialBlock = !settings.allowChat || !settings.allowListings;
  const restriction = {
    manualReview: settings.manualReview,
    allowChat: settings.allowChat,
    allowListings: settings.allowListings,
    durationDays: settings.durationDays,
    note: settings.note,
  };

  if (!partialBlock && !settings.manualReview) {
    await updateDoc(doc(db, "users", userId), {
      accountStatus: "active",
      restriction: deleteField(),
      updatedAt: serverTimestamp(),
      ...(moderatorUid ? { liftedBy: moderatorUid, liftedAt: serverTimestamp() } : {}),
    });
    return;
  }

  await updateDoc(doc(db, "users", userId), {
    accountStatus: partialBlock ? "restricted" : "active",
    restriction,
    updatedAt: serverTimestamp(),
    ...(partialBlock && moderatorUid
      ? { restrictedBy: moderatorUid, restrictedAt: serverTimestamp() }
      : {}),
  });
}

export async function softDeleteUserFirestore(userId: string): Promise<void> {
  const moderatorUid = auth.currentUser?.uid;
  await updateDoc(doc(db, "users", userId), {
    accountStatus: "banned",
    updatedAt: serverTimestamp(),
    ...(moderatorUid ? { deletedBy: moderatorUid } : {}),
    deletedAt: serverTimestamp(),
  });
}
