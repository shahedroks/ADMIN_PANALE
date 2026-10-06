import { useLocation } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

const titles: { match: RegExp; title: string }[] = [
  { match: /^\/login\/?$/, title: "SWAP IT — Admin Login" },
  { match: /^\/dashboard\/?$/, title: "SWAP IT — Dashboard Overview" },
  { match: /^\/reports\/?$/, title: "SWAP IT — Reports & Review" },
  { match: /^\/items-review\/[^/]+\/?$/, title: "SWAP IT — Item Detail" },
  { match: /^\/items-review\/?$/, title: "SWAP IT — Items Review" },
  { match: /^\/users\/[^/]+\/?$/, title: "SWAP IT — User Details" },
  { match: /^\/users\/?$/, title: "SWAP IT — User Management" },
  { match: /^\/settings\/?$/, title: "SWAP IT — Settings" },
  { match: /^\/subscriptions\/plans\/?$/, title: "SWAP IT — Plans Management" },
  { match: /^\/subscriptions\/?$/, title: "SWAP IT — Subscription Overview" },
];

export function ShellPageTitle() {
  const { pathname } = useLocation();
  const entry = titles.find((t) => t.match.test(pathname));
  usePageTitle(entry?.title ?? "SWAP IT — Control Center");
  return null;
}
