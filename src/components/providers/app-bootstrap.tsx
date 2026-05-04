"use client";

import { useEffect } from "react";
import { ensureDefaultSettings } from "@/lib/db/client";
import { getSettings } from "@/lib/db/queries";
import {
  enableTimerPersistence,
  useTimerStore,
} from "@/lib/timer/timer-store";
import { useTimerTick } from "@/lib/timer/use-timer-tick";
import { useThemeStore } from "@/lib/theme/theme-store";

export function AppBootstrap() {
  useTimerTick();

  useEffect(() => {
    void (async () => {
      await ensureDefaultSettings();
      const settings = await getSettings();
      useTimerStore.getState().setSettings(settings);
      useTimerStore.getState().hydrateFromStorage();
      enableTimerPersistence();
      useThemeStore.getState().setPreference(settings.theme);
    })();
  }, []);

  return null;
}
