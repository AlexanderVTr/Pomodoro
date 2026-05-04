"use client";

import { useState } from "react";
import type { Task } from "@/lib/db/schema";
import { deleteTask, reorderTasks, updateTask } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { useTimerStore } from "@/lib/timer/timer-store";
import styles from "./task-item.module.scss";

interface TaskItemProps {
  task: Task;
  index: number;
  total: number;
}

export function TaskItem({ task, index, total }: TaskItemProps) {
  const activeTaskId = useTimerStore((s) => s.activeTaskId);
  const setActiveTaskId = useTimerStore((s) => s.setActiveTaskId);
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);

  const isActive = activeTaskId === task.id;

  const displayTitle = editing ? titleDraft : task.title;

  const handleBlurTitle = () => {
    setEditing(false);
    if (titleDraft.trim() && titleDraft !== task.title) {
      void updateTask(task.id, { title: titleDraft });
    } else {
      setTitleDraft(task.title);
    }
  };

  const handleReorder = async (from: number, to: number) => {
    const ordered = await db.tasks.orderBy("order").toArray();
    const [moved] = ordered.splice(from, 1);
    ordered.splice(to, 0, moved);
    await reorderTasks(ordered.map((t) => t.id));
  };

  return (
    <div className={`${styles.row} ${isActive ? styles.active : ""}`}>
      <input
        className={styles.title}
        value={displayTitle}
        disabled={task.isCompleted}
        onFocus={() => {
          setEditing(true);
          setTitleDraft(task.title);
        }}
        onChange={(e) => setTitleDraft(e.target.value)}
        onBlur={handleBlurTitle}
        aria-label="Task title"
      />
      <input
        className={styles.est}
        type="number"
        min={1}
        max={99}
        value={task.estimatedPomodoros}
        disabled={task.isCompleted}
        title="Estimated pomodoros"
        aria-label="Estimated pomodoros"
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isFinite(v) || v < 1) return;
          void updateTask(task.id, { estimatedPomodoros: Math.min(99, v) });
        }}
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Mark complete"
          onClick={() =>
            void updateTask(task.id, { isCompleted: !task.isCompleted })
          }
        >
          {task.isCompleted ? "↩" : "✓"}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Select for timer"
          onClick={() => setActiveTaskId(task.id)}
        >
          ●
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Delete task"
          onClick={() => void deleteTask(task.id)}
        >
          ×
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          disabled={index === 0}
          aria-label="Move up"
          onClick={() => void handleReorder(index, index - 1)}
        >
          ↑
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          disabled={index >= total - 1}
          aria-label="Move down"
          onClick={() => void handleReorder(index, index + 1)}
        >
          ↓
        </button>
      </div>
    </div>
  );
}
