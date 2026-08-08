"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Schedule } from "@/types/schedule";
import {
  isToday,
  format,
  HOUR_HEIGHT_PX,
  TOTAL_HOURS,
  getEventTopPx,
  getEventHeightPx,
  getCurrentTimeTopPx,
  generateTimeSlots,
} from "@/lib/date-utils";
import { layoutDayEvents } from "@/lib/scheduler-helpers";
import { ScheduleEventCard } from "./schedule-event-card";

interface CalendarDayColumnProps {
  day: Date;
  events: Schedule[];
  onEventClick: (event: Schedule) => void;
  onSlotClick: (day: Date, hour: number, minute: number) => void;
  isDraggingAny?: boolean;
}

export function CalendarDayColumn({
  day,
  events,
  onEventClick,
  onSlotClick,
}: CalendarDayColumnProps) {
  const dayKey = format(day, "yyyy-MM-dd");
  const isCurrentDay = isToday(day);
  const slots = generateTimeSlots();

  const { setNodeRef, isOver } = useDroppable({
    id: `day_${dayKey}`,
    data: { day, dayKey },
  });

  const positionedEvents = layoutDayEvents(events);
  const currentTimeTop = isCurrentDay ? getCurrentTimeTopPx() : -1;
  const gridHeight = TOTAL_HOURS * HOUR_HEIGHT_PX;

  return (
    <div
      ref={setNodeRef}
      style={{ height: `${gridHeight}px` }}
      className={`relative min-w-[150px] flex-1 border-r border-slate-200 last:border-r-0 transition-colors ${
        isCurrentDay ? "bg-indigo-50/15" : "bg-white"
      } ${isOver ? "bg-indigo-50/40 ring-1 ring-inset ring-indigo-400" : ""}`}
    >
      {/* Background Hour Slots for Click-to-Add */}
      {slots.map((slot) => (
        <div
          key={slot.label}
          style={{ height: `${HOUR_HEIGHT_PX}px` }}
          className="relative border-b border-slate-100 flex flex-col group/slot"
        >
          {/* Top half hour click zone */}
          <div
            onClick={() => onSlotClick(day, slot.hour, 0)}
            className="flex-1 cursor-pointer hover:bg-indigo-50/30 transition-colors"
            title={`Add event at ${slot.label}`}
          />
          {/* Subtle half-hour divider */}
          <div className="border-b border-dashed border-slate-100/70 pointer-events-none" />
          {/* Bottom half hour click zone */}
          <div
            onClick={() => onSlotClick(day, slot.hour, 30)}
            className="flex-1 cursor-pointer hover:bg-indigo-50/30 transition-colors"
            title={`Add event at ${slot.hour > 12 ? slot.hour - 12 : slot.hour}:30 ${
              slot.hour >= 12 ? "PM" : "AM"
            }`}
          />
        </div>
      ))}

      {/* Live Current Time Marker (if column is today) */}
      {isCurrentDay && currentTimeTop >= 0 && currentTimeTop <= gridHeight && (
        <div
          className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
          style={{ top: `${currentTimeTop}px` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1 shadow-sm" />
          <div className="flex-1 h-[2px] bg-rose-500 shadow-xs" />
        </div>
      )}

      {/* Positioned Event Cards */}
      {positionedEvents.map(({ event, colIndex, totalCols }) => {
        const top = getEventTopPx(event.startDateTime);
        const height = getEventHeightPx(event.startDateTime, event.endDateTime);

        // Calculate horizontal width and left offset for overlapping events
        const colWidthPercent = 100 / totalCols;
        const leftPercent = colIndex * colWidthPercent;

        return (
          <div
            key={event._id}
            className="absolute z-20"
            style={{
              top: `${top + 1}px`,
              height: `${height - 2}px`,
              left: `calc(${leftPercent}% + 2px)`,
              width: `calc(${colWidthPercent}% - 4px)`,
            }}
          >
            <ScheduleEventCard
              event={event}
              onClick={() => onEventClick(event)}
              compact={totalCols > 1 || height < 55}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
