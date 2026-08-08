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
  category?: EventCategory | "all";
  search?: string;
  status?: ScheduleStatus | "all";
  hideCompleted?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type EditRecurrenceScope = "this" | "future" | "all";

export interface CategoryStyle {
  label: string;
  color: string;
  accentColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORY_CONFIG: Record<EventCategory, CategoryStyle> = {
  class: {
    label: "Class",
    color: "#4f46e5",
    accentColor: "#6366f1",
    bgClass: "bg-[#eef2ff]",
    borderClass: "border-[#818cf8]",
    textClass: "text-[#312e81]",
    badgeBg: "bg-[#e0e7ff]",
    badgeText: "text-[#4338ca]",
  },
  lab: {
    label: "Lab",
    color: "#0891b2",
    accentColor: "#06b6d4",
    bgClass: "bg-[#ecfeff]",
    borderClass: "border-[#38bdf8]",
    textClass: "text-[#164e63]",
    badgeBg: "bg-[#cffafe]",
    badgeText: "text-[#0e7490]",
  },
  study: {
    label: "Study",
    color: "#059669",
    accentColor: "#10b981",
    bgClass: "bg-[#ecfdf5]",
    borderClass: "border-[#34d399]",
    textClass: "text-[#064e3b]",
    badgeBg: "bg-[#d1fae5]",
    badgeText: "text-[#047857]",
  },
  assignment: {
    label: "Assignment",
    color: "#d97706",
    accentColor: "#f59e0b",
    bgClass: "bg-[#fffbeb]",
    borderClass: "border-[#fbbf24]",
    textClass: "text-[#78350f]",
    badgeBg: "bg-[#fef3c7]",
    badgeText: "text-[#b45309]",
  },
  exam: {
    label: "Exam",
    color: "#dc2626",
    accentColor: "#ef4444",
    bgClass: "bg-[#fef2f2]",
    borderClass: "border-[#f87171]",
    textClass: "text-[#7f1d1d]",
    badgeBg: "bg-[#fee2e2]",
    badgeText: "text-[#b91c1c]",
  },
  personal: {
    label: "Personal",
    color: "#7c3aed",
    accentColor: "#8b5cf6",
    bgClass: "bg-[#faf5ff]",
    borderClass: "border-[#c084fc]",
    textClass: "text-[#581c87]",
    badgeBg: "bg-[#f3e8ff]",
    badgeText: "text-[#6d28d9]",
  },
};

