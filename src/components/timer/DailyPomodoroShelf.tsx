"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getTodayCompletedFocusCount } from "@/lib/db/queries";
import styles from "./daily-pomodoro-shelf.module.scss";

export function DailyPomodoroShelf() {
  const count =
    useLiveQuery(() => getTodayCompletedFocusCount(), []) ?? 0;

  const dots = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={styles.wrap} aria-live="polite" aria-atomic="true">
      <div
        className={styles.track}
        role="group"
        aria-label={`Completed focus sessions today: ${count}`}
      >
        {dots.map((i) => (
          <span key={i} className={styles.dot} title="Completed pomodoro" />
        ))}
      </div>
    </div>
  );
}
