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
  now?: Date;
}

export function CalendarDayColumn({
  day,
  events,
  onEventClick,
  onSlotClick,
  now = new Date(),
}: CalendarDayColumnProps) {
  const dayKey = format(day, "yyyy-MM-dd");
  const isCurrentDay = isToday(day);
  const slots = generateTimeSlots();

  const { setNodeRef, isOver } = useDroppable({
    id: `day_${dayKey}`,
    data: { day, dayKey },
  });

  const positionedEvents = layoutDayEvents(events);
  const currentTimeTop = isCurrentDay ? getCurrentTimeTopPx(now) : -1;
  const gridHeight = TOTAL_HOURS * HOUR_HEIGHT_PX;

  return (
    <div
      ref={setNodeRef}
      style={{ height: `${gridHeight}px` }}
      className={`relative min-w-[152px] flex-1 border-r border-slate-200/80 transition-colors last:border-r-0 ${
        isCurrentDay ? "bg-indigo-50/25" : "bg-white"
      } ${isOver ? "bg-indigo-50/60 ring-2 ring-inset ring-indigo-400/70" : ""}`}
    >
      {/* Background Hour Slots for Click-to-Add */}
      {slots.map((slot) => (
        <div
          key={slot.label}
          style={{ height: `${HOUR_HEIGHT_PX}px` }}
          className="group/slot relative flex flex-col border-b border-slate-100"
        >
          {/* Top half hour click zone */}
          <button
            type="button"
            onClick={() => onSlotClick(day, slot.hour, 0)}
            className="flex-1 cursor-pointer transition-colors hover:bg-indigo-50/50 focus-visible:z-10"
            title={`Add event at ${slot.label}`}
            aria-label={`Add event at ${slot.label} on ${format(day, "EEEE, MMMM d")}`}
          />
          {/* Subtle half-hour divider */}
          <div className="pointer-events-none border-b border-dashed border-slate-100/90" />
          {/* Bottom half hour click zone */}
          <button
            type="button"
            onClick={() => onSlotClick(day, slot.hour, 30)}
            className="flex-1 cursor-pointer transition-colors hover:bg-indigo-50/50 focus-visible:z-10"
            title={`Add event at ${slot.hour > 12 ? slot.hour - 12 : slot.hour}:30 ${
              slot.hour >= 12 ? "PM" : "AM"
            }`}
            aria-label={`Add event at ${slot.hour > 12 ? slot.hour - 12 : slot.hour}:30 ${
              slot.hour >= 12 ? "PM" : "AM"
            } on ${format(day, "EEEE, MMMM d")}`}
          />
        </div>
      ))}

      {/* Live Current Time Marker (if column is today) */}
      {isCurrentDay && currentTimeTop >= 0 && currentTimeTop <= gridHeight && (
        <div
          className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
          style={{ top: `${currentTimeTop}px` }}
        >
          <div className="-ml-1 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]" />
          <div className="h-[1.5px] flex-1 bg-rose-500" />
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
            className="absolute z-20 px-px"
            style={{
              top: `${top + 1}px`,
              height: `${height - 2}px`,
              left: `calc(${leftPercent}% + 3px)`,
              width: `calc(${colWidthPercent}% - 6px)`,
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
