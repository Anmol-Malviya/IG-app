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
    <div className="space-y-7 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-7 text-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.8)] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
              <Sparkles size={14} className="text-indigo-300" />
              Focused student workspace
            </div>
            <p className="mb-2 text-sm font-semibold text-slate-400">Your focused dashboard</p>
            <h2 className="max-w-xl text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-[42px] lg:leading-[1.05]">
              Welcome back, {firstName}.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Everything you need for classes, deadlines, exams, and study resources — nothing extra.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-black tracking-tight">4</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Core tools</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-black tracking-tight">1</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Core features</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-slate-950 sm:text-2xl">
              Your study command center
            </h3>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-500 md:block">
            Designed to stay simple on mobile and productive on desktop.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 text-slate-950 no-underline shadow-[0_10px_35px_-28px_rgba(15,23,42,0.5)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.35)] sm:p-6"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accentClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconClass}`}>
                      <Icon size={22} strokeWidth={2.1} />
                    </div>
                    <span className="text-xs font-black tracking-[0.16em] text-slate-300">{feature.number}</span>
                  </div>

                  <h4 className="max-w-sm text-xl font-extrabold tracking-[-0.025em] sm:text-[22px]">
                    {feature.title}
                  </h4>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900">
                    Open workspace
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-5 sm:flex sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-extrabold text-slate-950">Built for quick daily use</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Open the app, check what matters, update it, and get back to studying.
          </p>
        </div>
        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:mt-0">
          Mobile-first • Minimal • Fast
        </div>
      </section>
    </div>
  );
}
