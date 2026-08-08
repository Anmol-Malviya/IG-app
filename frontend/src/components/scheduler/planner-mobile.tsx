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
      <div className="border-b border-slate-200/80 bg-white px-2.5 py-2.5 sm:px-4">
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
                  "relative flex min-h-[58px] min-w-0 flex-col items-center justify-center rounded-xl px-1 outline-none transition focus-visible:ring-4 focus-visible:ring-slate-900/[0.05]",
                  selected
                    ? "bg-slate-950 text-white shadow-sm"
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
                <span className="mt-1.5 flex h-1 items-center gap-0.5">
                  {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1 w-1 rounded-full",
                        selected ? "bg-indigo-300" : "bg-indigo-500"
                      )}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#fafbfc] px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-4 sm:pt-5">
        <div className="mb-4 flex items-start justify-between gap-3 px-1">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-slate-400">
              {isToday(selectedDay) ? "Today" : format(selectedDay, "EEEE")}
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-950">
              {format(selectedDay, "MMMM d")}
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              {dayEvents.length
                ? `${dayEvents.length} ${dayEvents.length === 1 ? "schedule" : "schedules"}`
                : "A clear day"}
            </p>
          </div>
          {!isToday(selectedDay) ? (
            <button
              type="button"
              onClick={onToday}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              Today
            </button>
          ) : null}
        </div>

        {dayEvents.length ? (
          <div className="relative space-y-2.5 before:absolute before:bottom-4 before:left-[42px] before:top-4 before:w-px before:bg-slate-200">
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
          <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-300 bg-white px-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <CalendarPlus className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[14px] font-semibold text-slate-900">
              Nothing planned yet
            </h3>
            <p className="mt-1 max-w-[260px] text-[12px] leading-5 text-slate-500">
              Keep this day open or add a class, task, study session, or personal plan.
            </p>
            <button
              type="button"
              onClick={onAddEvent}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
        "relative z-[1] grid grid-cols-[56px_minmax(0,1fr)] items-start gap-2.5",
        completed && "opacity-65"
      )}
    >
      <div className="pt-3 text-right">
        <p className="text-[10.5px] font-semibold text-slate-700">{formatTime(start)}</p>
        <p className="mt-0.5 text-[9px] font-medium text-slate-400">
          {formatDuration(start, end)}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[16px] border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
        <span
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ backgroundColor: theme.color }}
          aria-hidden="true"
        />

        <div className="flex items-stretch">
          <button
            type="button"
            onClick={onOpen}
            className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3 text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-slate-900/[0.04]"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
              style={{ color: theme.color, backgroundColor: `${theme.color}10` }}
            >
              <CategoryIcon category={event.category} className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-2">
                <strong
                  className={cn(
                    "truncate text-[13px] font-semibold tracking-[-0.01em] text-slate-950",
                    completed && "line-through text-slate-500"
                  )}
                >
                  {event.title}
                </strong>
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.07em]"
                  style={{ color: theme.color, backgroundColor: `${theme.color}0d` }}
                >
                  {theme.label}
                </span>
              </span>

              <span className="mt-1.5 flex min-w-0 items-center gap-2 text-[10px] font-medium text-slate-500">
                <span className="flex shrink-0 items-center gap-1 sm:hidden">
                  <Clock3 className="h-3 w-3" />
                  {formatTime(start)}
                </span>
                {event.location ? (
                  <span className="flex min-w-0 items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                ) : event.subject ? (
                  <span className="truncate">{event.subject}</span>
                ) : (
                  <span className="text-slate-400">Tap for details</span>
                )}
              </span>
            </span>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label={completed ? `Mark ${event.title} active` : `Mark ${event.title} complete`}
            className="flex w-11 shrink-0 items-center justify-center border-l border-slate-100 text-slate-300 outline-none transition hover:bg-emerald-50 hover:text-emerald-600 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-emerald-500/10"
          >
            <span
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full border",
                completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-slate-200 bg-white"
              )}
            >
              <Check className="h-3 w-3" />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
