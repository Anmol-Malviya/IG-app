"use client";

import {
  Beaker,
  BookOpen,
  Brain,
  CalendarCheck,
  ClipboardList,
  MapPin,
  Repeat2,
  Sparkles,
} from "lucide-react";
import { EventCategory, Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import { formatTime } from "@/lib/date-utils";
import { cn } from "@/lib/cn";

interface PlannerEventCardProps {
  event: Schedule;
  height?: number;
  detailed?: boolean;
  dragging?: boolean;
  onClick?: () => void;
}

const categoryIcons = {
  class: BookOpen,
  lab: Beaker,
  study: Brain,
  assignment: ClipboardList,
  exam: CalendarCheck,
  personal: Sparkles,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: EventCategory;
  className?: string;
}) {
  const Icon = categoryIcons[category];
  return <Icon aria-hidden="true" className={className} />;
}

export function PlannerEventCard({
  event,
  height = 72,
  detailed = false,
  dragging = false,
  onClick,
}: PlannerEventCardProps) {
  const category = CATEGORY_CONFIG[event.category];
  const completed = event.status === "completed";
  const cancelled = event.status === "cancelled";
  const compact = height < 64 && !detailed;
  const tiny = height < 44 && !detailed;

  return (
    <button
      type="button"
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onClick?.();
      }}
      aria-label={`${event.title}, ${formatTime(event.startDateTime)} to ${formatTime(event.endDateTime)}`}
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-[11px] border bg-white px-2.5 py-2 text-left outline-none transition duration-150 focus-visible:z-30 focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-1",
        "hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)]",
        compact && "px-2 py-1.5",
        dragging && "rotate-[1deg] scale-[1.015] shadow-xl",
        completed && "opacity-60 saturate-50",
        cancelled && "opacity-45"
      )}
      style={{
        backgroundColor: `${category.color}0c`,
        borderColor: `${category.color}28`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: category.color }}
      />

      <span className="flex min-w-0 items-start gap-1.5 pl-0.5">
        {!tiny ? (
          <span
            className={cn(
              "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
              compact && "h-4 w-4"
            )}
            style={{ color: category.color, backgroundColor: `${category.color}12` }}
          >
            <CategoryIcon
              category={event.category}
              className={cn("h-3 w-3", compact && "h-2.5 w-2.5")}
            />
          </span>
        ) : null}

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-[11.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-slate-900",
              detailed && "text-[13px]",
              compact && "text-[10.5px]",
              completed && "line-through text-slate-500"
            )}
          >
            {event.title}
          </span>

          {!tiny ? (
            <span
              className={cn(
                "mt-1 block truncate text-[9.5px] font-medium leading-none text-slate-500",
                compact && "mt-0.5 text-[9px]"
              )}
            >
              {formatTime(event.startDateTime)} – {formatTime(event.endDateTime)}
            </span>
          ) : null}

          {(detailed || height >= 86) && (event.location || event.subject) ? (
            <span className="mt-1.5 flex min-w-0 items-center gap-1 text-[9.5px] font-medium text-slate-500">
              {event.location ? <MapPin className="h-3 w-3 shrink-0" /> : null}
              <span className="truncate">{event.location || event.subject}</span>
            </span>
          ) : null}
        </span>

        {event.recurrence?.type !== "none" && !tiny ? (
          <Repeat2
            className="h-3 w-3 shrink-0 text-slate-400"
            aria-label="Recurring"
          />
        ) : null}
      </span>
    </button>
  );
}
