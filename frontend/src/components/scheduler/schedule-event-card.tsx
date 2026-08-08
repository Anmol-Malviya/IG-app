"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import { formatTime, formatDuration, parseISO } from "@/lib/date-utils";
import {
  BookOpen,
  FlaskConical,
  GraduationCap,
  ClipboardList,
  User,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";

interface ScheduleEventCardProps {
  event: Schedule;
  onClick?: () => void;
  style?: React.CSSProperties;
  isDragging?: boolean;
  compact?: boolean;
  detailed?: boolean;
}

export function getCategoryIcon(category: Schedule["category"], className = "w-3.5 h-3.5") {
  switch (category) {
    case "class":
      return <GraduationCap className={className} />;
    case "lab":
      return <FlaskConical className={className} />;
    case "study":
      return <BookOpen className={className} />;
    case "assignment":
      return <ClipboardList className={className} />;
    case "exam":
      return <GraduationCap className={className} />;
    case "personal":
      return <Sparkles className={className} />;
    default:
      return <Clock className={className} />;
  }
}

export function ScheduleEventCard({
  event,
  onClick,
  style,
  isDragging = false,
  compact = false,
  detailed = false,
}: ScheduleEventCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event._id,
    data: { event },
  });

  const catStyle = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.class;
  const isCompleted = event.status === "completed";

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const start = parseISO(event.startDateTime);
  const end = parseISO(event.endDateTime);
  const timeFormatted = `${formatTime(start)} – ${formatTime(end)}`;
  const durationText = formatDuration(start, end);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${event.title}, ${timeFormatted}${event.location ? `, ${event.location}` : ""}`}
      title={`${event.title} (${timeFormatted})${event.location ? ` • ${event.location}` : ""}`}
      style={{
        ...style,
        ...transformStyle,
      }}
      className={`group relative flex cursor-pointer select-none flex-col justify-start overflow-hidden rounded-[9px] border border-black/[0.035] p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-150 hover:-translate-y-px hover:brightness-[0.99] hover:shadow-[0_7px_18px_rgba(15,23,42,0.09)] ${catStyle.bgClass} ${
        isCompleted ? "opacity-60 saturate-50" : ""
      } ${isDragging ? "opacity-80 ring-2 ring-indigo-500 shadow-xl z-50 cursor-grabbing" : ""}`}
    >
      {/* 3px category accent on left */}
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[9px]"
        style={{ backgroundColor: catStyle.accentColor }}
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between pl-1">
        <div className="flex min-w-0 items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className="flex-shrink-0"
                style={{ color: catStyle.color }}
              >
                {getCategoryIcon(event.category, "h-3 w-3")}
              </span>
              <h4
                className={`truncate text-[12.5px] font-bold leading-[1.15] tracking-[-0.01em] ${
                  isCompleted ? "line-through text-slate-500" : "text-slate-900"
                }`}
              >
                {event.title}
              </h4>
            </div>

            <p className="mt-1 flex truncate text-[10.5px] font-semibold leading-tight text-slate-600">
                <span>{timeFormatted}</span>
                {!compact ? <span className="ml-1 text-slate-400">· {durationText}</span> : null}
            </p>

            {detailed && event.location && (
              <p className="mt-1 flex gap-1 truncate text-[10.5px] font-medium text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </p>
            )}

            {detailed && event.faculty && (
              <p className="mt-0.5 flex gap-1 truncate text-[10.5px] font-medium text-slate-500">
                <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{event.faculty}</span>
              </p>
            )}
          </div>

          {isCompleted && (
            <span className="flex-shrink-0 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {compact && event.location && (
          <p className="mt-0.5 flex gap-1 truncate text-[10px] font-medium text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
      </div>
    </div>
  );
}
