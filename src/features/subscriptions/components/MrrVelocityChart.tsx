import {
  mrrVelocitySeries,
  subscriptionFooterMetrics,
} from "@/features/subscriptions/data/subscriptionsData";

export function MrrVelocityChart() {
  const { months, values, basePortion } = mrrVelocitySeries;
  const max = 42;
  const chartH = 180;
  const barW = 36;
  const gap = 24;
  const pad = 20;
  const totalW = pad * 2 + months.length * barW + (months.length - 1) * gap;

  return (
    <div className="sub-chart sub-chart--mrr">
      <div className="sub-chart__mrr-headline">
        <strong>$38,420.00</strong>
        <span>56.8% Gross Margin</span>
      </div>
      <svg
        viewBox={`0 0 ${totalW} ${chartH + 36}`}
        className="sub-chart__svg"
        role="img"
        aria-label="MRR velocity bar chart"
      >
        {months.map((m, i) => {
          const x = pad + i * (barW + gap);
          const total = values[i];
          const base = basePortion[i];
          const growth = total - base;
          const baseH = (base / max) * (chartH - 24);
          const growthH = (growth / max) * (chartH - 24);
          return (
            <g key={m}>
              <text x={x + barW / 2} y={12} textAnchor="middle" className="sub-chart__bar-value">
                ${total}k
              </text>
              <rect
                x={x}
                y={chartH - baseH}
                width={barW}
                height={baseH}
                rx="4"
                fill="#00241a"
              />
              <rect
                x={x}
                y={chartH - baseH - growthH}
                width={barW}
                height={growthH}
                rx="4"
                fill="#acf847"
              />
              <text x={x + barW / 2} y={chartH + 20} textAnchor="middle" className="sub-chart__axis-label">
                {m}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="sub-chart__mini-metrics">
        {subscriptionFooterMetrics.map((m) => (
          <div key={m.label} className="sub-chart__mini-metric">
            <span>{m.label}</span>
            <strong>{m.value}</strong>
            <em className={`sub-chart__mini-hint--${m.hintTone}`}>{m.hint}</em>
          </div>
        ))}
      </div>
    </div>
  );
}
