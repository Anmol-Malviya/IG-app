"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useSchedules } from "@/hooks/use-schedules";
import { useSchedulerView } from "@/hooks/use-scheduler-view";
import { Schedule, EventCategory, ScheduleStatus } from "@/types/schedule";
import {
  getWeekDays,
  combineDateAndTime,
  isSameDay,
  parseISO,
  format,
  nextDay,
  prevDay,
} from "@/lib/date-utils";
import { mergeWithRecurringOccurrences } from "@/lib/recurrence";
import { countActiveFilters } from "@/lib/scheduler-helpers";
import { toast, Toaster } from "sonner";

// Scheduler Modular Components
import { SchedulerShell } from "@/components/scheduler/scheduler-shell";
import { CalendarToolbar } from "@/components/scheduler/calendar-toolbar";
import { ScheduleSummary } from "@/components/scheduler/schedule-summary";
import { WeekCalendar } from "@/components/scheduler/week-calendar";
import { DayCalendar } from "@/components/scheduler/day-calendar";
import { AgendaView } from "@/components/scheduler/agenda-view";
import { MobileDayAgenda } from "@/components/scheduler/mobile-day-agenda";
import { QuickAddSheet } from "@/components/scheduler/quick-add-sheet";
import { EventDetailsSheet } from "@/components/scheduler/event-details-sheet";
import { SchedulerSkeleton } from "@/components/scheduler/scheduler-skeleton";
import { SchedulerEmptyState } from "@/components/scheduler/scheduler-empty-state";
import { SchedulerFilterState } from "@/components/scheduler/scheduler-filters";
import { CalendarRange, CircleCheck } from "lucide-react";

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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SchedulerFilterState>({
    category: "all",
    status: "all",
    day: "all",
    hideCompleted: false,
  });

  // Modal / Sheet states
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddInitial, setQuickAddInitial] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  }>({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
  });
  const [detailEvent, setDetailEvent] = useState<Schedule | null>(null);

  // Date range for fetching/expanding schedules (+/- 14 days around current date)
  const weekBounds = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - 14);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + 14);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [currentDate]);

  const scheduleFilters = useMemo(
    () => ({
      startDate: weekBounds.startDate,
      endDate: weekBounds.endDate,
    }),
    [weekBounds]
  );

  const {
    schedules,
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    duplicateSchedule,
    updateStatus,
    undoDelete,
    fetchSchedules,
  } = useSchedules(scheduleFilters);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Expand recurring event occurrences
  const rawEvents = useMemo(
    () =>
      mergeWithRecurringOccurrences(
        schedules,
        parseISO(weekBounds.startDate),
        parseISO(weekBounds.endDate)
      ),
    [schedules, weekBounds]
  );

  // Apply search and filters across all views
  const filteredEvents = useMemo(() => {
    let list = rawEvents;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subject?.toLowerCase().includes(q) ||
          e.faculty?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      list = list.filter((e) => e.category === filters.category);
    }

    // Status filter
    if (filters.status !== "all") {
      list = list.filter((e) => e.status === filters.status);
    }

    // Weekday filter (0 = Sunday, 1 = Monday)
    if (filters.day !== "all") {
      list = list.filter((e) => parseISO(e.startDateTime).getDay() === filters.day);
    }

    // Hide completed filter
    if (filters.hideCompleted) {
      list = list.filter((e) => e.status !== "completed");
    }

    return list;
  }, [rawEvents, searchQuery, filters]);

  // Group filtered events by day "yyyy-MM-dd"
  const eventsByDay = useMemo(() => {
    const map: Record<string, Schedule[]> = {};
    for (const d of weekDays) {
      const k = format(d, "yyyy-MM-dd");
      map[k] = filteredEvents
        .filter((e) => isSameDay(parseISO(e.startDateTime), d))
        .sort(
          (a, b) =>
            parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime()
        );
    }
    return map;
  }, [filteredEvents, weekDays]);

  // Events for the selected day in Day View
  const selectedDayEvents = useMemo(() => {
    return filteredEvents
      .filter((e) => isSameDay(parseISO(e.startDateTime), selectedDay))
      .sort(
        (a, b) =>
          parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime()
      );
  }, [filteredEvents, selectedDay]);

  // Active filters count badge
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

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (viewMode === "day") {
      const prev = prevDay(selectedDay);
      setSelectedDay(prev);
    } else {
      goPrevWeek();
    }
  }, [viewMode, selectedDay, setSelectedDay, goPrevWeek]);

  const handleNext = useCallback(() => {
    if (viewMode === "day") {
      const next = nextDay(selectedDay);
      setSelectedDay(next);
    } else {
      goNextWeek();
    }
  }, [viewMode, selectedDay, setSelectedDay, goNextWeek]);

  const handleToday = useCallback(() => {
    goToToday();
  }, [goToToday]);

  // Slot click handler to open Quick Add prefilled with time & date
  const handleSlotClick = useCallback((day: Date, hour: number, minute: number) => {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMin = minute < 10 ? `0${minute}` : `${minute}`;
    const endHour = hour + 1 < 10 ? `0${hour + 1}` : `${hour + 1}`;

    setQuickAddInitial({
      date: format(day, "yyyy-MM-dd"),
      startTime: `${formattedHour}:${formattedMin}`,
      endTime: `${endHour}:${formattedMin}`,
    });
    setQuickAddOpen(true);
  }, []);

  // Quick Add submit
  const handleQuickAddSubmit = async (values: {
    title: string;
    category: EventCategory;
    startDate: string;
    startTime: string;
    endTime: string;
    location?: string;
    faculty?: string;
  }) => {
    try {
      const start = combineDateAndTime(values.startDate, values.startTime);
      const end = combineDateAndTime(values.startDate, values.endTime);

      await createSchedule({
        title: values.title,
        category: values.category,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        location: values.location,
        faculty: values.faculty,
        recurrence: { type: "none" },
        status: "scheduled",
      });

      toast.success(`"${values.title}" added to your schedule!`);
    } catch {
      toast.error("Failed to add event");
      throw new Error("Add failed");
    }
  };

  // Drag and drop event move handler
  const handleEventMove = async (
    event: Schedule,
    newStartISO: string,
    newEndISO: string
  ) => {
    try {
      const prevStart = event.startDateTime;
      const prevEnd = event.endDateTime;

      await updateSchedule(event._id, {
        startDateTime: newStartISO,
        endDateTime: newEndISO,
      });

      const newStart = parseISO(newStartISO);
      toast.success(
        `Moved "${event.title}" to ${format(newStart, "EEE, MMM d")} at ${format(
          newStart,
          "h:mm a"
        )}`,
        {
          action: {
            label: "Undo",
            onClick: () =>
              updateSchedule(event._id, {
                startDateTime: prevStart,
                endDateTime: prevEnd,
              }),
          },
        }
      );
    } catch {
      toast.error("Failed to move event");
    }
  };

  // Status toggle handler
  const handleToggleComplete = async (id: string, status: ScheduleStatus) => {
    try {
      await updateStatus(id, status);
      toast.success(
        status === "completed" ? "Marked as completed" : "Marked active"
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Duplicate handler
  const handleDuplicate = async (id: string) => {
    try {
      await duplicateSchedule(id);
      toast.success("Event duplicated!");
    } catch {
      toast.error("Failed to duplicate event");
    }
  };

  // Delete handler with Undo
  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      toast("Event deleted", {
        action: {
          label: "Undo",
          onClick: () => undoDelete(),
        },
      });
    } catch {
      toast.error("Failed to delete event");
    }
  };

  // Render view component
  const renderActiveView = () => {
    if (isLoading) {
      return <SchedulerSkeleton />;
    }

    if (error) {
      return (
        <div className="bg-white rounded-[14px] border border-rose-200 p-8 text-center shadow-xs">
          <p className="text-sm font-bold text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => fetchSchedules()}
            className="mt-3 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-[8px] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (filteredEvents.length === 0 && rawEvents.length > 0) {
      if (searchQuery) {
        return (
          <SchedulerEmptyState
            type="no-search-results"
            searchQuery={searchQuery}
            onResetSearch={() => setSearchQuery("")}
          />
        );
      }
      return (
        <SchedulerEmptyState
          type="no-filter-results"
          onResetFilters={() =>
            setFilters({
              category: "all",
              status: "all",
              day: "all",
              hideCompleted: false,
            })
          }
        />
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <SchedulerEmptyState
          type="no-events"
          onAddEvent={() => {
            setQuickAddInitial({
              date: format(new Date(), "yyyy-MM-dd"),
              startTime: "09:00",
              endTime: "10:00",
            });
            setQuickAddOpen(true);
          }}
        />
      );
    }

    switch (viewMode) {
      case "day":
        return (
          <DayCalendar
            selectedDay={selectedDay}
            events={selectedDayEvents}
            onEventClick={(ev) => setDetailEvent(ev)}
            onSlotClick={handleSlotClick}
            onEventMove={handleEventMove}
          />
        );
      case "agenda":
        return (
          <AgendaView
            weekDays={weekDays}
            events={filteredEvents}
            onEventClick={(ev) => setDetailEvent(ev)}
            onToggleComplete={handleToggleComplete}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        );
      case "week":
      default:
        return (
          <WeekCalendar
            weekDays={weekDays}
            eventsByDay={eventsByDay}
            onEventClick={(ev) => setDetailEvent(ev)}
            onSlotClick={handleSlotClick}
            onEventMove={handleEventMove}
          />
        );
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {/* ══════════════════════════════════════════════════════════════
          1. DESKTOP / TABLET WORKSPACE (Visible on >= 1024px)
          ══════════════════════════════════════════════════════════════ */}
      <SchedulerShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
      >
        {/* Page identity */}
        <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold tracking-[-0.035em] text-slate-950 xl:text-[25px]">
                  Weekly schedule
                </h1>
                <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-emerald-700 ring-1 ring-emerald-100 xl:flex">
                  <CircleCheck className="h-3 w-3" /> Current week
                </span>
              </div>
              <p className="mt-0.5 text-[12px] font-medium text-slate-500">
                Good {getGreetingTime()}, {user?.firstName || "Student"}. Plan your week with clarity.
              </p>
            </div>
          </div>
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/* Dynamic Summary Cards */}
        <ScheduleSummary events={rawEvents} />

        {/* Unified planning workspace */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_12px_32px_rgba(15,23,42,0.035)]">
          <CalendarToolbar
            currentDate={currentDate}
            selectedDay={selectedDay}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onAddEvent={() => {
              setQuickAddInitial({
                date: format(selectedDay, "yyyy-MM-dd"),
                startTime: "09:00",
                endTime: "10:00",
              });
              setQuickAddOpen(true);
            }}
            filters={filters}
            onFilterChange={setFilters}
            activeFilterCount={activeFilterCount}
          />

          <section className="min-h-0 flex-1 bg-white" aria-live="polite">
            {renderActiveView()}
          </section>
        </div>
      </SchedulerShell>

      {/* ══════════════════════════════════════════════════════════════
          2. MOBILE / PHONE WORKSPACE (Visible on < 1024px)
          ══════════════════════════════════════════════════════════════ */}
      <MobileDayAgenda
        weekDays={weekDays}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrevWeek={goPrevWeek}
        onNextWeek={goNextWeek}
        onToday={goToToday}
        dayEvents={selectedDayEvents}
        allEvents={rawEvents}
        onEventClick={(ev) => setDetailEvent(ev)}
        onAddClick={() => {
          setQuickAddInitial({
            date: format(selectedDay, "yyyy-MM-dd"),
            startTime: "09:00",
            endTime: "10:00",
          });
          setQuickAddOpen(true);
        }}
      />

      {/* ── Modals / Sheets ── */}
      <QuickAddSheet
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
        initialDate={quickAddInitial.date}
        initialStartTime={quickAddInitial.startTime}
        initialEndTime={quickAddInitial.endTime}
      />

      <EventDetailsSheet
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onToggleComplete={handleToggleComplete}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
    </>
  );
}

function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
