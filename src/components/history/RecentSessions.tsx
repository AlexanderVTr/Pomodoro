"use client";

import type { SessionRecord } from "@/lib/db/schema";
import styles from "./recent-sessions.module.scss";

interface RecentSessionsProps {
  sessions: SessionRecord[];
}

function typeLabel(t: SessionRecord["type"]): string {
  switch (t) {
    case "focus":
      return "Focus";
    case "shortBreak":
      return "Short break";
    case "longBreak":
      return "Long break";
    default:
      return t;
  }
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const rows = sessions.slice(0, 25);

  if (rows.length === 0) {
    return <p>No sessions logged yet.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>When</th>
          <th className={styles.th}>Type</th>
          <th className={styles.th}>Duration</th>
          <th className={styles.th}>Done</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((s) => (
          <tr key={s.id}>
            <td className={styles.td}>
              {new Date(s.endedAt).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </td>
            <td className={styles.td}>{typeLabel(s.type)}</td>
            <td className={styles.td}>{s.actualDurationSec}s</td>
            <td className={styles.td}>{s.completed ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
