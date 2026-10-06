import { figmaStroke } from "@/components/icons/strokeProps";
import type { UserActionLogEntry } from "@/features/user-detail/types";

type IconProps = {
  className?: string;
};

export function UserDetailReportFlagIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3.25 1.5v13M3.25 2.75h7.5l-1.625 2.125L11.875 7.25H3.25"
        {...figmaStroke}
      />
    </svg>
  );
}

export function UserDetailListedFolderIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M2.25 5.25h5.25L8.5 7.25h5.75v6.75H2.25V5.25Z"
        {...figmaStroke}
      />
      <path d="M2.25 5.25V4.25c0-.55.45-1 1-1h3.75L8.5 5.25" {...figmaStroke} />
    </svg>
  );
}

export function UserDetailActionClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="5.5" {...figmaStroke} />
      <path d="M8 4.75V8l2.25 1.5" {...figmaStroke} />
    </svg>
  );
}

export function UserDetailColumnIcon({
  type,
}: {
  type: "report" | "items" | "actions";
}) {
  if (type === "report") {
    return <UserDetailReportFlagIcon className="user-detail-col-icon user-detail-col-icon--report" />;
  }
  if (type === "items") {
    return <UserDetailListedFolderIcon className="user-detail-col-icon user-detail-col-icon--items" />;
  }
  return <UserDetailActionClockIcon className="user-detail-col-icon user-detail-col-icon--actions" />;
}

export function UserDetailActionLogMarker({
  tone,
}: {
  tone: UserActionLogEntry["tone"];
}) {
  return (
    <span className={`user-detail-action-marker user-detail-action-marker--${tone}`} aria-hidden>
      {tone === "review" && (
        <svg viewBox="0 0 10 10">
          <path d="M1.5 2.5h7v5H1.5v-5Zm1.5 1.2 2 1.4 2.5-1.8" {...figmaStroke} strokeWidth={1.1} />
        </svg>
      )}
      {tone === "flag" && (
        <svg viewBox="0 0 10 10">
          <path d="M2 1.5v7M2 2.5h4.2L5.5 4.5 7 3.5H2" {...figmaStroke} strokeWidth={1.1} />
        </svg>
      )}
      {tone === "verify" && (
        <svg viewBox="0 0 10 10">
          <path
            d="M5 1.2 1.8 2.4v2.4c0 1.8 1.3 3.5 3.2 4 1.9-.5 3.2-2.2 3.2-4V2.4L5 1.2Zm-.8 4.2 1.4 1.4 2.4-2.5"
            {...figmaStroke}
            strokeWidth={1.1}
          />
        </svg>
      )}
      {tone === "system" && (
        <svg viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="2.2" {...figmaStroke} strokeWidth={1.1} />
        </svg>
      )}
    </span>
  );
}

export function UserDetailShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path d="M8 1.5 2.5 3.8v4.1c0 3.1 2.1 5.9 5.5 7.1 3.4-1.2 5.5-4 5.5-7.1V3.8L8 1.5Z" {...figmaStroke} />
      <path d="M5.5 8h5" {...figmaStroke} />
    </svg>
  );
}

export function UserDetailSaveIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path d="M3 2.5h8l2 2v9H3v-11Zm2 0v4h5v-4M5.5 13v-4h5v4" {...figmaStroke} />
    </svg>
  );
}
