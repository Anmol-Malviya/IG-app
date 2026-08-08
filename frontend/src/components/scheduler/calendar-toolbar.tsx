"use client";

import React from "react";
import { ViewMode } from "@/hooks/use-scheduler-view";
import { formatWeekRange, format } from "@/lib/date-utils";

import { SchedulerFilters, SchedulerFilterState } from "./scheduler-filters";
import { ChevronLeft, ChevronRight, Plus, Calendar, List, Columns } from "lucide-react";

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
    <div className="bg-white rounded-[14px] border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-3 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-3">
      {/* ── Left: Date Navigation ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center rounded-[10px] border border-slate-200 bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={onPrev}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="px-3 h-8 text-[12px] font-bold text-[#4F46E5] hover:bg-indigo-50/70 rounded-[8px] transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-[13.5px] font-bold text-slate-900 px-1 whitespace-nowrap">
          {dateTitle}
        </span>
      </div>

      {/* ── Right: View Switcher, Filters & Add Event ── */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* View Switcher Tabs */}
        <div className="flex bg-slate-100/90 p-1 rounded-[10px] border border-slate-200/80 gap-1">
          <button
            type="button"
            onClick={() => onViewModeChange("day")}
            className={`px-3 py-1 text-[12px] font-bold rounded-[8px] transition-all flex items-center gap-1.5 ${
              viewMode === "day"
                ? "bg-white text-[#4F46E5] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Day</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("week")}
            className={`px-3 py-1 text-[12px] font-bold rounded-[8px] transition-all flex items-center gap-1.5 ${
              viewMode === "week"
                ? "bg-white text-[#4F46E5] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Week</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("agenda")}
            className={`px-3 py-1 text-[12px] font-bold rounded-[8px] transition-all flex items-center gap-1.5 ${
              viewMode === "agenda"
                ? "bg-white text-[#4F46E5] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
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
          className="h-9 px-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[10px] text-[12.5px] font-bold shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>
    </div>
  );
}
