import { getFunctions, httpsCallable } from "firebase/functions";

import { app } from "@/lib/firebase";

const functions = getFunctions(app, "us-central1");

export async function callModerateItem(params: {
  itemId: string;
  action: "approve" | "hide" | "reject" | "request_edit";
  note?: string;
}) {
  const fn = httpsCallable(functions, "moderateItem");
  return fn(params);
}

export async function callModerateItemBatch(params: {
  itemIds: string[];
  action: "approve" | "hide" | "reject" | "request_edit";
}) {
  const fn = httpsCallable(functions, "moderateItemBatch");
  return fn(params);
}

export async function callRestrictUser(params: {
  userId: string;
  restriction?: Record<string, unknown>;
}) {
  const fn = httpsCallable(functions, "restrictUser");
  return fn(params);
}

export async function callBanUser(params: { userId: string; note?: string }) {
  const fn = httpsCallable(functions, "banUser");
  return fn(params);
}

export async function callLiftRestriction(params: { userId: string }) {
  const fn = httpsCallable(functions, "liftRestriction");
  return fn(params);
}

export async function callDeleteUser(params: { userId: string }) {
  const fn = httpsCallable(functions, "deleteUser");
  return fn(params);
}

export async function callSetUserRole(params: { userId: string; role: string }) {
  const fn = httpsCallable(functions, "setUserRole");
  return fn(params);
}

export async function callUpdateReport(params: {
  reportId: string;
  status?: string;
  priority?: string;
}) {
  const fn = httpsCallable(functions, "updateReport");
  return fn(params);
}

export async function callUpdateAppSettings(params: { settings: Record<string, unknown> }) {
  const fn = httpsCallable(functions, "updateAppSettings");
  return fn(params);
}

export async function callUpdateCategory(params: {
  categoryId: string;
  data: Record<string, unknown>;
}) {
  const fn = httpsCallable(functions, "updateCategory");
  return fn(params);
}

export async function callSeedCategories() {
  const fn = httpsCallable(functions, "seedCategories");
  return fn({});
}

export async function callUpdateSubscriptionPlan(params: {
  planId: string;
  patch: Record<string, unknown>;
}) {
  const fn = httpsCallable(functions, "updateSubscriptionPlan");
  return fn(params);
}
