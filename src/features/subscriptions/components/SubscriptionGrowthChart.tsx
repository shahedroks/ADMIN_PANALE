import { subscriptionGrowthSeries } from "@/features/subscriptions/data/subscriptionsData";

function scaleY(value: number, max: number, height: number, pad: number) {
  return height - pad - (value / max) * (height - pad * 2);
}

export function SubscriptionGrowthChart() {
  const { months, premium, free } = subscriptionGrowthSeries;
  const max = 15000;
  const w = 400;
  const h = 200;
  const pad = 16;
  const step = (w - pad * 2) / (months.length - 1);

  const premiumPoints = premium
    .map((v, i) => `${pad + i * step},${scaleY(v, max, h, pad)}`)
    .join(" ");
  const freePoints = free
    .map((v, i) => `${pad + i * step},${scaleY(v, max, h, pad)}`)
    .join(" ");

  const milestoneX = pad + 4 * step;

  return (
    <div className="sub-chart sub-chart--growth">
      <svg viewBox={`0 0 ${w} ${h + 40}`} className="sub-chart__svg" role="img" aria-label="Subscription growth chart">
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={pad}
            x2={w - pad}
            y1={pad + i * 45}
            y2={pad + i * 45}
            stroke="rgba(0,36,26,0.06)"
          />
        ))}
        <polyline points={freePoints} fill="none" stroke="#c0c8c3" strokeWidth="2.5" />
        <polyline points={premiumPoints} fill="none" stroke="#00241a" strokeWidth="2.5" />
        <line
          x1={milestoneX}
          x2={milestoneX}
          y1={pad}
          y2={h - pad}
          stroke="#00241a"
          strokeDasharray="4 4"
          opacity="0.35"
        />
        {months.map((m, i) => (
          <text
            key={m}
            x={pad + i * step}
            y={h + 18}
            textAnchor="middle"
            className="sub-chart__axis-label"
          >
            {m}
          </text>
        ))}
      </svg>
      <div className="sub-chart__milestone" style={{ left: `${((milestoneX / w) * 100).toFixed(1)}%` }}>
        <span className="sub-chart__milestone-tag">✦ MILESTONE SEP 15</span>
        <small>AI Launch</small>
      </div>
      <ul className="sub-chart__legend">
        <li>
          <i className="sub-chart__dot sub-chart__dot--premium" />
          Active Premium (4,820)
        </li>
        <li>
          <i className="sub-chart__dot sub-chart__dot--free" />
          Active Free (13,630)
        </li>
        <li>
          <i className="sub-chart__dot sub-chart__dot--trial" />
          New Trials (412)
        </li>
      </ul>
      <p className="sub-chart__retention">Cohort retention 94.2%</p>
    </div>
  );
}
