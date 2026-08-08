"use client";

import {
  CalendarPlus,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import {
  format,
  formatDuration,
  formatTime,
  isSameDay,
  isToday,
  parseISO,
} from "@/lib/date-utils";
import { cn } from "@/lib/cn";
import { CategoryIcon } from "./planner-event-card";

interface PlannerMobileProps {
  weekDays: Date[];
  selectedDay: Date;
  events: Schedule[];
  onSelectDay: (day: Date) => void;
  onToday: () => void;
  onEventClick: (event: Schedule) => void;
  onToggleComplete: (event: Schedule) => void;
  onAddEvent: () => void;
}

export function PlannerMobile({
  weekDays,
  selectedDay,
  events,
  onSelectDay,
  onToday,
  onEventClick,
  onToggleComplete,
  onAddEvent,
}: PlannerMobileProps) {
  const dayEvents = events
    .filter((event) => isSameDay(parseISO(event.startDateTime), selectedDay))
    .sort(
      (first, second) =>
        parseISO(first.startDateTime).getTime() -
        parseISO(second.startDateTime).getTime()
    );

  return (
    <div className="xl:hidden">
      <div className="border-b border-slate-200 bg-white px-2 py-2.5 sm:px-3">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const selected = isSameDay(day, selectedDay);
            const today = isToday(day);
            const count = events.filter((event) =>
              isSameDay(parseISO(event.startDateTime), day)
            ).length;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onSelectDay(day)}
                aria-pressed={selected}
                aria-label={`${format(day, "EEEE, MMMM d")}, ${count} schedules`}
                className={cn(
                  "relative flex min-h-[58px] min-w-0 flex-col items-center justify-center rounded-xl px-1 outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-500/15",
                  selected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50",
                  today && !selected && "text-indigo-700"
                )}
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] opacity-65">
                  {format(day, "EEEEE")}
                </span>
                <span className="mt-1 text-[14px] font-semibold leading-none">
                  {format(day, "d")}
                </span>
                <span
                  className={cn(
                    "mt-1.5 h-1 w-1 rounded-full",
                    count > 0
                      ? selected
                        ? "bg-indigo-300"
                        : "bg-indigo-500"
                      : "bg-transparent"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50/55 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-4">
        <div className="mb-3 flex items-start justify-between gap-3 px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
              {isToday(selectedDay) ? "Today" : format(selectedDay, "EEEE")}
            </p>
            <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.025em] text-slate-950">
              {format(selectedDay, "MMMM d")}
            </h2>
            <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">
              {dayEvents.length} {dayEvents.length === 1 ? "schedule" : "schedules"}
            </p>
          </div>
          {!isToday(selectedDay) ? (
            <button
              type="button"
              onClick={onToday}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              Today
            </button>
          ) : null}
        </div>

        {dayEvents.length ? (
          <div className="space-y-2.5">
            {dayEvents.map((event) => (
              <MobileEvent
                key={event._id}
                event={event}
                onOpen={() => onEventClick(event)}
                onToggle={() => onToggleComplete(event)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <CalendarPlus className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[14px] font-semibold text-slate-900">
              Nothing planned for this day
            </h3>
            <p className="mt-1 max-w-[260px] text-[12px] leading-5 text-slate-500">
              Add a class, study block or personal activity when you are ready.
            </p>
            <button
              type="button"
              onClick={onAddEvent}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <CalendarPlus className="h-4 w-4" />
              Add schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileEvent({
  event,
  onOpen,
  onToggle,
}: {
  event: Schedule;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const theme = CATEGORY_CONFIG[event.category];
  const completed = event.status === "completed";
  const start = parseISO(event.startDateTime);
  const end = parseISO(event.endDateTime);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        completed && "opacity-65"
      )}
    >
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: theme.color }}
        aria-hidden="true"
      />
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-indigo-500/10"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ color: theme.color, backgroundColor: `${theme.color}12` }}
          >
            <CategoryIcon category={event.category} className="h-[17px] w-[17px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center gap-2">
              <strong
                className={cn(
                  "truncate text-[13.5px] font-semibold tracking-[-0.01em] text-slate-950",
                  completed && "line-through text-slate-500"
                )}
              >
                {event.title}
              </strong>
              <span
                className="shrink-0 text-[9.5px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: theme.color }}
              >
                {theme.label}
              </span>
            </span>
            <span className="mt-1.5 flex min-w-0 items-center gap-2 text-[10.5px] font-medium text-slate-500">
              <span className="flex shrink-0 items-center gap-1">
                <Clock3 className="h-3 w-3" />
                {formatTime(start)} · {formatDuration(start, end)}
              </span>
              {event.location ? (
                <span className="flex min-w-0 items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
              ) : null}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label={completed ? `Mark ${event.title} active` : `Mark ${event.title} complete`}
          className="flex w-12 shrink-0 items-center justify-center border-l border-slate-100 text-slate-300 outline-none transition hover:bg-emerald-50 hover:text-emerald-600 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-emerald-500/10"
        >
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full border",
              completed
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-200"
            )}
          >
            <Check className="h-3 w-3" />
          </span>
        </button>
      </div>
    </article>
  );
}
