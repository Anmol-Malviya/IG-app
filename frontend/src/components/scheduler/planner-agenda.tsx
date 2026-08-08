"use client";

import {
  Check,
  ChevronRight,
  ExternalLink,
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

interface PlannerAgendaProps {
  days: Date[];
  events: Schedule[];
  onEventClick: (event: Schedule) => void;
  onToggleComplete: (event: Schedule) => void;
}

export function PlannerAgenda({
  days,
  events,
  onEventClick,
  onToggleComplete,
}: PlannerAgendaProps) {
  const groups = days
    .map((day) => ({
      day,
      events: events
        .filter((event) => isSameDay(parseISO(event.startDateTime), day))
        .sort(
          (first, second) =>
            parseISO(first.startDateTime).getTime() -
            parseISO(second.startDateTime).getTime()
        ),
    }))
    .filter((group) => group.events.length > 0);

  return (
    <div
      data-scheduler-scroll
      className="hidden h-[calc(100dvh-282px)] min-h-[480px] justify-center overflow-y-auto bg-slate-50/55 p-4 xl:flex xl:p-5"
    >
      <div className="w-full max-w-5xl space-y-4">
        {groups.map((group) => (
          <section
            key={group.day.toISOString()}
            aria-labelledby={`agenda-${format(group.day, "yyyy-MM-dd")}`}
          >
            <div className="mb-2.5 flex items-center gap-2 px-1">
              <h3
                id={`agenda-${format(group.day, "yyyy-MM-dd")}`}
                className="text-[13px] font-semibold text-slate-900"
              >
                {format(group.day, "EEEE, MMMM d")}
              </h3>
              {isToday(group.day) ? (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-indigo-700">
                  Today
                </span>
              ) : null}
              <span className="text-[11px] font-medium text-slate-400">
                {group.events.length} {group.events.length === 1 ? "schedule" : "schedules"}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              {group.events.map((event, index) => (
                <AgendaRow
                  key={event._id}
                  event={event}
                  withBorder={index > 0}
                  onOpen={() => onEventClick(event)}
                  onToggle={() => onToggleComplete(event)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function AgendaRow({
  event,
  withBorder,
  onOpen,
  onToggle,
}: {
  event: Schedule;
  withBorder: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const theme = CATEGORY_CONFIG[event.category];
  const completed = event.status === "completed";
  const start = parseISO(event.startDateTime);
  const end = parseISO(event.endDateTime);

  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-4 py-3.5 transition hover:bg-slate-50/70 sm:px-5",
        withBorder && "border-t border-slate-100",
        completed && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={completed ? `Mark ${event.title} active` : `Mark ${event.title} complete`}
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-500/15",
          completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-200 bg-white text-transparent hover:border-emerald-400 hover:text-emerald-500"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </button>

      <div className="w-[92px] shrink-0">
        <p className="text-[12.5px] font-semibold text-slate-800">
          {formatTime(start)}
        </p>
        <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
          {formatDuration(start, end)}
        </p>
      </div>

      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ color: theme.color, backgroundColor: `${theme.color}12` }}
      >
        <CategoryIcon category={event.category} className="h-4 w-4" />
      </span>

      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-4 text-left outline-none focus-visible:rounded-lg focus-visible:ring-4 focus-visible:ring-indigo-500/10"
      >
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-[13.5px] font-semibold tracking-[-0.01em] text-slate-950",
              completed && "line-through text-slate-500"
            )}
          >
            {event.title}
          </span>
          <span className="mt-1 flex min-w-0 items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="shrink-0" style={{ color: theme.color }}>
              {theme.label}
            </span>
            {event.location ? (
              <span className="flex min-w-0 items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{event.location}</span>
              </span>
            ) : event.subject ? (
              <span className="truncate">{event.subject}</span>
            ) : null}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
      </button>

      {event.meetingUrl ? (
        <a
          href={event.meetingUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Join ${event.title}`}
          className="hidden h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-[11px] font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 xl:inline-flex"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Join
        </a>
      ) : null}
    </div>
  );
}
