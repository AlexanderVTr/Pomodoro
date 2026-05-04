"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { SessionRecord, Task } from "@/lib/db/schema";
import { sessionsLiveQuery, tasksLiveQuery } from "@/lib/db/queries";
import {
  computeDailyLastDays,
  computeStreakDays,
  computeTodayFocusMinutes,
  computeTotalFocusMinutes,
  computeWeekFocusMinutes,
  computeWeeklyTrend,
  countCompletedTasks,
} from "@/lib/history/compute-stats";
import { StatsOverview } from "./StatsOverview";
import { RecentSessions } from "./RecentSessions";
import styles from "./history-dashboard.module.scss";

const DailyChart = dynamic(
  () => import("./daily-chart").then((m) => m.DailyChart),
  { ssr: false, loading: () => <div style={{ height: 260 }} aria-hidden /> }
);

const WeeklyChart = dynamic(
  () => import("./weekly-chart").then((m) => m.WeeklyChart),
  { ssr: false, loading: () => <div style={{ height: 240 }} aria-hidden /> }
);

const EMPTY_SESSIONS: SessionRecord[] = [];
const EMPTY_TASKS: Task[] = [];

export function HistoryDashboard() {
  const sessions =
    useLiveQuery(() => sessionsLiveQuery(), []) ?? EMPTY_SESSIONS;
  const tasks = useLiveQuery(() => tasksLiveQuery(), []) ?? EMPTY_TASKS;

  const stats = useMemo(() => {
    const todayMinutes = computeTodayFocusMinutes(sessions);
    const weekMinutes = computeWeekFocusMinutes(sessions);
    const totalMinutes = computeTotalFocusMinutes(sessions);
    const streak = computeStreakDays(sessions);
    const daily = computeDailyLastDays(sessions, 30);
    const weekly = computeWeeklyTrend(sessions, 8);
    const completedTasks = countCompletedTasks(tasks);
    return {
      todayMinutes,
      weekMinutes,
      totalMinutes,
      streak,
      daily,
      weekly,
      completedTasks,
    };
  }, [sessions, tasks]);

  return (
    <main className={styles.wrap}>
      <h1 className={styles.h1}>History</h1>
      <StatsOverview
        todayMinutes={stats.todayMinutes}
        weekMinutes={stats.weekMinutes}
        totalMinutes={stats.totalMinutes}
        streak={stats.streak}
        completedTasks={stats.completedTasks}
      />
      <section className={styles.section}>
        <h2 className={styles.h2}>Daily focus (last 30 days)</h2>
        <DailyChart data={stats.daily} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.h2}>Weekly trend (8 weeks)</h2>
        <WeeklyChart data={stats.weekly} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.h2}>Recent sessions</h2>
        <RecentSessions sessions={sessions} />
      </section>
    </main>
  );
}
