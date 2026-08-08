"use client";

import React, { useState, useRef, useEffect } from "react";
import { EventCategory, ScheduleStatus } from "@/types/schedule";
import { Filter } from "lucide-react";


export interface SchedulerFilterState {
  category: EventCategory | "all";
  status: ScheduleStatus | "all";
  day: number | "all";
  hideCompleted: boolean;
}

interface SchedulerFiltersProps {
  filters: SchedulerFilterState;
  onChange: (filters: SchedulerFilterState) => void;
  activeCount: number;
}

export function SchedulerFilters({
  filters,
  onChange,
  activeCount,
}: SchedulerFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const categories: Array<{ id: EventCategory | "all"; label: string }> = [
    { id: "all", label: "All Categories" },
    { id: "class", label: "Class" },
    { id: "lab", label: "Lab" },
    { id: "study", label: "Study" },
    { id: "assignment", label: "Assignment" },
    { id: "exam", label: "Exam" },
    { id: "personal", label: "Personal" },
  ];

  const statuses: Array<{ id: ScheduleStatus | "all"; label: string }> = [
    { id: "all", label: "All Status" },
    { id: "scheduled", label: "Scheduled" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const days: Array<{ id: number | "all"; label: string }> = [
    { id: "all", label: "All" },
    { id: 1, label: "Mon" },
    { id: 2, label: "Tue" },
    { id: 3, label: "Wed" },
    { id: 4, label: "Thu" },
    { id: 5, label: "Fri" },
    { id: 6, label: "Sat" },
    { id: 0, label: "Sun" },
  ];

  const handleClear = () => {
    onChange({
      category: "all",
      status: "all",
      day: "all",
      hideCompleted: false,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`flex h-10 cursor-pointer select-none items-center gap-2 rounded-xl border px-3 text-[11.5px] font-bold transition-colors ${
          activeCount > 0
            ? "border-indigo-200 bg-indigo-50 text-indigo-600"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-indigo-600 text-[9.5px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="animate-fadeIn absolute right-0 z-40 mt-2 w-72 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_46px_rgba(15,23,42,0.14)]"
          role="dialog"
          aria-label="Schedule filters"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[13px] font-bold text-slate-900">Filter Events</span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = filters.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onChange({ ...filters, category: cat.id })}
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] font-semibold transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Status
            </label>
            <div className="flex gap-1.5">
              {statuses.map((st) => {
                const isSelected = filters.status === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChange({ ...filters, status: st.id })}
                    className={`flex-1 py-1 rounded-[8px] text-[11px] font-semibold transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Day
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {days.map((day) => {
                const isSelected = filters.day === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => onChange({ ...filters, day: day.id })}
                    className={`py-1 rounded-[8px] text-[11px] font-semibold transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hide Completed Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-700">
              Hide completed events
            </span>
            <input
              type="checkbox"
              checked={filters.hideCompleted}
              onChange={(e) =>
                onChange({ ...filters, hideCompleted: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
