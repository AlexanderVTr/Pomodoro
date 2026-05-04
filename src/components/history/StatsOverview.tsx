"use client";

import styles from "./stats-overview.module.scss";

interface StatsOverviewProps {
  todayMinutes: number;
  weekMinutes: number;
  totalMinutes: number;
  streak: number;
  completedTasks: number;
}

export function StatsOverview({
  todayMinutes,
  weekMinutes,
  totalMinutes,
  streak,
  completedTasks,
}: StatsOverviewProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <p className={styles.label}>Today</p>
        <p className={styles.value}>{Math.round(todayMinutes)}m</p>
      </div>
      <div className={styles.card}>
        <p className={styles.label}>This week</p>
        <p className={styles.value}>{Math.round(weekMinutes)}m</p>
      </div>
      <div className={styles.card}>
        <p className={styles.label}>Total focus</p>
        <p className={styles.value}>{Math.round(totalMinutes)}m</p>
      </div>
      <div className={styles.card}>
        <p className={styles.label}>Streak</p>
        <p className={styles.value}>{streak}d</p>
      </div>
      <div className={styles.card}>
        <p className={styles.label}>Tasks done</p>
        <p className={styles.value}>{completedTasks}</p>
      </div>
    </div>
  );
}
