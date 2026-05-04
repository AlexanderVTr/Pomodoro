"use client";

import type { SessionType } from "@/lib/db/schema";
import { useTimerStore } from "@/lib/timer/timer-store";
import styles from "./session-tabs.module.scss";

const tabs: { id: SessionType; label: string }[] = [
  { id: "focus", label: "Pomodoro" },
  { id: "shortBreak", label: "Short break" },
  { id: "longBreak", label: "Long break" },
];

export function SessionTabs() {
  const sessionType = useTimerStore((s) => s.sessionType);
  const isRunning = useTimerStore((s) => s.isRunning);
  const setSessionType = useTimerStore((s) => s.setSessionType);

  return (
    <div className={styles.row} role="tablist" aria-label="Session type">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={sessionType === t.id}
          className={`${styles.tab} ${sessionType === t.id ? styles.active : ""} ${isRunning ? styles.disabled : ""}`}
          disabled={isRunning}
          onClick={() => setSessionType(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
