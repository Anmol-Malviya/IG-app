"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  FolderOpen,
  GraduationCap,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const features = [
  {
    number: "01",
    title: "Weekly Schedule",
    description: "Plan classes and study blocks across the week without clutter.",
    href: "/services/weekly-schedule",
    icon: CalendarDays,
    iconClass: "bg-indigo-50 text-indigo-700",
    accentClass: "from-indigo-500/12 via-indigo-500/5 to-transparent",
  },
  {
    number: "02",
    title: "Task & Assignment Track",
    description: "Keep deadlines, priorities, and completion status in one focused view.",
    href: "/services/assignments",
    icon: ListTodo,
    iconClass: "bg-emerald-50 text-emerald-700",
    accentClass: "from-emerald-500/12 via-emerald-500/5 to-transparent",
  },
  {
    number: "03",
    title: "Exam & Study Planner",
    description: "Track exam dates and preparation progress with a clear study plan.",
    href: "/services/exam-planner",
    icon: GraduationCap,
    iconClass: "bg-amber-50 text-amber-700",
    accentClass: "from-amber-500/12 via-amber-500/5 to-transparent",
  },
  {
    number: "04",
    title: "Quick Links & Resources",
    description: "Save important portals, notes, files, and study links for quick access.",
    href: "/services/resources",
    icon: FolderOpen,
    iconClass: "bg-violet-50 text-violet-700",
    accentClass: "from-violet-500/12 via-violet-500/5 to-transparent",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Student";

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8">
      <section className="relative w-full min-w-0 overflow-hidden rounded-[24px] border border-slate-800 bg-slate-950 px-4 py-5 text-white shadow-[0_18px_50px_-34px_rgba(15,23,42,0.85)] sm:rounded-[28px] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl sm:h-56 sm:w-56" />

        <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300 sm:mb-5 sm:px-3 sm:text-xs">
              <Sparkles size={13} className="shrink-0 text-indigo-300" />
              <span className="truncate">Focused student workspace</span>
            </div>
            <p className="mb-1.5 text-xs font-semibold text-slate-400 sm:mb-2 sm:text-sm">Your focused dashboard</p>
            <h2 className="max-w-xl break-words text-[28px] font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-[42px] lg:leading-[1.05]">
              Welcome back, {firstName}.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-5 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
              Everything you need for classes, deadlines, exams, and study resources — nothing extra.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:gap-3">
            <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-xl font-black tracking-tight sm:text-2xl">4</p>
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[11px] sm:tracking-[0.14em]">Core tools</p>
            </div>
            <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-xl font-black tracking-tight sm:text-2xl">1</p>
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[11px] sm:tracking-[0.14em]">Workspace</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0">
        <div className="mb-3 flex min-w-0 items-end justify-between gap-4 sm:mb-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 sm:text-xs">Core features</p>
            <h3 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 sm:text-2xl">
              Your study command center
            </h3>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-500 md:block">
            Designed to stay simple on mobile and productive on desktop.
          </p>
        </div>

        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative min-w-0 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-4 text-slate-950 no-underline shadow-[0_10px_30px_-26px_rgba(15,23,42,0.45)] transition duration-300 sm:rounded-[24px] sm:p-6 sm:hover:-translate-y-1 sm:hover:border-slate-300 sm:hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.35)]"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accentClass} opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100`} />
                <div className="relative min-w-0">
                  <div className="mb-5 flex items-start justify-between gap-4 sm:mb-8">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] sm:h-12 sm:w-12 sm:rounded-2xl ${feature.iconClass}`}>
                      <Icon size={21} strokeWidth={2.1} />
                    </div>
                    <span className="shrink-0 pt-1 text-[10px] font-black tracking-[0.14em] text-slate-300 sm:text-xs sm:tracking-[0.16em]">{feature.number}</span>
                  </div>

                  <h4 className="max-w-sm break-words text-[19px] font-extrabold leading-[1.18] tracking-[-0.025em] sm:text-[22px]">
                    {feature.title}
                  </h4>
                  <p className="mt-2 max-w-md text-[13px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    {feature.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[13px] font-bold text-slate-900 sm:mt-6 sm:text-sm">
                    Open workspace
                    <ArrowUpRight size={15} className="transition-transform duration-300 sm:group-hover:translate-x-0.5 sm:group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[20px] border border-slate-200/80 bg-white px-4 py-4 sm:flex sm:items-center sm:justify-between sm:rounded-[24px] sm:px-6 sm:py-5">
        <div>
          <p className="text-[13px] font-extrabold text-slate-950 sm:text-sm">Built for quick daily use</p>
          <p className="mt-1 text-[12px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Open the app, check what matters, update it, and get back to studying.
          </p>
        </div>
        <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600 sm:mt-0 sm:text-xs">
          Mobile-first • Minimal • Fast
        </div>
      </section>
    </div>
  );
}
