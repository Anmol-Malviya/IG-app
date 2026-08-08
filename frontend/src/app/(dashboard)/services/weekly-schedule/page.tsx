"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CalendarCheck2,
  MoreVertical,
  Plus,
  X,
} from "lucide-react";

const weekDays = [
  { key: "Mon", date: "6 May", full: "Monday" },
  { key: "Tue", date: "7 May", full: "Tuesday" },
  { key: "Wed", date: "8 May", full: "Wednesday" },
  { key: "Thu", date: "9 May", full: "Thursday" },
  { key: "Fri", date: "10 May", full: "Friday" },
  { key: "Sat", date: "11 May", full: "Saturday" },
] as const;

type DayKey = (typeof weekDays)[number]["key"];
type ScheduleTone = "violet" | "mint" | "cream" | "neutral" | "blue" | "pink";

interface ScheduleItem {
  id: string;
  day: DayKey;
  startTime: string;
  title: string;
  faculty?: string;
  room?: string;
  tone: ScheduleTone;
}

const initialSchedule: ScheduleItem[] = [
  {
    id: "data-structures",
    day: "Mon",
    startTime: "09:00",
    title: "Data Structures",
    faculty: "Prof. Sharma",
    room: "CS-201",
    tone: "violet",
  },
  {
    id: "operating-systems",
    day: "Mon",
    startTime: "10:00",
    title: "Operating Systems",
    faculty: "Prof. Verma",
    room: "CS-202",
    tone: "mint",
  },
  {
    id: "discrete-mathematics",
    day: "Mon",
    startTime: "11:00",
    title: "Discrete Mathematics",
    faculty: "Prof. Gupta",
    room: "CS-203",
    tone: "cream",
  },
  {
    id: "lunch-break",
    day: "Mon",
    startTime: "13:00",
    title: "Lunch Break",
    tone: "neutral",
  },
  {
    id: "database-management",
    day: "Mon",
    startTime: "14:00",
    title: "Database Management",
    faculty: "Prof. Mehta",
    room: "CS-204",
    tone: "blue",
  },
  {
    id: "computer-networks",
    day: "Mon",
    startTime: "15:00",
    title: "Computer Networks",
    faculty: "Prof. Khan",
    room: "CS-205",
    tone: "pink",
  },
  {
    id: "algorithms",
    day: "Tue",
    startTime: "10:00",
    title: "Design & Analysis of Algorithms",
    faculty: "Prof. Rao",
    room: "CS-206",
    tone: "violet",
  },
  {
    id: "cyber-security",
    day: "Wed",
    startTime: "11:00",
    title: "Cyber Security",
    faculty: "Prof. Singh",
    room: "CS-208",
    tone: "mint",
  },
];

const toneStyles: Record<ScheduleTone, string> = {
  violet: "bg-gradient-to-r from-[#f0ecff] to-[#f6f3ff]",
  mint: "bg-gradient-to-r from-[#e9f9f0] to-[#f1fbf5]",
  cream: "bg-gradient-to-r from-[#fff3e2] to-[#fff8ee]",
  neutral: "bg-gradient-to-r from-[#f7f8fb] to-[#f3f5f8]",
  blue: "bg-gradient-to-r from-[#e7f3ff] to-[#f0f8ff]",
  pink: "bg-gradient-to-r from-[#ffe9ef] to-[#fff1f5]",
};

const toneCycle: ScheduleTone[] = ["violet", "mint", "cream", "blue", "pink"];

export default function WeeklySchedulePage() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("Mon");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const selectedItems = useMemo(
    () =>
      schedule
        .filter((item) => item.day === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [schedule, selectedDay]
  );

  const removeItem = (id: string) => {
    setSchedule((current) => current.filter((item) => item.id !== id));
    setMenuId(null);
  };

  const addSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const startTime = String(form.get("startTime") || "09:00");
    const faculty = String(form.get("faculty") || "").trim();
    const room = String(form.get("room") || "").trim();

    if (!title) return;

    setSchedule((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        day: selectedDay,
        startTime,
        title,
        faculty: faculty || undefined,
        room: room || undefined,
        tone: toneCycle[current.length % toneCycle.length],
      },
    ]);
    setShowAdd(false);
    event.currentTarget.reset();
  };

  return (
    <main className="mx-auto min-h-full w-full max-w-[820px] bg-[#fbfbfe] text-[#111318] sm:rounded-[30px] sm:border sm:border-[#f0f0f6] sm:shadow-[0_24px_70px_rgba(60,63,100,0.10)]">
      <div className="px-4 pb-10 pt-3 sm:px-7 sm:pb-12 sm:pt-6 lg:px-9">
        <header className="mb-6 grid grid-cols-[44px_1fr_44px] items-center sm:mb-8">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111318] no-underline transition hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>

          <h1 className="text-center text-[22px] font-black tracking-[-0.035em] text-[#111318] sm:text-[27px]">
            Weekly Schedule
          </h1>

          <button
            type="button"
            onClick={() => setShowAdd(true)}
            aria-label="Add schedule"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111318] transition hover:bg-white hover:shadow-sm"
          >
            <CalendarDays className="h-5.5 w-5.5" strokeWidth={2.2} />
          </button>
        </header>

        <nav
          aria-label="Choose day"
          className="mb-7 grid grid-cols-6 gap-1 rounded-[24px] bg-white/60 p-1.5 sm:mb-9 sm:gap-2 sm:p-2"
        >
          {weekDays.map((item) => {
            const active = item.key === selectedDay;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedDay(item.key)}
                className={`flex min-w-0 flex-col items-center justify-center rounded-[18px] px-1 py-2.5 text-center transition sm:py-3.5 ${
                  active
                    ? "bg-gradient-to-br from-[#6048ff] to-[#7455f7] text-white shadow-[0_10px_24px_rgba(98,72,255,0.24)]"
                    : "text-[#111318] hover:bg-white"
                }`}
              >
                <span className="text-[13px] font-extrabold sm:text-[15px]">{item.key}</span>
                <span
                  className={`mt-1 text-[11px] font-medium sm:text-[13px] ${
                    active ? "text-white/95" : "text-[#696f7e]"
                  }`}
                >
                  {item.date}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="relative">
          {selectedItems.length ? (
            <div className="relative">
              <div className="pointer-events-none absolute bottom-10 left-[76px] top-10 hidden border-l border-dashed border-[#e6e8f0] sm:block lg:left-[91px]" />

              <div className="flex flex-col gap-3.5 sm:gap-4.5">
                {selectedItems.map((item) => (
                  <ScheduleRow
                    key={item.id}
                    item={item}
                    menuOpen={menuId === item.id}
                    onMenu={() => setMenuId((current) => (current === item.id ? null : item.id))}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eeeaff] text-[#654bff]">
                <CalendarCheck2 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-[19px] font-black tracking-[-0.02em]">No classes yet</h2>
              <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-5 text-[#777d8d]">
                Add your first class or study block for {weekDays.find((item) => item.key === selectedDay)?.full}.
              </p>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#6048ff] px-5 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(96,72,255,0.24)]"
              >
                <Plus className="h-4 w-4" />
                Add schedule
              </button>
            </div>
          )}
        </section>
      </div>

      {showAdd ? (
        <AddScheduleModal
          selectedDay={selectedDay}
          onClose={() => setShowAdd(false)}
          onSubmit={addSchedule}
        />
      ) : null}
    </main>
  );
}

function ScheduleRow({
  item,
  menuOpen,
  onMenu,
  onRemove,
}: {
  item: ScheduleItem;
  menuOpen: boolean;
  onMenu: () => void;
  onRemove: () => void;
}) {
  const [time, suffix] = formatTime(item.startTime);

  return (
    <article className="grid grid-cols-[62px_1fr] items-stretch gap-3 sm:grid-cols-[82px_1fr] sm:gap-4 lg:grid-cols-[96px_1fr]">
      <div className="relative flex items-start justify-end pt-5 text-right sm:pt-6">
        <div>
          <p className="text-[15px] font-black leading-[1.05] tracking-[-0.025em] text-[#111318] sm:text-[17px]">
            {time}
          </p>
          <p className="mt-1 text-[13px] font-black leading-none text-[#111318] sm:text-[14px]">
            {suffix}
          </p>
        </div>
        <span className="absolute -right-[16px] top-[31px] hidden h-3 w-3 rounded-full bg-[#eceef5] ring-4 ring-[#fbfbfe] sm:block lg:-right-[20px]" />
      </div>

      <div
        className={`relative min-h-[108px] rounded-[24px] px-5 py-4.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] sm:min-h-[122px] sm:px-6 sm:py-5 ${toneStyles[item.tone]}`}
      >
        <div className="flex h-full items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-black tracking-[-0.025em] text-[#111318] sm:text-[20px]">
              {item.title}
            </h2>
            {item.faculty ? (
              <p className="mt-2 text-[13px] font-medium text-[#5e6574] sm:text-[15px]">{item.faculty}</p>
            ) : null}
            {item.room ? (
              <p className="mt-1 text-[13px] font-medium text-[#5e6574] sm:text-[15px]">{item.room}</p>
            ) : null}
          </div>

          {item.title !== "Lunch Break" ? (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={onMenu}
                aria-label={`More options for ${item.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#333847] transition hover:bg-white/65"
              >
                <MoreVertical className="h-5 w-5" strokeWidth={2.5} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-10 z-20 w-32 rounded-xl border border-white/80 bg-white p-1.5 shadow-[0_14px_34px_rgba(40,44,70,0.14)]">
                  <button
                    type="button"
                    onClick={onRemove}
                    className="w-full rounded-lg px-3 py-2 text-left text-[12px] font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function AddScheduleModal({
  selectedDay,
  onClose,
  onSubmit,
}: {
  selectedDay: DayKey;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#222538]/30 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-5 shadow-[0_30px_80px_rgba(30,33,55,0.24)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#7864ff]">{selectedDay} schedule</p>
            <h2 className="mt-1 text-[22px] font-black tracking-[-0.03em] text-[#111318]">Add a new class</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f6fa] text-[#5f6574]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[12px] font-bold text-[#555b6b]">
            Class / activity
            <input
              name="title"
              required
              placeholder="e.g. Data Structures"
              className="h-12 w-full rounded-2xl border border-[#e8e9f0] bg-[#fafafd] px-4 text-[14px] text-[#111318] outline-none placeholder:text-[#a2a7b4] focus:border-[#7158ff] focus:ring-4 focus:ring-[#7158ff]/10"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-[12px] font-bold text-[#555b6b]">
              Time
              <input
                name="startTime"
                type="time"
                defaultValue="09:00"
                className="h-12 w-full rounded-2xl border border-[#e8e9f0] bg-[#fafafd] px-4 text-[14px] text-[#111318] outline-none focus:border-[#7158ff] focus:ring-4 focus:ring-[#7158ff]/10"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[12px] font-bold text-[#555b6b]">
              Room
              <input
                name="room"
                placeholder="CS-201"
                className="h-12 w-full rounded-2xl border border-[#e8e9f0] bg-[#fafafd] px-4 text-[14px] text-[#111318] outline-none placeholder:text-[#a2a7b4] focus:border-[#7158ff] focus:ring-4 focus:ring-[#7158ff]/10"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-[12px] font-bold text-[#555b6b]">
            Faculty
            <input
              name="faculty"
              placeholder="Prof. Sharma"
              className="h-12 w-full rounded-2xl border border-[#e8e9f0] bg-[#fafafd] px-4 text-[14px] text-[#111318] outline-none placeholder:text-[#a2a7b4] focus:border-[#7158ff] focus:ring-4 focus:ring-[#7158ff]/10"
            />
          </label>

          <button
            type="submit"
            className="mt-1 flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#684cff] to-[#563af3] px-5 text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(91,61,245,0.24)]"
          >
            <Plus className="h-4 w-4" />
            Add schedule
          </button>
        </form>
      </div>
    </div>
  );
}

function formatTime(value: string): [string, string] {
  const [hourString, minute] = value.split(":");
  const hour = Number(hourString);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return [`${String(displayHour).padStart(2, "0")}:${minute}`, suffix];
}
