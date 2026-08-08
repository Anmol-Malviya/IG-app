/**
 * Recurrence expansion logic for the scheduler.
 * Expands recurring events into concrete occurrences for a date range.
 */

import {
  parseISO,
  addDays,
  addWeeks,
  isBefore,
  isAfter,
  getDay,
  differenceInMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  startOfDay,
} from "date-fns";
import { Schedule, Recurrence } from "@/types/schedule";

/**
 * Generate recurring occurrences of a base event within a date range.
 * Returns cloned event objects with adjusted start/end times.
 */
export function expandRecurringEvents(
  baseEvent: Schedule,
  rangeStart: Date,
  rangeEnd: Date
): Schedule[] {
  const { recurrence } = baseEvent;

  if (!recurrence || recurrence.type === "none") {
    return [];
  }

  const occurrences: Schedule[] = [];
  const originalStart = parseISO(baseEvent.startDateTime);
  const originalEnd = parseISO(baseEvent.endDateTime);
  const durationMinutes = differenceInMinutes(originalEnd, originalStart);

  const until = recurrence.until ? parseISO(recurrence.until) : rangeEnd;
  const cutoff = isBefore(until, rangeEnd) ? until : rangeEnd;

  let cursor = originalStart;

  // Safety limit to avoid infinite loops
  const MAX_ITERATIONS = 500;
  let iterations = 0;

  while (isBefore(cursor, cutoff) && iterations < MAX_ITERATIONS) {
    iterations++;

    const shouldInclude = (() => {
      if (isAfter(cursor, rangeEnd) || isBefore(cursor, rangeStart)) {
        // Skip if outside range, but keep iterating
        return false;
      }

      if (recurrence.type === "daily") return true;

      if (recurrence.type === "weekly") {
        // Same weekday as original
        return getDay(cursor) === getDay(originalStart);
      }

      if (recurrence.type === "custom") {
        const weekdays = recurrence.weekdays ?? [];
        return weekdays.includes(getDay(cursor));
      }

      return false;
    })();

    if (shouldInclude && cursor.toISOString() !== originalStart.toISOString()) {
      const newEnd = new Date(cursor.getTime() + durationMinutes * 60 * 1000);

      occurrences.push({
        ...baseEvent,
        _id: `${baseEvent._id}_${cursor.toISOString()}`,
        startDateTime: cursor.toISOString(),
        endDateTime: newEnd.toISOString(),
        recurrenceGroupId: baseEvent.recurrenceGroupId ?? baseEvent._id,
      });
    }

    cursor = addDays(cursor, 1);
  }

  return occurrences;
}

/**
 * Given a list of events (some recurring), expand all recurring events
 * within the range and merge with non-recurring ones.
 */
export function mergeWithRecurringOccurrences(
  events: Schedule[],
  rangeStart: Date,
  rangeEnd: Date
): Schedule[] {
  const result: Schedule[] = [];

  for (const event of events) {
    result.push(event); // always include the base event

    if (event.recurrence?.type !== "none") {
      const occurrences = expandRecurringEvents(event, rangeStart, rangeEnd);
      result.push(...occurrences);
    }
  }

  return result.sort(
    (a, b) =>
      parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime()
  );
}

/**
 * Build a label for recurrence for display.
 */
export function describeRecurrence(recurrence: Recurrence): string {
  if (!recurrence || recurrence.type === "none") return "Does not repeat";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (recurrence.type === "daily") return "Every day";
  if (recurrence.type === "weekly") return "Every week";
  if (recurrence.type === "custom" && recurrence.weekdays?.length) {
    const days = recurrence.weekdays
      .sort()
      .map((d) => dayNames[d])
      .join(", ");
    return `Every ${days}`;
  }

  return "Custom";
}
