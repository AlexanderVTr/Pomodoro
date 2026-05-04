"use client";

import { Button } from "@/components/ui/Button";
import { useTimerStore } from "@/lib/timer/timer-store";
import styles from "./timer-controls.module.scss";

export function TimerControls() {
  const isRunning = useTimerStore((s) => s.isRunning);
  const toggle = useTimerStore((s) => s.toggle);
  const skip = useTimerStore((s) => s.skip);

  return (
    <div className={styles.row}>
      <Button variant="primary" onClick={() => toggle()}>
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button variant="ghost" onClick={() => skip()}>
        Skip
      </Button>
    </div>
  );
}
