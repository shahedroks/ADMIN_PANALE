const SOUND_KEY = "swapit.admin.notificationSound";
const READ_IDS_KEY = "swapit.admin.notificationReadIds";

export function isAdminNotificationSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SOUND_KEY);
    if (raw === null) return true;
    return raw === "1";
  } catch {
    return true;
  }
}

export function setAdminNotificationSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function loadReadNotificationIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function saveReadNotificationIds(ids: Set<string>): void {
  try {
    const list = [...ids].slice(-200);
    localStorage.setItem(READ_IDS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
