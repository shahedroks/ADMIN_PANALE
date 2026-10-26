import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/routes";
import { I18nProvider } from "@/i18n";
import { AppProvider } from "@/store";
import { ToastProvider } from "@/store/toastStore";
import "@/styles/language-switcher.css";
import "@/styles/swapit-tokens.css";
import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <AppProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AppProvider>
    </I18nProvider>
  </StrictMode>,
);
