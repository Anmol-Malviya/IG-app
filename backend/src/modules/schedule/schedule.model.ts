import mongoose, { Document, Schema } from "mongoose";

export type ScheduleCategory =
  | "class"
  | "lab"
  | "study"
  | "assignment"
  | "exam"
  | "personal";

export type ScheduleStatus = "scheduled" | "completed" | "cancelled";
export type RecurrenceType = "none" | "daily" | "weekly" | "custom";

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  subject?: string;
  category: ScheduleCategory;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  faculty?: string;
  meetingUrl?: string;
  color?: string;
  reminderMinutes?: number;
  recurrence: {
    type: RecurrenceType;
    weekdays?: number[];
    until?: Date;
  };
  recurrenceGroupId?: string;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

const recurrenceSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["none", "daily", "weekly", "custom"],
      default: "none",
    },
    weekdays: {
      type: [Number],
      default: undefined,
    },
    until: {
      type: Date,
      default: undefined,
    },
  },
  { _id: false }
);

const scheduleSchema = new Schema<ISchedule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: { type: String, trim: true, maxlength: 1000 },
    subject: { type: String, trim: true, maxlength: 100 },
    category: {
      type: String,
      enum: ["class", "lab", "study", "assignment", "exam", "personal"],
      required: true,
      index: true,
    },
    startDateTime: { type: Date, required: true, index: true },
    endDateTime: { type: Date, required: true },
    location: { type: String, trim: true, maxlength: 200 },
    faculty: { type: String, trim: true, maxlength: 100 },
    meetingUrl: { type: String, trim: true },
    color: { type: String, trim: true },
    reminderMinutes: { type: Number, min: 0 },
    recurrence: {
      type: recurrenceSchema,
      default: () => ({ type: "none" }),
    },
    recurrenceGroupId: { type: String, index: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

scheduleSchema.index({ userId: 1, startDateTime: 1 });
scheduleSchema.index({ userId: 1, category: 1, status: 1 });
scheduleSchema.index({ userId: 1, recurrenceGroupId: 1 });

export const Schedule = mongoose.model<ISchedule>("Schedule", scheduleSchema);
