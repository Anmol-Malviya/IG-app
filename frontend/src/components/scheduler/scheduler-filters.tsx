"use client";

import React, { useState, useRef, useEffect } from "react";
import { EventCategory, ScheduleStatus } from "@/types/schedule";
import { Filter } from "lucide-react";


export interface SchedulerFilterState {
  category: EventCategory | "all";
  status: ScheduleStatus | "all";
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
  ];

  const handleClear = () => {
    onChange({
      category: "all",
      status: "all",
      hideCompleted: false,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 rounded-[10px] border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer select-none ${
          activeCount > 0
            ? "border-indigo-300 bg-indigo-50 text-[#4F46E5]"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="w-4.5 h-4.5 rounded-full bg-[#4F46E5] text-white text-[10px] font-extrabold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-[14px] border border-slate-200 shadow-xl p-4 z-40 animate-fadeIn space-y-4">
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
                        ? "bg-[#4F46E5] text-white shadow-xs"
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
                        ? "bg-[#4F46E5] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st.label}
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
