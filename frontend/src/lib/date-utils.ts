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
  subDays,
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

export const HOURS_START = 7; // 7:00 AM
export const HOURS_END = 22; // 10:00 PM
export const TOTAL_HOURS = HOURS_END - HOURS_START;
export const HOUR_HEIGHT_PX = 72; // 72px per hour for premium readability

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
export function formatDayHeader(date: Date): { day: string; num: string; full: string } {
  return {
    day: format(date, "EEE"),
    num: format(date, "d"),
    full: format(date, "d MMM"),
  };
}

/**
 * Format time: "09:30 AM"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "h:mm a");
}

/**
 * Format date range for week navigation: "Aug 4 – Aug 10, 2026"
 */
export function formatWeekRange(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

/**
 * Format single day range for Day navigation: "Monday, Aug 10, 2026"
 */
export function formatDayTitle(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
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
  return Math.max(height, 36); // minimum 36px for readable content
}

/**
 * Total height of the time grid in px.
 */
export const GRID_HEIGHT_PX = TOTAL_HOURS * HOUR_HEIGHT_PX;

/**
 * Convert time string "HH:MM" + date string "YYYY-MM-DD" to a Date object.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const d = new Date(year, month - 1, day);
  return setMinutes(setHours(d, hour), minute);
}

/**
 * Check if an event is within the visible grid (HOURS_START to HOURS_END).
 */
export function isInGridRange(startDateTime: Date | string): boolean {
  const d = typeof startDateTime === "string" ? parseISO(startDateTime) : startDateTime;
  const h = getHours(d);
  return h >= HOURS_START && h < HOURS_END;
}

/**
 * Generate hour slot definitions for the grid.
 */
export function generateTimeSlots(): Array<{ label: string; hour: number }> {
  return Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const hour = HOURS_START + i;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return {
      label: `${displayHour}:00 ${period}`,
      hour,
    };
  });
}

/**
 * Get the current time top offset for the live time indicator.
 */
export function getCurrentTimeTopPx(now = new Date()): number {
  const hours = getHours(now) - HOURS_START;
  const minutes = getMinutes(now);
  return (hours + minutes / 60) * HOUR_HEIGHT_PX;
}

/**
 * Check if the live time indicator should be visible for the displayed week/day.
 */
export function isCurrentTimeVisible(displayedDate: Date, viewMode: "day" | "week" | "agenda"): boolean {
  const now = new Date();
  const currentHour = getHours(now);
  if (currentHour < HOURS_START || currentHour >= HOURS_END) return false;

  if (viewMode === "day") {
    return isSameDay(displayedDate, now);
  }
  const week = getWeekDays(displayedDate);
  return week.some((d) => isSameDay(d, now));
}

/**
 * Format duration in human-readable form: "1h 30m"
 */
export function formatDuration(start: Date | string, end: Date | string): string {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  const mins = Math.max(differenceInMinutes(e, s), 0);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Navigate forward.
 */
export const nextWeek = (date: Date): Date => addWeeks(date, 1);
export const nextDay = (date: Date): Date => addDays(date, 1);

/**
 * Navigate backward.
 */
export const prevWeek = (date: Date): Date => subWeeks(date, 1);
export const prevDay = (date: Date): Date => subDays(date, 1);

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
 * Friendly countdown: "in 30m", "in 2h 15m", "Tomorrow at 9:00 AM"
 */
export function formatCountdown(date: Date | string, now = new Date()): string {
  const target = typeof date === "string" ? parseISO(date) : date;
  const mins = differenceInMinutes(target, now);
  if (mins < 0) return "Started";
  if (mins === 0) return "Now";
  if (mins < 60) return `in ${mins}m`;
  if (mins < 1440) {
    const h = Math.floor(mins / 60);
    const remM = mins % 60;
    return `in ${h}h${remM > 0 ? ` ${remM}m` : ""}`;
  }
  if (isSameDay(target, addDays(now, 1))) {
    return `Tomorrow at ${format(target, "h:mm a")}`;
  }
  return format(target, "EEE, MMM d 'at' h:mm a");
}

export { isSameDay, isToday, parseISO, format, addDays, subDays, startOfDay, endOfDay, setHours, setMinutes, differenceInMinutes };
