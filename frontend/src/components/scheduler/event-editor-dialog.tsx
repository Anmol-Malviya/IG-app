"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Dialog } from "radix-ui";
import { z } from "zod";
import {
  CalendarClock,
  Check,
  ChevronDown,
  LoaderCircle,
  X,
} from "lucide-react";
import { CATEGORY_CONFIG, EventCategory, Schedule } from "@/types/schedule";
import { combineDateAndTime, format, parseISO } from "@/lib/date-utils";
import { cn } from "@/lib/cn";
import { CategoryIcon } from "./planner-event-card";

const categoryValues = [
  "class",
  "lab",
  "study",
  "assignment",
  "exam",
  "personal",
] as const;

const editorSchema = z
  .object({
    title: z.string().trim().min(2, "Add a clear title").max(200),
    category: z.enum(categoryValues),
    date: z.string().min(1, "Select a date"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Select a start time"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Select an end time"),
    subject: z.string().trim().max(100).optional(),
    location: z.string().trim().max(200).optional(),
    faculty: z.string().trim().max(100).optional(),
    meetingUrl: z.union([z.literal(""), z.url("Enter a valid meeting URL")]),
    description: z.string().trim().max(1000).optional(),
    reminder: z.enum(["none", "10", "30", "60", "1440"]),
    recurrenceType: z.enum(["none", "daily", "weekly", "custom"]),
    recurrenceUntil: z.string().optional(),
    recurrenceWeekdays: z.array(z.number().int().min(0).max(6)),
  })
  .superRefine((values, context) => {
    if (values.endTime <= values.startTime) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }

    if (values.recurrenceType === "custom" && values.recurrenceWeekdays.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["recurrenceWeekdays"],
        message: "Choose at least one repeat day",
      });
    }

    if (
      values.recurrenceUntil &&
      combineDateAndTime(values.recurrenceUntil, "23:59") <
        combineDateAndTime(values.date, values.startTime)
    ) {
      context.addIssue({
        code: "custom",
        path: ["recurrenceUntil"],
        message: "Repeat end date must be after the event",
      });
    }
  });

export type EventEditorValues = z.infer<typeof editorSchema>;

export interface EventEditorPayload {
  title: string;
  category: EventCategory;
  subject?: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  faculty?: string;
  meetingUrl?: string;
  reminderMinutes?: number;
  recurrence: {
    type: EventEditorValues["recurrenceType"];
    weekdays?: number[];
    until?: string;
  };
}

interface EventEditorDialogProps {
  open: boolean;
  event?: Schedule | null;
  initialDate: string;
  initialStartTime: string;
  initialEndTime: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: EventEditorPayload) => Promise<void>;
}

const weekdays = [
  { value: 1, label: "M" },
  { value: 2, label: "T" },
  { value: 3, label: "W" },
  { value: 4, label: "T" },
  { value: 5, label: "F" },
  { value: 6, label: "S" },
  { value: 0, label: "S" },
];

const supportedReminders = new Set([10, 30, 60, 1440]);

function eventDefaults(
  event: Schedule | null | undefined,
  initialDate: string,
  initialStartTime: string,
  initialEndTime: string
): EventEditorValues {
  if (!event) {
    return {
      title: "",
      category: "class",
      date: initialDate,
      startTime: initialStartTime,
      endTime: initialEndTime,
      subject: "",
      location: "",
      faculty: "",
      meetingUrl: "",
      description: "",
      reminder: "none",
      recurrenceType: "none",
      recurrenceUntil: "",
      recurrenceWeekdays: [],
    };
  }

  const start = parseISO(event.startDateTime);
  const end = parseISO(event.endDateTime);
  return {
    title: event.title,
    category: event.category,
    date: format(start, "yyyy-MM-dd"),
    startTime: format(start, "HH:mm"),
    endTime: format(end, "HH:mm"),
    subject: event.subject ?? "",
    location: event.location ?? "",
    faculty: event.faculty ?? "",
    meetingUrl: event.meetingUrl ?? "",
    description: event.description ?? "",
    reminder: event.reminderMinutes && supportedReminders.has(event.reminderMinutes)
      ? (`${event.reminderMinutes}` as EventEditorValues["reminder"])
      : "none",
    recurrenceType: event.recurrence?.type ?? "none",
    recurrenceUntil: event.recurrence?.until
      ? format(parseISO(event.recurrence.until), "yyyy-MM-dd")
      : "",
    recurrenceWeekdays: event.recurrence?.weekdays ?? [],
  };
}

export function EventEditorDialog({
  open,
  event,
  initialDate,
  initialStartTime,
  initialEndTime,
  onOpenChange,
  onSubmit,
}: EventEditorDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventEditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: eventDefaults(event, initialDate, initialStartTime, initialEndTime),
  });

  useEffect(() => {
    if (open) {
      reset(eventDefaults(event, initialDate, initialStartTime, initialEndTime));
    }
  }, [event, initialDate, initialEndTime, initialStartTime, open, reset]);

  const selectedCategory = useWatch({ control, name: "category" });
  const recurrenceType = useWatch({ control, name: "recurrenceType" });
  const selectedWeekdays = useWatch({ control, name: "recurrenceWeekdays" });

  const submit = handleSubmit(async (values) => {
    const start = combineDateAndTime(values.date, values.startTime);
    const end = combineDateAndTime(values.date, values.endTime);

    try {
      await onSubmit({
        title: values.title.trim(),
        category: values.category,
        subject: values.subject?.trim() || undefined,
        description: values.description?.trim() || undefined,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        location: values.location?.trim() || undefined,
        faculty: values.faculty?.trim() || undefined,
        meetingUrl: values.meetingUrl || undefined,
        reminderMinutes:
          values.reminder === "none" ? undefined : Number(values.reminder),
        recurrence: {
          type: values.recurrenceType,
          weekdays:
            values.recurrenceType === "custom"
              ? values.recurrenceWeekdays
              : undefined,
          until: values.recurrenceType !== "none" && values.recurrenceUntil
            ? combineDateAndTime(values.recurrenceUntil, "23:59").toISOString()
            : undefined,
        },
      });
      onOpenChange(false);
    } catch (submitError) {
      setError("root", {
        message:
          submitError instanceof Error
            ? submitError.message
            : "Unable to save this schedule",
      });
    }
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-slate-950/45 opacity-0 backdrop-blur-[2px] transition data-[state=open]:opacity-100" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[94dvh] flex-col rounded-t-[24px] border border-slate-200 bg-white opacity-0 shadow-[0_24px_80px_rgba(15,23,42,0.24)] outline-none transition data-[state=open]:opacity-100 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(720px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[22px]">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarClock className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <Dialog.Title className="text-[16px] font-semibold tracking-[-0.02em] text-slate-950">
                  {event ? "Edit schedule" : "New schedule"}
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-[11.5px] text-slate-500">
                  {event
                    ? "Update the details saved to your account."
                    : "Plan a class, study block, deadline or activity."}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close schedule editor"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div data-scheduler-scroll className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {errors.root?.message ? (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] font-medium text-rose-700">
                  {errors.root.message}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <label htmlFor="schedule-title" className="text-[11px] font-semibold text-slate-700">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="schedule-title"
                  autoFocus
                  placeholder="e.g. Data Structures lecture"
                  aria-invalid={Boolean(errors.title)}
                  className={inputClass(Boolean(errors.title))}
                  {...register("title")}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <fieldset>
                <legend className="mb-2 text-[11px] font-semibold text-slate-700">
                  Category
                </legend>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {categoryValues.map((category) => {
                    const config = CATEGORY_CONFIG[category];
                    const selected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setValue("category", category, { shouldValidate: true })}
                        aria-pressed={selected}
                        className={cn(
                          "relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl border px-2 text-[10.5px] font-semibold outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-500/15",
                          selected
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <CategoryIcon category={category} className="h-4 w-4" />
                        {config.label}
                        {selected ? (
                          <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-slate-900">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Date" error={errors.date?.message}>
                  <input type="date" className={inputClass(Boolean(errors.date))} {...register("date")} />
                </Field>
                <Field label="Start time" error={errors.startTime?.message}>
                  <input type="time" className={inputClass(Boolean(errors.startTime))} {...register("startTime")} />
                </Field>
                <Field label="End time" error={errors.endTime?.message}>
                  <input type="time" className={inputClass(Boolean(errors.endTime))} {...register("endTime")} />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Subject" hint="Optional">
                  <input placeholder="Computer Networks" className={inputClass()} {...register("subject")} />
                </Field>
                <Field label="Location" hint="Optional">
                  <input placeholder="Room 204 or Library" className={inputClass()} {...register("location")} />
                </Field>
                <Field label="Faculty" hint="Optional">
                  <input placeholder="Professor name" className={inputClass()} {...register("faculty")} />
                </Field>
                <Field label="Meeting link" hint="Optional" error={errors.meetingUrl?.message}>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    className={inputClass(Boolean(errors.meetingUrl))}
                    {...register("meetingUrl")}
                  />
                </Field>
              </div>

              <Field label="Notes" hint="Optional" error={errors.description?.message}>
                <textarea
                  rows={3}
                  placeholder="Add anything you need to remember"
                  className={`${inputClass(Boolean(errors.description))} h-auto resize-none py-3`}
                  {...register("description")}
                />
              </Field>

              <details className="group rounded-2xl border border-slate-200 bg-slate-50/60 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[12px] font-semibold text-slate-800 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-indigo-500/10">
                  Reminder and repeat
                  <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <div className="space-y-4 border-t border-slate-200 px-4 py-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Reminder">
                      <select className={inputClass()} {...register("reminder")}>
                        <option value="none">No reminder</option>
                        <option value="10">10 minutes before</option>
                        <option value="30">30 minutes before</option>
                        <option value="60">1 hour before</option>
                        <option value="1440">1 day before</option>
                      </select>
                    </Field>
                    <Field label="Repeat">
                      <select className={inputClass()} {...register("recurrenceType")}>
                        <option value="none">Does not repeat</option>
                        <option value="daily">Every day</option>
                        <option value="weekly">Every week</option>
                        <option value="custom">Custom weekdays</option>
                      </select>
                    </Field>
                  </div>

                  {recurrenceType !== "none" ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {recurrenceType === "custom" ? (
                        <fieldset>
                          <legend className="mb-1.5 text-[11px] font-semibold text-slate-700">
                            Repeat on
                          </legend>
                          <div className="flex gap-1.5">
                            {weekdays.map((day) => {
                              const selected = selectedWeekdays.includes(day.value);
                              return (
                                <button
                                  key={day.value}
                                  type="button"
                                  onClick={() =>
                                    setValue(
                                      "recurrenceWeekdays",
                                      selected
                                        ? selectedWeekdays.filter((value) => value !== day.value)
                                        : [...selectedWeekdays, day.value],
                                      { shouldValidate: true }
                                    )
                                  }
                                  aria-pressed={selected}
                                  className={cn(
                                    "h-9 min-w-9 flex-1 rounded-lg text-[10.5px] font-semibold",
                                    selected
                                      ? "bg-slate-900 text-white"
                                      : "border border-slate-200 bg-white text-slate-600"
                                  )}
                                >
                                  {day.label}
                                </button>
                              );
                            })}
                          </div>
                          <FieldError message={errors.recurrenceWeekdays?.message} />
                        </fieldset>
                      ) : (
                        <div />
                      )}
                      <Field label="Repeat until" hint="Optional" error={errors.recurrenceUntil?.message}>
                        <input type="date" className={inputClass(Boolean(errors.recurrenceUntil))} {...register("recurrenceUntil")} />
                      </Field>
                    </div>
                  ) : null}
                </div>
              </details>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 min-w-[116px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-wait disabled:opacity-65"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {event ? "Save changes" : "Add schedule"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-700">
        {label}
        {hint ? <span className="font-normal text-slate-400">{hint}</span> : null}
      </span>
      {children}
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span role="alert" className="block text-[10.5px] font-medium text-rose-600">
      {message}
    </span>
  ) : null;
}

function inputClass(invalid = false) {
  return cn(
    "h-11 w-full rounded-xl border bg-white px-3.5 text-[12.5px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4",
    invalid
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
      : "border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-500/10"
  );
}
