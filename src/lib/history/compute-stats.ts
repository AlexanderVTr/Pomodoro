import type { SessionRecord, Task } from "@/lib/db/schema";
import {
  eachLocalDay,
  endOfLocalDay,
  startOfLocalDay,
  startOfWeekMonday,
} from "@/lib/utils/date";

export interface DailyPoint {
  day: string;
  focusMinutes: number;
}

export interface WeeklyPoint {
  weekLabel: string;
  focusMinutes: number;
}

function focusMinutesFromSessions(
  sessions: SessionRecord[],
  predicate: (s: SessionRecord) => boolean
): number {
  return sessions
    .filter((s) => s.type === "focus" && s.completed && predicate(s))
    .reduce((acc, s) => acc + s.actualDurationSec / 60, 0);
}

export function computeTodayFocusMinutes(
  sessions: SessionRecord[],
  now = new Date()
): number {
  const start = startOfLocalDay(now).getTime();
  const end = endOfLocalDay(now).getTime();
  return focusMinutesFromSessions(
    sessions,
    (s) => s.endedAt >= start && s.endedAt <= end
  );
}

export function computeWeekFocusMinutes(
  sessions: SessionRecord[],
  now = new Date()
): number {
  const start = startOfWeekMonday(now).getTime();
  const end = endOfLocalDay(now).getTime();
  return focusMinutesFromSessions(
    sessions,
    (s) => s.endedAt >= start && s.endedAt <= end
  );
}

export function computeTotalFocusMinutes(sessions: SessionRecord[]): number {
  return focusMinutesFromSessions(sessions, () => true);
}

export function computeDailyLastDays(
  sessions: SessionRecord[],
  days: number,
  now = new Date()
): DailyPoint[] {
  const end = startOfLocalDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  const daysList = eachLocalDay(start, end);
  return daysList.map((d) => {
    const dayStart = startOfLocalDay(d).getTime();
    const dayEnd = endOfLocalDay(d).getTime();
    const minutes = focusMinutesFromSessions(
      sessions,
      (s) => s.endedAt >= dayStart && s.endedAt <= dayEnd
    );
    return {
      day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      focusMinutes: Math.round(minutes * 10) / 10,
    };
  });
}

export function computeWeeklyTrend(
  sessions: SessionRecord[],
  weeks: number,
  now = new Date()
): WeeklyPoint[] {
  const points: WeeklyPoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const anchor = new Date(now);
    anchor.setDate(anchor.getDate() - w * 7);
    const ws = startOfWeekMonday(anchor).getTime();
    const we = endOfLocalDay(
      new Date(ws + 6 * 24 * 60 * 60 * 1000)
    ).getTime();
    const minutes = focusMinutesFromSessions(
      sessions,
      (s) => s.endedAt >= ws && s.endedAt <= we
    );
    points.push({
      weekLabel: new Date(ws).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      focusMinutes: Math.round(minutes * 10) / 10,
    });
  }
  return points;
}

export function countCompletedTasks(tasks: Task[]): number {
  return tasks.filter((t) => t.isCompleted).length;
}

export function computeStreakDays(
  sessions: SessionRecord[],
  now = new Date()
): number {
  const hasFocus = (d: Date) => {
    const ds = startOfLocalDay(d).getTime();
    const de = endOfLocalDay(d).getTime();
    return sessions.some(
      (s) =>
        s.type === "focus" &&
        s.completed &&
        s.endedAt >= ds &&
        s.endedAt <= de
    );
  };

  let streak = 0;
  const cur = startOfLocalDay(now);
  for (let i = 0; i < 366; i++) {
    const d = new Date(cur);
    d.setDate(d.getDate() - i);
    if (hasFocus(d)) {
      streak += 1;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}
