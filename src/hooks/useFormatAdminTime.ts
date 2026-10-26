import { useCallback } from "react";

import { useI18n } from "@/i18n";

export function useFormatAdminTime() {
  const { t } = useI18n();

  return useCallback(
    (date: Date) => {
      const sec = Math.floor((Date.now() - date.getTime()) / 1000);
      if (sec < 60) return t("time.justNow");
      const min = Math.floor(sec / 60);
      if (min < 60) return t("time.minutesAgo", { count: min });
      const hr = Math.floor(min / 60);
      if (hr < 24) return t("time.hoursAgo", { count: hr });
      const days = Math.floor(hr / 24);
      return t("time.daysAgo", { count: days });
    },
    [t],
  );
}
