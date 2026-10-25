import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";

import type { ModerationReport, ReportKpi } from "@/features/reports/types";
import { db } from "@/lib/firebase";

type ReportDoc = {
  type?: string;
  targetType?: string;
  targetId?: string;
  title?: string;
  message?: string;
  status?: string;
  priority?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function normalizeTargetKind(raw?: string): ModerationReport["targetKind"] {
  const t = (raw ?? "item").toLowerCase();
  if (t === "user") return "user";
  if (t === "conversation" || t === "chat") return "conversation";
  return "item";
}

function mapReport(id: string, data: ReportDoc): ModerationReport {
  const targetKind = normalizeTargetKind(data.targetType);
  const status = (data.status ?? "open") as ModerationReport["status"];
  const priority = (data.priority ?? "medium") as ModerationReport["priority"];
  const targetId = data.targetId ?? "";
  const created = data.createdAt?.toDate().toISOString() ?? new Date().toISOString();
  const updated = data.updatedAt?.toDate().toISOString();
  const label =
    data.title?.trim() ||
    data.message?.trim()?.slice(0, 48) ||
    targetId ||
    "—";
  return {
    id,
    flow: data.type ?? "report",
    type: data.type ?? "General",
    targetId,
    targetLabel: label,
    targetKind,
    priority,
    status,
    reportedAt: created,
    updatedAt: updated,
    thumbnailHue: id.charCodeAt(0) * 17,
  };
}

export async function fetchReports(max = 100): Promise<ModerationReport[]> {
  const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapReport(d.id, d.data() as ReportDoc));
}

export async function fetchReportKpis(reports?: ModerationReport[]): Promise<ReportKpi[]> {
  const list = reports ?? await fetchReports(200);
  const open = list.filter((r) => r.status === "open" || r.status === "under_review");
  const high = list.filter((r) => r.priority === "high" && r.status !== "closed");
  const closed = list.filter((r) => r.status === "closed");

  let avgHours = 0;
  if (closed.length > 0) {
    const totalMs = closed.reduce((sum, r) => {
      const start = Date.parse(r.reportedAt);
      const end = r.updatedAt ? Date.parse(r.updatedAt) : start;
      return sum + Math.max(0, end - start);
    }, 0);
    avgHours = totalMs / closed.length / (1000 * 60 * 60);
  }

  const closedRate =
    list.length > 0 ? Math.round((closed.length / list.length) * 1000) / 10 : 100;

  return [
    {
      id: "incidents",
      label: "Active Incidents",
      value: String(open.length).padStart(2, "0"),
      hint: `${list.length} total in queue`,
      hintTone: open.length > 0 ? "negative" : "positive",
      icon: "shield",
      iconBg: "#e6eeff",
    },
    {
      id: "urgency",
      label: "High Urgency",
      value: String(high.length).padStart(2, "0"),
      hint: high.length > 0 ? "Action required" : "Queue clear",
      hintTone: high.length > 0 ? "negative" : "positive",
      icon: "flag",
      iconBg: "rgba(255, 218, 214, 0.55)",
      alert: high.length > 0,
    },
    {
      id: "resolution",
      label: "Avg Resolution Time",
      value: closed.length ? `${avgHours.toFixed(1)} hrs` : "—",
      hint: `${closedRate}% closed`,
      hintTone: "positive",
      icon: "timer",
      iconBg: "#eff4ff",
    },
    {
      id: "clean",
      label: "Closed Reports",
      value: String(closed.length),
      hint: "Platform data",
      hintTone: "neutral",
      icon: "leaf",
      iconBg: "rgba(163, 114, 34, 0.35)",
    },
  ];
}
