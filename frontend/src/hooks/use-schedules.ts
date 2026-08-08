"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import {
  EditRecurrenceScope,
  Schedule,
  ScheduleFilters,
} from "@/types/schedule";

function buildScheduleQuery(filters?: ScheduleFilters): string {
  const params = new URLSearchParams();

  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.category && filters.category !== "all") {
    params.set("category", filters.category);
  }
  if (filters?.search?.trim()) params.set("search", filters.search.trim());
  if (filters?.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters?.hideCompleted) params.set("hideCompleted", "true");

  const query = params.toString();
  return query ? `?${query}` : "";
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function getPersistedScheduleId(id: string): string {
  return id.split("_")[0] || id;
}

export function useSchedules(filters?: ScheduleFilters) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedEvent, setDeletedEvent] = useState<Schedule | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startDate = filters?.startDate;
  const endDate = filters?.endDate;
  const category = filters?.category;
  const search = filters?.search;
  const status = filters?.status;
  const hideCompleted = filters?.hideCompleted;

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Schedule[]>(
        `/schedules${buildScheduleQuery({
          startDate,
          endDate,
          category,
          search,
          status,
          hideCompleted,
        })}`
      );
      setSchedules(response.data ?? []);
    } catch (requestError) {
      setSchedules([]);
      setError(getErrorMessage(requestError, "Unable to load your schedule"));
    } finally {
      setIsLoading(false);
    }
  }, [category, endDate, hideCompleted, search, startDate, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSchedules();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchSchedules]);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  const createSchedule = useCallback(
    async (data: Partial<Schedule>): Promise<Schedule> => {
      const response = await api.post<Schedule>("/schedules", data);
      const created = response.data;

      if (!created) throw new Error("Schedule was not created");
      await fetchSchedules();
      return created;
    },
    [fetchSchedules]
  );

  const updateSchedule = useCallback(
    async (
      id: string,
      data: Partial<Schedule>,
      scope: EditRecurrenceScope = "this"
    ): Promise<void> => {
      const persistedId = getPersistedScheduleId(id);
      await api.patch(`/schedules/${persistedId}?scope=${scope}`, data);
      await fetchSchedules();
    },
    [fetchSchedules]
  );

  const deleteSchedule = useCallback(
    async (id: string, scope: EditRecurrenceScope = "this"): Promise<void> => {
      const persistedId = getPersistedScheduleId(id);
      const target =
        schedules.find((schedule) => schedule._id === persistedId) ?? null;
      await api.delete(`/schedules/${persistedId}?scope=${scope}`);

      setDeletedEvent(target);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => setDeletedEvent(null), 8000);
      await fetchSchedules();
    },
    [fetchSchedules, schedules]
  );

  const undoDelete = useCallback(async (): Promise<void> => {
    if (!deletedEvent) return;

    const restorableData: Partial<Schedule> = {
      title: deletedEvent.title,
      description: deletedEvent.description,
      subject: deletedEvent.subject,
      category: deletedEvent.category,
      startDateTime: deletedEvent.startDateTime,
      endDateTime: deletedEvent.endDateTime,
      location: deletedEvent.location,
      faculty: deletedEvent.faculty,
      meetingUrl: deletedEvent.meetingUrl,
      color: deletedEvent.color,
      reminderMinutes: deletedEvent.reminderMinutes,
      recurrence: deletedEvent.recurrence,
      status: deletedEvent.status,
    };

    await api.post<Schedule>("/schedules", restorableData);
    setDeletedEvent(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    await fetchSchedules();
  }, [deletedEvent, fetchSchedules]);

  const duplicateSchedule = useCallback(
    async (id: string): Promise<Schedule | null> => {
      const persistedId = getPersistedScheduleId(id);
      const response = await api.post<Schedule>(
        `/schedules/${persistedId}/duplicate`
      );
      await fetchSchedules();
      return response.data ?? null;
    },
    [fetchSchedules]
  );

  const updateStatus = useCallback(
    async (id: string, nextStatus: Schedule["status"]): Promise<void> => {
      const persistedId = getPersistedScheduleId(id);
      await api.patch(`/schedules/${persistedId}`, { status: nextStatus });
      setSchedules((current) =>
        current.map((schedule) =>
          schedule._id === persistedId
            ? { ...schedule, status: nextStatus }
            : schedule
        )
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
