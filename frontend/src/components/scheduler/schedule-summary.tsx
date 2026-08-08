"use client";

import React from "react";
import { Schedule } from "@/types/schedule";
import {
  calculateTodayClasses,
  calculateStudyDuration,
  findNextUpcomingEvent,
  calculatePendingCount,
} from "@/lib/scheduler-helpers";
import {
  BookOpen,
  Clock3,
  ArrowUpRight,
  ClipboardCheck,
  TimerReset,
} from "lucide-react";
import { useCurrentMinute } from "@/hooks/use-current-minute";

interface ScheduleSummaryProps {
  events: Schedule[];
}

export function ScheduleSummary({ events }: ScheduleSummaryProps) {
  const now = useCurrentMinute();
  const { count: todayClasses, active: activeClasses } = calculateTodayClasses(events, now);
  const { formattedDuration, progressPercent } = calculateStudyDuration(events, 240, now);
  const { event: nextEvent, countdown: nextCountdown, timeRange: nextTimeRange } =
    findNextUpcomingEvent(events, now);
  const { total: pendingTotal, assignments, exams } = calculatePendingCount(events, now);

  return (
    <section
      className="grid shrink-0 grid-cols-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_24px_rgba(15,23,42,0.025)]"
      aria-label="Schedule overview"
    >
      {/* ── Card 1: Today's Classes ── */}
      <div className="flex min-h-[92px] items-center gap-3 border-r border-slate-100 px-4 py-3.5 xl:px-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100/80">
          <BookOpen className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
            Classes today
          </p>
          <div className="mt-1 flex items-end gap-2">
            <h3 className="text-[22px] font-bold leading-none tracking-[-0.04em] text-slate-950">
              {todayClasses}
            </h3>
            <span className="truncate pb-0.5 text-[10.5px] font-semibold text-slate-400">
              {activeClasses > 0 ? `${activeClasses} active now` : "nothing active"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Card 2: Study Hours ── */}
      <div className="flex min-h-[92px] items-center gap-3 border-r border-slate-100 px-4 py-3.5 xl:px-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100/80">
          <TimerReset className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
            Focus time
          </p>
          <div className="mt-1 flex items-end gap-2">
            <h3 className="text-[22px] font-bold leading-none tracking-[-0.04em] text-slate-950">
              {formattedDuration}
            </h3>
            <span className="pb-0.5 text-[10.5px] font-semibold text-slate-400">
              of 4h goal
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Card 3: Next Event ── */}
      <div className="relative flex min-h-[92px] items-center gap-3 overflow-hidden border-r border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 px-4 py-3.5 xl:px-5">
        <div className="pointer-events-none absolute -right-5 -top-10 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl" />
        <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_8px_18px_rgba(79,70,229,0.22)]">
          <Clock3 className="h-[18px] w-[18px]" />
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-indigo-400">
            Coming up next
          </p>
          <h3 className="mt-1 truncate text-[13px] font-bold leading-tight text-slate-950">
            {nextEvent ? nextEvent.title : "No upcoming events"}
          </h3>
          <p className="mt-1 truncate text-[10.5px] font-semibold text-indigo-600">
            {nextEvent ? `${nextCountdown} • ${nextTimeRange}` : "All clear for now"}
          </p>
        </div>
        {nextEvent ? <ArrowUpRight className="relative h-4 w-4 flex-shrink-0 text-indigo-400" /> : null}
      </div>

      {/* ── Card 4: Pending Tasks ── */}
      <div className="flex min-h-[92px] items-center gap-3 px-4 py-3.5 xl:px-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100/80">
          <ClipboardCheck className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
            Needs attention
          </p>
          <div className="mt-1 flex items-end gap-2">
            <h3 className="text-[22px] font-bold leading-none tracking-[-0.04em] text-slate-950">
              {pendingTotal}
            </h3>
            <span className="truncate pb-0.5 text-[10.5px] font-semibold text-slate-400">
              {assignments} assignments · {exams} exams
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
