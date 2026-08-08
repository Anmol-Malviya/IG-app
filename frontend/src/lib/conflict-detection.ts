/**
 * Conflict detection logic for schedule events.
 * Detects overlapping events and generates warnings.
 */

import { parseISO, areIntervalsOverlapping } from "date-fns";
import { Schedule } from "@/types/schedule";

export interface ConflictResult {
  hasConflict: boolean;
  conflictingEvents: Schedule[];
}

/**
 * Check if two schedule events overlap in time.
 */
function doEventsOverlap(a: Schedule, b: Schedule): boolean {
  const aStart = parseISO(a.startDateTime);
  const aEnd = parseISO(a.endDateTime);
  const bStart = parseISO(b.startDateTime);
  const bEnd = parseISO(b.endDateTime);

  // Events that share only endpoints are not considered overlapping
  if (aEnd <= bStart || bEnd <= aStart) return false;

  return areIntervalsOverlapping(
    { start: aStart, end: aEnd },
    { start: bStart, end: bEnd },
    { inclusive: false }
  );
}

/**
 * Find all conflicts for a given new/edited event against existing events.
 * Excludes the event being edited (by _id).
 */
export function detectConflicts(
  candidate: Pick<Schedule, "startDateTime" | "endDateTime">,
  existingEvents: Schedule[],
  excludeId?: string
): ConflictResult {
  const candidateSchedule = {
    _id: excludeId ?? "__candidate__",
    startDateTime: candidate.startDateTime,
    endDateTime: candidate.endDateTime,
  } as Schedule;

  const conflicts = existingEvents.filter((event) => {
    if (excludeId && event._id === excludeId) return false;
    if (event.status === "cancelled") return false;
    return doEventsOverlap(candidateSchedule, event);
  });

  return {
    hasConflict: conflicts.length > 0,
    conflictingEvents: conflicts,
  };
}

/**
 * Get a human-readable conflict description.
 */
export function describeConflict(conflicts: Schedule[]): string {
  if (conflicts.length === 0) return "";
  if (conflicts.length === 1) {
    return `Overlaps with "${conflicts[0].title}"`;
  }
  return `Overlaps with ${conflicts.length} events: ${conflicts
    .slice(0, 2)
    .map((e) => `"${e.title}"`)
    .join(", ")}${conflicts.length > 2 ? ` and ${conflicts.length - 2} more` : ""}`;
}
