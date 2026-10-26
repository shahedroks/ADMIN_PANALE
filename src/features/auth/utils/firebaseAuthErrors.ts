import { FirebaseError } from "firebase/app";

import type { TranslateParams } from "@/i18n/translate";

export type AuthTranslateFn = (key: string, params?: TranslateParams) => string;

const AUTH_CODE_TO_KEY: Record<string, string> = {
  "auth/invalid-email": "auth.invalidEmail",
  "auth/user-disabled": "auth.userDisabled",
  "auth/user-not-found": "auth.invalidCredentials",
  "auth/wrong-password": "auth.invalidCredentials",
  "auth/invalid-credential": "auth.invalidCredentials",
  "auth/too-many-requests": "auth.tooManyRequests",
  "auth/network-request-failed": "auth.networkError",
};

const FALLBACK_MESSAGES: Record<string, string> = {
  "auth.invalidEmail": "Please enter a valid email address.",
  "auth.userDisabled": "This account has been disabled.",
  "auth.invalidCredentials": "Invalid email or password.",
  "auth.tooManyRequests": "Too many attempts. Try again later.",
  "auth.networkError": "Network error. Check your connection.",
  "auth.noAdminAccess": "You do not have admin access.",
  "login.failed": "Login failed.",
};

function resolveMessage(key: string, t?: AuthTranslateFn): string {
  if (t) return t(key);
  return FALLBACK_MESSAGES[key] ?? key;
}

export function firebaseAuthErrorMessage(error: unknown, t?: AuthTranslateFn): string {
  if (error instanceof FirebaseError) {
    const key = AUTH_CODE_TO_KEY[error.code];
    if (key) return resolveMessage(key, t);
    return error.message;
  }
  if (error instanceof Error) {
    if (error.message.includes("admin access")) {
      return resolveMessage("auth.noAdminAccess", t);
    }
    return error.message;
  }
  return resolveMessage("login.failed", t);
}
