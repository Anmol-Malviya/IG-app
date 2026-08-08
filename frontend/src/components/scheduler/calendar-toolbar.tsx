"use client";

import React from "react";
import { ViewMode } from "@/hooks/use-scheduler-view";
import { formatWeekRange, format } from "@/lib/date-utils";

import { SchedulerFilters, SchedulerFilterState } from "./scheduler-filters";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  List,
  Columns3,
} from "lucide-react";

interface CalendarToolbarProps {
  currentDate: Date;
  selectedDay: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent: () => void;
  filters: SchedulerFilterState;
  onFilterChange: (filters: SchedulerFilterState) => void;
  activeFilterCount: number;
}

export function CalendarToolbar({
  currentDate,
  selectedDay,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onAddEvent,
  filters,
  onFilterChange,
  activeFilterCount,
}: CalendarToolbarProps) {
  const dateTitle =
    viewMode === "day"
      ? format(selectedDay, "MMMM d, yyyy")
      : formatWeekRange(currentDate);

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3.5 xl:px-5">
      {/* ── Left: Date Navigation ── */}
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            title="Previous"
            aria-label="Go to previous period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            title="Next"
            aria-label="Go to next period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="min-w-0">
          <span className="block max-w-[250px] truncate whitespace-nowrap text-[14px] font-bold tracking-[-0.01em] text-slate-950">
            {dateTitle}
          </span>
          <span className="mt-0.5 block text-[10.5px] font-medium text-slate-400">
            Local time · drag events to reschedule
          </span>
        </div>
        <button
          type="button"
          onClick={onToday}
          className="h-8 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
        >
          Today
        </button>
      </div>

      {/* ── Right: View Switcher, Filters & Add Event ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* View Switcher Tabs */}
        <div className="flex gap-0.5 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("day")}
            aria-pressed={viewMode === "day"}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-bold transition-all ${
              viewMode === "day"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/[0.03]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Columns3 className="h-3.5 w-3.5" />
            <span>Day</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("week")}
            aria-pressed={viewMode === "week"}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-bold transition-all ${
              viewMode === "week"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/[0.03]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Week</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("agenda")}
            aria-pressed={viewMode === "agenda"}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-bold transition-all ${
              viewMode === "agenda"
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/[0.03]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Agenda</span>
          </button>
        </div>

        {/* Filters dropdown */}
        <SchedulerFilters
          filters={filters}
          onChange={onFilterChange}
          activeCount={activeFilterCount}
        />

        {/* Primary Add Event Button */}
        <button
          type="button"
          onClick={onAddEvent}
          className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl bg-indigo-600 px-4 text-[12px] font-bold text-white shadow-[0_6px_16px_rgba(79,70,229,0.2)] transition-all hover:bg-indigo-700 hover:shadow-[0_8px_20px_rgba(79,70,229,0.26)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>
    </div>
  );
}
