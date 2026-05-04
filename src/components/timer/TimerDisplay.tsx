"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { formatSeconds } from "@/lib/utils/format-time";
import { plannedDurationSeconds } from "@/lib/timer/timer-logic";
import { useTimerStore } from "@/lib/timer/timer-store";
import { ProgressRing } from "./ProgressRing";
import styles from "./timer-display.module.scss";

export function TimerDisplay() {
  const [now, setNow] = useState(() => Date.now());
  const sessionType = useTimerStore((s) => s.sessionType);
  const isRunning = useTimerStore((s) => s.isRunning);
  const endsAt = useTimerStore((s) => s.endsAt);
  const pausedRemainingSec = useTimerStore((s) => s.pausedRemainingSec);
  const settings = useTimerStore((s) => s.settings);

  useEffect(() => {
    if (!isRunning) return;
    const kick = setTimeout(() => {
      setNow(Date.now());
    }, 0);
    const id = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => {
      clearTimeout(kick);
      clearInterval(id);
    };
  }, [isRunning]);

  const planned = plannedDurationSeconds(sessionType, settings);

  let remainingSec: number;
  let progress: number;
  if (isRunning && endsAt) {
    remainingSec = Math.max(0, Math.ceil((endsAt - now) / 1000));
    progress = 1 - remainingSec / planned;
  } else {
    remainingSec = pausedRemainingSec ?? planned;
    progress = 1 - remainingSec / planned;
  }

  const label =
    sessionType === "focus"
      ? "Focus time remaining"
      : sessionType === "shortBreak"
        ? "Short break remaining"
        : "Long break remaining";

  const ringPx = 280;

  return (
    <div
      className={styles.wrap}
      style={{ "--timer-ring": `${ringPx}px` } as CSSProperties}
    >
      <ProgressRing
        size={ringPx}
        progress={progress}
        aria-label={label}
      />
      <div className={styles.inner}>
        <div
          className={styles.time}
          aria-live="polite"
          aria-label={`${label}, ${formatSeconds(remainingSec)}`}
        >
          {formatSeconds(remainingSec)}
        </div>
      </div>
    </div>
  );
}
