import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/routes";
import { AppProvider } from "@/store";
import { DemoProvider } from "@/store/demoStore";
import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <DemoProvider>
        <AppRouter />
      </DemoProvider>
    </AppProvider>
  </StrictMode>,
);
