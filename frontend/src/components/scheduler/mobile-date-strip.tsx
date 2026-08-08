"use client";

import React from "react";
import { isSameDay, isToday, format, formatWeekRange } from "@/lib/date-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileDateStripProps {
  weekDays: Date[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function MobileDateStrip({
  weekDays,
  selectedDay,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
  onToday,
}: MobileDateStripProps) {
  return (
    <div className="sticky top-16 z-20 border-b border-slate-200/80 bg-white px-3 pb-3 pt-2 shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <button
          type="button"
          onClick={onPrevWeek}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="min-w-0 rounded-xl px-3 py-1.5 text-center transition-colors hover:bg-indigo-50"
          aria-label="Back to current week"
        >
          <span className="block truncate text-[12.5px] font-bold tracking-[-0.01em] text-slate-900">
            {formatWeekRange(weekDays[0])}
          </span>
          <span className="mt-0.5 block text-[9.5px] font-bold uppercase tracking-[0.1em] text-indigo-500">Tap for today</span>
        </button>
        <button
          type="button"
          onClick={onNextWeek}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="scrollbar-none flex items-center justify-between gap-1.5 overflow-x-auto py-0.5">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          const isCurrent = isToday(day);
          const dayName = format(day, "EEE");
          const dayNum = format(day, "d");

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              aria-pressed={isSelected}
              aria-label={`${format(day, "EEEE, MMMM d")}${isCurrent ? ", today" : ""}`}
              className={`flex min-h-[52px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-2 transition-all duration-150 ${
                isSelected
                  ? "bg-indigo-600 font-bold text-white shadow-[0_7px_16px_rgba(79,70,229,0.24)]"
                  : "font-medium text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span
                className={`text-[11px] leading-none uppercase ${
                  isSelected ? "text-indigo-100" : isCurrent ? "font-bold text-indigo-600" : "text-slate-400"
                }`}
              >
                {dayName}
              </span>
              <span
                className={`text-[15px] font-extrabold mt-1 leading-none ${
                  isSelected ? "text-white" : isCurrent ? "text-indigo-600" : "text-slate-900"
                }`}
              >
                {dayNum}
              </span>
              {isCurrent && !isSelected && (
                <span className="mt-1 h-1 w-1 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
