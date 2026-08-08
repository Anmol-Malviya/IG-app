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
    <div className="bg-white border-b border-slate-200 px-2 py-2 sticky top-14 z-20 shadow-2xs">
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <button
          type="button"
          onClick={onPrevWeek}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-600 hover:bg-slate-100"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="min-w-0 rounded-[10px] px-3 py-1.5 text-center hover:bg-indigo-50"
          aria-label="Back to current week"
        >
          <span className="block truncate text-[12px] font-extrabold text-slate-900">
            {formatWeekRange(weekDays[0])}
          </span>
          <span className="block text-[10px] font-bold text-[#4F46E5]">Tap for today</span>
        </button>
        <button
          type="button"
          onClick={onNextWeek}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-600 hover:bg-slate-100"
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
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
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-[12px] min-w-[46px] flex-1 transition-all duration-150 cursor-pointer min-h-[44px] ${
                isSelected
                  ? "bg-[#4F46E5] text-white shadow-xs scale-102 font-bold"
                  : "text-slate-700 hover:bg-slate-50 font-medium"
              }`}
            >
              <span
                className={`text-[11px] leading-none uppercase ${
                  isSelected ? "text-indigo-100" : isCurrent ? "text-[#4F46E5] font-bold" : "text-slate-500"
                }`}
              >
                {dayName}
              </span>
              <span
                className={`text-[15px] font-extrabold mt-1 leading-none ${
                  isSelected ? "text-white" : isCurrent ? "text-[#4F46E5]" : "text-slate-900"
                }`}
              >
                {dayNum}
              </span>
              {isCurrent && !isSelected && (
                <span className="w-1 h-1 bg-[#4F46E5] rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
