"use client";

import { SessionTabs } from "@/components/timer/SessionTabs";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { DailyPomodoroShelf } from "@/components/timer/DailyPomodoroShelf";
import { TimerControls } from "@/components/timer/TimerControls";
import { AutoSwitchToggle } from "@/components/timer/AutoSwitchToggle";
import { ActiveTaskBanner } from "@/components/todo/ActiveTaskBanner";
import { TaskList } from "@/components/todo/TaskList";
import { TimerSideEffects } from "@/components/timer/timer-side-effects";
import { useKeyboardToggle } from "./use-keyboard-toggle";
import styles from "./home-page.module.scss";

export function HomePageClient() {
  useKeyboardToggle();

  return (
    <>
      <TimerSideEffects />
      <main className={styles.shell}>
        <SessionTabs />
        <TimerDisplay />
        <DailyPomodoroShelf />
        <TimerControls />
        <AutoSwitchToggle />
        <div className={styles.panel}>
          <ActiveTaskBanner />
          <TaskList />
        </div>
      </main>
    </>
  );
}
