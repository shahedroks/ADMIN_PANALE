import { useCallback, useEffect, useState } from "react";

import type { AdminMember } from "@/features/settings/data/settingsData";
import { callUpdateAppSettings } from "@/lib/callableFunctions";
import { fetchAdminTeamMembers } from "@/services/firestore/adminTeamFirestoreService";
import {
  fetchAppSettings,
  saveAppSettingsFirestore,
  type AppSettings,
} from "@/services/firestore/appSettingsFirestoreService";

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSettings(await fetchAppSettings());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (patch: Partial<AppSettings>) => {
      try {
        await callUpdateAppSettings({ settings: patch });
      } catch {
        await saveAppSettingsFirestore(patch);
      }
      await reload();
    },
    [reload],
  );

  return { settings, loading, error, reload, save };
}

export function useAdminTeam() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchAdminTeamMembers()
      .then((team) => {
        if (!cancelled) setMembers(team);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { members, loading };
}
