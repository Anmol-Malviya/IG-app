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
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useCurrentMinute } from "@/hooks/use-current-minute";


interface DayCalendarProps {
  selectedDay: Date;
  events: Schedule[];
  onEventClick: (event: Schedule) => void;
  onSlotClick: (day: Date, hour: number, minute: number) => void;
  onEventMove: (event: Schedule, newStart: string, newEnd: string) => void;
}

export function DayCalendar({
  selectedDay,
  events,
  onEventClick,
  onSlotClick,
  onEventMove,
}: DayCalendarProps) {
  const now = useCurrentMinute();
  const [activeDragEvent, setActiveDragEvent] = useState<Schedule | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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
    const overDay = (over.data.current?.day as Date) || selectedDay;

    const originalStart = parseISO(draggedEvent.startDateTime);
    const originalEnd = parseISO(draggedEvent.endDateTime);
    const duration = differenceInMinutes(originalEnd, originalStart);

    const deltaHours = delta.y / HOUR_HEIGHT_PX;
    const deltaMinutes = Math.round((deltaHours * 60) / 15) * 15;

    let newStart = new Date(overDay);
    newStart = setHours(newStart, originalStart.getHours());
    newStart = setMinutes(newStart, originalStart.getMinutes() + deltaMinutes);

    if (newStart.getHours() < HOURS_START) {
      newStart = setHours(newStart, HOURS_START);
      newStart = setMinutes(newStart, 0);
    }

    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    onEventMove(draggedEvent, newStart.toISOString(), newEnd.toISOString());
  };

  const isCurrent = isToday(selectedDay);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-h-[360px] flex-col overflow-hidden bg-white">
        {/* Day Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {format(selectedDay, "EEEE, MMMM d, yyyy")}
                </h3>
                {isCurrent && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Today
                  </span>
                )}
              </div>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                {events.length} {events.length === 1 ? "event" : "events"} scheduled for this day
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>7:00 AM – 10:00 PM</span>
          </div>
        </div>

        {/* Scrollable Timeline Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "68px 1fr",
            }}
            className="relative bg-white"
          >
            <CalendarTimeColumn />

            <CalendarDayColumn
              day={selectedDay}
              events={events}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
              isDraggingAny={activeDragEvent !== null}
              now={now}
            />
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragEvent ? (
          <div className="w-72 pointer-events-none opacity-90 shadow-2xl scale-105">
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
