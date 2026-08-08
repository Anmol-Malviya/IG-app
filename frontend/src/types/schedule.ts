/**
 * Schedule types for the Weekly Scheduler module.
 */

export type EventCategory =
  | "class"
  | "lab"
  | "study"
  | "assignment"
  | "exam"
  | "personal";

export type RecurrenceType = "none" | "daily" | "weekly" | "custom";

export type ScheduleStatus = "scheduled" | "completed" | "cancelled";

export interface Recurrence {
  type: RecurrenceType;
  weekdays?: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  until?: string; // ISO date string
}

export interface Schedule {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: string;
  category: EventCategory;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  location?: string;
  faculty?: string;
  meetingUrl?: string;
  color?: string;
  reminderMinutes?: number;
  recurrence: Recurrence;
  recurrenceGroupId?: string;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormValues {
  title: string;
  category: EventCategory;
  subject?: string;
  description?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  faculty?: string;
  meetingUrl?: string;
  color?: string;
  reminderMinutes?: number;
  recurrenceType: RecurrenceType;
  recurrenceWeekdays?: number[];
  recurrenceUntil?: string;
}

export interface QuickAddValues {
  title: string;
  category: EventCategory;
  startDate: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleFilters {
  startDate?: string;
  endDate?: string;
  category?: EventCategory;
  search?: string;
  status?: ScheduleStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type EditRecurrenceScope = "this" | "future" | "all";

export const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; color: string; bgClass: string; borderClass: string; textClass: string }
> = {
  class: {
    label: "Class",
    color: "#6366f1",
    bgClass: "bg-indigo-100",
    borderClass: "border-indigo-400",
    textClass: "text-indigo-700",
  },
  lab: {
    label: "Lab",
    color: "#06b6d4",
    bgClass: "bg-cyan-100",
    borderClass: "border-cyan-400",
    textClass: "text-cyan-700",
  },
  study: {
    label: "Study",
    color: "#22c55e",
    bgClass: "bg-green-100",
    borderClass: "border-green-400",
    textClass: "text-green-700",
  },
  assignment: {
    label: "Assignment",
    color: "#f97316",
    bgClass: "bg-orange-100",
    borderClass: "border-orange-400",
    textClass: "text-orange-700",
  },
  exam: {
    label: "Exam",
    color: "#ef4444",
    bgClass: "bg-red-100",
    borderClass: "border-red-400",
    textClass: "text-red-700",
  },
  personal: {
    label: "Personal",
    color: "#a855f7",
    bgClass: "bg-purple-100",
    borderClass: "border-purple-400",
    textClass: "text-purple-700",
  },
};
