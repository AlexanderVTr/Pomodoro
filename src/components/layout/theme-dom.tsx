"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme/theme-store";

export function ThemeDom() {
  const resolved = useThemeStore((s) => s.resolved);
  const setResolvedFromSystem = useThemeStore((s) => s.setResolvedFromSystem);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedFromSystem(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setResolvedFromSystem]);

  return null;
}
