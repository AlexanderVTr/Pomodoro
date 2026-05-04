"use client";

import { useWakeLock } from "@/lib/wake-lock/use-wake-lock";
import { useTickingSound } from "@/lib/audio/use-ticking";
import { useTimerStore } from "@/lib/timer/timer-store";

export function TimerSideEffects() {
  const isRunning = useTimerStore((s) => s.isRunning);
  const sessionType = useTimerStore((s) => s.sessionType);
  const settings = useTimerStore((s) => s.settings);

  useWakeLock(isRunning && sessionType === "focus");
  useTickingSound(
    isRunning &&
      sessionType === "focus" &&
      settings.tickingSound === "tick",
    settings.tickingVolume
  );

  return null;
}
