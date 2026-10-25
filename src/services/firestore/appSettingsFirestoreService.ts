import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AppSettings = {
  platformDisplayName: string;
  enforceTwoFactor: boolean;
  sessionTimeoutMinutes: number;
};

const DEFAULTS: AppSettings = {
  platformDisplayName: "SWAP IT",
  enforceTwoFactor: true,
  sessionTimeoutMinutes: 30,
};

const SETTINGS_DOC = doc(db, "settings", "app");

export async function fetchAppSettings(): Promise<AppSettings> {
  const snap = await getDoc(SETTINGS_DOC);
  if (!snap.exists()) {
    await setDoc(SETTINGS_DOC, { ...DEFAULTS, updatedAt: serverTimestamp() }, { merge: true });
    return DEFAULTS;
  }
  const data = snap.data();
  return {
    platformDisplayName: (data.platformDisplayName as string) ?? DEFAULTS.platformDisplayName,
    enforceTwoFactor: (data.enforceTwoFactor as boolean) ?? DEFAULTS.enforceTwoFactor,
    sessionTimeoutMinutes:
      (data.sessionTimeoutMinutes as number) ?? DEFAULTS.sessionTimeoutMinutes,
  };
}

export async function saveAppSettingsFirestore(patch: Partial<AppSettings>): Promise<AppSettings> {
  const current = await fetchAppSettings();
  const next = { ...current, ...patch };
  await setDoc(SETTINGS_DOC, { ...next, updatedAt: serverTimestamp() }, { merge: true });
  return next;
}
