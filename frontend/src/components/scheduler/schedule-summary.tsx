"use client";

import React from "react";
import { Schedule } from "@/types/schedule";
import {
  calculateTodayClasses,
  calculateStudyDuration,
  findNextUpcomingEvent,
  calculatePendingCount,
} from "@/lib/scheduler-helpers";
import { BookOpen, Clock, GraduationCap, ClipboardList } from "lucide-react";

interface ScheduleSummaryProps {
  events: Schedule[];
}

export function ScheduleSummary({ events }: ScheduleSummaryProps) {
  const { count: todayClasses, active: activeClasses } = calculateTodayClasses(events);
  const { formattedDuration, progressPercent } = calculateStudyDuration(events);
  const { event: nextEvent, countdown: nextCountdown, timeRange: nextTimeRange } =
    findNextUpcomingEvent(events);
  const { total: pendingTotal, assignments, exams } = calculatePendingCount(events);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ── Card 1: Today's Classes ── */}
      <div className="bg-white rounded-[14px] p-4 border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] flex items-center gap-3.5 hover:border-indigo-200 transition-all min-h-[92px]">
        <div className="w-10 h-10 rounded-[10px] bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-[#4F46E5]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Today&apos;s Classes
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-xl font-extrabold text-slate-900 leading-none">
              {todayClasses}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 truncate">
              {activeClasses} active
            </span>
          </div>
        </div>
      </div>

      {/* ── Card 2: Study Hours ── */}
      <div className="bg-white rounded-[14px] p-4 border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] flex items-center gap-3.5 hover:border-emerald-200 transition-all min-h-[92px]">
        <div className="w-10 h-10 rounded-[10px] bg-[#ECFDF5] text-[#059669] flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-[#059669]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Study Hours
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-xl font-extrabold text-slate-900 leading-none">
              {formattedDuration}
            </h3>
            <span className="text-[11px] font-medium text-slate-500">
              Goal: 4h
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Card 3: Next Event ── */}
      <div className="bg-white rounded-[14px] p-4 border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] flex items-center gap-3.5 hover:border-purple-200 transition-all min-h-[92px]">
        <div className="w-10 h-10 rounded-[10px] bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-[#7C3AED]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Next Up
          </p>
          <h3 className="text-[13px] font-bold text-slate-900 truncate mt-0.5 leading-tight">
            {nextEvent ? nextEvent.title : "No upcoming events"}
          </h3>
          <p className="text-[11px] font-semibold text-[#4F46E5] truncate mt-0.5">
            {nextEvent ? `${nextCountdown} • ${nextTimeRange}` : "All clear for now"}
          </p>
        </div>
      </div>

      {/* ── Card 4: Pending Tasks ── */}
      <div className="bg-white rounded-[14px] p-4 border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] flex items-center gap-3.5 hover:border-amber-200 transition-all min-h-[92px]">
        <div className="w-10 h-10 rounded-[10px] bg-[#FFFBEB] text-[#D97706] flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-5 h-5 text-[#D97706]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Pending Tasks
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-xl font-extrabold text-slate-900 leading-none">
              {pendingTotal}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 truncate">
              {assignments} asgn • {exams} exam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
