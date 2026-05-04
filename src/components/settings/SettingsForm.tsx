"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/client";
import { SETTINGS_ID, type ThemePreference } from "@/lib/db/schema";
import { getSettings, saveSettings } from "@/lib/db/queries";
import { useTimerStore } from "@/lib/timer/timer-store";
import { useThemeStore } from "@/lib/theme/theme-store";
import { ensureNotificationPermission } from "@/lib/notifications/notify";
import { NumberInput } from "@/components/ui/NumberInput";
import { Toggle } from "@/components/ui/Toggle";
import styles from "./settings-form.module.scss";

export function SettingsForm() {
  const row = useLiveQuery(() => db.settings.get(SETTINGS_ID));

  if (!row) {
    return <p>Loading settings…</p>;
  }

  const push = async (patch: Parameters<typeof saveSettings>[0]) => {
    await saveSettings(patch);
    const next = await getSettings();
    useTimerStore.getState().setSettings(next);
    if (patch.theme) {
      useThemeStore.getState().setPreference(patch.theme as ThemePreference);
    }
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div>
        <h2 className={styles.sectionTitle}>Timer</h2>
        <div className={styles.grid}>
          <NumberInput
            id="focus"
            label="Focus (minutes)"
            min={1}
            max={180}
            value={row.focusDurationMin}
            onChange={(e) =>
              void push({ focusDurationMin: Number(e.target.value) })
            }
          />
          <NumberInput
            id="short"
            label="Short break (minutes)"
            min={1}
            max={60}
            value={row.shortBreakDurationMin}
            onChange={(e) =>
              void push({ shortBreakDurationMin: Number(e.target.value) })
            }
          />
          <NumberInput
            id="long"
            label="Long break (minutes)"
            min={1}
            max={90}
            value={row.longBreakDurationMin}
            onChange={(e) =>
              void push({ longBreakDurationMin: Number(e.target.value) })
            }
          />
          <NumberInput
            id="interval"
            label="Long break every N focus"
            min={1}
            max={12}
            value={row.longBreakInterval}
            onChange={(e) =>
              void push({ longBreakInterval: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Sounds</h2>
        <label className={styles.fieldLabel} htmlFor="alarm">
          Alarm
        </label>
        <select
          id="alarm"
          className={styles.select}
          value={row.alarmSound}
          onChange={(e) =>
            void push({
              alarmSound: e.target.value as typeof row.alarmSound,
            })
          }
        >
          <option value="bell">Bell</option>
          <option value="digital">Digital</option>
          <option value="none">None</option>
        </select>
        <label className={styles.fieldLabel} htmlFor="alarmVol">
          Alarm volume
        </label>
        <input
          id="alarmVol"
          className={styles.range}
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={row.alarmVolume}
          onChange={(e) =>
            void push({ alarmVolume: Number(e.target.value) })
          }
        />

        <label className={styles.fieldLabel} htmlFor="tick">
          Ticking
        </label>
        <select
          id="tick"
          className={styles.select}
          value={row.tickingSound}
          onChange={(e) =>
            void push({
              tickingSound: e.target.value as typeof row.tickingSound,
            })
          }
        >
          <option value="none">None</option>
          <option value="tick">Tick</option>
        </select>
        <label className={styles.fieldLabel} htmlFor="tickVol">
          Tick volume
        </label>
        <input
          id="tickVol"
          className={styles.range}
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={row.tickingVolume}
          onChange={(e) =>
            void push({ tickingVolume: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <label className={styles.fieldLabel} htmlFor="theme">
          Theme
        </label>
        <select
          id="theme"
          className={styles.select}
          value={row.theme}
          onChange={(e) =>
            void push({ theme: e.target.value as typeof row.theme })
          }
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <Toggle
          label="Browser notifications on session end"
          checked={row.notificationsEnabled}
          onChange={async (e) => {
            const on = e.target.checked;
            if (on) {
              const p = await ensureNotificationPermission();
              if (p !== "granted") {
                e.target.checked = false;
                await push({ notificationsEnabled: false });
                return;
              }
            }
            await push({ notificationsEnabled: on });
          }}
        />
      </div>
    </form>
  );
}
