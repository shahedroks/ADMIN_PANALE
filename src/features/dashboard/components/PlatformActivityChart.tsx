import { useMemo, useState } from "react";
import type { ActivityPoint, ActivitySummary } from "@/features/dashboard/data/dashboardData";
import { emptyActivitySummary } from "@/features/dashboard/data/dashboardData";

type PlatformActivityChartProps = {
  data: ActivityPoint[];
  summary?: ActivitySummary;
  onExport?: () => void;
};

const W = 568;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 28, left: 36 };

function scaleY(value: number, min: number, max: number): number {
  const span = max - min || 1;
  const inner = H - PAD.top - PAD.bottom;
  return PAD.top + inner - ((value - min) / span) * inner;
}

function scaleX(index: number, count: number): number {
  const inner = W - PAD.left - PAD.right;
  return PAD.left + (index / Math.max(count - 1, 1)) * inner;
}

function toAreaPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const baseY = H - PAD.bottom;
  return `${line} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
}

function toLinePath(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function niceMax(value: number): number {
  if (value <= 0) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

function buildYTicks(minY: number, maxY: number): number[] {
  const span = maxY - minY;
  const step = niceMax(span / 4);
  const ticks: number[] = [];
  for (let t = minY; t <= maxY; t += step) {
    ticks.push(t);
  }
  if (ticks.length < 2) {
    ticks.push(maxY);
  }
  return ticks;
}

export function PlatformActivityChart({
  data,
  summary = emptyActivitySummary,
  onExport,
}: PlatformActivityChartProps) {
  const [hoverIndex, setHoverIndex] = useState(() => Math.max(0, data.length - 1));

  const { userPoints, itemPoints, yTicks, minY, maxY } = useMemo(() => {
    const maxVal = Math.max(0, ...data.flatMap((d) => [d.users, d.items]));
    const minY = 0;
    const maxY = niceMax(maxVal);
    const yTicks = buildYTicks(minY, maxY);

    const userPoints = data.map((d, i) => ({
      x: scaleX(i, data.length),
      y: scaleY(d.users, minY, maxY),
      raw: d,
    }));
    const itemPoints = data.map((d, i) => ({
      x: scaleX(i, data.length),
      y: scaleY(d.items, minY, maxY),
      raw: d,
    }));

    return { userPoints, itemPoints, yTicks, minY, maxY };
  }, [data]);

  const safeHover = Math.min(hoverIndex, data.length - 1);
  const active = data[safeHover];

  return (
    <section className="dash-chart-card">
      <div className="dash-chart-card__head">
        <div>
          <h2>Platform activity</h2>
          <p>User sessions and inventory listings across the ecosystem.</p>
        </div>
        <div className="dash-chart-card__controls">
          <button type="button" className="dash-chart-card__select">
            Last 7 days
            <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden>
              <path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" />
            </svg>
          </button>
          <button type="button" className="dash-chart-card__export" onClick={onExport}>
            Export
          </button>
        </div>
      </div>

      <div className="dash-chart-card__legend">
        <span>
          <i className="dash-chart-card__dot dash-chart-card__dot--users" />
          Active users
        </span>
        <span>
          <i className="dash-chart-card__dot dash-chart-card__dot--items" />
          Listed items
        </span>
      </div>

      <div className="dash-chart-card__canvas">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="dash-chart-card__svg"
          role="img"
          aria-label="Platform activity chart for the last 7 days"
        >
          {yTicks.map((tick) => {
            const y = scaleY(tick, minY, maxY);
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  className="dash-chart-card__grid"
                />
                <text x={PAD.left - 8} y={y + 4} className="dash-chart-card__ylabel">
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </text>
              </g>
            );
          })}

          <path d={toAreaPath(itemPoints)} className="dash-chart-card__area dash-chart-card__area--items" />
          <path d={toAreaPath(userPoints)} className="dash-chart-card__area dash-chart-card__area--users" />
          <path d={toLinePath(itemPoints)} className="dash-chart-card__line dash-chart-card__line--items" />
          <path d={toLinePath(userPoints)} className="dash-chart-card__line dash-chart-card__line--users" />

          {userPoints.map((p, i) => (
            <g key={`${data[i].day}-${i}`}>
              <rect
                x={p.x - 24}
                y={PAD.top}
                width={48}
                height={H - PAD.top - PAD.bottom}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
              <text x={p.x} y={H - 8} textAnchor="middle" className="dash-chart-card__xlabel">
                {data[i].day}
              </text>
            </g>
          ))}

          {safeHover >= 0 && userPoints[safeHover] && (
            <>
              <line
                x1={userPoints[safeHover].x}
                x2={userPoints[safeHover].x}
                y1={PAD.top}
                y2={H - PAD.bottom}
                className="dash-chart-card__cursor"
              />
              <circle
                cx={userPoints[safeHover].x}
                cy={userPoints[safeHover].y}
                r="4"
                className="dash-chart-card__point dash-chart-card__point--users"
              />
              <circle
                cx={itemPoints[safeHover].x}
                cy={itemPoints[safeHover].y}
                r="4"
                className="dash-chart-card__point dash-chart-card__point--items"
              />
            </>
          )}
        </svg>

        {active && (
          <div
            className="dash-chart-card__tooltip"
            style={{ left: `${((safeHover + 0.5) / data.length) * 100}%` }}
          >
            <span className="dash-chart-card__tooltip-kicker">
              {active.day.toUpperCase()} • LIVE SYNC
            </span>
            <strong>{active.users.toLocaleString()} Active Users</strong>
            <span>{active.items.toLocaleString()} New Listings</span>
          </div>
        )}
      </div>

      <div className="dash-chart-card__footer">
        <div>
          <span>Daily Average Active</span>
          <strong>{summary.dailyAvgActive}</strong>
        </div>
        <div>
          <span>Item Match Conversion</span>
          <strong className="dash-chart-card__highlight">{summary.matchConversion}</strong>
        </div>
        <div>
          <span>Avg listings/member</span>
          <strong>{summary.avgListingsPerMember}</strong>
        </div>
      </div>
    </section>
  );
}
