import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AdminLiveNotification = {
  id: string;
  kind: "report" | "item";
  title: string;
  body: string;
  createdAt: Date;
  href: string;
};

type ReportDoc = {
  status?: string;
  priority?: string;
  title?: string;
  message?: string;
  targetType?: string;
  createdAt?: Timestamp;
};

type ItemDoc = {
  status?: string;
  title?: string;
  categoryName?: string;
  createdAt?: Timestamp;
};

function formatRelativeTime(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export function formatAdminNotificationTime(date: Date): string {
  return formatRelativeTime(date);
}

export type AdminLiveNotificationHandlers = {
  onItems: (items: AdminLiveNotification[]) => void;
  onAdded?: (item: AdminLiveNotification) => void;
};

export function subscribeAdminLiveNotifications(
  handlers: AdminLiveNotificationHandlers,
): Unsubscribe {
  const items: AdminLiveNotification[] = [];
  const seen = new Set<string>();
  let reportsReady = false;
  let listingsReady = false;

  const emit = () => {
    const sorted = [...items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    handlers.onItems(sorted.slice(0, 30));
  };

  const ingest = (entry: AdminLiveNotification, isInitial: boolean) => {
    if (seen.has(entry.id)) return;
    seen.add(entry.id);
    items.push(entry);
    if (!isInitial) handlers.onAdded?.(entry);
    emit();
  };

  const reportsQuery = query(
    collection(db, "reports"),
    where("status", "in", ["open", "under_review"]),
    orderBy("createdAt", "desc"),
    limit(25),
  );

  const itemsQuery = query(
    collection(db, "items"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc"),
    limit(25),
  );

  const unsubReports = onSnapshot(reportsQuery, (snap) => {
    const isInitial = !reportsReady;
    reportsReady = true;
    snap.docChanges().forEach((change) => {
      if (change.type !== "added" && !isInitial) return;
      if (change.type === "removed") return;
      const data = change.doc.data() as ReportDoc;
      const createdAt = data.createdAt?.toDate() ?? new Date();
      const priority = (data.priority ?? "medium").toLowerCase();
      const label =
        data.title?.trim() ||
        data.message?.trim()?.slice(0, 64) ||
        "New report";
      ingest(
        {
          id: `report-${change.doc.id}`,
          kind: "report",
          title: priority === "high" ? "High-priority report" : "New report",
          body: label,
          createdAt,
          href: "/reports",
        },
        isInitial,
      );
    });
    if (isInitial) emit();
  });

  const unsubItems = onSnapshot(itemsQuery, (snap) => {
    const isInitial = !listingsReady;
    listingsReady = true;
    snap.docChanges().forEach((change) => {
      if (change.type !== "added" && !isInitial) return;
      if (change.type === "removed") return;
      const data = change.doc.data() as ItemDoc;
      const createdAt = data.createdAt?.toDate() ?? new Date();
      const title = data.title?.trim() || "New listing";
      ingest(
        {
          id: `item-${change.doc.id}`,
          kind: "item",
          title: "Listing pending review",
          body: title,
          createdAt,
          href: `/items-review/${change.doc.id}`,
        },
        isInitial,
      );
    });
    if (isInitial) emit();
  });

  return () => {
    unsubReports();
    unsubItems();
  };
}
