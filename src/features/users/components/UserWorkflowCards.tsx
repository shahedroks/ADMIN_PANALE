import { Link } from "react-router-dom";
import type { UserWorkflowStats } from "@/features/users/utils/userManagementMetrics";
import { useI18n } from "@/i18n";

type UserWorkflowCardsProps = {
  workflow: UserWorkflowStats;
};

const workflowLinks = ["/reports", "/items-review", "/reports"] as const;

export function UserWorkflowCards({ workflow }: UserWorkflowCardsProps) {
  const { t } = useI18n();

  const cards = [
    {
      title: t("workflow.autoTitle"),
      body:
        workflow.autoRestrictedCount > 0
          ? t("workflow.autoBodyActive", { count: workflow.autoRestrictedCount })
          : t("workflow.autoBodyEmpty"),
      link: t("workflow.autoLink"),
    },
    {
      title: t("workflow.verifyTitle"),
      body:
        workflow.verificationPendingCount > 0
          ? t("workflow.verifyBodyActive", { count: workflow.verificationPendingCount })
          : t("workflow.verifyBodyEmpty"),
      link: t("workflow.verifyLink"),
    },
    {
      title: t("workflow.mediationTitle"),
      body:
        workflow.disputedReportsCount > 0
          ? t("workflow.mediationBodyActive", { count: workflow.disputedReportsCount })
          : t("workflow.mediationBodyEmpty"),
      link: t("workflow.mediationLink"),
    },
  ];

  return (
    <div className="users-workflows">
      {cards.map((card, index) => (
        <article key={card.title} className="users-workflow-card">
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <Link to={workflowLinks[index] ?? "/reports"}>{card.link}</Link>
        </article>
      ))}
    </div>
  );
}
