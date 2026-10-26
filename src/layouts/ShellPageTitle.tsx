import { useLocation } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useI18n } from "@/i18n";

const titleRoutes: { match: RegExp; key: string }[] = [
  { match: /^\/login\/?$/, key: "documentTitle.login" },
  { match: /^\/dashboard\/?$/, key: "documentTitle.dashboard" },
  { match: /^\/reports\/?$/, key: "documentTitle.reports" },
  { match: /^\/items-review\/[^/]+\/?$/, key: "documentTitle.itemDetail" },
  { match: /^\/items-review\/?$/, key: "documentTitle.itemsReview" },
  { match: /^\/users\/[^/]+\/?$/, key: "documentTitle.userDetail" },
  { match: /^\/users\/?$/, key: "documentTitle.users" },
  { match: /^\/settings\/?$/, key: "documentTitle.settings" },
  { match: /^\/subscriptions\/plans\/?$/, key: "documentTitle.plans" },
  { match: /^\/subscriptions\/?$/, key: "documentTitle.subscriptions" },
];

export function ShellPageTitle() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const entry = titleRoutes.find((route) => route.match.test(pathname));
  usePageTitle(entry ? t(entry.key) : t("documentTitle.fallback"));
  return null;
}
