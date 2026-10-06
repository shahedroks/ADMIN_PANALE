type IconProps = { className?: string };

/** Dashboard — Matches and Chats (overlapping bubbles) */
export function DashChatIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden>
      <path
        fill="#416900"
        opacity="0.45"
        d="M15.25 2.5H8.75A2.25 2.25 0 0 0 6.5 4.75V8.5a2.25 2.25 0 0 0 2.25 2.25h.65l1.35 1.65V10.75H15.25A2.25 2.25 0 0 0 17.5 8.5V4.75A2.25 2.25 0 0 0 15.25 2.5Z"
      />
      <path
        fill="#416900"
        d="M13.5 5H5.75A2.25 2.25 0 0 0 3.5 7.25v4.75a2.25 2.25 0 0 0 2.25 2.25h1.55l2.05 2.5V14.25h4.15A2.25 2.25 0 0 0 15.75 12V7.25A2.25 2.25 0 0 0 13.5 5Z"
      />
    </svg>
  );
}

/** Dashboard — Open Reports */
export function DashFlagIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 15 17" aria-hidden>
      <path
        fill="#ba1a1a"
        d="M3.1 1.25a.85.85 0 0 0-.85.85v12.65a.85.85 0 0 0 1.7 0V10.35h7.45c.55 0 1.05-.32 1.28-.82l1.48-2.96a1.35 1.35 0 0 0-1.2-1.94H3.95V2.1a.85.85 0 0 0-.85-.85Z"
      />
    </svg>
  );
}

/** Dashboard — Listed Items (inventory tray) */
export function DashBoxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden>
      <path
        fill="#0d3b2e"
        d="M4.25 7.25h11.5v9a1.35 1.35 0 0 1-1.35 1.35H5.6a1.35 1.35 0 0 1-1.35-1.35v-9ZM6.85 4.1h6.3l.95 2.4H5.9l.95-2.4ZM8.15 11.1h3.7v1.05h-3.7V11.1Z"
      />
    </svg>
  );
}

/** Dashboard — Active Users (3-person group) */
export function DashUsersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 12" aria-hidden>
      <path
        fill="#3c6658"
        d="M5.8 2.35a2.05 2.05 0 1 1 0 4.1 2.05 2.05 0 0 1 0-4.1ZM1.2 11c0-2.15 1.95-3.4 4.35-3.4s4.35 1.25 4.35 3.4H1.2ZM11.2 1.85a2.45 2.45 0 1 1 0 4.9 2.45 2.45 0 0 1 0-4.9ZM6.15 11c0-2.55 2.35-3.95 5.2-3.95s5.2 1.4 5.2 3.95H6.15ZM17.05 2.65a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7ZM13.35 11c0-1.95 1.55-3.25 3.45-3.25s3.45 1.3 3.45 3.25h-6.9Z"
      />
    </svg>
  );
}

/** Reports — Active Incidents (outline shield) */
export function ReportShieldOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 22" aria-hidden>
      <path
        fill="none"
        stroke="#00241a"
        strokeWidth="1.45"
        strokeLinejoin="round"
        d="M10 2.25 3.25 4.85v6.05c0 4.55 3.15 8.65 6.75 10.05 3.6-1.4 6.75-5.5 6.75-10.05V4.85L10 2.25Z"
      />
    </svg>
  );
}

/** Reports — High Urgency (outline flag) */
export function ReportFlagOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 15 17" aria-hidden>
      <path
        fill="none"
        stroke="#ba1a1a"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.35 1.5v14M3.35 2.35h7.55c.75 0 1.43-.44 1.74-1.12l1.36-2.72a1.25 1.25 0 0 0-1.12-1.8H3.35"
      />
    </svg>
  );
}

/** Reports — Avg Resolution Time (outline clock) */
export function ReportClockOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10.5" r="7.25" fill="none" stroke="#00241a" strokeWidth="1.45" />
      <path
        fill="none"
        stroke="#00241a"
        strokeWidth="1.45"
        strokeLinecap="round"
        d="M10 6.75V10.5l2.65 1.65M6.5 2.75h7"
      />
    </svg>
  );
}

/** Reports — Clean Trades (outline leaf) */
export function ReportLeafOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="#416900"
        strokeWidth="1.45"
        strokeLinejoin="round"
        d="M10 17.25s5.75-3.65 5.75-9.1C15.75 4.85 10 2.75 10 2.75S4.25 4.85 4.25 8.15c0 5.45 5.75 9.1 5.75 9.1Z"
      />
      <path
        fill="none"
        stroke="#416900"
        strokeWidth="1.35"
        strokeLinecap="round"
        d="M10 17V8.25"
      />
    </svg>
  );
}

/** Users — network members (outline duo) */
export function UserMembersOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 12" aria-hidden>
      <circle cx="7.2" cy="3.4" r="2.15" fill="none" stroke="#00241a" strokeWidth="1.35" />
      <path
        fill="none"
        stroke="#00241a"
        strokeWidth="1.35"
        strokeLinecap="round"
        d="M2.4 11c0-2.35 2.05-3.75 4.55-3.75S11.55 8.65 11.55 11"
      />
      <circle cx="14.6" cy="3.95" r="2.45" fill="none" stroke="#00241a" strokeWidth="1.35" />
      <path
        fill="none"
        stroke="#00241a"
        strokeWidth="1.35"
        strokeLinecap="round"
        d="M8.6 11c0-2.75 2.35-4.15 6-4.15s6 1.4 6 4.15"
      />
    </svg>
  );
}

/** Users — verified trust (seal + shield + check) */
export function UserTrustSealIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 22 21" aria-hidden>
      <circle
        cx="11"
        cy="10.5"
        r="9.35"
        fill="none"
        stroke="#416900"
        strokeWidth="1"
        strokeDasharray="2.4 2.2"
      />
      <path
        fill="none"
        stroke="#416900"
        strokeWidth="1.35"
        strokeLinejoin="round"
        d="M11 3.15 5.35 5.55v4.65c0 3.45 2.15 6.65 5.65 8 3.5-1.35 5.65-4.55 5.65-8V5.55L11 3.15Z"
      />
      <path
        fill="none"
        stroke="#416900"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.15 10.35 10 12.1l4.05-3.65"
      />
    </svg>
  );
}

/** Users — active restrictions (outline shield) */
export function UserShieldOutlineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 20" aria-hidden>
      <path
        fill="none"
        stroke="#414845"
        strokeWidth="1.4"
        strokeLinejoin="round"
        d="M8 1.65 2.65 4.05v5.05c0 3.65 2.25 7.05 5.35 8.15 3.1-1.1 5.35-4.5 5.35-8.15V4.05L8 1.65Z"
      />
    </svg>
  );
}

/** Users — flagged incidents (target / bullseye) */
export function UserTargetIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 22" aria-hidden>
      <circle cx="10" cy="12" r="7.35" fill="none" stroke="#ba1a1a" strokeWidth="1.4" />
      <circle cx="10" cy="12" r="3.65" fill="none" stroke="#ba1a1a" strokeWidth="1.4" />
      <circle cx="10" cy="12" r="1.15" fill="#ba1a1a" />
    </svg>
  );
}

/** Plans — Paid Subscribers (price tag) */
export function PlanPriceTagIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 19 19" aria-hidden>
      <path
        fill="#00241a"
        d="M2.75 2.25h7.85l3.65 3.65V16.5H2.75V2.25Zm5.55 2.05v4.35h4.35L8.3 4.3ZM6.35 11.65a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z"
      />
    </svg>
  );
}

/** Plans — Active MRR (banknote) */
export function PlanBanknoteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 21 15" aria-hidden>
      <rect
        x="1.1"
        y="1.1"
        width="18.8"
        height="12.8"
        rx="2"
        fill="none"
        stroke="#457000"
        strokeWidth="1.35"
      />
      <circle cx="10.5" cy="7.5" r="2.65" fill="none" stroke="#457000" strokeWidth="1.25" />
      <path stroke="#457000" strokeWidth="1.15" d="M1.1 5.2h18.8M1.1 9.8h18.8" />
    </svg>
  );
}

/** Plans — Total Circulating (recycle) */
export function PlanRecycleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="#00241a"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.2 3.2 5.4 6.1H8.9l1.2-2.2a5.2 5.2 0 0 1 7.1 1.9M12.8 16.8l1.8-2.9H11.1l-1.2 2.2a5.2 5.2 0 0 1-7.1-1.9M3.5 10.5h3.5l-.65 2.85a5.2 5.2 0 0 0 8.35 2.35M16.5 9.5H13l.65-2.85a5.2 5.2 0 0 0-8.35-2.35"
      />
    </svg>
  );
}

/** Plans — Paid Conversion (verified badge) */
export function PlanVerifiedBadgeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 21 20" aria-hidden>
      <path
        fill="#042014"
        fillRule="evenodd"
        d="M10.5 1.15 11.72 3.95h2.98l-2.41 1.75.92 2.98-2.49-1.81-2.49 1.81.92-2.98-2.41-1.75h2.98L10.5 1.15Zm-.35 8.05 1.55 1.55 3.45-3.45 1.25 1.25-4.7 4.7-2.8-2.8 1.25-1.25Z"
      />
    </svg>
  );
}
