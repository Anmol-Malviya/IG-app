"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type Day = (typeof DAYS)[number];

interface ScheduleItem {
  id: string;
  day: Day;
  subject: string;
  startTime: string;
  endTime: string;
  location: string;
}

const initialSchedule: ScheduleItem[] = [
  { id: "1", day: "Monday", subject: "Data Structures", startTime: "09:00", endTime: "10:00", location: "Lab 204" },
  { id: "2", day: "Monday", subject: "Mathematics", startTime: "11:00", endTime: "12:00", location: "Room 302" },
  { id: "3", day: "Tuesday", subject: "Cyber Security", startTime: "10:00", endTime: "11:00", location: "Room 208" },
  { id: "4", day: "Wednesday", subject: "Computer Networks", startTime: "09:00", endTime: "10:30", location: "Lab 102" },
  { id: "5", day: "Thursday", subject: "Blockchain", startTime: "12:00", endTime: "13:00", location: "Room 305" },
  { id: "6", day: "Friday", subject: "Project Work", startTime: "14:00", endTime: "16:00", location: "Innovation Lab" },
];

const cardAccent = [
  "border-l-indigo-500 bg-indigo-50/60",
  "border-l-emerald-500 bg-emerald-50/60",
  "border-l-amber-500 bg-amber-50/60",
  "border-l-violet-500 bg-violet-50/60",
  "border-l-sky-500 bg-sky-50/60",
];

export default function WeeklySchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [day, setDay] = useState<Day>("Monday");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [currentDay, setCurrentDay] = useState<Day | null>(null);

  useEffect(() => {
    const value = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date()) as Day;
    if (DAYS.includes(value)) setCurrentDay(value);
  }, []);

  const sortedSchedule = useMemo(
    () => [...schedule].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [schedule]
  );

  const todayItems = currentDay ? schedule.filter((item) => item.day === currentDay).length : 0;
  const subjects = new Set(schedule.map((item) => item.subject)).size;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !startTime || !endTime) return;

    setSchedule((current) => [
      ...current,
      {
        id: Date.now().toString(),
        day,
        subject: subject.trim(),
        startTime,
        endTime,
        location: location.trim() || "Not specified",
      },
    ]);
    setSubject("");
    setStartTime("");
    setEndTime("");
    setLocation("");
  };

  const removeItem = (id: string) => {
    setSchedule((current) => current.filter((item) => item.id !== id));
  };

  const formatTime = (value: string) => {
    const [hour, minute] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(date);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-100 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-950"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
                <CalendarDays size={15} />
                Weekly schedule
              </div>
              <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-3xl">
                See your week before it gets busy.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Organize classes and study blocks by day, time, and location in one simple weekly view.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
              <p className="text-xl font-black text-slate-950">{schedule.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Sessions</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 px-3 py-3 text-center">
              <p className="text-xl font-black text-indigo-700">{todayItems}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500">Today</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
              <p className="text-xl font-black text-emerald-700">{subjects}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-500">Subjects</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Quick add</p>
          <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-950">Add class or study block</h3>
        </div>

        <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <select
            value={day}
            onChange={(event) => setDay(event.target.value as Day)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            {DAYS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject / study block"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <input
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Room / location"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add session
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Week overview</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-slate-950">Monday to Sunday</h3>
          </div>
          {currentDay && (
            <span className="hidden rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:inline-flex">
              {currentDay} is highlighted
            </span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DAYS.map((weekDay) => {
            const dayItems = sortedSchedule.filter((item) => item.day === weekDay);
            const isToday = weekDay === currentDay;

            return (
              <article
                key={weekDay}
                className={`rounded-[22px] border bg-white p-4 sm:p-5 ${
                  isToday ? "border-indigo-300 ring-4 ring-indigo-50" : "border-slate-200/80"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold tracking-[-0.02em] text-slate-950">{weekDay}</h4>
                      {isToday && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {dayItems.length} {dayItems.length === 1 ? "session" : "sessions"}
                    </p>
                  </div>
                  <CalendarDays size={18} className={isToday ? "text-indigo-500" : "text-slate-300"} />
                </div>

                <div className="space-y-3">
                  {dayItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group rounded-2xl border-l-4 p-3.5 ${cardAccent[index % cardAccent.length]}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Clock3 size={14} />
                            {formatTime(item.startTime)} – {formatTime(item.endTime)}
                          </div>
                          <p className="mt-2 truncate text-sm font-extrabold text-slate-950">{item.subject}</p>
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <MapPin size={13} />
                            <span className="truncate">{item.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 opacity-100 transition hover:bg-white hover:text-rose-600 md:opacity-0 md:group-hover:opacity-100"
                          aria-label={`Remove ${item.subject}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {dayItems.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-7 text-center">
                      <BookOpen className="mx-auto text-slate-300" size={20} />
                      <p className="mt-2 text-xs font-semibold text-slate-400">No sessions planned</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
