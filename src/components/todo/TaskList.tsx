"use client";

import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Task } from "@/lib/db/schema";
import { tasksLiveQuery } from "@/lib/db/queries";
import { useTimerStore } from "@/lib/timer/timer-store";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import styles from "./task-list.module.scss";

const EMPTY_TASKS: Task[] = [];

export function TaskList() {
  const tasks = useLiveQuery(() => tasksLiveQuery(), []) ?? EMPTY_TASKS;
  const activeTaskId = useTimerStore((s) => s.activeTaskId);
  const setActiveTaskId = useTimerStore((s) => s.setActiveTaskId);

  useEffect(() => {
    if (activeTaskId) return;
    const firstOpen = tasks.find((t) => !t.isCompleted);
    if (firstOpen) {
      setActiveTaskId(firstOpen.id);
    }
  }, [tasks, activeTaskId, setActiveTaskId]);

  return (
    <section>
      <h2 className={styles.h2}>Tasks</h2>
      <TaskForm />
      <div className={styles.list}>
        {tasks.map((t, i) => (
          <TaskItem key={t.id} task={t} index={i} total={tasks.length} />
        ))}
      </div>
    </section>
  );
}
