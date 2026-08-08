"use client";

import { useCallback, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useSchedules } from "@/hooks/use-schedules";
import { useSchedulerView } from "@/hooks/use-scheduler-view";
import { Schedule, ScheduleStatus } from "@/types/schedule";
import {
  endOfDay,
  format,
  getWeekDays,
  isSameDay,
  nextDay,
  parseISO,
  prevDay,
  startOfDay,
} from "@/lib/date-utils";
import { mergeWithRecurringOccurrences } from "@/lib/recurrence";
import { countActiveFilters } from "@/lib/scheduler-helpers";
import { PlannerShell } from "@/components/scheduler/planner-shell";
import { PlannerOverview } from "@/components/scheduler/planner-overview";
import {
  PlannerFilterState,
  PlannerToolbar,
} from "@/components/scheduler/planner-toolbar";
import { PlannerCalendar } from "@/components/scheduler/planner-calendar";
import { PlannerAgenda } from "@/components/scheduler/planner-agenda";
import { PlannerMobile } from "@/components/scheduler/planner-mobile";
import {
  EventEditorDialog,
  EventEditorPayload,
} from "@/components/scheduler/event-editor-dialog";
import { EventDetailsDialog } from "@/components/scheduler/event-details-dialog";
import { PlannerLoading, PlannerState } from "@/components/scheduler/planner-state";

const emptyFilters: PlannerFilterState = {
  category: "all",
  status: "all",
  day: "all",
  hideCompleted: false,
};

interface EditorInitialState {
  date: string;
  startTime: string;
  endTime: string;
}

export default function WeeklySchedulePage() {
  const { user } = useAuth();
  const {
    currentDate,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    goToToday,
    goNextWeek,
    goPrevWeek,
  } = useSchedulerView();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PlannerFilterState>(emptyFilters);
  const [detailsEvent, setDetailsEvent] = useState<Schedule | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorEvent, setEditorEvent] = useState<Schedule | null>(null);
  const [editorInitial, setEditorInitial] = useState<EditorInitialState>(() => ({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
  }));

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const fetchRange = useMemo(() => {
    const start = new Date(weekDays[0]);
    start.setDate(start.getDate() - 7);
    const end = new Date(weekDays[6]);
    end.setDate(end.getDate() + 14);
    return {
      startDate: startOfDay(start).toISOString(),
      endDate: endOfDay(end).toISOString(),
    };
  }, [weekDays]);

  const scheduleFilters = useMemo(
    () => ({
      startDate: fetchRange.startDate,
      endDate: fetchRange.endDate,
    }),
    [fetchRange]
  );

  const {
    schedules,
    isLoading,
    error,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    duplicateSchedule,
    updateStatus,
    undoDelete,
  } = useSchedules(scheduleFilters);

  const expandedEvents = useMemo(
    () =>
      mergeWithRecurringOccurrences(
        schedules,
        parseISO(fetchRange.startDate),
        parseISO(fetchRange.endDate)
      ),
    [fetchRange, schedules]
  );

  const periodStart = useMemo(() => startOfDay(weekDays[0]).getTime(), [weekDays]);
  const periodEnd = useMemo(() => endOfDay(weekDays[6]).getTime(), [weekDays]);

  const periodEvents = useMemo(
    () =>
      expandedEvents.filter((event) => {
        const start = parseISO(event.startDateTime).getTime();
        return start >= periodStart && start <= periodEnd;
      }),
    [expandedEvents, periodEnd, periodStart]
  );

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return periodEvents.filter((event) => {
      if (
        query &&
        ![event.title, event.subject, event.faculty, event.location]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query))
      ) {
        return false;
      }
      if (filters.category !== "all" && event.category !== filters.category) {
        return false;
      }
      if (filters.status !== "all" && event.status !== filters.status) {
        return false;
      }
      if (
        filters.day !== "all" &&
        parseISO(event.startDateTime).getDay() !== filters.day
      ) {
        return false;
      }
      if (filters.hideCompleted && event.status === "completed") {
        return false;
      }
      return true;
    });
  }, [filters, periodEvents, searchQuery]);

  const eventsByDay = useMemo(() => {
    const grouped: Record<string, Schedule[]> = {};
    for (const day of weekDays) {
      grouped[format(day, "yyyy-MM-dd")] = filteredEvents
        .filter((event) => isSameDay(parseISO(event.startDateTime), day))
        .sort(
          (first, second) =>
            parseISO(first.startDateTime).getTime() -
            parseISO(second.startDateTime).getTime()
        );
    }
    return grouped;
  }, [filteredEvents, weekDays]);

  const activeFilterCount = useMemo(
    () =>
      countActiveFilters({
        category: filters.category,
        status: filters.status,
        day: filters.day,
        hideCompleted: filters.hideCompleted,
      }),
    [filters]
  );

  const openCreate = useCallback(
    (initial?: Partial<EditorInitialState>) => {
      setEditorEvent(null);
      setEditorInitial({
        date: initial?.date ?? format(selectedDay, "yyyy-MM-dd"),
        startTime: initial?.startTime ?? "09:00",
        endTime: initial?.endTime ?? "10:00",
      });
      setEditorOpen(true);
    },
    [selectedDay]
  );

  const handleSlotClick = useCallback(
    (day: Date, hour: number, minute: number) => {
      const startTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const endHour = Math.min(hour + 1, 23);
      openCreate({
        date: format(day, "yyyy-MM-dd"),
        startTime,
        endTime: `${String(endHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      });
    },
    [openCreate]
  );

  const handlePrevious = useCallback(() => {
    if (viewMode === "day") {
      setSelectedDay(prevDay(selectedDay));
      return;
    }
    goPrevWeek();
  }, [goPrevWeek, selectedDay, setSelectedDay, viewMode]);

  const handleNext = useCallback(() => {
    if (viewMode === "day") {
      setSelectedDay(nextDay(selectedDay));
      return;
    }
    goNextWeek();
  }, [goNextWeek, selectedDay, setSelectedDay, viewMode]);

  const handleEditorSubmit = async (payload: EventEditorPayload) => {
    if (editorEvent) {
      const recurrenceScope =
        editorEvent.recurrence?.type !== "none" ? "all" : "this";
      await updateSchedule(editorEvent._id, payload, recurrenceScope);
      toast.success("Schedule updated");
      setEditorEvent(null);
      return;
    }

    await createSchedule({ ...payload, status: "scheduled" });
    toast.success("Schedule added");
  };

  const handleEventMove = async (
    event: Schedule,
    newStartDateTime: string,
    newEndDateTime: string
  ) => {
    const previous = {
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
    };

    try {
      await updateSchedule(event._id, {
        startDateTime: newStartDateTime,
        endDateTime: newEndDateTime,
      });
      toast.success(`Moved to ${format(parseISO(newStartDateTime), "EEE, h:mm a")}`, {
        action: {
          label: "Undo",
          onClick: () => updateSchedule(event._id, previous),
        },
      });
    } catch {
      toast.error("Could not move this schedule");
    }
  };

  const handleToggleComplete = async (event: Schedule) => {
    const nextStatus: ScheduleStatus =
      event.status === "completed" ? "scheduled" : "completed";
    try {
      await updateStatus(event._id, nextStatus);
      setDetailsEvent((current) =>
        current?._id === event._id ? { ...current, status: nextStatus } : current
      );
      toast.success(nextStatus === "completed" ? "Marked as done" : "Marked active");
    } catch {
      toast.error("Could not update this schedule");
    }
  };

  const handleDuplicate = async (event: Schedule) => {
    try {
      await duplicateSchedule(event._id);
      setDetailsEvent(null);
      toast.success("Schedule duplicated");
    } catch {
      toast.error("Could not duplicate this schedule");
    }
  };

  const handleDelete = async (event: Schedule) => {
    try {
      await deleteSchedule(event._id);
      setDetailsEvent(null);
      toast("Schedule deleted", {
        action: {
          label: "Undo",
          onClick: async () => {
            await undoDelete();
            toast.success("Schedule restored");
          },
        },
      });
    } catch {
      toast.error("Could not delete this schedule");
    }
  };

  const renderPlannerContent = () => {
    if (isLoading) return <PlannerLoading />;
    if (error) {
      return (
        <PlannerState
          type="error"
          message={error}
          onPrimaryAction={() => void fetchSchedules()}
        />
      );
    }
    if (periodEvents.length === 0) {
      return <PlannerState type="empty" onPrimaryAction={() => openCreate()} />;
    }
    if (filteredEvents.length === 0 && searchQuery.trim()) {
      return (
        <PlannerState
          type="search"
          searchQuery={searchQuery}
          onPrimaryAction={() => setSearchQuery("")}
        />
      );
    }
    if (filteredEvents.length === 0) {
      return (
        <PlannerState
          type="filter"
          onPrimaryAction={() => setFilters(emptyFilters)}
        />
      );
    }

    return (
      <>
        {viewMode === "agenda" ? (
          <PlannerAgenda
            days={weekDays}
            events={filteredEvents}
            onEventClick={setDetailsEvent}
            onToggleComplete={(event) => void handleToggleComplete(event)}
          />
        ) : (
          <PlannerCalendar
            days={viewMode === "day" ? [selectedDay] : weekDays}
            eventsByDay={eventsByDay}
            onEventClick={setDetailsEvent}
            onSlotClick={handleSlotClick}
            onEventMove={(event, start, end) => void handleEventMove(event, start, end)}
          />
        )}

        <PlannerMobile
          weekDays={weekDays}
          selectedDay={selectedDay}
          events={filteredEvents}
          onSelectDay={setSelectedDay}
          onToday={goToToday}
          onEventClick={setDetailsEvent}
          onToggleComplete={(event) => void handleToggleComplete(event)}
          onAddEvent={() => openCreate()}
        />
      </>
    );
  };

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <PlannerShell
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddEvent={() => openCreate()}
      >
        <PlannerOverview events={expandedEvents} onOpenEvent={setDetailsEvent} />

        <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <PlannerToolbar
            currentDate={currentDate}
            selectedDay={selectedDay}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={goToToday}
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div aria-live="polite">{renderPlannerContent()}</div>
        </section>
      </PlannerShell>

      <EventEditorDialog
        open={editorOpen}
        event={editorEvent}
        initialDate={editorInitial.date}
        initialStartTime={editorInitial.startTime}
        initialEndTime={editorInitial.endTime}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditorEvent(null);
        }}
        onSubmit={handleEditorSubmit}
      />

      <EventDetailsDialog
        event={detailsEvent}
        onOpenChange={(open) => {
          if (!open) setDetailsEvent(null);
        }}
        onEdit={(event) => {
          setDetailsEvent(null);
          setEditorEvent(event);
          setEditorOpen(true);
        }}
        onToggleComplete={(event) => void handleToggleComplete(event)}
        onDuplicate={(event) => void handleDuplicate(event)}
        onDelete={(event) => void handleDelete(event)}
      />
    </>
  );
}
