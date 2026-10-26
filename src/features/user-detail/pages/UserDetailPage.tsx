import { useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UserDetailColumns } from "@/features/user-detail/components/UserDetailColumns";
import { UserDetailMemberPanel } from "@/features/user-detail/components/UserDetailMemberPanel";
import { UserDetailSummary } from "@/features/user-detail/components/UserDetailSummary";
import { useSwapperMemberDetail } from "@/hooks/useFirestoreAdminData";
import { useI18n } from "@/i18n";
import { useDemoStore } from "@/store/demoStore";
import "@/features/dashboard/styles/dashboard.css";
import "@/features/user-detail/styles/user-detail.css";

const memberPanelValues = new Set(["reports", "items", "log"]);

export function UserDetailPage() {
  const { t } = useI18n();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const panelParam = searchParams.get("panel");
  const activePanel =
    panelParam && memberPanelValues.has(panelParam)
      ? (panelParam as "reports" | "items" | "log")
      : null;

  const {
    member,
    profile,
    userDoc,
    restrictionSettings,
    loading,
    error,
    restrictMember,
    banMember,
    saveRestrictionSettings,
  } = useSwapperMemberDetail(userId);
  const { pushToast } = useDemoStore();

  useEffect(() => {
    if (!activePanel) return;
    const el = document.getElementById("member-panel");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activePanel, profile?.routeId]);

  const runAction = async (label: string, action: () => Promise<void>) => {
    try {
      await action();
      pushToast(label, "success");
    } catch (e) {
      pushToast(
        e instanceof Error ? e.message : t("userDetail.toast.failed", { action: label }),
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="dash-page user-detail-page">
        <p>{t("userDetail.loading")}</p>
      </div>
    );
  }

  if (!member || !profile || !restrictionSettings) {
    return (
      <div className="dash-page user-detail-page">
        <Link to="/users" className="user-detail-back">
          {t("userDetail.back")}
        </Link>
        <p>{error ?? t("userDetail.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="dash-page user-detail-page">
      <header className="user-detail-header">
        <Link to="/users" className="user-detail-back">
          {t("userDetail.back")}
        </Link>
        <div className="user-detail-header__row">
          <div className="user-detail-header__title">
            <h1>{t("userDetail.title")}</h1>
            {profile.trusted && (
              <span className="user-detail-pill user-detail-pill--trusted">{t("userDetail.trusted")}</span>
            )}
            <span className="user-detail-pill user-detail-pill--code">{profile.userCode}</span>
            <span className="user-detail-header__name">{profile.name}</span>
          </div>
          <div className="user-detail-header__actions">
            <button
              type="button"
              className="user-detail-action user-detail-action--warn"
              onClick={() =>
                runAction(t("userDetail.toast.restricted"), () => restrictMember(member.id))
              }
              disabled={member.status === "banned"}
            >
              {t("userDetail.restrict")}
            </button>
            <button
              type="button"
              className="user-detail-action user-detail-action--ban"
              onClick={() => runAction(t("userDetail.toast.banned"), () => banMember(member.id))}
              disabled={member.status === "banned"}
            >
              {t("userDetail.ban")}
            </button>
          </div>
        </div>
      </header>

      <UserDetailSummary profile={profile} />
      <UserDetailColumns
        profile={profile}
        userId={member.id}
        memberStatus={member.status}
        restrictionSettings={restrictionSettings}
        onSaveSettings={async (settings) => {
          try {
            await saveRestrictionSettings(settings);
            pushToast(t("userDetail.toast.saved"), "success");
          } catch (e) {
            pushToast(
              e instanceof Error ? e.message : t("userDetail.toast.saveFailed"),
              "error",
            );
          }
        }}
      />

      {activePanel && userDoc && (
        <UserDetailMemberPanel
          panel={activePanel}
          userId={member.id}
          member={member}
          profile={profile}
          userDoc={userDoc}
          onClose={() => navigate(`/users/${member.id}`, { replace: true })}
        />
      )}
    </div>
  );
}
