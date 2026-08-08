"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { Schedule } from "@/types/schedule";
import {
  differenceInMinutes,
  format,
  generateTimeSlots,
  getCurrentTimeTopPx,
  getEventHeightPx,
  getEventTopPx,
  GRID_HEIGHT_PX,
  HOURS_END,
  HOURS_START,
  HOUR_HEIGHT_PX,
  isInGridRange,
  isToday,
  parseISO,
  setHours,
  setMinutes,
} from "@/lib/date-utils";
import { layoutDayEvents } from "@/lib/scheduler-helpers";
import { useCurrentMinute } from "@/hooks/use-current-minute";
import { cn } from "@/lib/cn";
import { PlannerEventCard } from "./planner-event-card";

interface PlannerCalendarProps {
  days: Date[];
  eventsByDay: Record<string, Schedule[]>;
  onEventClick: (event: Schedule) => void;
  onSlotClick: (day: Date, hour: number, minute: number) => void;
  onEventMove: (event: Schedule, newStart: string, newEnd: string) => void;
}

const timeSlots = generateTimeSlots();

export function PlannerCalendar({
  days,
  eventsByDay,
  onEventClick,
  onSlotClick,
  onEventMove,
}: PlannerCalendarProps) {
  const now = useCurrentMinute();
  const [activeEvent, setActiveEvent] = useState<Schedule | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } })
  );
  const isWeek = days.length > 1;
  const gridTemplate = `64px repeat(${days.length}, minmax(${isWeek ? "144px" : "520px"}, 1fr))`;

  const handleDragStart = (dragEvent: DragStartEvent) => {
    const event = dragEvent.active.data.current?.event as Schedule | undefined;
    if (event) setActiveEvent(event);
  };

  const handleDragEnd = (dragEvent: DragEndEvent) => {
    setActiveEvent(null);
    const event = dragEvent.active.data.current?.event as Schedule | undefined;
    const targetDay = dragEvent.over?.data.current?.day as Date | undefined;
    if (!event || !targetDay) return;

    const originalStart = parseISO(event.startDateTime);
    const originalEnd = parseISO(event.endDateTime);
    const duration = Math.max(differenceInMinutes(originalEnd, originalStart), 15);
    const minuteShift = Math.round((dragEvent.delta.y / HOUR_HEIGHT_PX) * 4) * 15;
    const originalMinute = originalStart.getHours() * 60 + originalStart.getMinutes();
    const earliestMinute = HOURS_START * 60;
    const latestMinute = HOURS_END * 60 - duration;
    const nextMinute = Math.min(
      Math.max(originalMinute + minuteShift, earliestMinute),
      latestMinute
    );

    let nextStart = new Date(targetDay);
    nextStart = setHours(nextStart, Math.floor(nextMinute / 60));
    nextStart = setMinutes(nextStart, nextMinute % 60);
    const nextEnd = new Date(nextStart.getTime() + duration * 60_000);

    if (
      nextStart.getTime() === originalStart.getTime() &&
      nextEnd.getTime() === originalEnd.getTime()
    ) {
      return;
    }

    onEventMove(event, nextStart.toISOString(), nextEnd.toISOString());
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveEvent(null)}
      onDragEnd={handleDragEnd}
    >
      <div
        data-scheduler-scroll
        className="hidden h-[calc(100dvh-276px)] min-h-[500px] overflow-auto overscroll-contain bg-white xl:block"
      >
        <div className={cn("relative", isWeek ? "min-w-[1080px]" : "min-w-[700px]")}>
          <div
            className="sticky top-0 z-30 grid border-b border-slate-200/80 bg-white/95 backdrop-blur-xl"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="flex h-[60px] items-center justify-center border-r border-slate-200/80 bg-slate-50/70">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Time
              </span>
            </div>

            {days.map((day) => {
              const today = isToday(day);
              const dayEvents = eventsByDay[format(day, "yyyy-MM-dd")] ?? [];
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "flex h-[60px] items-center justify-center gap-2 border-r border-slate-200/80 px-2.5 last:border-r-0",
                    today && "bg-indigo-50/55"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "text-[9.5px] font-semibold uppercase tracking-[0.12em] text-slate-400",
                        today && "text-indigo-600"
                      )}
                    >
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-8 min-w-8 items-center justify-center rounded-[10px] px-1 text-[13px] font-semibold text-slate-800",
                        today && "bg-slate-950 text-white shadow-sm"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  {dayEvents.length ? (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                      {dayEvents.length}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div
            className="relative grid bg-white"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <TimeColumn />
            {days.map((day) => (
              <CalendarDay
                key={day.toISOString()}
                day={day}
                events={eventsByDay[format(day, "yyyy-MM-dd")] ?? []}
                now={now}
                onEventClick={onEventClick}
                onSlotClick={onSlotClick}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeEvent ? (
          <div className="h-20 w-64 cursor-grabbing">
            <PlannerEventCard event={activeEvent} height={80} detailed dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function TimeColumn() {
  return (
    <div
      className="relative border-r border-slate-200/80 bg-slate-50/45"
      style={{ height: GRID_HEIGHT_PX }}
    >
      {timeSlots.map((slot, index) => (
        <div
          key={slot.hour}
          className="absolute inset-x-0 border-t border-slate-200/80 pr-2.5 text-right"
          style={{ top: index * HOUR_HEIGHT_PX }}
        >
          <span className="relative -top-2 bg-slate-50 px-1 text-[9px] font-medium text-slate-400">
            {slot.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CalendarDay({
  day,
  events,
  now,
  onEventClick,
  onSlotClick,
}: {
  day: Date;
  events: Schedule[];
  now: Date;
  onEventClick: (event: Schedule) => void;
  onSlotClick: (day: Date, hour: number, minute: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `calendar-day-${day.toISOString()}`,
    data: { day },
  });
  const positionedEvents = layoutDayEvents(
    events.filter((event) => isInGridRange(event.startDateTime))
  );
  const showNow =
    isToday(day) && now.getHours() >= HOURS_START && now.getHours() < HOURS_END;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative border-r border-slate-200/70 bg-white last:border-r-0",
        isToday(day) && "bg-indigo-50/[0.10]",
        isOver && "bg-indigo-50/60"
      )}
      style={{ height: GRID_HEIGHT_PX }}
    >
      {timeSlots.map((slot, index) => {
        const top = index * HOUR_HEIGHT_PX;
        const halfHour = HOUR_HEIGHT_PX / 2;

        return (
          <div key={slot.hour}>
            <button
              type="button"
              onClick={() => onSlotClick(day, slot.hour, 0)}
              aria-label={`Add schedule on ${format(day, "EEEE, MMMM d")} at ${slot.label}`}
              className="absolute inset-x-0 border-t border-slate-200/75 outline-none transition hover:bg-indigo-50/35 focus-visible:z-20 focus-visible:bg-indigo-50/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
              style={{ top, height: halfHour }}
            >
              <span className="sr-only">Add schedule</span>
            </button>
            <button
              type="button"
              onClick={() => onSlotClick(day, slot.hour, 30)}
              aria-label={`Add schedule on ${format(day, "EEEE, MMMM d")} at half past ${slot.label}`}
              className="absolute inset-x-0 border-t border-dashed border-slate-100 outline-none transition hover:bg-indigo-50/30 focus-visible:z-20 focus-visible:bg-indigo-50/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
              style={{ top: top + halfHour, height: halfHour }}
            >
              <span className="sr-only">Add schedule at half hour</span>
            </button>
          </div>
        );
      })}

      {showNow ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
          style={{ top: getCurrentTimeTopPx(now) }}
          aria-hidden="true"
        >
          <span className="-ml-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          <span className="h-px flex-1 bg-rose-500" />
        </div>
      ) : null}

      {positionedEvents.map(({ event, colIndex, totalCols }) => {
        const top = Math.max(getEventTopPx(event.startDateTime), 0);
        const height = Math.min(
          getEventHeightPx(event.startDateTime, event.endDateTime),
          GRID_HEIGHT_PX - top
        );
        const width = 100 / totalCols;

        return (
          <DraggableEvent
            key={event._id}
            event={event}
            top={top}
            height={height}
            left={`calc(${colIndex * width}% + 3px)`}
            width={`calc(${width}% - 6px)`}
            onClick={() => onEventClick(event)}
          />
        );
      })}
    </div>
  );
}

function DraggableEvent({
  event,
  top,
  height,
  left,
  width,
  onClick,
}: {
  event: Schedule;
  top: number;
  height: number;
  left: string;
  width: string;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event._id,
    data: { event },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="group absolute z-10 touch-none"
      style={{
        top,
        height,
        left,
        width,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.25 : 1,
      }}
    >
      <span className="pointer-events-none absolute right-1 top-1 z-10 hidden rounded-md bg-white/80 p-0.5 text-slate-400 shadow-sm group-hover:block">
        <GripVertical className="h-3 w-3" />
      </span>
      <PlannerEventCard event={event} height={height} onClick={onClick} />
    </div>
  );
}
