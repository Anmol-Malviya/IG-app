"use client";

import React from "react";
import Link from "next/link";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import { isToday, format, parseISO, formatTime } from "@/lib/date-utils";
import { findNextUpcomingEvent } from "@/lib/scheduler-helpers";
import { useCurrentMinute } from "@/hooks/use-current-minute";
import { getCategoryIcon } from "./schedule-event-card";
import { MobileDateStrip } from "./mobile-date-strip";
import {
  Calendar,
  Home,
  ClipboardList,
  BookOpen,
  User,
  Plus,
  Menu,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface MobileDayAgendaProps {
  weekDays: Date[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  dayEvents: Schedule[];
  allEvents: Schedule[];
  onEventClick: (event: Schedule) => void;
  onAddClick: () => void;
}

export function MobileDayAgenda({
  weekDays,
  selectedDay,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
  onToday,
  dayEvents,
  allEvents,
  onEventClick,
  onAddClick,
}: MobileDayAgendaProps) {
  const now = useCurrentMinute();
  const isSelectedToday = isToday(selectedDay);
  const { event: nextEvent, countdown: nextCountdown, timeRange: nextTimeRange } =
    findNextUpcomingEvent(allEvents, now);

  const nowTime = now.getTime();

  // Find the index before which the live time marker should be rendered
  const liveMarkerIndex = isSelectedToday
    ? dayEvents.findIndex((e) => parseISO(e.startDateTime).getTime() > nowTime)
    : -1;

  return (
    <div
      data-scheduler
      className="flex min-h-screen w-full flex-col bg-[#f3f5f9] pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      {/* ── Top Mobile Bar ── */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4">
        <Link
          href="/dashboard"
          className="-ml-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
          title="Back to Dashboard"
        >
          <Menu className="h-[18px] w-[18px]" />
        </Link>

        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-500">Student planner</p>
          <h1 className="text-[15px] font-bold tracking-[-0.02em] text-slate-950">My schedule</h1>
        </div>

        <button
          type="button"
          onClick={onToday}
          className="-mr-1 flex h-10 min-w-10 items-center justify-center rounded-xl bg-indigo-50 px-2 text-[10.5px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
          title="Back to today"
        >
          Today
        </button>
      </header>

      {/* ── 7-Day Date Strip ── */}
      <MobileDateStrip
        weekDays={weekDays}
        selectedDay={selectedDay}
        onSelectDay={onSelectDay}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onToday={onToday}
      />

      <div className="flex-1 space-y-5 p-4">
        {/* ── Next Class Banner (Dynamic) ── */}
        {nextEvent && (
          <button
            type="button"
            onClick={() => onEventClick(nextEvent)}
            className="relative w-full cursor-pointer overflow-hidden rounded-[18px] bg-[#111a2d] p-4 text-left shadow-[0_14px_30px_rgba(15,23,42,0.16)] transition-transform active:scale-[0.99]"
          >
            <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="relative mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-indigo-200 ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Up next
                </span>
              </div>
              <span className="rounded-full border border-indigo-300/20 bg-indigo-400/15 px-2.5 py-1 text-[10.5px] font-bold text-indigo-200">
                {nextCountdown}
              </span>
            </div>

            <div className="relative flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-bold tracking-[-0.02em] text-white">
                  {nextEvent.title}
                </h3>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {nextTimeRange} {nextEvent.location ? `· ${nextEvent.location}` : ""}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-indigo-300" />
            </div>
          </button>
        )}

        {/* ── Day Header ── */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400">Day plan</p>
            <h2 className="mt-1 text-[15px] font-bold tracking-[-0.02em] text-slate-950">
              {format(selectedDay, "EEEE, MMMM d")}
            </h2>
          </div>
          <span className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
          </span>
        </div>

        {/* ── Day Events Timeline ── */}
        {dayEvents.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-slate-300 bg-white p-9 text-center">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="mt-3 text-[13px] font-bold text-slate-800">
              Your day is open
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">Add a class or focus block when you are ready.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayEvents.map((event, index) => {
              const start = parseISO(event.startDateTime);
              const end = parseISO(event.endDateTime);
              const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.class;
              const isCompleted = event.status === "completed";
              const showLiveMarkerHere = isSelectedToday && index === liveMarkerIndex;

              return (
                <React.Fragment key={event._id}>
                  {showLiveMarkerHere && (
                    <div className="flex items-center gap-2 my-2">
                      <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full shadow-2xs">
                        {format(now, "h:mm a")}
                      </span>
                      <div className="flex-1 h-[1.5px] bg-rose-400" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onEventClick(event)}
                    className="group flex w-full cursor-pointer items-center gap-3 text-left transition-transform active:scale-[0.99]"
                  >
                    {/* Time */}
                    <div className="w-12 flex-shrink-0 text-center leading-none">
                      <div className="text-[12px] font-bold text-slate-900">
                        {format(start, "h:mm")}
                      </div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {format(start, "a")}
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className={`flex min-h-[64px] flex-1 items-center justify-between rounded-[15px] border border-slate-200/90 bg-white p-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.035)] transition-all group-hover:border-slate-300 ${
                        isCompleted ? "opacity-60 saturate-50" : ""
                      }`}
                      style={{
                        borderLeftWidth: "4px",
                        borderLeftColor: cat.accentColor,
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="flex-shrink-0"
                          style={{ color: cat.color }}
                        >
                          {getCategoryIcon(event.category, "w-4 h-4")}
                        </span>
                        <div className="min-w-0">
                          <h4
                            className={`truncate text-[13px] font-bold tracking-[-0.01em] text-slate-900 ${
                              isCompleted ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {event.title}
                          </h4>
                          <p className="mt-1 truncate text-[10.5px] font-medium text-slate-500">
                            {formatTime(start)} – {formatTime(end)}
                            {event.location ? ` • ${event.location}` : ""}
                          </p>
                        </div>
                      </div>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </React.Fragment>
              );
            })}

            {isSelectedToday && liveMarkerIndex === -1 && (
              <div className="flex items-center gap-2 py-1" aria-label="Current time">
                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full shadow-2xs">
                  {format(now, "h:mm a")}
                </span>
                <div className="flex-1 h-[1.5px] bg-rose-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Floating Action Button (+) ── */}
      <button
        type="button"
        onClick={onAddClick}
        className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-5 z-30 flex h-14 w-14 min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-[0_12px_28px_rgba(79,70,229,0.34)] transition-all hover:bg-indigo-700 active:scale-95"
        title="Add Event"
        aria-label="Add schedule event"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Bottom App Tab Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex min-h-[68px] items-center justify-around border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl" aria-label="Primary navigation">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#4F46E5] transition-colors min-h-[48px] min-w-[48px]"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link
          href="/services/weekly-schedule"
          className="relative flex min-h-[48px] min-w-[56px] flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
        >
          <Calendar className="w-5 h-5 text-[#4F46E5]" />
          <span className="text-[10px] font-bold mt-1 text-[#4F46E5]">Schedule</span>
        </Link>
        <Link
          href="/services/assignments"
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#4F46E5] transition-colors min-h-[48px] min-w-[48px]"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Tasks</span>
        </Link>
        <Link
          href="/services/resources"
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#4F46E5] transition-colors min-h-[48px] min-w-[48px]"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Courses</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#4F46E5] transition-colors min-h-[48px] min-w-[48px]"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
