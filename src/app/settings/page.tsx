import { SettingsForm } from "@/components/settings/SettingsForm";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  return (
    <main className={styles.wrap}>
      <h1 className={styles.h1}>Settings</h1>
      <SettingsForm />
    </main>
  );
}
