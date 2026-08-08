"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Schedule } from "@/types/schedule";
import {
  isToday,
  format,
  parseISO,
  differenceInMinutes,
  setHours,
  setMinutes,
  HOURS_START,
  HOUR_HEIGHT_PX,
} from "@/lib/date-utils";
import { CalendarTimeColumn } from "./calendar-time-column";
import { CalendarDayColumn } from "./calendar-day-column";
import { ScheduleEventCard } from "./schedule-event-card";

interface WeekCalendarProps {
  weekDays: Date[];
  eventsByDay: Record<string, Schedule[]>;
  onEventClick: (event: Schedule) => void;
  onSlotClick: (day: Date, hour: number, minute: number) => void;
  onEventMove: (event: Schedule, newStart: string, newEnd: string) => void;
}

export function WeekCalendar({
  weekDays,
  eventsByDay,
  onEventClick,
  onSlotClick,
  onEventMove,
}: WeekCalendarProps) {
  const [activeDragEvent, setActiveDragEvent] = useState<Schedule | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag threshold to distinguish clicks from drags
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ev = event.active.data.current?.event as Schedule;
    if (ev) {
      setActiveDragEvent(ev);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveDragEvent(null);

    if (!over || !active.data.current?.event) return;

    const draggedEvent = active.data.current.event as Schedule;
    const overDay = over.data.current?.day as Date;

    if (!overDay) return;

    const originalStart = parseISO(draggedEvent.startDateTime);
    const originalEnd = parseISO(draggedEvent.endDateTime);
    const duration = differenceInMinutes(originalEnd, originalStart);

    // Calculate time shift based on vertical delta
    const deltaHours = delta.y / HOUR_HEIGHT_PX;
    const deltaMinutes = Math.round((deltaHours * 60) / 15) * 15; // Snap to 15 mins

    let newStart = new Date(overDay);
    newStart = setHours(newStart, originalStart.getHours());
    newStart = setMinutes(newStart, originalStart.getMinutes() + deltaMinutes);

    // Clamp within 7 AM to 10 PM
    if (newStart.getHours() < HOURS_START) {
      newStart = setHours(newStart, HOURS_START);
      newStart = setMinutes(newStart, 0);
    }

    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    onEventMove(draggedEvent, newStart.toISOString(), newEnd.toISOString());
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-[14px] border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col">
        {/* Horizontal scroll container for the calendar grid */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-290px)] min-h-[500px]">
          <div className="min-w-[1122px] flex flex-col">
            {/* Sticky Calendar Day Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "72px repeat(7, minmax(150px, 1fr))",
              }}
              className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200"
            >
              {/* Top-left corner box */}
              <div className="h-14 border-r border-slate-200 flex items-center justify-center bg-slate-50/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  GMT
                </span>
              </div>

              {/* 7 Day Column Headers */}
              {weekDays.map((day) => {
                const isCurrent = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`h-14 border-r border-slate-200 last:border-r-0 flex flex-col items-center justify-center px-2 transition-colors ${
                      isCurrent ? "bg-indigo-50/40" : "bg-white"
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {format(day, "EEE")}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[13px] font-bold inline-flex items-center justify-center px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? "bg-[#4F46E5] text-white shadow-xs font-extrabold"
                            : "text-slate-800"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {format(day, "MMM")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Grid Area */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "72px repeat(7, minmax(150px, 1fr))",
              }}
              className="relative bg-white"
            >
              <CalendarTimeColumn />

              {weekDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDay[dayKey] || [];

                return (
                  <CalendarDayColumn
                    key={dayKey}
                    day={day}
                    events={dayEvents}
                    onEventClick={onEventClick}
                    onSlotClick={onSlotClick}
                    isDraggingAny={activeDragEvent !== null}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay Preview */}
      <DragOverlay>
        {activeDragEvent ? (
          <div className="w-56 pointer-events-none opacity-90 shadow-2xl scale-105">
            <ScheduleEventCard
              event={activeDragEvent}
              isDragging
              detailed
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
