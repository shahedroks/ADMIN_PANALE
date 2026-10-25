import { Link } from "react-router-dom";
import type { UserWorkflowStats } from "@/features/users/utils/userManagementMetrics";

type UserWorkflowCardsProps = {
  workflow: UserWorkflowStats;
};

const workflowLinks = ["/reports", "/items-review", "/reports"] as const;

export function UserWorkflowCards({ workflow }: UserWorkflowCardsProps) {
  const cards = [
    {
      title: "Auto-restrictions",
      body:
        workflow.autoRestrictedCount > 0
          ? `${workflow.autoRestrictedCount} restricted member(s) have 3+ reports and were quarantined from new swap requests.`
          : "No restricted members currently match the 3+ unresolved reports rule.",
      link: "Review automated rules →",
    },
    {
      title: "Verification queue",
      body:
        workflow.verificationPendingCount > 0
          ? `${workflow.verificationPendingCount} active member(s) are not verified and may need badge review.`
          : "All loaded active members are verified.",
      link: "Open batch validator →",
    },
    {
      title: "Mediation room",
      body:
        workflow.disputedReportsCount > 0
          ? `${workflow.disputedReportsCount} open report(s) need moderator review or assignment.`
          : "No open reports awaiting mediation.",
      link: "Enter mediation dashboard →",
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
