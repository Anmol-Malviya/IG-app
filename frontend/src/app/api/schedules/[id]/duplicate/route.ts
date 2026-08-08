import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
import mongoose from "mongoose";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * POST /api/schedules/[id]/duplicate
 * Duplicate a schedule event.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) return jsonResponse({ success: false, error: "Unauthorized" }, 401);

    const { id } = await params;
    await connectToDatabase();

    const original = await Schedule.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    if (!original) {
      return jsonResponse({ success: false, error: "Schedule not found" }, 404);
    }

    // Create a duplicate without _id, timestamps, or recurrence group
    const {
      _id,
      createdAt,
      updatedAt,
      recurrenceGroupId,
      __v,
      ...duplicateData
    } = original as Record<string, unknown>;

    const duplicate = await Schedule.create({
      ...duplicateData,
      title: `${original.title} (Copy)`,
      recurrence: { type: "none" },
      status: "scheduled",
    });

    return jsonResponse({ success: true, data: duplicate }, 201);
  } catch (error) {
    console.error("[POST /api/schedules/[id]/duplicate]", error);
    return jsonResponse({ success: false, error: "Failed to duplicate schedule" }, 500);
  }
}
