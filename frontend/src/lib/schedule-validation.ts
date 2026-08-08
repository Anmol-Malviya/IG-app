/**
 * Zod validation schemas for schedule forms and API inputs.
 */

import { z } from "zod";

const urlRegex = /^https?:\/\/.+/;

export const recurrenceSchema = z.object({
  type: z.enum(["none", "daily", "weekly", "custom"]),
  weekdays: z.array(z.number().min(0).max(6)).optional(),
  until: z.string().optional(),
});

export const scheduleApiSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  description: z.string().max(1000).optional(),
  subject: z.string().max(100).optional(),
  category: z.enum(["class", "lab", "study", "assignment", "exam", "personal"]),
  startDateTime: z.string().datetime({ message: "Invalid start date/time" }),
  endDateTime: z.string().datetime({ message: "Invalid end date/time" }),
  location: z.string().max(200).optional(),
  faculty: z.string().max(100).optional(),
  meetingUrl: z
    .string()
    .refine((val) => !val || urlRegex.test(val), {
      message: "Meeting URL must start with http:// or https://",
    })
    .optional(),
  color: z.string().optional(),
  reminderMinutes: z.number().min(0).optional(),
  recurrence: recurrenceSchema.optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
}).refine(
  (data) => new Date(data.startDateTime) < new Date(data.endDateTime),
  {
    message: "Start time must be before end time",
    path: ["endDateTime"],
  }
);

export const quickAddSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  category: z.enum(["class", "lab", "study", "assignment", "exam", "personal"]),
  startDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine(
  (data) => data.startTime < data.endTime,
  {
    message: "Start time must be before end time",
    path: ["endTime"],
  }
);

export const scheduleFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title too long"),
    category: z.enum(["class", "lab", "study", "assignment", "exam", "personal"]),
    subject: z.string().max(100).optional().or(z.literal("")),
    description: z.string().max(1000).optional().or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    location: z.string().max(200).optional().or(z.literal("")),
    faculty: z.string().max(100).optional().or(z.literal("")),
    meetingUrl: z
      .string()
      .refine((val) => !val || urlRegex.test(val), {
        message: "Must be a valid URL starting with http:// or https://",
      })
      .optional()
      .or(z.literal("")),
    color: z.string().optional(),
    reminderMinutes: z.number().min(0).optional(),
    recurrenceType: z.enum(["none", "daily", "weekly", "custom"]),
    recurrenceWeekdays: z.array(z.number()).optional(),
    recurrenceUntil: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  });

export type ScheduleApiInput = z.infer<typeof scheduleApiSchema>;
export type ScheduleFormInput = z.infer<typeof scheduleFormSchema>;
export type QuickAddInput = z.infer<typeof quickAddSchema>;
