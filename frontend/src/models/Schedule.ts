import mongoose, { Document, Model, Schema } from "mongoose";
import { EventCategory, RecurrenceType, ScheduleStatus } from "@/types/schedule";

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  subject?: string;
  category: EventCategory;
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

const RecurrenceSchema = new Schema(
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

const ScheduleSchema = new Schema<ISchedule>(
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
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ["class", "lab", "study", "assignment", "exam", "personal"],
      required: true,
      index: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    faculty: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    meetingUrl: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
    },
    reminderMinutes: {
      type: Number,
      min: 0,
    },
    recurrence: {
      type: RecurrenceSchema,
      default: () => ({ type: "none" }),
    },
    recurrenceGroupId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        if (ret._id) {
          ret.id = (ret._id as { toString(): string }).toString();
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for efficient user+date range queries
ScheduleSchema.index({ userId: 1, startDateTime: 1 });
ScheduleSchema.index({ userId: 1, category: 1 });
ScheduleSchema.index({ userId: 1, recurrenceGroupId: 1 });

// Prevent model recompilation in Next.js hot reload
const Schedule: Model<ISchedule> =
  mongoose.models.Schedule ||
  mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;
