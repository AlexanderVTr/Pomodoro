"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/client";
import { useTimerStore } from "@/lib/timer/timer-store";
import styles from "./active-task-banner.module.scss";

export function ActiveTaskBanner() {
  const activeTaskId = useTimerStore((s) => s.activeTaskId);
  const sessionType = useTimerStore((s) => s.sessionType);

  const task = useLiveQuery(
    async () => {
      if (!activeTaskId) return undefined;
      return db.tasks.get(activeTaskId);
    },
    [activeTaskId]
  );

  if (!activeTaskId || !task) {
    return (
      <p className={styles.empty}>
        Select a task below to link it with your focus sessions.
      </p>
    );
  }

  const ratio = `${task.completedPomodoros} / ${task.estimatedPomodoros}`;

  return (
    <div className={styles.banner}>
      <p className={styles.title}>{task.title}</p>
      <p className={styles.meta}>
        {sessionType === "focus"
          ? `Pomodoros today on this task: ${ratio}`
          : `Next focus: ${task.title} (${ratio} pomodoros)`}
      </p>
    </div>
  );
}
