"use client";

import { useEffect, useRef } from "react";
import { playTickClick } from "./sounds";

export function useTickingSound(
  active: boolean,
  volume: number
): void {
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
      return;
    }
    ref.current = setInterval(() => {
      playTickClick(volume);
    }, 1000);
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    };
  }, [active, volume]);
}
