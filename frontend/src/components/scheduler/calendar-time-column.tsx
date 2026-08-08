"use client";

import React from "react";
import { generateTimeSlots, HOUR_HEIGHT_PX } from "@/lib/date-utils";

export function CalendarTimeColumn() {
  const slots = generateTimeSlots();

  return (
    <div className="w-[72px] flex-shrink-0 select-none border-r border-slate-200 bg-white sticky left-0 z-10">
      {slots.map((slot) => (
        <div
          key={slot.label}
          style={{ height: `${HOUR_HEIGHT_PX}px` }}
          className="relative border-b border-slate-100 flex items-start justify-end pr-2.5 pt-1.5"
        >
          <span className="text-[11px] font-semibold text-slate-400 tracking-tight">
            {slot.label}
          </span>
        </div>
      ))}
    </div>
  );
}
