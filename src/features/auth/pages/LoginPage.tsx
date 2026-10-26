import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginHeroPanel } from "@/features/auth/components/LoginHeroPanel";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useI18n } from "@/i18n";
import "@/features/auth/styles/login-page.css";

export function LoginPage() {
  const { t } = useI18n();
  usePageTitle(t("documentTitle.login"));
  return (
    <div className="login-page login-page--enter">
      <div className="login-page__lang">
        <LanguageSwitcher />
      </div>
      <div className="login-card login-card--enter">
        <LoginHeroPanel />
        <LoginForm />
      </div>
    </div>
  );
}
