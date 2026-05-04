import Dexie, { type Table } from "dexie";
import type { AppSettings, SessionRecord, Task } from "./schema";
import { DEFAULT_SETTINGS, SETTINGS_ID } from "./schema";

export class PomodoroDB extends Dexie {
  tasks!: Table<Task, string>;
  sessions!: Table<SessionRecord, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("pomodoro_focus_db");
    this.version(1).stores({
      tasks: "id, order, isCompleted, createdAt",
      sessions: "id, type, taskId, startedAt, endedAt, completed",
      settings: "id",
    });
  }
}

export const db = new PomodoroDB();

export async function ensureDefaultSettings(): Promise<void> {
  const row = await db.settings.get(SETTINGS_ID);
  if (!row) {
    await db.settings.put({ ...DEFAULT_SETTINGS });
  }
}
