"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  MapPin,
  Pencil,
  Repeat2,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Schedule, CATEGORY_CONFIG } from "@/types/schedule";
import {
  format,
  formatDuration,
  formatTime,
  parseISO,
} from "@/lib/date-utils";
import { describeRecurrence } from "@/lib/recurrence";
import { cn } from "@/lib/cn";
import { CategoryIcon } from "./planner-event-card";

interface EventDetailsDialogProps {
  event: Schedule | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (event: Schedule) => void;
  onToggleComplete: (event: Schedule) => void;
  onDuplicate: (event: Schedule) => void;
  onDelete: (event: Schedule) => void;
}

export function EventDetailsDialog({
  event,
  onOpenChange,
  onEdit,
  onToggleComplete,
  onDuplicate,
  onDelete,
}: EventDetailsDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
  }, [event?._id]);

  useEffect(() => {
    if (!event) return;
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== "Escape") return;
      if (confirmDelete) {
        setConfirmDelete(false);
      } else {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmDelete, event, onOpenChange]);

  if (!event) return null;

  const category = CATEGORY_CONFIG[event.category];
  const start = parseISO(event.startDateTime);
  const end = parseISO(event.endDateTime);
  const completed = event.status === "completed";

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-slate-950/45 backdrop-blur-[2px]"
        onMouseDown={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-details-title"
        aria-describedby="schedule-details-description"
        className="fixed inset-x-0 bottom-0 z-[90] max-h-[92dvh] overflow-y-auto rounded-t-[24px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(520px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[22px]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ color: category.color, backgroundColor: `${category.color}12` }}
            >
              <CategoryIcon category={event.category} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: category.color }}
                >
                  {category.label}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[9.5px] font-semibold capitalize",
                    completed
                      ? "bg-emerald-50 text-emerald-700"
                      : event.status === "cancelled"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-slate-100 text-slate-600"
                  )}
                >
                  {event.status}
                </span>
              </div>
              <h2
                id="schedule-details-title"
                className={cn(
                  "mt-1.5 text-[20px] font-semibold leading-tight tracking-[-0.03em] text-slate-950",
                  completed && "text-slate-500 line-through"
                )}
              >
                {event.title}
              </h2>
              <p id="schedule-details-description" className="sr-only">
                Schedule details and actions for {event.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close schedule details"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/65 p-4 sm:mx-6">
          <DetailRow icon={<Calendar className="h-4 w-4" />}>
            {format(start, "EEEE, MMMM d, yyyy")}
          </DetailRow>
          <DetailRow icon={<Clock3 className="h-4 w-4" />}>
            {formatTime(start)} – {formatTime(end)}
            <span className="text-slate-400"> · {formatDuration(start, end)}</span>
          </DetailRow>
          {event.location ? (
            <DetailRow icon={<MapPin className="h-4 w-4" />}>{event.location}</DetailRow>
          ) : null}
          {event.faculty ? (
            <DetailRow icon={<UserRound className="h-4 w-4" />}>{event.faculty}</DetailRow>
          ) : null}
          {event.recurrence?.type !== "none" ? (
            <DetailRow icon={<Repeat2 className="h-4 w-4" />}>
              {describeRecurrence(event.recurrence)}
            </DetailRow>
          ) : null}
        </div>

        {event.description ? (
          <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl px-1 sm:mx-6">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <p className="text-[12.5px] leading-5 text-slate-600">{event.description}</p>
          </div>
        ) : null}

        {event.meetingUrl ? (
          <div className="mx-5 mt-4 sm:mx-6">
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 text-[12px] font-semibold text-indigo-700 transition hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
            >
              <ExternalLink className="h-4 w-4" />
              Join online meeting
            </a>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-5">
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onToggleComplete(event)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {completed ? "Mark active" : "Mark done"}
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(event)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 text-[12px] font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/15"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </section>

      {confirmDelete ? (
        <>
          <div
            className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-[2px]"
            onMouseDown={() => setConfirmDelete(false)}
            aria-hidden="true"
          />
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-schedule-title"
            aria-describedby="delete-schedule-description"
            className="fixed left-1/2 top-1/2 z-[110] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.26)] outline-none sm:p-6"
          >
            <h3 id="delete-schedule-title" className="text-[16px] font-semibold text-slate-950">
              Delete this schedule?
            </h3>
            <p id="delete-schedule-description" className="mt-2 text-[12.5px] leading-5 text-slate-500">
              “{event.title}” will be removed from your account. You can undo it briefly after deletion.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete(event);
                }}
                className="h-10 rounded-xl bg-rose-600 px-4 text-[12px] font-semibold text-white hover:bg-rose-700"
              >
                Delete schedule
              </button>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}

function DetailRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[12px] font-medium text-slate-700">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}
