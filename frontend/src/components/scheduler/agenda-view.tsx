"use client";

import React from "react";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import {
  isToday,
  format,
  parseISO,
  formatTime,
  formatDuration,
  isSameDay,
} from "@/lib/date-utils";
import { getCategoryIcon } from "./schedule-event-card";
import {
  MapPin,
  User,
  CheckCircle2,
  Copy,
  Trash2,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

interface AgendaViewProps {
  weekDays: Date[];
  events: Schedule[];
  onEventClick: (event: Schedule) => void;
  onToggleComplete: (id: string, status: Schedule["status"]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AgendaView({
  weekDays,
  events,
  onEventClick,
  onToggleComplete,
  onDuplicate,
  onDelete,
}: AgendaViewProps) {
  // Group events by day in the displayed week
  const grouped = weekDays.map((day) => {
    const dayEvents = events
      .filter((e) => isSameDay(parseISO(e.startDateTime), day))
      .sort(
        (a, b) =>
          parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime()
      );
    return {
      day,
      events: dayEvents,
    };
  });

  const totalEvents = events.length;

  if (totalEvents === 0) {
    return (
      <div className="bg-white rounded-[14px] border border-slate-200 p-12 text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <CalendarDays className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No events scheduled for this period</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Add classes, study blocks, or assignments to see your agenda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ day, events: dayEvents }) => {
        const isCurrent = isToday(day);
        const dayFormatted = format(day, "EEEE, MMMM d");

        return (
          <div
            key={day.toISOString()}
            className="bg-white rounded-[14px] border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] overflow-hidden"
          >
            {/* Day Group Header */}
            <div
              className={`px-5 py-3 border-b border-slate-100 flex items-center justify-between ${
                isCurrent ? "bg-indigo-50/40" : "bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-bold text-slate-900">
                  {dayFormatted}
                </span>
                {isCurrent && (
                  <span className="bg-[#4F46E5] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
              </span>
            </div>

            {/* Event List */}
            {dayEvents.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-slate-400">
                No scheduled activities
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {dayEvents.map((event) => {
                  const start = parseISO(event.startDateTime);
                  const end = parseISO(event.endDateTime);
                  const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.class;
                  const isCompleted = event.status === "completed";

                  return (
                    <div
                      key={event._id}
                      onClick={() => onEventClick(event)}
                      className={`p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                        isCompleted ? "opacity-60 saturate-50" : ""
                      }`}
                    >
                      {/* Left: Time & Category */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-28 flex-shrink-0 text-left">
                          <div className="text-[13px] font-bold text-slate-900">
                            {formatTime(start)}
                          </div>
                          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <span>{formatTime(end)}</span>
                            <span>•</span>
                            <span>{formatDuration(start, end)}</span>
                          </div>
                        </div>

                        {/* Category badge & Title */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px] inline-flex items-center gap-1 ${cat.badgeBg} ${cat.badgeText}`}
                            >
                              {getCategoryIcon(event.category, "w-3 h-3")}
                              <span>{cat.label}</span>
                            </span>
                            {event.subject && (
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-[6px]">
                                {event.subject}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-[14px] font-bold mt-1 text-slate-900 truncate ${
                              isCompleted ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {event.title}
                          </h4>

                          {/* Metadata row */}
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {event.location}
                              </span>
                            )}
                            {event.faculty && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                {event.faculty}
                              </span>
                            )}
                            {event.meetingUrl && (
                              <a
                                href={event.meetingUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Join Link
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onToggleComplete(
                              event._id,
                              isCompleted ? "scheduled" : "completed"
                            )
                          }
                          className={`p-2 rounded-[8px] border text-xs font-semibold transition-colors ${
                            isCompleted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                          title={isCompleted ? "Mark active" : "Mark completed"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicate(event._id)}
                          className="p-2 rounded-[8px] border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate event"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(event._id)}
                          className="p-2 rounded-[8px] border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
