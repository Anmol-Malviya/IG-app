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
import { useCurrentMinute } from "@/hooks/use-current-minute";

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
  const now = useCurrentMinute();
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
      <div className="flex h-full min-h-[360px] flex-col overflow-hidden bg-white">
        {/* Horizontal scroll container for the calendar grid */}
        <div className="h-full min-h-0 overflow-auto overscroll-contain">
          <div className="flex min-w-[1132px] flex-col">
            {/* Sticky Calendar Day Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "68px repeat(7, minmax(152px, 1fr))",
              }}
              className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-md"
            >
              {/* Top-left corner box */}
              <div className="flex h-16 items-center justify-center border-r border-slate-200/80 bg-slate-50/70">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Local
                </span>
              </div>

              {/* 7 Day Column Headers */}
              {weekDays.map((day) => {
                const isCurrent = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`flex h-16 items-center justify-center gap-2 border-r border-slate-200/80 px-2 transition-colors last:border-r-0 ${
                      isCurrent ? "bg-indigo-50/55" : "bg-white"
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isCurrent ? "text-indigo-500" : "text-slate-400"}`}>
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-xl px-1.5 text-[13px] font-bold ${
                        isCurrent
                          ? "bg-indigo-600 text-white shadow-[0_5px_12px_rgba(79,70,229,0.22)]"
                          : "bg-slate-50 text-slate-800"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {format(day, "MMM")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Time Grid Area */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "68px repeat(7, minmax(152px, 1fr))",
              }}
              className="relative bg-[#fbfcfe]"
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
                    now={now}
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
          <div className="pointer-events-none w-56 scale-105 opacity-95 shadow-2xl">
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
