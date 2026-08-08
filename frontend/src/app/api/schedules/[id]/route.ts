import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
import { scheduleApiSchema } from "@/lib/schedule-validation";
import mongoose from "mongoose";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * GET /api/schedules/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) return jsonResponse({ success: false, error: "Unauthorized" }, 401);

    const { id } = await params;
    await connectToDatabase();

    const schedule = await Schedule.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    if (!schedule) {
      return jsonResponse({ success: false, error: "Schedule not found" }, 404);
    }

    return jsonResponse({ success: true, data: schedule });
  } catch (error) {
    console.error("[GET /api/schedules/[id]]", error);
    return jsonResponse({ success: false, error: "Failed to fetch schedule" }, 500);
  }
}

/**
 * PATCH /api/schedules/[id]
 * Supports ?scope=this|future|all for recurring events.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) return jsonResponse({ success: false, error: "Unauthorized" }, 401);

    const { id } = await params;
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "this";

    await connectToDatabase();

    const existing = await Schedule.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!existing) {
      return jsonResponse({ success: false, error: "Schedule not found" }, 404);
    }

    // Handle status-only updates
    if (body.status && Object.keys(body).length === 1) {
      existing.status = body.status;
      await existing.save();
      return jsonResponse({ success: true, data: existing });
    }

    if (scope === "all" && existing.recurrenceGroupId) {
      // Update all events in the recurrence group
      await Schedule.updateMany(
        {
          userId: new mongoose.Types.ObjectId(userId),
          recurrenceGroupId: existing.recurrenceGroupId,
        },
        { $set: body }
      );
      const updated = await Schedule.find({
        userId: new mongoose.Types.ObjectId(userId),
        recurrenceGroupId: existing.recurrenceGroupId,
      }).lean();
      return jsonResponse({ success: true, data: updated });
    }

    if (scope === "future" && existing.recurrenceGroupId) {
      // Update this and all future events in the group
      await Schedule.updateMany(
        {
          userId: new mongoose.Types.ObjectId(userId),
          recurrenceGroupId: existing.recurrenceGroupId,
          startDateTime: { $gte: existing.startDateTime },
        },
        { $set: body }
      );
      const updated = await Schedule.find({
        userId: new mongoose.Types.ObjectId(userId),
        recurrenceGroupId: existing.recurrenceGroupId,
      }).lean();
      return jsonResponse({ success: true, data: updated });
    }

    // Default: update just this event
    Object.assign(existing, body);
    await existing.save();

    return jsonResponse({ success: true, data: existing });
  } catch (error) {
    console.error("[PATCH /api/schedules/[id]]", error);
    return jsonResponse({ success: false, error: "Failed to update schedule" }, 500);
  }
}

/**
 * DELETE /api/schedules/[id]
 * Supports ?scope=this|future|all for recurring events.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) return jsonResponse({ success: false, error: "Unauthorized" }, 401);

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "this";

    await connectToDatabase();

    const existing = await Schedule.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!existing) {
      return jsonResponse({ success: false, error: "Schedule not found" }, 404);
    }

    if (scope === "all" && existing.recurrenceGroupId) {
      const result = await Schedule.deleteMany({
        userId: new mongoose.Types.ObjectId(userId),
        recurrenceGroupId: existing.recurrenceGroupId,
      });
      return jsonResponse({
        success: true,
        data: { deletedCount: result.deletedCount },
      });
    }

    if (scope === "future" && existing.recurrenceGroupId) {
      const result = await Schedule.deleteMany({
        userId: new mongoose.Types.ObjectId(userId),
        recurrenceGroupId: existing.recurrenceGroupId,
        startDateTime: { $gte: existing.startDateTime },
      });
      return jsonResponse({
        success: true,
        data: { deletedCount: result.deletedCount },
      });
    }

    await Schedule.deleteOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
    return jsonResponse({ success: true, data: { deletedCount: 1 } });
  } catch (error) {
    console.error("[DELETE /api/schedules/[id]]", error);
    return jsonResponse({ success: false, error: "Failed to delete schedule" }, 500);
  }
}
