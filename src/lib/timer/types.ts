import type { AppSettings, SessionType } from "@/lib/db/schema";

export interface TimerSnapshot {
  sessionType: SessionType;
  isRunning: boolean;
  endsAt: number | null;
  pausedRemainingSec: number | null;
  activeTaskId: string | null;
  completedFocusCount: number;
  sessionStartedAt: number | null;
}

export interface TimerStoreState extends TimerSnapshot {
  settings: AppSettings;
  /** Monotonic token bumped when a session ends (natural or synthetic from hydration) */
  completionToken: number;
  setSettings: (s: AppSettings) => void;
  setActiveTaskId: (id: string | null) => void;
  setSessionType: (t: SessionType) => void;
  setAutoSwitch: (v: boolean) => Promise<void>;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  skip: () => void;
  tick: () => void;
  /** Call on app mount after DB + storage ready */
  hydrateFromStorage: () => void;
}

export type { AppSettings, SessionType };
