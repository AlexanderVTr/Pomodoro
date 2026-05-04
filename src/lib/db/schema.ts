export type SessionType = "focus" | "shortBreak" | "longBreak";

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface SessionRecord {
  id: string;
  type: SessionType;
  taskId?: string;
  startedAt: number;
  endedAt: number;
  plannedDurationSec: number;
  actualDurationSec: number;
  completed: boolean;
}

export type AlarmSoundId = "bell" | "digital" | "none";
export type TickingSoundId = "tick" | "none";
export type ThemePreference = "system" | "light" | "dark";

export interface AppSettings {
  id: "singleton";
  focusDurationMin: number;
  shortBreakDurationMin: number;
  longBreakDurationMin: number;
  longBreakInterval: number;
  autoSwitch: boolean;
  alarmSound: AlarmSoundId;
  alarmVolume: number;
  tickingSound: TickingSoundId;
  tickingVolume: number;
  theme: ThemePreference;
  notificationsEnabled: boolean;
}

export const SETTINGS_ID = "singleton" as const;

export const DEFAULT_SETTINGS: AppSettings = {
  id: SETTINGS_ID,
  focusDurationMin: 25,
  shortBreakDurationMin: 5,
  longBreakDurationMin: 15,
  longBreakInterval: 4,
  autoSwitch: true,
  alarmSound: "bell",
  alarmVolume: 0.8,
  tickingSound: "none",
  tickingVolume: 0.35,
  theme: "system",
  notificationsEnabled: false,
};
