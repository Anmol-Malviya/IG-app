import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid schedule ID");

const recurrenceSchema = z.object({
  type: z.enum(["none", "daily", "weekly", "custom"]),
  weekdays: z.array(z.number().int().min(0).max(6)).optional(),
  until: z.string().datetime().optional(),
});

const scheduleFields = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  subject: z.string().trim().max(100).optional(),
  category: z.enum(["class", "lab", "study", "assignment", "exam", "personal"]),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  location: z.string().trim().max(200).optional(),
  faculty: z.string().trim().max(100).optional(),
  meetingUrl: z.url().optional(),
  color: z.string().trim().max(40).optional(),
  reminderMinutes: z.number().int().min(0).max(10080).optional(),
  recurrence: recurrenceSchema.optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
});

export const createScheduleSchema = scheduleFields.refine(
  (data) => new Date(data.startDateTime) < new Date(data.endDateTime),
  { path: ["endDateTime"], message: "End time must be after start time" }
);

export const updateScheduleSchema = scheduleFields.partial();

export const scheduleIdSchema = z.object({ id: objectIdSchema });

export const scheduleQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  category: z
    .enum(["class", "lab", "study", "assignment", "exam", "personal"])
    .optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  search: z.string().trim().max(100).optional(),
  hideCompleted: z.enum(["true", "false"]).optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
