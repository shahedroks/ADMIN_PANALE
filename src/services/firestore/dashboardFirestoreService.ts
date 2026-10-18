import { collection, getCountFromServer, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

export type DashboardCounts = {
  users: number;
  pendingItems: number;
  openReports: number;
  approvedItems: number;
};

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const usersQ = query(collection(db, "users"), where("role", "==", "user"));
  const pendingQ = query(collection(db, "items"), where("status", "==", "pending"));
  const openReportsQ = query(collection(db, "reports"), where("status", "in", ["open", "under_review"]));
  const approvedQ = query(collection(db, "items"), where("status", "==", "approved"));

  const [users, pendingItems, openReports, approvedItems] = await Promise.all([
    getCountFromServer(usersQ),
    getCountFromServer(pendingQ),
    getCountFromServer(openReportsQ),
    getCountFromServer(approvedQ),
  ]);

  return {
    users: users.data().count,
    pendingItems: pendingItems.data().count,
    openReports: openReports.data().count,
    approvedItems: approvedItems.data().count,
  };
}
