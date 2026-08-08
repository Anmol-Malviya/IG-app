/**
 * Helper algorithms and derived metric calculators for the Weekly Scheduler.
 */

import { Schedule, EventCategory } from "@/types/schedule";
import { isSameDay, parseISO, differenceInMinutes, formatCountdown, formatTime } from "@/lib/date-utils";

export interface PositionedEvent {
  event: Schedule;
  colIndex: number;
  totalCols: number;
}

/**
 * Layout algorithm for overlapping events within a single day.
 * Clusters overlapping events together and assigns each an index and column count
 * so they display side-by-side cleanly.
 */
export function layoutDayEvents(events: Schedule[]): PositionedEvent[] {
  if (!events.length) return [];

  // Sort events by start time, then by end time descending
  const sorted = [...events].sort((a, b) => {
    const startDiff = parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime();
    if (startDiff !== 0) return startDiff;
    return parseISO(b.endDateTime).getTime() - parseISO(a.endDateTime).getTime();
  });

  const positioned: PositionedEvent[] = [];
  let cluster: Schedule[] = [];
  let clusterEnd = 0;

  for (const event of sorted) {
    const start = parseISO(event.startDateTime).getTime();
    const end = parseISO(event.endDateTime).getTime();

    if (cluster.length === 0) {
      cluster.push(event);
      clusterEnd = end;
    } else if (start < clusterEnd) {
      // Overlaps with current cluster
      cluster.push(event);
      clusterEnd = Math.max(clusterEnd, end);
    } else {
      // Process finished cluster
      assignColumnsToCluster(cluster, positioned);
      cluster = [event];
      clusterEnd = end;
    }
  }

  if (cluster.length > 0) {
    assignColumnsToCluster(cluster, positioned);
  }

  return positioned;
}

function assignColumnsToCluster(cluster: Schedule[], results: PositionedEvent[]) {
  const columns: Schedule[][] = [];

  for (const event of cluster) {
    let placed = false;
    const start = parseISO(event.startDateTime).getTime();

    for (let c = 0; c < columns.length; c++) {
      const lastEventInCol = columns[c][columns[c].length - 1];
      const lastEnd = parseISO(lastEventInCol.endDateTime).getTime();

      if (start >= lastEnd) {
        columns[c].push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([event]);
    }
  }

  const totalCols = columns.length;

  for (let c = 0; c < columns.length; c++) {
    for (const event of columns[c]) {
      results.push({
        event,
        colIndex: c,
        totalCols,
      });
    }
  }
}

/**
 * Compute Today's Classes count
 */
export function calculateTodayClasses(
  events: Schedule[],
  now = new Date()
): { count: number; active: number } {
  const todayList = events.filter((e) => isSameDay(parseISO(e.startDateTime), now));
  const classes = todayList.filter((e) => e.category === "class" || e.category === "lab");
  const active = classes.filter((e) => e.status !== "completed").length;
  return {
    count: classes.length,
    active,
  };
}

/**
 * Compute Today's Study Duration and progress towards 4h goal
 */
export function calculateStudyDuration(events: Schedule[], targetMinutes = 240, now = new Date()): {
  totalMinutes: number;
  formattedDuration: string;
  progressPercent: number;
} {
  const todayStudyEvents = events.filter(
    (e) => isSameDay(parseISO(e.startDateTime), now) && e.category === "study"
  );

  let totalMinutes = 0;
  for (const e of todayStudyEvents) {
    const start = parseISO(e.startDateTime);
    const end = parseISO(e.endDateTime);
    const mins = Math.max(differenceInMinutes(end, start), 0);
    totalMinutes += mins;
  }

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const formattedDuration = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
  const progressPercent = Math.min(Math.round((totalMinutes / targetMinutes) * 100), 100);

  return {
    totalMinutes,
    formattedDuration: totalMinutes === 0 ? "0m" : formattedDuration,
    progressPercent,
  };
}

/**
 * Find the next upcoming event from all events
 */
export function findNextUpcomingEvent(events: Schedule[], now = new Date()): {
  event: Schedule | null;
  countdown: string;
  timeRange: string;
} {
  const upcoming = events
    .filter((e) => parseISO(e.startDateTime) > now && e.status === "scheduled")
    .sort((a, b) => parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime())[0];

  if (!upcoming) {
    return {
      event: null,
      countdown: "No upcoming events",
      timeRange: "",
    };
  }

  return {
    event: upcoming,
    countdown: formatCountdown(upcoming.startDateTime, now),
    timeRange: `${formatTime(upcoming.startDateTime)} – ${formatTime(upcoming.endDateTime)}`,
  };
}

/**
 * Calculate count of pending items (assignments, exams, tasks)
 */
export function calculatePendingCount(events: Schedule[], now = new Date()): {
  total: number;
  assignments: number;
  exams: number;
} {
  const pending = events.filter(
    (e) =>
      (e.category === "assignment" || e.category === "exam") &&
      e.status === "scheduled" &&
      parseISO(e.endDateTime) >= now
  );
  const assignments = pending.filter((e) => e.category === "assignment").length;
  const exams = pending.filter((e) => e.category === "exam").length;

  return {
    total: pending.length,
    assignments,
    exams,
  };
}

/**
 * Quick filter helper for active filter counter
 */
export function countActiveFilters(filters?: {
  category?: EventCategory | "all";
  status?: Schedule["status"] | "all";
  day?: number | "all";
  hideCompleted?: boolean;
  search?: string;
}): number {
  let count = 0;
  if (filters?.category && filters.category !== "all") count++;
  if (filters?.status && filters.status !== "all") count++;
  if (filters?.day !== undefined && filters.day !== "all") count++;
  if (filters?.hideCompleted) count++;
  if (filters?.search && filters.search.trim().length > 0) count++;
  return count;
}
