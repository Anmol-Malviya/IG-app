"use client";

import React from "react";
import Link from "next/link";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import { isToday, format, parseISO, formatTime } from "@/lib/date-utils";
import { findNextUpcomingEvent } from "@/lib/scheduler-helpers";
import { getCategoryIcon } from "./schedule-event-card";
import { MobileDateStrip } from "./mobile-date-strip";
import {
  Calendar,
  Home,
  ClipboardList,
  BookOpen,
  User,
  Plus,
  Bell,
  Menu,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface MobileDayAgendaProps {
  weekDays: Date[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
  dayEvents: Schedule[];
  allEvents: Schedule[];
  onEventClick: (event: Schedule) => void;
  onAddClick: () => void;
}

export function MobileDayAgenda({
  weekDays,
  selectedDay,
  onSelectDay,
  dayEvents,
  allEvents,
  onEventClick,
  onAddClick,
}: MobileDayAgendaProps) {
  const isSelectedToday = isToday(selectedDay);
  const { event: nextEvent, countdown: nextCountdown, timeRange: nextTimeRange } =
    findNextUpcomingEvent(allEvents);

  const now = new Date();
  const nowTime = now.getTime();

  // Find the index before which the live time marker should be rendered
  const liveMarkerIndex = isSelectedToday
    ? dayEvents.findIndex((e) => parseISO(e.startDateTime).getTime() > nowTime)
    : -1;

  return (
    <div className="lg:hidden w-full min-h-screen bg-[#F7F8FC] flex flex-col pb-20">
      {/* ── Top Mobile Bar ── */}
      <header className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <Link
          href="/dashboard"
          className="w-10 h-10 -ml-1 rounded-[10px] flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          title="Back to Dashboard"
        >
          <Menu className="w-5 h-5" />
        </Link>

        <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">
          Weekly Schedule
        </h1>

        <button
          type="button"
          className="w-10 h-10 -mr-1 rounded-[10px] flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* ── 7-Day Date Strip ── */}
      <MobileDateStrip
        weekDays={weekDays}
        selectedDay={selectedDay}
        onSelectDay={onSelectDay}
      />

      <div className="p-4 space-y-4 flex-1">
        {/* ── Next Class Banner (Dynamic) ── */}
        {nextEvent && (
          <div
            onClick={() => onEventClick(nextEvent)}
            className="rounded-[14px] p-4 bg-white border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] cursor-pointer hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Next Class
                </span>
              </div>
              <span className="text-[12px] font-extrabold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded-full">
                {nextCountdown}
              </span>
            </div>

            <h3 className="text-[15px] font-bold text-slate-900 truncate">
              {nextEvent.title}
            </h3>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">
              {nextTimeRange} {nextEvent.location ? `• ${nextEvent.location}` : ""}
            </p>
          </div>
        )}

        {/* ── Day Header ── */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-[14px] font-extrabold text-[#4F46E5]">
            {format(selectedDay, "EEEE, MMMM d")}
          </h2>
          <span className="text-[11px] font-medium text-slate-500">
            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
          </span>
        </div>

        {/* ── Day Events Timeline ── */}
        {dayEvents.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-slate-200 p-8 text-center shadow-2xs">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-[13px] font-bold text-slate-800 mt-2">
              No classes scheduled
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Enjoy your free time!</p>
          </div>
        ) : (
          <div className="space-y-3">
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

                  <div
                    onClick={() => onEventClick(event)}
                    className="flex items-center gap-3 cursor-pointer group active:scale-99 transition-transform"
                  >
                    {/* Time */}
                    <div className="w-13 text-center flex-shrink-0 leading-none">
                      <div className="text-[12.5px] font-extrabold text-slate-900">
                        {format(start, "h:mm")}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        {format(start, "a")}
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 rounded-[12px] p-3 border bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all flex items-center justify-between min-h-[48px] ${
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
                            className={`font-bold text-[13px] text-slate-900 truncate ${
                              isCompleted ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {event.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
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
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Floating Action Button (+) ── */}
      <button
        type="button"
        onClick={onAddClick}
        className="fixed bottom-20 right-5 w-13 h-13 rounded-full bg-[#4F46E5] text-white shadow-lg flex items-center justify-center text-xl font-bold active:scale-95 z-30 min-h-[48px] min-w-[48px] hover:bg-[#4338CA] transition-all"
        title="Add Event"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Bottom App Tab Navigation ── */}
      <nav className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 fixed bottom-0 left-0 right-0 z-30 shadow-[0_-2px_8px_rgba(15,23,42,0.04)]">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#4F46E5] transition-colors min-h-[48px] min-w-[48px]"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link
          href="/services/weekly-schedule"
          className="flex flex-col items-center justify-center text-[#4F46E5] min-h-[48px] min-w-[48px]"
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
