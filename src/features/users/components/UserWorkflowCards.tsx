import { Link } from "react-router-dom";
import { workflowCards } from "@/features/users/data/usersManagementData";

const workflowLinks = ["/reports", "/items-review", "/settings"] as const;

export function UserWorkflowCards() {
  return (
    <div className="users-workflows">
      {workflowCards.map((card, index) => (
        <article key={card.title} className="users-workflow-card">
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <Link to={workflowLinks[index] ?? "/reports"}>{card.link}</Link>
        </article>
      ))}
    </div>
  );
}
