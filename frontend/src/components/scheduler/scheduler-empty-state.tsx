"use client";

import React from "react";
import { Calendar, Search, FilterX, Plus } from "lucide-react";

interface SchedulerEmptyStateProps {
  type: "no-events" | "no-search-results" | "no-filter-results";
  searchQuery?: string;
  onResetSearch?: () => void;
  onResetFilters?: () => void;
  onAddEvent?: () => void;
}

export function SchedulerEmptyState({
  type,
  searchQuery,
  onResetSearch,
  onResetFilters,
  onAddEvent,
}: SchedulerEmptyStateProps) {
  if (type === "no-search-results") {
    return (
      <div className="h-full bg-white p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          No events matching &ldquo;{searchQuery}&rdquo;
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try searching for a different title, instructor, room code, or course name.
        </p>
        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[8px] transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  if (type === "no-filter-results") {
    return (
      <div className="h-full bg-white p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FilterX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No events match active filters</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Adjust your category or status filters to view scheduled items.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-xs font-bold rounded-[8px] transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-10 text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto mb-3">
        <Calendar className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900">Your schedule is empty</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Start by adding your classes, labs, assignments, and study blocks to stay organized.
      </p>
      {onAddEvent && (
        <button
          type="button"
          onClick={onAddEvent}
          className="mt-4 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-[8px] transition-all inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Event</span>
        </button>
      )}
    </div>
  );
}
