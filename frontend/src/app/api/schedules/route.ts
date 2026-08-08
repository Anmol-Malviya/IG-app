import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
import { scheduleApiSchema } from "@/lib/schedule-validation";
import mongoose from "mongoose";

// Helper: Get userId from request headers (token-based from existing auth)
// The frontend passes the JWT; here we just read the userId from a custom header
// set by the client, verified against the token on the backend.
// For simplicity in this frontend-only API route, we use a demo userId approach
// tied to the x-user-id header populated by the client after login.
function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * GET /api/schedules
 * Supports: startDate, endDate, category, search, status
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
      query.startDateTime = {};
      if (startDate) query.startDateTime.$gte = new Date(startDate);
      if (endDate) query.startDateTime.$lte = new Date(endDate);
    }

    if (category) query.category = category;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { faculty: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const schedules = await Schedule.find(query)
      .sort({ startDateTime: 1 })
      .lean();

    return jsonResponse({ success: true, data: schedules });
  } catch (error) {
    console.error("[GET /api/schedules]", error);
    return jsonResponse({ success: false, error: "Failed to fetch schedules" }, 500);
  }
}

/**
 * POST /api/schedules
 * Create a new schedule event.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const body = await request.json();
    const parsed = scheduleApiSchema.safeParse(body);

    if (!parsed.success) {
      return jsonResponse(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        422
      );
    }

    await connectToDatabase();

    const data = parsed.data;

    // If this is a recurring event, assign a group ID
    const recurrenceGroupId =
      data.recurrence?.type !== "none"
        ? new mongoose.Types.ObjectId().toString()
        : undefined;

    const schedule = await Schedule.create({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      recurrenceGroupId,
      recurrence: data.recurrence ?? { type: "none" },
    });

    return jsonResponse({ success: true, data: schedule }, 201);
  } catch (error) {
    console.error("[POST /api/schedules]", error);
    return jsonResponse({ success: false, error: "Failed to create schedule" }, 500);
  }
}
