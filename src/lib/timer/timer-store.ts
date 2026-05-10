import { create } from "zustand";
import { DEFAULT_SETTINGS, type SessionType } from "@/lib/db/schema";
import { addSession, incrementTaskPomodoro, saveSettings } from "@/lib/db/queries";
import { playAlarm } from "@/lib/audio/sounds";
import { notifySessionComplete } from "@/lib/notifications/notify";
import {
  nextSessionAfterBreakComplete,
  nextSessionAfterFocusComplete,
  nextSessionAfterFocusSkip,
  plannedDurationSeconds,
} from "./timer-logic";
import type { TimerStoreState } from "./types";

const STORAGE_KEY = "pomodoro-timer-v1";
const STORAGE_VERSION = 1;

interface PersistedShape {
  v: number;
  sessionType: SessionType;
  isRunning: boolean;
  endsAt: number | null;
  pausedRemainingSec: number | null;
  activeTaskId: string | null;
  completedFocusCount: number;
  sessionStartedAt: number | null;
}

let completionTimer: ReturnType<typeof setTimeout> | null = null;

/** Prevents tick + timeout both running session transition logic. */
let sessionTransitionLock = false;

function clearCompletionTimer(): void {
  if (completionTimer) {
    clearTimeout(completionTimer);
    completionTimer = null;
  }
}

function snapshotForStorage(state: TimerStoreState): PersistedShape {
  return {
    v: STORAGE_VERSION,
    sessionType: state.sessionType,
    isRunning: state.isRunning,
    endsAt: state.endsAt,
    pausedRemainingSec: state.pausedRemainingSec,
    activeTaskId: state.activeTaskId,
    completedFocusCount: state.completedFocusCount,
    sessionStartedAt: state.sessionStartedAt,
  };
}

function persistSnapshot(state: TimerStoreState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshotForStorage(state)));
  } catch {
    /* ignore */
  }
}

let persistEnabled = false;

function loadPersisted(): Partial<PersistedShape> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedShape;
    if (data.v !== STORAGE_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

function labelForSession(type: SessionType): string {
  switch (type) {
    case "focus":
      return "Focus session complete";
    case "shortBreak":
      return "Short break over";
    case "longBreak":
      return "Long break over";
    default:
      return "Session complete";
  }
}

export const useTimerStore = create<TimerStoreState>((set, get) => {
  function scheduleCompletionTimer(): void {
    clearCompletionTimer();
    const { isRunning, endsAt } = get();
    if (!isRunning || !endsAt) return;
    const delay = Math.max(0, endsAt - Date.now());
    completionTimer = setTimeout(() => {
      void finalizeNaturalComplete();
    }, delay);
  }

  async function finalizeNaturalComplete(): Promise<void> {
    if (sessionTransitionLock) return;
    sessionTransitionLock = true;
    try {
      const state = get();
      clearCompletionTimer();
      if (!state.sessionStartedAt) return;

      const now = Date.now();
      const planned = plannedDurationSeconds(state.sessionType, state.settings);
      const actual = Math.round((now - state.sessionStartedAt) / 1000);

      await addSession({
        type: state.sessionType,
        taskId: state.activeTaskId ?? undefined,
        startedAt: state.sessionStartedAt,
        endedAt: now,
        plannedDurationSec: planned,
        actualDurationSec: Math.min(actual, planned),
        completed: true,
      });

      let completedFocusCount = state.completedFocusCount;
      if (state.sessionType === "focus") {
        if (state.activeTaskId) {
          await incrementTaskPomodoro(state.activeTaskId);
        }
        completedFocusCount += 1;
      }

      playAlarm(state.settings.alarmSound, state.settings.alarmVolume);
      notifySessionComplete(
        labelForSession(state.sessionType),
        "Time for the next step.",
        state.settings.notificationsEnabled
      );

      const manual = !state.settings.autoSwitch;

      if (state.sessionType === "focus" && manual) {
        set((s) => ({
          ...s,
          completedFocusCount,
          sessionType: "focus",
          completionToken: s.completionToken + 1,
          sessionStartedAt: null,
          endsAt: null,
          pausedRemainingSec: 0,
          isRunning: false,
        }));
      } else {
        const nextType: SessionType =
          state.sessionType === "focus"
            ? nextSessionAfterFocusComplete(completedFocusCount, state.settings)
            : nextSessionAfterBreakComplete();
        const nextDuration = plannedDurationSeconds(nextType, state.settings);

        set((s) => ({
          ...s,
          completedFocusCount,
          sessionType: nextType,
          completionToken: s.completionToken + 1,
          sessionStartedAt: null,
          endsAt: null,
          pausedRemainingSec: nextDuration,
          isRunning: false,
        }));

        if (!manual) {
          get().start();
        }
      }
    } finally {
      sessionTransitionLock = false;
    }
  }

  async function finalizeSkip(): Promise<void> {
    if (sessionTransitionLock) return;
    sessionTransitionLock = true;
    try {
      const state = get();
      clearCompletionTimer();
      const now = Date.now();
      const planned = plannedDurationSeconds(state.sessionType, state.settings);
      const started = state.sessionStartedAt ?? now;
      const actual = Math.max(0, Math.round((now - started) / 1000));

      await addSession({
        type: state.sessionType,
        taskId: state.activeTaskId ?? undefined,
        startedAt: started,
        endedAt: now,
        plannedDurationSec: planned,
        actualDurationSec: Math.min(actual, planned),
        completed: false,
      });

      const completedFocusCount = state.completedFocusCount;
      const manual = !state.settings.autoSwitch;

      if (state.sessionType === "focus" && manual) {
        set((s) => ({
          ...s,
          completedFocusCount,
          sessionType: "focus",
          completionToken: s.completionToken + 1,
          sessionStartedAt: null,
          endsAt: null,
          pausedRemainingSec: 0,
          isRunning: false,
        }));
      } else {
        const nextType: SessionType =
          state.sessionType === "focus"
            ? nextSessionAfterFocusSkip()
            : nextSessionAfterBreakComplete();
        const nextDuration = plannedDurationSeconds(nextType, state.settings);

        set((s) => ({
          ...s,
          completedFocusCount,
          sessionType: nextType,
          completionToken: s.completionToken + 1,
          sessionStartedAt: null,
          endsAt: null,
          pausedRemainingSec: nextDuration,
          isRunning: false,
        }));

        if (!manual) {
          get().start();
        }
      }
    } finally {
      sessionTransitionLock = false;
    }
  }

  return {
    sessionType: "focus",
    isRunning: false,
    endsAt: null,
    pausedRemainingSec: plannedDurationSeconds("focus", DEFAULT_SETTINGS),
    activeTaskId: null,
    completedFocusCount: 0,
    sessionStartedAt: null,
    settings: { ...DEFAULT_SETTINGS },
    completionToken: 0,

    setSettings: (settings) => {
      set((s) => {
        const next = { ...s, settings };
        if (!s.isRunning) {
          next.pausedRemainingSec = plannedDurationSeconds(
            s.sessionType,
            settings
          );
        }
        return next;
      });
    },

    setActiveTaskId: (activeTaskId) => {
      set((s) => ({ ...s, activeTaskId }));
    },

    setSessionType: (sessionType) => {
      const s = get();
      if (s.isRunning) return;
      const duration = plannedDurationSeconds(sessionType, s.settings);
      set({
        ...s,
        sessionType,
        pausedRemainingSec: duration,
        endsAt: null,
        sessionStartedAt: null,
      });
    },

    setAutoSwitch: async (autoSwitch) => {
      try {
        await saveSettings({ autoSwitch });
      } catch (err) {
        console.error("[timer] Failed to persist autoSwitch", err);
        return;
      }
      set((s) => {
        const settings = { ...s.settings, autoSwitch };
        return { ...s, settings };
      });
    },

    start: () => {
      void import("@/lib/audio/sounds").then((m) => m.resumeAudioContext());
      const s = get();
      const remaining =
        s.pausedRemainingSec ?? plannedDurationSeconds(s.sessionType, s.settings);
      if (remaining <= 0) return;
      const endsAt = Date.now() + remaining * 1000;
      set({
        ...s,
        isRunning: true,
        endsAt,
        pausedRemainingSec: null,
        sessionStartedAt: s.sessionStartedAt ?? Date.now(),
      });
      scheduleCompletionTimer();
    },

    pause: () => {
      const s = get();
      if (!s.isRunning || !s.endsAt) return;
      clearCompletionTimer();
      const remainingSec = Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000));
      set({
        ...s,
        isRunning: false,
        endsAt: null,
        pausedRemainingSec: remainingSec,
      });
    },

    toggle: () => {
      const s = get();
      if (s.isRunning) {
        get().pause();
      } else {
        get().start();
      }
    },

    skip: () => {
      void finalizeSkip();
    },

    tick: () => {
      const s = get();
      if (!s.isRunning || !s.endsAt) return;
      if (Date.now() >= s.endsAt) {
        void finalizeNaturalComplete();
      }
    },

    hydrateFromStorage: () => {
      const disk = loadPersisted();
      if (!disk) return;
      const s = get();
      set({
        ...s,
        sessionType: disk.sessionType ?? s.sessionType,
        isRunning: disk.isRunning ?? false,
        endsAt: disk.endsAt ?? null,
        pausedRemainingSec:
          disk.pausedRemainingSec ??
          plannedDurationSeconds(
            disk.sessionType ?? s.sessionType,
            s.settings
          ),
        activeTaskId: disk.activeTaskId ?? null,
        completedFocusCount: disk.completedFocusCount ?? 0,
        sessionStartedAt: disk.sessionStartedAt ?? null,
      });

      const cur = get();
      if (cur.isRunning && cur.endsAt && cur.endsAt <= Date.now()) {
        void finalizeNaturalComplete();
        return;
      }
      if (cur.isRunning && cur.endsAt) {
        scheduleCompletionTimer();
      }
    },
  };
});

useTimerStore.subscribe((state) => {
  if (!persistEnabled) return;
  persistSnapshot(state);
});

export function enableTimerPersistence(): void {
  persistEnabled = true;
  persistSnapshot(useTimerStore.getState());
}
