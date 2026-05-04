"use client";

import { useEffect, useRef } from "react";

interface WakeLockSentinel {
  release: () => Promise<void>;
  addEventListener: (
    type: "release",
    listener: () => void
  ) => void;
}

interface NavigatorWakeLock {
  request: (type: "screen") => Promise<WakeLockSentinel>;
}

export function useWakeLock(active: boolean): void {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || typeof navigator === "undefined") return;
    const wake = (navigator as Navigator & { wakeLock?: NavigatorWakeLock }).wakeLock;
    if (!wake) return;

    let cancelled = false;

    const request = async () => {
      try {
        const sentinel = await wake.request("screen");
        if (cancelled) {
          await sentinel.release();
          return;
        }
        lockRef.current = sentinel;
        sentinel.addEventListener("release", () => {
          lockRef.current = null;
        });
      } catch {
        /* unsupported or denied */
      }
    };

    void request();

    return () => {
      cancelled = true;
      void lockRef.current?.release();
      lockRef.current = null;
    };
  }, [active]);
}
