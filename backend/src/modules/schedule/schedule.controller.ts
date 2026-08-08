import { Request, Response } from "express";
import mongoose from "mongoose";
import { apiResponse } from "../../shared/utils/apiResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AppError } from "../../shared/errors/AppError";
import { Schedule } from "./schedule.model";
import { scheduleQuerySchema } from "./schedule.validation";

function userObjectId(req: Request): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(req.user!.userId);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findOwnedSchedule(req: Request) {
  const schedule = await Schedule.findOne({
    _id: req.params.id,
    userId: userObjectId(req),
  });

  if (!schedule) throw AppError.notFound("Schedule not found");
  return schedule;
}

export class ScheduleController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const parsedQuery = scheduleQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      throw AppError.validationError(
        "Invalid schedule filters",
        parsedQuery.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      );
    }

    const conditions: Record<string, unknown>[] = [{ userId: userObjectId(req) }];
    const { startDate, endDate, category, status, search, hideCompleted } =
      parsedQuery.data;

    if (startDate || endDate) {
      const dateRange: { $gte?: Date; $lte?: Date } = {};
      if (startDate) dateRange.$gte = new Date(startDate);
      if (endDate) dateRange.$lte = new Date(endDate);

      const dateConditions: Record<string, unknown>[] = [
        { startDateTime: dateRange },
      ];

      if (endDate) {
        const recurrenceConditions: Record<string, unknown> = {
          "recurrence.type": { $ne: "none" },
          startDateTime: { $lte: new Date(endDate) },
        };
        if (startDate) {
          recurrenceConditions.$or = [
            { "recurrence.until": { $gte: new Date(startDate) } },
            { "recurrence.until": { $exists: false } },
          ];
        }
        dateConditions.push(recurrenceConditions);
      }

      conditions.push({ $or: dateConditions });
    }

    if (category) conditions.push({ category });
    if (status) conditions.push({ status });
    if (hideCompleted === "true" && !status) {
      conditions.push({ status: { $ne: "completed" } });
    }

    if (search) {
      const safeSearch = escapeRegExp(search);
      conditions.push({
        $or: ["title", "subject", "faculty", "location"].map((field) => ({
          [field]: { $regex: safeSearch, $options: "i" },
        })),
      });
    }

    const query = conditions.length === 1 ? conditions[0] : { $and: conditions };
    const schedules = await Schedule.find(query).sort({ startDateTime: 1 }).lean();
    apiResponse.success(res, schedules, "Schedules fetched");
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const recurrenceGroupId =
      req.body.recurrence?.type && req.body.recurrence.type !== "none"
        ? new mongoose.Types.ObjectId().toString()
        : undefined;

    const schedule = await Schedule.create({
      ...req.body,
      userId: userObjectId(req),
      recurrence: req.body.recurrence ?? { type: "none" },
      recurrenceGroupId,
    });

    apiResponse.created(res, schedule, "Schedule created");
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const schedule = await findOwnedSchedule(req);
    apiResponse.success(res, schedule, "Schedule fetched");
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const existing = await findOwnedSchedule(req);
    const scope = req.query.scope;
    const nextStart = req.body.startDateTime
      ? new Date(req.body.startDateTime)
      : existing.startDateTime;
    const nextEnd = req.body.endDateTime
      ? new Date(req.body.endDateTime)
      : existing.endDateTime;

    if (nextStart >= nextEnd) {
      throw AppError.badRequest("End time must be after start time");
    }

    const owner = userObjectId(req);
    if ((scope === "all" || scope === "future") && existing.recurrenceGroupId) {
      const groupQuery: Record<string, unknown> = {
        userId: owner,
        recurrenceGroupId: existing.recurrenceGroupId,
      };
      if (scope === "future") {
        groupQuery.startDateTime = { $gte: existing.startDateTime };
      }

      await Schedule.updateMany(groupQuery, { $set: req.body }, { runValidators: true });
      const updated = await Schedule.find(groupQuery).sort({ startDateTime: 1 }).lean();
      apiResponse.success(res, updated, "Schedule series updated");
      return;
    }

    existing.set(req.body);
    await existing.save();
    apiResponse.success(res, existing, "Schedule updated");
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const existing = await findOwnedSchedule(req);
    const scope = req.query.scope;
    const owner = userObjectId(req);

    if ((scope === "all" || scope === "future") && existing.recurrenceGroupId) {
      const groupQuery: Record<string, unknown> = {
        userId: owner,
        recurrenceGroupId: existing.recurrenceGroupId,
      };
      if (scope === "future") {
        groupQuery.startDateTime = { $gte: existing.startDateTime };
      }
      await Schedule.deleteMany(groupQuery);
    } else {
      await existing.deleteOne();
    }

    apiResponse.success(res, { id: existing.id }, "Schedule deleted");
  });

  static duplicate = asyncHandler(async (req: Request, res: Response) => {
    const original = await findOwnedSchedule(req);
    const duplicate = await Schedule.create({
      userId: userObjectId(req),
      title: `${original.title} (Copy)`,
      description: original.description,
      subject: original.subject,
      category: original.category,
      startDateTime: original.startDateTime,
      endDateTime: original.endDateTime,
      location: original.location,
      faculty: original.faculty,
      meetingUrl: original.meetingUrl,
      color: original.color,
      reminderMinutes: original.reminderMinutes,
      recurrence: { type: "none" },
      status: "scheduled",
    });

    apiResponse.created(res, duplicate, "Schedule duplicated");
  });
}
