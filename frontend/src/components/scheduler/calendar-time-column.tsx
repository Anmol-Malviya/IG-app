"use client";

import React from "react";
import { generateTimeSlots, HOUR_HEIGHT_PX } from "@/lib/date-utils";

export function CalendarTimeColumn() {
  const slots = generateTimeSlots();

  return (
    <div className="sticky left-0 z-10 w-[68px] flex-shrink-0 select-none border-r border-slate-200/80 bg-white">
      {slots.map((slot) => (
        <div
          key={slot.label}
          style={{ height: `${HOUR_HEIGHT_PX}px` }}
          className="relative flex items-start justify-end border-b border-slate-100 pr-2.5 pt-2"
        >
          <span className="text-[10px] font-semibold tracking-tight text-slate-400">
            {slot.label}
          </span>
        </div>
      ))}
    </div>
  );
}
