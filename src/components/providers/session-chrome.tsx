"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTimerStore } from "@/lib/timer/timer-store";

export function SessionChrome() {
  const pathname = usePathname();
  const sessionType = useTimerStore((s) => s.sessionType);

  useEffect(() => {
    const onTimer = pathname === "/";
    document.documentElement.dataset.session = onTimer
      ? sessionType
      : "focus";
    document.documentElement.dataset.appPage = onTimer ? "timer" : "app";
  }, [pathname, sessionType]);

  return null;
}
