"use client";

import { Toggle } from "@/components/ui/Toggle";
import { useTimerStore } from "@/lib/timer/timer-store";
import styles from "./auto-switch.module.scss";

export function AutoSwitchToggle() {
  const autoSwitch = useTimerStore((s) => s.settings.autoSwitch);
  const setAutoSwitch = useTimerStore((s) => s.setAutoSwitch);

  return (
    <div className={styles.wrap}>
      <Toggle
        label="Auto-switch & auto-start next session"
        checked={autoSwitch}
        onChange={(e) => setAutoSwitch(e.target.checked)}
      />
    </div>
  );
}
