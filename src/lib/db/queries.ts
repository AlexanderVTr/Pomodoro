import { endOfLocalDay, startOfLocalDay } from "@/lib/utils/date";
import { db } from "./client";
import type { AppSettings, SessionRecord, Task } from "./schema";
import { DEFAULT_SETTINGS, SETTINGS_ID } from "./schema";

export async function getSettings(): Promise<AppSettings> {
  const row = await db.settings.get(SETTINGS_ID);
  return row ?? { ...DEFAULT_SETTINGS };
}

export async function saveSettings(
  patch: Partial<Omit<AppSettings, "id">>
): Promise<void> {
  const current = await getSettings();
  await db.settings.put({ ...current, ...patch, id: SETTINGS_ID });
}

export function tasksLiveQuery() {
  return db.tasks.orderBy("order").toArray();
}

export function sessionsLiveQuery() {
  return db.sessions.orderBy("endedAt").reverse().toArray();
}

export async function addTask(title: string): Promise<Task> {
  const now = Date.now();
  const maxOrder =
    (await db.tasks.orderBy("order").last())?.order ?? -1;
  const task: Task = {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled",
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    isCompleted: false,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  await db.tasks.add(task);
  return task;
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<Task, "title" | "estimatedPomodoros" | "isCompleted">>
): Promise<void> {
  await db.tasks.update(id, {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id);
}

export async function reorderTasks(orderedIds: string[]): Promise<void> {
  await db.transaction("rw", db.tasks, async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.tasks.update(orderedIds[i], { order: i, updatedAt: Date.now() });
    }
  });
}

export async function incrementTaskPomodoro(taskId: string): Promise<void> {
  const task = await db.tasks.get(taskId);
  if (!task || task.isCompleted) return;
  await db.tasks.update(taskId, {
    completedPomodoros: task.completedPomodoros + 1,
    updatedAt: Date.now(),
  });
}

export async function addSession(
  record: Omit<SessionRecord, "id">
): Promise<void> {
  await db.sessions.add({
    ...record,
    id: crypto.randomUUID(),
  });
}

export async function getSessionsInRange(
  fromMs: number,
  toMs: number
): Promise<SessionRecord[]> {
  const all = await db.sessions.toArray();
  return all.filter((s) => s.endedAt >= fromMs && s.endedAt <= toMs);
}

/** Completed focus sessions that ended today (local calendar day). */
export async function getTodayCompletedFocusCount(): Promise<number> {
  const start = startOfLocalDay(new Date()).getTime();
  const end = endOfLocalDay(new Date()).getTime();
  const list = await db.sessions
    .where("endedAt")
    .between(start, end, true, true)
    .toArray();
  return list.filter((s) => s.type === "focus" && s.completed).length;
}
