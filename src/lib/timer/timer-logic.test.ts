import { describe, expect, it } from "vitest";
import {
  nextSessionAfterFocusComplete,
  pickBreakAfterCompletedFocus,
  plannedDurationSeconds,
} from "./timer-logic";
import { DEFAULT_SETTINGS, type AppSettings } from "@/lib/db/schema";

const base: AppSettings = { ...DEFAULT_SETTINGS };

describe("plannedDurationSeconds", () => {
  it("uses settings minutes", () => {
    expect(
      plannedDurationSeconds("focus", {
        ...base,
        focusDurationMin: 25,
      })
    ).toBe(1500);
    expect(
      plannedDurationSeconds("shortBreak", {
        ...base,
        shortBreakDurationMin: 5,
      })
    ).toBe(300);
  });
});

describe("pickBreakAfterCompletedFocus", () => {
  it("returns long break every N completed focus sessions", () => {
    expect(pickBreakAfterCompletedFocus(1, 4)).toBe("shortBreak");
    expect(pickBreakAfterCompletedFocus(4, 4)).toBe("longBreak");
    expect(pickBreakAfterCompletedFocus(8, 4)).toBe("longBreak");
  });
});

describe("nextSessionAfterFocusComplete", () => {
  it("matches pickBreak with incremented counter", () => {
    expect(nextSessionAfterFocusComplete(4, { ...base, longBreakInterval: 4 })).toBe(
      "longBreak"
    );
    expect(nextSessionAfterFocusComplete(3, { ...base, longBreakInterval: 4 })).toBe(
      "shortBreak"
    );
  });
});
