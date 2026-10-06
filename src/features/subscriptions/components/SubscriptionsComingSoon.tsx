type SubscriptionsComingSoonProps = {
  variant: "overview" | "plans";
};

const copy = {
  overview: {
    breadcrumb: "Subscriptions › Overview",
    title: "Subscription Overview",
    body: "MRR analytics, growth charts, and subscriber telemetry are being finalized for this environment.",
  },
  plans: {
    breadcrumb: "Subscriptions › Plans Management",
    title: "Plans Management",
    body: "Tier configuration, pricing models, and entitlement gates will appear here soon.",
  },
} as const;

export function SubscriptionsComingSoon({ variant }: SubscriptionsComingSoonProps) {
  const { breadcrumb, title, body } = copy[variant];

  return (
    <div className="dash-page subscriptions-coming-soon">
      <p className="subscriptions-coming-soon__crumb">{breadcrumb}</p>
      <div className="subscriptions-coming-soon__card">
        <span className="subscriptions-coming-soon__badge">Coming soon</span>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </div>
  );
}
