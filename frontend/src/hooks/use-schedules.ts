/**
 * Custom hook for managing schedule data with seed data matching design mockup.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Schedule,
  ScheduleFilters,
  EventCategory,
  EditRecurrenceScope,
} from "@/types/schedule";

const STORAGE_KEY = "ig_schedules_v3";

function generateId(): string {
  return `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultSchedules(): Schedule[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const makeDate = (dayIndex: number, hours: number, minutes: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + dayIndex);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const sampleEvents: Array<{
    title: string;
    category: EventCategory;
    location?: string;
    subject?: string;
    faculty?: string;
    dayIndex: number;
    startH: number;
    startM: number;
    endH: number;
    endM: number;
  }> = [
    // ── Monday (Day 0) ──
    { title: "Data Structures", category: "class", location: "Room B-201", subject: "CS", faculty: "Prof. Sharma", dayIndex: 0, startH: 9, startM: 0, endH: 10, endM: 0 },
    { title: "Assignment Due", category: "assignment", location: "Submit on LMS", subject: "CS", dayIndex: 0, startH: 13, startM: 0, endH: 14, endM: 0 },
    { title: "Cyber Security Lab", category: "lab", location: "Lab 3", subject: "Security", faculty: "Prof. Mehta", dayIndex: 0, startH: 15, startM: 0, endH: 17, endM: 0 },

    // ── Tuesday (Day 1) ──
    { title: "Cyber Security Lab", category: "lab", location: "Lab 3", subject: "Security", faculty: "Prof. Mehta", dayIndex: 1, startH: 9, startM: 0, endH: 11, endM: 0 },
    { title: "Study Session", category: "study", location: "Library", subject: "Self Study", dayIndex: 1, startH: 11, startM: 15, endH: 12, endM: 45 },
    { title: "Study Session", category: "study", location: "Library", subject: "Self Study", dayIndex: 1, startH: 15, startM: 0, endH: 16, endM: 30 },

    // ── Wednesday (Day 2) ──
    { title: "Data Structures", category: "class", location: "Room B-201", subject: "CS", faculty: "Prof. Sharma", dayIndex: 2, startH: 9, startM: 0, endH: 10, endM: 0 },
    { title: "Study Session", category: "study", location: "Library", subject: "Self Study", dayIndex: 2, startH: 13, startM: 0, endH: 14, endM: 30 },

    // ── Thursday (Day 3) ──
    { title: "Project Work", category: "study", location: "Team Room", subject: "Capstone", dayIndex: 3, startH: 9, startM: 0, endH: 11, endM: 0 },
    { title: "Project Work", category: "study", location: "Team Room", subject: "Capstone", dayIndex: 3, startH: 11, startM: 15, endH: 13, endM: 15 },
    { title: "Personal Time", category: "personal", location: "Reading", dayIndex: 3, startH: 15, startM: 0, endH: 16, endM: 0 },

    // ── Friday (Day 4) ──
    { title: "Data Structures", category: "class", location: "Room B-201", subject: "CS", faculty: "Prof. Sharma", dayIndex: 4, startH: 9, startM: 0, endH: 10, endM: 0 },
    { title: "Midterm Exam", category: "exam", location: "Hall A", subject: "Mathematics", dayIndex: 4, startH: 11, startM: 30, endH: 13, endM: 30 },
    { title: "Assignment Due", category: "assignment", location: "Submit on LMS", dayIndex: 4, startH: 14, startM: 0, endH: 15, endM: 0 },
    { title: "Project Work", category: "study", location: "Team Room", dayIndex: 4, startH: 15, startM: 0, endH: 16, endM: 30 },

    // ── Saturday (Day 5) ──
    { title: "Cyber Security Lab", category: "lab", location: "Lab 3", subject: "Security", faculty: "Prof. Mehta", dayIndex: 5, startH: 9, startM: 0, endH: 11, endM: 0 },
    { title: "Personal Time", category: "personal", location: "Gym", dayIndex: 5, startH: 13, startM: 0, endH: 14, endM: 0 },
    { title: "Assignment Due", category: "assignment", location: "Submit on LMS", dayIndex: 5, startH: 14, startM: 0, endH: 15, endM: 0 },
    { title: "Project Work", category: "study", location: "Team Room", dayIndex: 5, startH: 15, startM: 0, endH: 16, endM: 30 },
    { title: "Personal Time", category: "personal", location: "Reading", dayIndex: 5, startH: 17, startM: 0, endH: 18, endM: 0 },

    // ── Sunday (Day 6) ──
    { title: "Weekly Revision", category: "study", location: "Home Desk", dayIndex: 6, startH: 10, startM: 0, endH: 12, endM: 0 },
  ];

  return sampleEvents.map((ev, idx) => ({
    _id: `mock_${idx}_${Date.now()}`,
    userId: "local",
    title: ev.title,
    category: ev.category,
    faculty: ev.faculty,
    location: ev.location,
    subject: ev.subject,
    startDateTime: makeDate(ev.dayIndex, ev.startH, ev.startM),
    endDateTime: makeDate(ev.dayIndex, ev.endH, ev.endM),
    recurrence: { type: "none" },
    status: "scheduled",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function readStorage(): Schedule[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    const initial = getDefaultSchedules();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return [];
  }
}

function writeStorage(schedules: Schedule[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

export function useSchedules(filters?: ScheduleFilters) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedEvent, setDeletedEvent] = useState<Schedule | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSchedules = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      let all = readStorage();

      if (filters?.startDate) {
        const start = new Date(filters.startDate);
        all = all.filter((s) => new Date(s.startDateTime) >= start);
      }
      if (filters?.endDate) {
        const end = new Date(filters.endDate);
        all = all.filter((s) => new Date(s.startDateTime) <= end);
      }
      if (filters?.category) {
        all = all.filter((s) => s.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        all = all.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.subject?.toLowerCase().includes(q) ||
            s.faculty?.toLowerCase().includes(q) ||
            s.location?.toLowerCase().includes(q)
        );
      }
      if (filters?.status) {
        all = all.filter((s) => s.status === filters.status);
      }

      all.sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      );

      setSchedules(all);
    } catch {
      setError("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }, [
    filters?.startDate,
    filters?.endDate,
    filters?.category,
    filters?.search,
    filters?.status,
  ]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createSchedule = useCallback(
    async (data: Partial<Schedule>): Promise<Schedule> => {
      const now = new Date().toISOString();
      const newSchedule: Schedule = {
        _id: generateId(),
        userId: "local",
        title: data.title || "Untitled",
        description: data.description,
        subject: data.subject,
        category: data.category || "class",
        startDateTime: data.startDateTime || now,
        endDateTime: data.endDateTime || now,
        location: data.location,
        faculty: data.faculty,
        meetingUrl: data.meetingUrl,
        color: data.color,
        reminderMinutes: data.reminderMinutes,
        recurrence: data.recurrence || { type: "none" },
        recurrenceGroupId: data.recurrence?.type !== "none" ? generateId() : undefined,
        status: data.status || "scheduled",
        createdAt: now,
        updatedAt: now,
      };

      const all = readStorage();
      all.push(newSchedule);
      writeStorage(all);

      setSchedules((prev) =>
        [...prev, newSchedule].sort(
          (a, b) =>
            new Date(a.startDateTime).getTime() -
            new Date(b.startDateTime).getTime()
        )
      );

      return newSchedule;
    },
    []
  );

  const updateSchedule = useCallback(
    async (
      id: string,
      data: Partial<Schedule>,
      scope: EditRecurrenceScope = "this"
    ): Promise<void> => {
      const all = readStorage();
      const idx = all.findIndex((s) => s._id === id);
      if (idx === -1) throw new Error("Schedule not found");

      const now = new Date().toISOString();

      if (scope === "this") {
        all[idx] = { ...all[idx], ...data, updatedAt: now };
      } else if (scope === "all" && all[idx].recurrenceGroupId) {
        const groupId = all[idx].recurrenceGroupId;
        for (let i = 0; i < all.length; i++) {
          if (all[i].recurrenceGroupId === groupId) {
            all[i] = { ...all[i], ...data, updatedAt: now };
          }
        }
      } else if (scope === "future" && all[idx].recurrenceGroupId) {
        const groupId = all[idx].recurrenceGroupId;
        const cutoff = new Date(all[idx].startDateTime);
        for (let i = 0; i < all.length; i++) {
          if (
            all[i].recurrenceGroupId === groupId &&
            new Date(all[i].startDateTime) >= cutoff
          ) {
            all[i] = { ...all[i], ...data, updatedAt: now };
          }
        }
      }

      writeStorage(all);
      fetchSchedules();
    },
    [fetchSchedules]
  );

  const deleteSchedule = useCallback(
    async (id: string, scope: EditRecurrenceScope = "this"): Promise<void> => {
      const all = readStorage();
      const target = all.find((s) => s._id === id);

      if (target) {
        setDeletedEvent(target);
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = setTimeout(() => setDeletedEvent(null), 8000);
      }

      let filtered: Schedule[];
      if (scope === "all" && target?.recurrenceGroupId) {
        filtered = all.filter((s) => s.recurrenceGroupId !== target.recurrenceGroupId);
      } else if (scope === "future" && target?.recurrenceGroupId) {
        const cutoff = new Date(target.startDateTime);
        filtered = all.filter(
          (s) =>
            s.recurrenceGroupId !== target.recurrenceGroupId ||
            new Date(s.startDateTime) < cutoff
        );
      } else {
        filtered = all.filter((s) => s._id !== id);
      }

      writeStorage(filtered);
      setSchedules((prev) => prev.filter((s) => s._id !== id));
      fetchSchedules();
    },
    [fetchSchedules]
  );

  const undoDelete = useCallback(async () => {
    if (!deletedEvent) return;
    const all = readStorage();
    all.push(deletedEvent);
    writeStorage(all);
    setDeletedEvent(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    fetchSchedules();
  }, [deletedEvent, fetchSchedules]);

  const duplicateSchedule = useCallback(
    async (id: string): Promise<Schedule | null> => {
      const all = readStorage();
      const original = all.find((s) => s._id === id);
      if (!original) return null;

      const now = new Date().toISOString();
      const duplicate: Schedule = {
        ...original,
        _id: generateId(),
        title: `${original.title} (Copy)`,
        recurrence: { type: "none" },
        recurrenceGroupId: undefined,
        status: "scheduled",
        createdAt: now,
        updatedAt: now,
      };

      all.push(duplicate);
      writeStorage(all);

      setSchedules((prev) =>
        [...prev, duplicate].sort(
          (a, b) =>
            new Date(a.startDateTime).getTime() -
            new Date(b.startDateTime).getTime()
        )
      );

      return duplicate;
    },
    []
  );

  const updateStatus = useCallback(
    async (id: string, status: Schedule["status"]): Promise<void> => {
      const all = readStorage();
      const idx = all.findIndex((s) => s._id === id);
      if (idx === -1) return;

      all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
      writeStorage(all);

      setSchedules((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );
    },
    []
  );

  return {
    schedules,
    isLoading,
    error,
    deletedEvent,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    duplicateSchedule,
    updateStatus,
    undoDelete,
  };
}
