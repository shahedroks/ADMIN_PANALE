/** Console admins when Firestore users/{uid} is missing or on an old Auth UID. */
export const BOOTSTRAP_ADMIN_UIDS = [
  "cvPl7RFBpsNIXXSBLBeNQxcm3Hk2",
  "FyG56sMWMgYI5RZ8W3Iws2RsxMO2",
] as const;

export const BOOTSTRAP_ADMIN_EMAILS = ["admin@swapit.io"] as const;

export function isBootstrapAdminUid(uid: string | undefined | null): boolean {
  if (!uid) return false;
  return (BOOTSTRAP_ADMIN_UIDS as readonly string[]).includes(uid);
}

export function isBootstrapAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (BOOTSTRAP_ADMIN_EMAILS as readonly string[]).some(
    (e) => e.toLowerCase() === normalized,
  );
}

export function isBootstrapAdminAccount(
  uid: string | undefined | null,
  email: string | undefined | null,
): boolean {
  return isBootstrapAdminUid(uid) || isBootstrapAdminEmail(email);
}
