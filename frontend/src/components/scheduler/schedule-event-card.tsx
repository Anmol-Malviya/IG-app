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
      title={`${event.title} (${timeFormatted})${event.location ? ` • ${event.location}` : ""}`}
      style={{
        ...style,
        ...transformStyle,
        backgroundColor: catStyle.bgClass.includes("#") ? undefined : undefined,
      }}
      className={`group select-none rounded-[10px] p-2 sm:p-2.5 transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-start border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-md hover:scale-[1.01] hover:border-slate-300 ${
        isCompleted ? "opacity-60 saturate-50" : ""
      } ${isDragging ? "opacity-80 ring-2 ring-indigo-500 shadow-xl z-50 cursor-grabbing" : ""}`}
    >
      {/* 3px category accent on left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3.5px] rounded-l-[10px]"
        style={{ backgroundColor: catStyle.accentColor }}
      />

      <div className="pl-1.5 min-w-0 flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1.5 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="flex-shrink-0"
                style={{ color: catStyle.color }}
              >
                {getCategoryIcon(event.category, "w-3.5 h-3.5")}
              </span>
              <h4
                className={`font-semibold text-[13px] leading-tight truncate ${
                  isCompleted ? "line-through text-slate-500" : "text-slate-900"
                }`}
              >
                {event.title}
              </h4>
            </div>

            {!compact && (
              <p className="text-[11px] font-medium text-slate-600 mt-1 flex items-center gap-1 truncate leading-tight">
                <span>{timeFormatted}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{durationText}</span>
              </p>
            )}

            {detailed && event.location && (
              <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </p>
            )}

            {detailed && event.faculty && (
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1 truncate">
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
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
      </div>
    </div>
  );
}
