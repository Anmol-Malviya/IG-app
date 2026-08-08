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
      <div className="bg-white rounded-[14px] border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col">
        {/* Day Header Banner */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {format(selectedDay, "EEEE, MMMM d, yyyy")}
                </h3>
                {isCurrent && (
                  <span className="bg-[#4F46E5] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                {events.length} {events.length === 1 ? "event" : "events"} scheduled for this day
              </p>
            </div>
          </div>

          <div className="text-[12px] font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-[10px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>7:00 AM – 10:00 PM</span>
          </div>
        </div>

        {/* Scrollable Timeline Grid */}
        <div className="overflow-y-auto max-h-[calc(100vh-320px)] min-h-[500px]">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr",
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
