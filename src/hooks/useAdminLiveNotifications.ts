import { useCallback, useEffect, useMemo, useState } from "react";

import {
  isAdminNotificationSoundEnabled,
  loadReadNotificationIds,
  saveReadNotificationIds,
} from "@/lib/adminNotificationPrefs";
import { playAdminNotificationSound } from "@/lib/playAdminNotificationSound";
import {
  subscribeAdminLiveNotifications,
  type AdminLiveNotification,
} from "@/services/firestore/adminLiveNotificationsService";
import { useToast } from "@/store/toastStore";

export function useAdminLiveNotifications() {
  const { pushToast } = useToast();
  const [notifications, setNotifications] = useState<AdminLiveNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadNotificationIds());

  useEffect(() => {
    const unsub = subscribeAdminLiveNotifications({
      onItems: setNotifications,
      onAdded: (item) => {
        if (!isAdminNotificationSoundEnabled()) return;
        playAdminNotificationSound();
        pushToast(item.title, "info");
      },
    });
    return unsub;
  }, [pushToast]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds],
  );

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const n of notifications) next.add(n.id);
      saveReadNotificationIds(next);
      return next;
    });
  }, [notifications]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadNotificationIds(next);
      return next;
    });
  }, []);

  return { notifications, unreadCount, markAllRead, markRead };
}
