"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { formatSeconds } from "@/lib/utils/format-time";
import { plannedDurationSeconds } from "@/lib/timer/timer-logic";
import { useTimerStore } from "@/lib/timer/timer-store";
import { Pause, Play, SkipForward } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import styles from "./timer-display.module.scss";

export function TimerDisplay() {
  const [now, setNow] = useState(() => Date.now());
  const sessionType = useTimerStore((s) => s.sessionType);
  const isRunning = useTimerStore((s) => s.isRunning);
  const endsAt = useTimerStore((s) => s.endsAt);
  const pausedRemainingSec = useTimerStore((s) => s.pausedRemainingSec);
  const settings = useTimerStore((s) => s.settings);
  const toggle = useTimerStore((s) => s.toggle);
  const skip = useTimerStore((s) => s.skip);

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
  const toggleLabel = isRunning ? "Pause timer" : "Start timer";

  return (
    <div
      className={styles.wrap}
      style={{ "--timer-ring": `${ringPx}px` } as CSSProperties}
    >
      <div className={styles.disc}>
        <ProgressRing size={ringPx} progress={progress} decorative />
        <button
          type="button"
          className={styles.discToggle}
          tabIndex={-1}
          aria-hidden
          onClick={() => toggle()}
        />
        <div className={styles.overlay}>
          <div className={styles.timeSlot}>
            <div
              className={styles.time}
              aria-live="polite"
              aria-label={`${label}, ${formatSeconds(remainingSec)}`}
            >
              {formatSeconds(remainingSec)}
            </div>
          </div>
        </div>
        <div className={styles.bottomDock}>
          <button
            type="button"
            className={styles.toolBtnMain}
            aria-label={toggleLabel}
            onClick={() => toggle()}
          >
            {isRunning ? (
              <Pause
                className={styles.iconMain}
                aria-hidden
                strokeWidth={2.25}
                absoluteStrokeWidth
              />
            ) : (
              <Play
                className={styles.iconMain}
                aria-hidden
                strokeWidth={2.25}
                absoluteStrokeWidth
              />
            )}
          </button>
          <button
            type="button"
            className={styles.toolBtnSkip}
            aria-label="Skip session"
            onClick={() => skip()}
          >
            <SkipForward
              className={styles.iconSkip}
              aria-hidden
              strokeWidth={2}
              absoluteStrokeWidth
            />
          </button>
        </div>
      </div>
    </div>
  );
}
