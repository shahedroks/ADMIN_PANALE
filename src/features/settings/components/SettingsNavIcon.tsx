import type { SettingsNavIconId } from "@/features/settings/data/settingsData";

type SettingsNavIconProps = {
  id: SettingsNavIconId;
  active?: boolean;
};

export function SettingsNavIcon({ id, active }: SettingsNavIconProps) {
  const fill = active ? "#acf847" : "#414845";

  switch (id) {
    case "general":
      return (
        <svg className="settings-subnav__icon" viewBox="0 0 16 16" aria-hidden>
          <path
            fill={fill}
            d="M2.75 5.5h4.85L8.6 7.5H13.5v6.75H2.75V5.5Zm0-2.25h4.1L8.35 5.5h5.15V4.75c0-.69-.56-1.25-1.25-1.25H3.5c-.69 0-1.25.56-1.25 1.25V5.5h.5Z"
          />
        </svg>
      );
    case "team":
      return (
        <svg className="settings-subnav__icon" viewBox="0 0 17 17" aria-hidden>
          <path
            fill={fill}
            d="M5.6 3.4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM1.5 14c0-2.2 1.85-3.5 4.1-3.5s4.1 1.3 4.1 3.5H1.5Zm6.2-9.1a2.45 2.45 0 1 1 0 4.9 2.45 2.45 0 0 1 0-4.9ZM4.5 14c0-2.55 2.35-3.95 5.2-3.95h.15c2.85 0 5.2 1.4 5.2 3.95H4.5Zm7.9-7.75a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7ZM11.2 14c0-1.85 1.55-3.1 3.45-3.1h.1c1.9 0 3.45 1.25 3.45 3.1h-7Z"
          />
        </svg>
      );
    case "security":
      return (
        <svg className="settings-subnav__icon" viewBox="0 0 12 14" aria-hidden>
          <path
            fill={fill}
            d="M6 1 2 3v4c0 2.75 1.75 5.15 4 6 2.25-.85 4-3.25 4-6V3L6 1Zm0 3.25a1.75 1.75 0 0 1 1.05 3.17v1.33a1.05 1.05 0 1 1-2.1 0V7.42A1.75 1.75 0 0 1 6 4.25Z"
          />
        </svg>
      );
  }
}

export function SettingsImpactLeafIcon() {
  return (
    <svg className="settings-impact__leaf" viewBox="0 0 13 13" aria-hidden>
      <path
        fill="#416900"
        d="M6.5 1.2C4.2 1.2 2.4 3 2.4 5.4c0 3.8 4.1 6.4 4.1 6.4s4.1-2.6 4.1-6.4c0-2.4-1.8-4.2-4.1-4.2Zm0 2.1a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7Z"
      />
    </svg>
  );
}

export function SettingsDownloadIcon() {
  return (
    <svg className="settings-download__icon" viewBox="0 0 12 12" aria-hidden>
      <path
        fill="currentColor"
        d="M6 1.5v5.2l1.8-1.8 1.05 1.05L6 9.85 3.15 6.95l1.05-1.05L5 6.7V1.5H6Zm-3.25 7h6.5V11H2.75V8.5Z"
      />
    </svg>
  );
}

export function SettingsPhoneIcon() {
  return (
    <svg className="settings-2fa__phone" viewBox="0 0 14 20" aria-hidden>
      <path
        fill="#00241a"
        d="M4.25 1.5h5.5a1.25 1.25 0 0 1 1.25 1.25v14.5A1.25 1.25 0 0 1 9.75 18.5h-5.5A1.25 1.25 0 0 1 3 17.25V2.75A1.25 1.25 0 0 1 4.25 1.5Zm2.75 14.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
      />
    </svg>
  );
}

export function SettingsInviteIcon() {
  return (
    <svg className="settings-btn__icon" viewBox="0 0 17 12" aria-hidden>
      <path
        fill="currentColor"
        d="M6.5 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM1.5 11c0-2.05 2.2-3.25 5-3.25s5 1.2 5 3.25H1.5ZM12.25 2.5h2v2h2v1.5h-2v2h-1.5v-2h-2V4.5h2v-2Z"
      />
    </svg>
  );
}
