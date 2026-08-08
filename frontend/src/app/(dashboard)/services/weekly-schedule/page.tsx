"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CalendarCheck2,
  CheckSquare2,
  House,
  ListFilter,
  MoreVertical,
  NotebookText,
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
  violet: "bg-gradient-to-r from-[#f0ecff] to-[#f3efff]",
  mint: "bg-gradient-to-r from-[#e8faf1] to-[#effbf4]",
  cream: "bg-gradient-to-r from-[#fff4e5] to-[#fff7ed]",
  neutral: "bg-gradient-to-r from-[#f8f9fc] to-[#f4f6fa]",
  blue: "bg-gradient-to-r from-[#e8f4ff] to-[#eef7ff]",
  pink: "bg-gradient-to-r from-[#ffeaf0] to-[#fff0f4]",
};

const toneCycle: ScheduleTone[] = ["violet", "mint", "cream", "blue", "pink"];

export default function WeeklySchedulePage() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("Mon");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAll, setShowAll] = useState(false);

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
    <main className="!mx-auto !min-h-[calc(100vh-32px)] !w-full !max-w-[860px] !overflow-hidden !rounded-[36px] bg-[#fbfbfe] text-[#111318] shadow-[0_30px_80px_rgba(64,67,120,0.12)] sm:!my-4 lg:!my-6">
      <div className="!px-5 !pb-28 !pt-4 sm:!px-8 sm:!pt-6 lg:!px-10">
        <div className="!mb-6 flex items-center justify-between text-[14px] font-extrabold sm:!mb-7">
          <span>9:41</span>
          <div className="flex items-center !gap-2 text-[#111318]" aria-hidden="true">
            <span className="flex items-end !gap-[2px]">
              <i className="h-1.5 w-1 rounded-sm bg-current" />
              <i className="h-2.5 w-1 rounded-sm bg-current" />
              <i className="h-3.5 w-1 rounded-sm bg-current" />
              <i className="h-4.5 w-1 rounded-sm bg-current" />
            </span>
            <span className="text-[17px] leading-none">⌁</span>
            <span className="h-3.5 w-7 rounded-[4px] border-2 border-current p-[1px]">
              <span className="block h-full w-[82%] rounded-[1px] bg-current" />
            </span>
          </div>
        </div>

        <header className="!mb-8 grid grid-cols-[48px_1fr_48px] items-center sm:!mb-10">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#111318] no-underline transition hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="h-7 w-7" strokeWidth={2.2} />
          </Link>
          <h1 className="text-center text-[24px] font-black tracking-[-0.035em] text-[#111318] sm:text-[28px]">
            Weekly Schedule
          </h1>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            aria-label="Open schedule calendar"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#111318] transition hover:bg-white hover:shadow-sm"
          >
            <CalendarDays className="h-6 w-6" strokeWidth={2.2} />
          </button>
        </header>

        <nav aria-label="Choose day" className="!mb-9 grid grid-cols-6 !gap-1 sm:!mb-11 sm:!gap-3">
          {weekDays.map((item) => {
            const active = item.key === selectedDay;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedDay(item.key)}
                className={`flex min-w-0 flex-col items-center justify-center !rounded-[20px] !px-1 !py-3 text-center transition sm:!py-4 ${
                  active
                    ? "bg-gradient-to-br from-[#6048ff] to-[#7455f7] text-white shadow-[0_12px_28px_rgba(98,72,255,0.28)]"
                    : "text-[#111318] hover:bg-white"
                }`}
              >
                <span className="text-[14px] font-extrabold sm:text-[16px]">{item.key}</span>
                <span className={`!mt-1 text-[12px] font-medium sm:text-[14px] ${active ? "text-white" : "text-[#5c6170]"}`}>
                  {item.date}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="relative">
          {selectedItems.length ? (
            <div className="relative">
              <div className="pointer-events-none absolute bottom-10 left-[89px] top-11 hidden border-l border-dashed border-[#e6e8f0] sm:block lg:left-[108px]" />

              <div className="flex flex-col !gap-4 sm:!gap-5">
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
            <div className="!py-24 text-center">
              <div className="!mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#eeeaff] text-[#654bff]">
                <CalendarCheck2 className="h-7 w-7" />
              </div>
              <h2 className="!mt-5 text-[20px] font-black tracking-[-0.02em]">No classes yet</h2>
              <p className="!mx-auto !mt-2 max-w-[280px] text-[13px] leading-5 text-[#777d8d]">
                Add your first class or study block for {weekDays.find((item) => item.key === selectedDay)?.full}.
              </p>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="!mt-5 inline-flex h-11 items-center !gap-2 rounded-full bg-[#6048ff] !px-5 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(96,72,255,0.24)]"
              >
                <Plus className="h-4 w-4" />
                Add schedule
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-label="Toggle schedule list"
            className="fixed bottom-[104px] right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6648ff] to-[#543cf0] text-white shadow-[0_14px_30px_rgba(86,59,240,0.34)] transition hover:scale-[1.04] sm:absolute sm:bottom-0 sm:right-0"
          >
            <ListFilter className="h-6 w-6" />
          </button>

          {showAll ? (
            <div className="absolute bottom-16 right-0 z-20 !w-[220px] !rounded-[20px] border border-[#ececf4] bg-white !p-3 shadow-[0_20px_48px_rgba(45,48,75,0.18)]">
              <p className="!px-2 !pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9297a6]">This week</p>
              {weekDays.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setSelectedDay(item.key);
                    setShowAll(false);
                  }}
                  className="flex w-full items-center justify-between !rounded-xl !px-2.5 !py-2 text-left text-[13px] font-semibold hover:bg-[#f7f7fb]"
                >
                  <span>{item.full}</span>
                  <span className="text-[11px] text-[#969baa]">
                    {schedule.filter((entry) => entry.day === item.key).length}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <BottomNavigation onAdd={() => setShowAdd(true)} />

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
    <article className="grid grid-cols-[72px_1fr] items-stretch !gap-3 sm:grid-cols-[94px_1fr] sm:!gap-5 lg:grid-cols-[112px_1fr]">
      <div className="relative flex items-start justify-end !pt-5 text-right sm:!pt-6">
        <div>
          <p className="text-[16px] font-black leading-[1.05] tracking-[-0.025em] text-[#111318] sm:text-[18px]">{time}</p>
          <p className="!mt-1 text-[14px] font-black leading-none text-[#111318]">{suffix}</p>
        </div>
        <span className="absolute -right-[19px] top-[31px] hidden h-3.5 w-3.5 rounded-full bg-[#eceef5] ring-4 ring-[#fbfbfe] sm:block lg:-right-[27px]" />
      </div>

      <div className={`relative min-h-[118px] !rounded-[26px] !px-5 !py-5 sm:min-h-[132px] sm:!px-7 sm:!py-6 ${toneStyles[item.tone]}`}>
        <div className="flex h-full items-start justify-between !gap-4">
          <div className="min-w-0 self-center">
            <h2 className="truncate text-[18px] font-black tracking-[-0.025em] text-[#111318] sm:text-[21px]">{item.title}</h2>
            {item.faculty ? (
              <p className="!mt-2 text-[14px] font-medium text-[#565d6d] sm:text-[16px]">{item.faculty}</p>
            ) : null}
            {item.room ? (
              <p className="!mt-1 text-[14px] font-medium text-[#565d6d] sm:text-[16px]">{item.room}</p>
            ) : null}
          </div>

          {item.title !== "Lunch Break" ? (
            <div className="relative self-center">
              <button
                type="button"
                onClick={onMenu}
                aria-label={`More options for ${item.title}`}
                className="flex h-10 w-9 items-center justify-center !rounded-xl text-[#333847] transition hover:bg-white/60"
              >
                <MoreVertical className="h-5 w-5" strokeWidth={2.6} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-11 z-20 !w-32 !rounded-xl border border-white/80 bg-white !p-1.5 shadow-[0_14px_34px_rgba(40,44,70,0.14)]">
                  <button
                    type="button"
                    onClick={onRemove}
                    className="w-full !rounded-lg !px-3 !py-2 text-left text-[12px] font-bold text-rose-600 hover:bg-rose-50"
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

function BottomNavigation({ onAdd }: { onAdd: () => void }) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-20 !mx-auto grid !max-w-[840px] grid-cols-5 items-end !rounded-[30px] border border-white/80 bg-white/95 !px-4 !pb-[calc(12px+env(safe-area-inset-bottom))] !pt-3 shadow-[0_18px_50px_rgba(55,58,90,0.14)] backdrop-blur-xl sm:absolute sm:bottom-0 sm:rounded-t-[32px] sm:rounded-b-none sm:border-x-0 sm:border-b-0">
      <NavItem href="/dashboard" label="Home" icon={<House />} />
      <NavItem href="/services/weekly-schedule" label="Schedule" icon={<CalendarCheck2 />} active />
      <button
        type="button"
        onClick={onAdd}
        aria-label="Add schedule"
        className="!mx-auto -translate-y-2 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gradient-to-br from-[#6b4dff] to-[#5137ee] text-white shadow-[0_14px_30px_rgba(83,56,239,0.34)] transition hover:scale-105 sm:h-16 sm:w-16"
      >
        <Plus className="h-7 w-7" strokeWidth={2.2} />
      </button>
      <NavItem href="/services/tasks" label="Tasks" icon={<CheckSquare2 />} />
      <NavItem href="/services/quick-links" label="Notes" icon={<NotebookText />} />
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center !gap-1 no-underline ${active ? "text-[#5d43ff]" : "text-[#727887]"}`}
    >
      <span className="[&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">{icon}</span>
      <span className="text-[10px] font-bold sm:text-[11px]">{label}</span>
    </Link>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#222538]/30 !p-3 backdrop-blur-sm sm:items-center sm:!p-6">
      <div className="!w-full !max-w-[520px] !rounded-[30px] bg-white !p-5 shadow-[0_30px_80px_rgba(30,33,55,0.24)] sm:!p-7">
        <div className="flex items-start justify-between !gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#7864ff]">{selectedDay} schedule</p>
            <h2 className="!mt-1 text-[22px] font-black tracking-[-0.03em] text-[#111318]">Add a new class</h2>
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

        <form onSubmit={onSubmit} className="!mt-6 flex flex-col !gap-4">
          <label className="flex flex-col !gap-1.5 text-[12px] font-bold text-[#555b6b]">
            Class / activity
            <input
              name="title"
              required
              placeholder="e.g. Data Structures"
              className="!h-12 !w-full !rounded-2xl !border !border-[#e8e9f0] !bg-[#fafafd] !px-4 text-[14px] !text-[#111318] outline-none placeholder:!text-[#a2a7b4] focus:!border-[#7158ff] focus:!ring-4 focus:!ring-[#7158ff]/10"
            />
          </label>
          <div className="grid grid-cols-2 !gap-3">
            <label className="flex flex-col !gap-1.5 text-[12px] font-bold text-[#555b6b]">
              Time
              <input
                name="startTime"
                type="time"
                defaultValue="09:00"
                className="!h-12 !w-full !rounded-2xl !border !border-[#e8e9f0] !bg-[#fafafd] !px-4 text-[14px] !text-[#111318] outline-none focus:!border-[#7158ff] focus:!ring-4 focus:!ring-[#7158ff]/10"
              />
            </label>
            <label className="flex flex-col !gap-1.5 text-[12px] font-bold text-[#555b6b]">
              Room
              <input
                name="room"
                placeholder="CS-201"
                className="!h-12 !w-full !rounded-2xl !border !border-[#e8e9f0] !bg-[#fafafd] !px-4 text-[14px] !text-[#111318] outline-none placeholder:!text-[#a2a7b4] focus:!border-[#7158ff] focus:!ring-4 focus:!ring-[#7158ff]/10"
              />
            </label>
          </div>
          <label className="flex flex-col !gap-1.5 text-[12px] font-bold text-[#555b6b]">
            Faculty
            <input
              name="faculty"
              placeholder="Prof. Sharma"
              className="!h-12 !w-full !rounded-2xl !border !border-[#e8e9f0] !bg-[#fafafd] !px-4 text-[14px] !text-[#111318] outline-none placeholder:!text-[#a2a7b4] focus:!border-[#7158ff] focus:!ring-4 focus:!ring-[#7158ff]/10"
            />
          </label>
          <button
            type="submit"
            className="!mt-1 flex !h-12 items-center justify-center !gap-2 !rounded-2xl bg-gradient-to-r from-[#684cff] to-[#563af3] !px-5 text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(91,61,245,0.24)]"
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
