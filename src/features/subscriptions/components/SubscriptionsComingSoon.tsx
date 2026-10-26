import { useI18n } from "@/i18n";

type SubscriptionsComingSoonProps = {
  variant: "overview" | "plans";
};

export function SubscriptionsComingSoon({ variant }: SubscriptionsComingSoonProps) {
  const { t } = useI18n();

  const breadcrumb =
    variant === "overview"
      ? `${t("subs.breadcrumb.parent")} › ${t("subs.breadcrumb.overview")}`
      : `${t("subs.breadcrumb.parent")} › ${t("subs.plans.breadcrumb")}`;
  const title =
    variant === "overview" ? t("subs.overviewSoonTitle") : t("subs.plansSoonTitle");
  const body =
    variant === "overview" ? t("subs.overviewSoonBody") : t("subs.plansSoonBody");

  return (
    <div className="dash-page subscriptions-coming-soon">
      <p className="subscriptions-coming-soon__crumb">{breadcrumb}</p>
      <div className="subscriptions-coming-soon__card">
        <span className="subscriptions-coming-soon__badge">{t("subs.comingSoon")}</span>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </div>
  );
}
