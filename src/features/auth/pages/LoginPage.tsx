import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginHeroPanel } from "@/features/auth/components/LoginHeroPanel";
import { usePageTitle } from "@/hooks/usePageTitle";
import "@/features/auth/styles/login-page.css";

export function LoginPage() {
  usePageTitle("SWAP IT — Admin Login");
  return (
    <div className="login-page login-page--enter">
      <div className="login-card login-card--enter">
        <LoginHeroPanel />
        <LoginForm />
      </div>
    </div>
  );
}
