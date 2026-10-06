import {
  ReportClockOutlineIcon,
  ReportFlagOutlineIcon,
  ReportLeafOutlineIcon,
  ReportShieldOutlineIcon,
} from "@/components/kpi-icons/FigmaMetricIcons";

type GlyphProps = {
  className?: string;
};

export function ReportTabFlagIcon({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 10 12" width="10" height="12" aria-hidden>
      <path
        fill="currentColor"
        d="M1.25 1a.75.75 0 0 0-.75.75v8.5a.75.75 0 0 0 1.5 0V7.4h5.2c.45 0 .86-.26 1.05-.67l1.03-2.06a1 1 0 0 0-.89-1.43H2V1.75A.75.75 0 0 0 1.25 1Z"
      />
    </svg>
  );
}

export function ReportTabClockIcon({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="12" height="12" aria-hidden>
      <path
        fill="currentColor"
        d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm-.75 2.5a.75.75 0 0 1 1.5 0v2.65l1.5 1.05a.75.75 0 1 1-.85 1.24l-1.82-1.28A.75.75 0 0 1 5.25 6V3.5Z"
      />
    </svg>
  );
}

export function ReportKpiShieldIcon({ className }: GlyphProps) {
  return <ReportShieldOutlineIcon className={className} />;
}

export function ReportKpiFlagIcon({ className }: GlyphProps) {
  return <ReportFlagOutlineIcon className={className} />;
}

export function ReportKpiTimerIcon({ className }: GlyphProps) {
  return <ReportClockOutlineIcon className={className} />;
}

export function ReportKpiLeafIcon({ className }: GlyphProps) {
  return <ReportLeafOutlineIcon className={className} />;
}
