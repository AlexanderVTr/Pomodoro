import type { SessionType } from "@/lib/db/schema";

export function sessionDataAttribute(type: SessionType): string {
  return type;
}
