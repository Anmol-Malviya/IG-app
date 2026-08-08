"use client";

import React, { useEffect } from "react";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import { formatTime, formatDuration, parseISO, format } from "@/lib/date-utils";
import { getCategoryIcon } from "./schedule-event-card";
import {
  X,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  Copy,
  Trash2,
  ExternalLink,
  Calendar,
  FileText,
} from "lucide-react";

interface EventDetailsSheetProps {
  event: Schedule | null;
  onClose: () => void;
  onToggleComplete: (id: string, status: Schedule["status"]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EventDetailsSheet({
  event,
  onClose,
  onToggleComplete,
  onDuplicate,
  onDelete,
}: EventDetailsSheetProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && event) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  const start = parseISO(event.startDateTime);
  const end = parseISO(event.endDateTime);
  const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.class;
  const isCompleted = event.status === "completed";

  return (
    <div
      data-scheduler
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center sm:p-4"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[92dvh] overflow-y-auto bg-white rounded-t-[22px] sm:rounded-[16px] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] inline-flex items-center gap-1.5 ${cat.badgeBg} ${cat.badgeText}`}
            >
              {getCategoryIcon(event.category, "w-3.5 h-3.5")}
              <span>{cat.label}</span>
            </span>

            <h3
              id="event-details-title"
              className={`text-lg font-bold text-slate-900 mt-2 truncate ${
                isCompleted ? "line-through text-slate-400" : ""
              }`}
            >
              {event.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
            aria-label="Close event details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date & Time */}
        <div className="space-y-2.5 py-3 border-y border-slate-100 text-[13px]">
          <div className="flex items-center gap-2.5 text-slate-700 font-medium">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{format(start, "EEEE, MMMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700 font-medium">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              {formatTime(start)} – {formatTime(end)} ({formatDuration(start, end)})
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}

          {event.faculty && (
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{event.faculty}</span>
            </div>
          )}

          {event.description && (
            <div className="flex items-start gap-2.5 text-slate-600 text-[12px] pt-1">
              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-3">{event.description}</p>
            </div>
          )}

          {event.meetingUrl && (
            <div className="pt-1">
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Join Virtual Meeting</span>
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            type="button"
            onClick={() => {
              onToggleComplete(event._id, isCompleted ? "scheduled" : "completed");
              onClose();
            }}
            className={`py-2.5 px-3 rounded-[10px] border text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors ${
              isCompleted
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? "Reactivate" : "Mark Done"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onDuplicate(event._id);
              onClose();
            }}
            className="py-2.5 px-3 rounded-[10px] border border-slate-200 text-[12.5px] font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete(event._id);
              onClose();
            }}
            className="col-span-2 py-2.5 px-3 rounded-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
