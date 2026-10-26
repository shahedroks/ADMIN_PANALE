import { useI18n } from "@/i18n";
import "@/styles/language-switcher.css";

type LanguageSwitcherProps = {
  variant?: "topbar" | "settings";
};

export function LanguageSwitcher({ variant = "topbar" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={`lang-switch lang-switch--${variant}`}
      role="group"
      aria-label={t("language.ariaLabel")}
    >
      <button
        type="button"
        className={locale === "en" ? "lang-switch__btn is-active" : "lang-switch__btn"}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        {t("language.english")}
      </button>
      <button
        type="button"
        className={locale === "ar" ? "lang-switch__btn is-active" : "lang-switch__btn"}
        onClick={() => setLocale("ar")}
        aria-pressed={locale === "ar"}
      >
        {t("language.arabic")}
      </button>
    </div>
  );
}
