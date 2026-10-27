import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, storage } from "@/lib/firebase";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export async function updateAdminProfile(params: {
  displayName: string;
  photoFile?: File | null;
}): Promise<void> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error("Sign in required.");
  }

  const displayName = params.displayName.trim();
  if (!displayName) {
    throw new Error("Enter a display name.");
  }

  let photoUrl: string | undefined;
  if (params.photoFile) {
    if (!params.photoFile.type.startsWith("image/")) {
      throw new Error("Choose an image file.");
    }
    if (params.photoFile.size > MAX_PHOTO_BYTES) {
      throw new Error("Image must be under 4 MB.");
    }
    const storageRef = ref(storage, `profiles/${firebaseUser.uid}/avatar.jpg`);
    await uploadBytes(storageRef, params.photoFile, {
      contentType: params.photoFile.type || "image/jpeg",
    });
    photoUrl = await getDownloadURL(storageRef);
  }

  await updateProfile(firebaseUser, {
    displayName,
    ...(photoUrl ? { photoURL: photoUrl } : {}),
  });

  await updateDoc(doc(db, "users", firebaseUser.uid), {
    displayName,
    ...(photoUrl ? { photoUrl } : {}),
    updatedAt: serverTimestamp(),
  });

  await firebaseUser.reload();
}
