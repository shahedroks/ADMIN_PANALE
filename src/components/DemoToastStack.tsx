import { useI18n } from "@/i18n";
import { useDemoStore } from "@/store/demoStore";
import "@/styles/toast.css";

export function DemoToastStack() {
  const { t } = useI18n();
  const { toasts, dismissToast } = useDemoStore();

  if (toasts.length === 0) return null;

  return (
    <div className="demo-toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`demo-toast demo-toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => dismissToast(toast.id)} aria-label={t("toast.dismiss")}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
