"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  FolderOpen,
  GraduationCap,
  Home,
  ListTodo,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const navigation = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Weekly Schedule", href: "/services/weekly-schedule", icon: CalendarDays },
  { label: "Tasks", href: "/services/assignments", icon: ListTodo },
  { label: "Exam Planner", href: "/services/exam-planner", icon: GraduationCap },
  { label: "Resources", href: "/services/resources", icon: FolderOpen },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push("/login");
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const pageTitle =
    navigation.find((item) => isActive(item.href))?.label ?? "Student Workspace";

  const initials = `${user?.firstName?.[0] ?? "S"}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[282px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <Link href="/dashboard" className="flex items-center gap-3 text-slate-950 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Sparkles size={19} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold tracking-[-0.03em]">IG App</p>
              <p className="text-xs font-medium text-slate-400">Student workspace</p>
            </div>
          </Link>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold no-underline transition-all ${
                    active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon size={18} strokeWidth={2.1} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-extrabold text-indigo-700">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {user?.firstName || "Student"} {user?.lastName || ""}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-[282px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white lg:hidden">
                <Sparkles size={17} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 lg:hidden">IG App</p>
                <h1 className="text-base font-extrabold tracking-[-0.02em] text-slate-950 sm:text-lg lg:text-xl">
                  {pageTitle}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium text-slate-400">Focused workspace</p>
                <p className="text-sm font-bold text-slate-700">4 essential tools</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-xs font-extrabold text-indigo-700 lg:hidden">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1480px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold no-underline transition ${
                  active ? "bg-slate-950 text-white" : "text-slate-400"
                }`}
              >
                <Icon size={18} strokeWidth={2.1} />
                <span className="w-full truncate text-center">
                  {item.label === "Weekly Schedule"
                    ? "Schedule"
                    : item.label === "Exam Planner"
                      ? "Exams"
                      : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
