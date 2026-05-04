import Link from "next/link";
import styles from "./offline.module.scss";

export default function OfflinePage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>You are offline</h1>
      <p className={styles.text}>
        Pomodoro Focus works offline once installed. Reconnect to sync any
        browser updates, or continue using cached pages.
      </p>
      <Link className={styles.link} href="/">
        Back home
      </Link>
    </div>
  );
}
