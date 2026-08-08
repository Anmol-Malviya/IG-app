/**
 * Date utility functions for the scheduler module.
 * All operations respect the user's local timezone.
 */

import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
  differenceInMinutes,
  addWeeks,
  subWeeks,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  startOfDay,
  endOfDay,
} from "date-fns";

export const HOURS_START = 6; // 6:00 AM
export const HOURS_END = 23; // 11:00 PM
export const TOTAL_HOURS = HOURS_END - HOURS_START;
export const HOUR_HEIGHT_PX = 64; // px per hour in the calendar grid

/**
 * Returns array of 7 days for the week containing the given date.
 * Week starts on Monday.
 */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Format date for display headers: "Mon 12"
 */
export function formatDayHeader(date: Date): { day: string; num: string } {
  return {
    day: format(date, "EEE"),
    num: format(date, "d"),
  };
}

/**
 * Format time: "09:30 AM"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "hh:mm a");
}

/**
 * Format date range for week navigation: "Aug 4 – Aug 10"
 */
export function formatWeekRange(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

/**
 * Get top offset (px) for an event based on its start time.
 */
export function getEventTopPx(startDateTime: Date | string): number {
  const d = typeof startDateTime === "string" ? parseISO(startDateTime) : startDateTime;
  const hours = getHours(d) - HOURS_START;
  const minutes = getMinutes(d);
  return (hours + minutes / 60) * HOUR_HEIGHT_PX;
}

/**
 * Get height (px) for an event based on its duration.
 */
export function getEventHeightPx(startDateTime: Date | string, endDateTime: Date | string): number {
  const start = typeof startDateTime === "string" ? parseISO(startDateTime) : startDateTime;
  const end = typeof endDateTime === "string" ? parseISO(endDateTime) : endDateTime;
  const durationMinutes = differenceInMinutes(end, start);
  const height = (durationMinutes / 60) * HOUR_HEIGHT_PX;
  return Math.max(height, 24); // minimum 24px
}

/**
 * Total height of the time grid in px.
 */
export const GRID_HEIGHT_PX = TOTAL_HOURS * HOUR_HEIGHT_PX;

/**
 * Convert time string "HH:MM" + date to a full Date.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const d = new Date(year, month - 1, day);
  return setMinutes(setHours(d, hour), minute);
}

/**
 * Check if an event is within the visible grid (6AM–11PM).
 */
export function isInGridRange(startDateTime: Date | string): boolean {
  const d = typeof startDateTime === "string" ? parseISO(startDateTime) : startDateTime;
  const h = getHours(d);
  return h >= HOURS_START && h < HOURS_END;
}

/**
 * Generate hour labels for the time column: ["6 AM", "7 AM", ..., "10 PM"]
 */
export function generateTimeLabels(): string[] {
  return Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const hour = HOURS_START + i;
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  });
}

/**
 * Get the current time top offset for the live time indicator.
 */
export function getCurrentTimeTopPx(): number {
  const now = new Date();
  return getEventTopPx(now);
}

/**
 * Format duration in human-readable form: "1h 30m"
 */
export function formatDuration(start: Date | string, end: Date | string): string {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  const mins = differenceInMinutes(e, s);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Navigate one week forward.
 */
export const nextWeek = (date: Date): Date => addWeeks(date, 1);

/**
 * Navigate one week backward.
 */
export const prevWeek = (date: Date): Date => subWeeks(date, 1);

/**
 * Get start and end of week as ISO strings for API queries.
 */
export function getWeekBounds(date: Date): { startDate: string; endDate: string } {
  return {
    startDate: startOfDay(startOfWeek(date, { weekStartsOn: 1 })).toISOString(),
    endDate: endOfDay(endOfWeek(date, { weekStartsOn: 1 })).toISOString(),
  };
}

/**
 * Friendly countdown: "in 30 min", "in 2h", "Tomorrow at 9 AM"
 */
export function formatCountdown(date: Date | string): string {
  const target = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const mins = differenceInMinutes(target, now);
  if (mins < 0) return "Passed";
  if (mins < 60) return `in ${mins}m`;
  if (mins < 1440) return `in ${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}`;
  if (isSameDay(target, addDays(now, 1))) return `Tomorrow at ${format(target, "h:mm a")}`;
  return format(target, "EEE, MMM d 'at' h:mm a");
}

export { isSameDay, isToday, parseISO, format, addDays, startOfDay, endOfDay };
