"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  GraduationCap,
  Plus,
  Target,
  Trash2,
} from "lucide-react";

interface Exam {
  id: string;
  subject: string;
  title: string;
  date: string;
  time: string;
  progress: number;
}

const initialExams: Exam[] = [
  { id: "1", subject: "Mathematics", title: "Calculus Mid Semester", date: "2026-08-20", time: "10:00", progress: 72 },
  { id: "2", subject: "Data Structures", title: "Algorithms & Trees Exam", date: "2026-08-28", time: "14:00", progress: 46 },
  { id: "3", subject: "Cyber Security", title: "Network Security Quiz", date: "2026-08-14", time: "09:00", progress: 88 },
];

export default function ExamPlannerPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todayStart, setTodayStart] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayStart(today.getTime());
  }, []);

  const daysUntil = (examDate: string) => {
    if (todayStart === null) return 0;
    const target = new Date(`${examDate}T00:00:00`).getTime();
    return Math.ceil((target - todayStart) / 86_400_000);
  };

  const orderedExams = useMemo(
    () => [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [exams]
  );

  const upcoming = orderedExams.filter((exam) => daysUntil(exam.date) >= 0);
  const nearestExam = upcoming[0];
  const averageProgress = exams.length
    ? Math.round(exams.reduce((sum, exam) => sum + exam.progress, 0) / exams.length)
    : 0;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !title.trim() || !date || !time) return;

    setExams((current) => [
      ...current,
      { id: Date.now().toString(), subject: subject.trim(), title: title.trim(), date, time, progress: 0 },
    ]);
    setSubject("");
    setTitle("");
    setDate("");
    setTime("");
  };

  const updateProgress = (id: string, progress: number) => {
    setExams((current) =>
      current.map((exam) =>
        exam.id === id ? { ...exam, progress: Math.max(0, Math.min(100, progress)) } : exam
      )
    );
  };

  const removeExam = (id: string) => {
    setExams((current) => current.filter((exam) => exam.id !== id));
  };

  const formatDate = (examDate: string) =>
    new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(
      new Date(`${examDate}T00:00:00`)
    );

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)]">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-950"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                  <GraduationCap size={15} />
                  Exam & study planner
                </div>
                <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-3xl">
                  Prepare with a clear plan.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Keep exam dates visible, measure preparation, and know exactly where your focus should go next.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-950 p-5 text-white sm:p-6 lg:border-l lg:border-t-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Next focus</p>
            {nearestExam ? (
              <>
                <p className="mt-3 text-lg font-extrabold tracking-[-0.02em]">{nearestExam.subject}</p>
                <p className="mt-1 text-sm text-slate-400">{nearestExam.title}</p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-black tracking-tight">{Math.max(0, daysUntil(nearestExam.date))}</p>
                    <p className="text-xs font-semibold text-slate-400">days remaining</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">{nearestExam.progress}% ready</div>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-300">No upcoming exam. Add your next exam to start planning.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Upcoming</p>
            <CalendarDays size={17} className="text-indigo-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-slate-950">{upcoming.length}</p>
          <p className="mt-1 text-xs text-slate-400">scheduled exams</p>
        </div>
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Preparation</p>
            <Target size={17} className="text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-slate-950">{averageProgress}%</p>
          <p className="mt-1 text-xs text-slate-400">average progress</p>
        </div>
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Study mode</p>
            <BookOpenCheck size={17} className="text-amber-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-slate-950">Focused</p>
          <p className="mt-1 text-xs text-slate-400">one exam at a time</p>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Plan ahead</p>
          <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-950">Schedule an exam</h3>
        </div>

        <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Exam / topic"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add exam
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Preparation board</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-slate-950">Upcoming exams</h3>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {orderedExams.map((exam) => {
            const remaining = daysUntil(exam.date);
            return (
              <article key={exam.id} className="rounded-[22px] border border-slate-200/80 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                      {exam.subject}
                    </span>
                    <h4 className="mt-3 text-lg font-extrabold tracking-[-0.02em] text-slate-950">{exam.title}</h4>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5"><CalendarDays size={15} /> {formatDate(exam.date)}</span>
                      <span className="flex items-center gap-1.5"><Clock3 size={15} /> {exam.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExam(exam.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Delete ${exam.title}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Preparation progress</p>
                      <p className="mt-1 text-xl font-black text-slate-950">{exam.progress}%</p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${remaining <= 3 && remaining >= 0 ? "bg-rose-50 text-rose-700" : "bg-white text-slate-600"}`}>
                      {remaining > 0 ? `${remaining} days left` : remaining === 0 ? "Today" : "Completed"}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                      style={{ width: `${exam.progress}%` }}
                    />
                  </div>
                  <input
                    aria-label={`Preparation progress for ${exam.title}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={exam.progress}
                    onChange={(event) => updateProgress(exam.id, Number(event.target.value))}
                    className="mt-4 w-full accent-amber-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">Drag to update how much of the syllabus you have prepared.</p>
                </div>
              </article>
            );
          })}
        </div>

        {orderedExams.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <GraduationCap className="mx-auto text-slate-300" size={30} />
            <p className="mt-3 text-sm font-bold text-slate-700">No exams scheduled</p>
            <p className="mt-1 text-sm text-slate-400">Add your next exam above to start planning.</p>
          </div>
        )}
      </section>
    </div>
  );
}
