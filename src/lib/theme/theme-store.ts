import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemePreference } from "@/lib/db/schema";

interface ThemeState {
  /** Resolved UI theme (what we apply to html) */
  resolved: "light" | "dark";
  /** User preference from settings */
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  setResolvedFromSystem: (isDark: boolean) => void;
}

function computeResolved(
  preference: ThemePreference,
  systemDark: boolean
): "light" | "dark" {
  if (preference === "system") {
    return systemDark ? "dark" : "light";
  }
  return preference;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      resolved: "light",
      preference: "system",
      setPreference: (preference) => {
        const mq =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        set({
          preference,
          resolved: computeResolved(preference, mq),
        });
      },
      setResolvedFromSystem: (isDark) => {
        const { preference } = get();
        if (preference === "system") {
          set({ resolved: isDark ? "dark" : "light" });
        }
      },
    }),
    {
      name: "pomodoro-theme-pref",
      partialize: (s) => ({ preference: s.preference }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state || typeof window === "undefined") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)").matches;
        useThemeStore.setState({
          resolved: computeResolved(state.preference, mq),
        });
      },
    }
  )
);
