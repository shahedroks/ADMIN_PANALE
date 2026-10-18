import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";

import type { ModerationReport } from "@/features/reports/types";
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
};

function mapReport(id: string, data: ReportDoc): ModerationReport {
  const targetKind = (data.targetType ?? "item") as ModerationReport["targetKind"];
  const status = (data.status ?? "open") as ModerationReport["status"];
  const priority = (data.priority ?? "medium") as ModerationReport["priority"];
  const created = data.createdAt?.toDate().toISOString() ?? new Date().toISOString();
  return {
    id,
    flow: data.type ?? "report",
    type: data.type ?? "General",
    targetLabel: data.title ?? data.targetId ?? "—",
    targetKind,
    priority,
    status,
    reportedAt: created,
    thumbnailHue: id.charCodeAt(0) * 17,
  };
}

export async function fetchReports(max = 100): Promise<ModerationReport[]> {
  const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapReport(d.id, d.data() as ReportDoc));
}
