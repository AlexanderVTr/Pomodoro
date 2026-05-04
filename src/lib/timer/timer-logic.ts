import type { AppSettings, SessionType } from "@/lib/db/schema";

export function plannedDurationSeconds(
  sessionType: SessionType,
  settings: AppSettings
): number {
  switch (sessionType) {
    case "focus":
      return settings.focusDurationMin * 60;
    case "shortBreak":
      return settings.shortBreakDurationMin * 60;
    case "longBreak":
      return settings.longBreakDurationMin * 60;
    default:
      return settings.focusDurationMin * 60;
  }
}

export function pickBreakAfterCompletedFocus(
  completedFocusCount: number,
  interval: number
): "shortBreak" | "longBreak" {
  if (interval <= 0) return "shortBreak";
  if (completedFocusCount > 0 && completedFocusCount % interval === 0) {
    return "longBreak";
  }
  return "shortBreak";
}

export function nextSessionAfterFocusComplete(
  completedFocusCountAfterIncrement: number,
  settings: AppSettings
): SessionType {
  return pickBreakAfterCompletedFocus(
    completedFocusCountAfterIncrement,
    settings.longBreakInterval
  );
}

export function nextSessionAfterFocusSkip(): SessionType {
  return "shortBreak";
}

export function nextSessionAfterBreakComplete(): SessionType {
  return "focus";
}
