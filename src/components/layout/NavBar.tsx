"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/lib/theme/theme-store";
import { InstallPrompt } from "./install-prompt";
import { TomatoMark } from "./tomato-mark";
import styles from "./nav-bar.module.scss";

export function NavBar() {
  const pathname = usePathname();
  const resolved = useThemeStore((s) => s.resolved);
  const setPreference = useThemeStore((s) => s.setPreference);

  const toggleTheme = () => {
    setPreference(resolved === "dark" ? "light" : "dark");
  };

  const variant = pathname === "/" ? "timer" : "app";

  return (
    <header className={styles.bar} data-variant={variant}>
      <Link href="/" className={styles.brand}>
        <TomatoMark className={styles.brandMark} />
        <span className={styles.brandWordmark}>Pomodoro Focus</span>
      </Link>
      <nav className={styles.links} aria-label="Main">
        <Link
          className={styles.link}
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Timer
        </Link>
        <Link
          className={styles.link}
          href="/history"
          aria-current={pathname === "/history" ? "page" : undefined}
        >
          History
        </Link>
        <Link
          className={styles.link}
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
        >
          Settings
        </Link>
      </nav>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={resolved === "dark" ? "Light mode" : "Dark mode"}
          title="Toggle theme"
        >
          {resolved === "dark" ? "☀" : "☾"}
        </button>
        <InstallPrompt />
      </div>
    </header>
  );
}
