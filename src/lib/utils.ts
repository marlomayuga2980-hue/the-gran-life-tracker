import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfWeek, format, addWeeks, subWeeks, endOfWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Returns the Monday of the ISO week containing `date`. */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/** Returns the Sunday of the ISO week containing `date`. */
export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/** Format weekStart for display: "May 26 – Jun 1, 2026" */
export function formatWeekRange(weekStart: Date): string {
  const weekEnd = getWeekEnd(weekStart);
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${format(weekStart, "MMM d")} – ${format(weekEnd, "d, yyyy")}`;
  }
  return `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`;
}

/** Navigate to the next week. */
export function nextWeek(weekStart: Date): Date {
  return addWeeks(weekStart, 1);
}

/** Navigate to the previous week. */
export function prevWeek(weekStart: Date): Date {
  return subWeeks(weekStart, 1);
}

/** Format hours as "2h 30m" or "0.5h". */
export function formatHours(hours: number): string {
  if (hours === 0) return "0h";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Format a date as relative "2 hours ago", "3 days ago", etc. */
export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return format(d, "MMM d, yyyy");
}

/** Status cycle order for admin view. */
export const STATUS_CYCLE: Record<string, string> = {
  "Not Started": "In Progress",
  "In Progress": "Done",
  Done: "Blocked",
  Blocked: "Not Started",
};

export const PHASES = [
  "Phase 1 — This Week",
  "Phase 2 — Next 1–2 Weeks",
  "Phase 3 — Once Logo is Approved",
];

export const TAGS = ["Shopify", "Go High Level", "Claude Design", "QA"];

export const STATUSES = ["Not Started", "In Progress", "Done", "Blocked"];
