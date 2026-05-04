"use client";

import { useEffect } from "react";
import { useTimerStore } from "./timer-store";

export function useTimerTick(): void {
  useEffect(() => {
    const id = setInterval(() => {
      useTimerStore.getState().tick();
    }, 250);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        useTimerStore.getState().tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
}
