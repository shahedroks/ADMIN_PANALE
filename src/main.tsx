import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/routes";
import { AppProvider } from "@/store";
import { ToastProvider } from "@/store/toastStore";
import "@/styles/swapit-tokens.css";
import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AppProvider>
  </StrictMode>,
);
