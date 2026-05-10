"use client";

import { Toggle } from "@/components/ui/Toggle";
import { useTimerStore } from "@/lib/timer/timer-store";
import styles from "./auto-switch.module.scss";

export function AutoSwitchToggle() {
  const autoSwitch = useTimerStore((s) => s.settings.autoSwitch);
  const setAutoSwitch = useTimerStore((s) => s.setAutoSwitch);

  const handleAutoSwitchChange = (checked: boolean) => {
    void setAutoSwitch(checked);
  };

  return (
    <div className={styles.wrap}>
      <Toggle
        label="Auto-start timer after each session"
        checked={autoSwitch}
        onChange={(e) => handleAutoSwitchChange(e.target.checked)}
      />
    </div>
  );
}
