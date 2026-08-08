"use client";

import {
  AlarmClock,
  BookOpenCheck,
  ChevronRight,
  CircleAlert,
  Timer,
} from "lucide-react";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import {
  calculatePendingCount,
  calculateStudyDuration,
  calculateTodayClasses,
  findNextUpcomingEvent,
} from "@/lib/scheduler-helpers";
import { format } from "@/lib/date-utils";
import { useCurrentMinute } from "@/hooks/use-current-minute";

interface PlannerOverviewProps {
  events: Schedule[];
  onOpenEvent: (event: Schedule) => void;
}

export function PlannerOverview({ events, onOpenEvent }: PlannerOverviewProps) {
  const now = useCurrentMinute();
  const classes = calculateTodayClasses(events, now);
  const study = calculateStudyDuration(events, 240, now);
  const pending = calculatePendingCount(events, now);
  const next = findNextUpcomingEvent(events, now);
  const nextTheme = next.event ? CATEGORY_CONFIG[next.event.category] : null;

  return (
    <section
      aria-labelledby="schedule-overview-title"
      className="hidden overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)] md:grid md:grid-cols-3 lg:grid-cols-[minmax(320px,1.55fr)_repeat(3,minmax(150px,.75fr))]"
    >
      <h2 id="schedule-overview-title" className="sr-only">
        Schedule overview
      </h2>

      <button
        type="button"
        onClick={() => next.event && onOpenEvent(next.event)}
        disabled={!next.event}
        className="group col-span-3 flex min-h-[78px] min-w-0 items-center gap-3.5 border-b border-slate-100 px-4 text-left transition enabled:hover:bg-slate-50/60 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-slate-900/[0.04] sm:px-5 lg:col-span-1 lg:border-b-0 lg:border-r"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            color: nextTheme?.color ?? "#64748b",
            backgroundColor: nextTheme ? `${nextTheme.color}10` : "#f1f5f9",
          }}
        >
          <AlarmClock className="h-[18px] w-[18px]" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Up next
            </span>
            {next.event ? (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: nextTheme?.color }}
              />
            ) : null}
          </span>
          <span className="mt-1 block truncate text-[14px] font-semibold tracking-[-0.015em] text-slate-950">
            {next.event?.title ?? "Your schedule is clear"}
          </span>
          <span className="mt-1 block truncate text-[11px] font-medium text-slate-500">
            {next.event
              ? `${format(new Date(next.event.startDateTime), "EEE, h:mm a")} · ${next.countdown}`
              : "Add your next class, task or study block"}
          </span>
        </span>

        {next.event ? (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
        ) : null}
      </button>

      <OverviewMetric
        icon={<BookOpenCheck className="h-4 w-4" />}
        label="Classes today"
        value={`${classes.count}`}
        detail={classes.count === 1 ? "class" : "classes"}
        tone="indigo"
        className="border-r border-slate-100"
      />
      <OverviewMetric
        icon={<Timer className="h-4 w-4" />}
        label="Study plan"
        value={study.formattedDuration}
        detail="today"
        tone="emerald"
        className="border-r border-slate-100"
      />
      <OverviewMetric
        icon={<CircleAlert className="h-4 w-4" />}
        label="Pending"
        value={`${pending.total}`}
        detail={`${pending.assignments} tasks · ${pending.exams} exams`}
        tone="amber"
      />
    </section>
  );
}

const metricTones = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

function OverviewMetric({
  icon,
  label,
  value,
  detail,
  tone,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: keyof typeof metricTones;
  className?: string;
}) {
  return (
    <div className={`flex min-h-[78px] min-w-0 items-center gap-3 px-4 ${className}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${metricTones[tone]}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[9.5px] font-semibold uppercase tracking-[0.11em] text-slate-400">
          {label}
        </span>
        <span className="mt-1.5 flex min-w-0 items-baseline gap-1.5">
          <strong className="text-[18px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
            {value}
          </strong>
          <span className="truncate text-[10px] font-medium text-slate-500">
            {detail}
          </span>
        </span>
      </span>
    </div>
  );
}
