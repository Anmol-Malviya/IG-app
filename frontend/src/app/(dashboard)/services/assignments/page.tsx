"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Flag,
  ListTodo,
  Plus,
  Trash2,
} from "lucide-react";

type ItemStatus = "Pending" | "In Progress" | "Completed";
type ItemPriority = "Low" | "Medium" | "High";
type ItemKind = "Task" | "Assignment";

interface WorkItem {
  id: string;
  kind: ItemKind;
  subject: string;
  title: string;
  dueDate: string;
  priority: ItemPriority;
  status: ItemStatus;
}

const initialItems: WorkItem[] = [
  {
    id: "1",
    kind: "Assignment",
    subject: "Data Structures",
    title: "Binary Trees lab report",
    dueDate: "2026-08-12",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "2",
    kind: "Task",
    subject: "Mathematics",
    title: "Revise integration formulas",
    dueDate: "2026-08-14",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "3",
    kind: "Assignment",
    subject: "Cyber Security",
    title: "Incident classification worksheet",
    dueDate: "2026-08-18",
    priority: "Medium",
    status: "Pending",
  },
];

const priorityStyles: Record<ItemPriority, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

const statusStyles: Record<ItemStatus, string> = {
  Pending: "bg-slate-100 text-slate-600",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export default function AssignmentsPage() {
  const [items, setItems] = useState<WorkItem[]>(initialItems);
  const [filter, setFilter] = useState<"All" | ItemStatus>("All");
  const [kind, setKind] = useState<ItemKind>("Assignment");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<ItemPriority>("Medium");

  const filteredItems = useMemo(
    () => (filter === "All" ? items : items.filter((item) => item.status === filter)),
    [filter, items]
  );

  const completed = items.filter((item) => item.status === "Completed").length;
  const inProgress = items.filter((item) => item.status === "In Progress").length;
  const completion = items.length ? Math.round((completed / items.length) * 100) : 0;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !title.trim() || !dueDate) return;

    setItems((current) => [
      {
        id: Date.now().toString(),
        kind,
        subject: subject.trim(),
        title: title.trim(),
        dueDate,
        priority,
        status: "Pending",
      },
      ...current,
    ]);
    setSubject("");
    setTitle("");
    setDueDate("");
    setPriority("Medium");
  };

  const updateStatus = (id: string, status: ItemStatus) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(`${date}T00:00:00`)
    );

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="flex flex-col gap-5 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-950"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              <ListTodo size={14} />
              Tasks & assignments
            </div>
            <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-3xl">
              Stay ahead of every deadline.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Keep academic tasks, assignments, priority, and progress in one clear workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:min-w-[340px]">
          <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
            <p className="text-xl font-black text-slate-950">{items.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Total</p>
          </div>
          <div className="rounded-2xl bg-indigo-50 px-3 py-3 text-center">
            <p className="text-xl font-black text-indigo-700">{inProgress}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400">Active</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <p className="text-xl font-black text-emerald-700">{completion}%</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-500">Done</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Quick add</p>
          <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-950">Add a new item</h3>
        </div>

        <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as ItemKind)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            <option value="Assignment">Assignment</option>
            <option value="Task">Task</option>
          </select>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 md:col-span-2 xl:col-span-1"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as ItemPriority)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            <option value="Low">Low priority</option>
            <option value="Medium">Medium priority</option>
            <option value="High">High priority</option>
          </select>
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add item
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Work queue</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-slate-950">Your upcoming work</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", "Pending", "In Progress", "Completed"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  filter === value
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)] transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                      {item.kind}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${priorityStyles[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.13em] text-slate-400">{item.subject}</p>
                  <h4 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-950">{item.title}</h4>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <CalendarClock size={16} className="text-slate-400" />
                  {formatDate(item.dueDate)}
                  <Flag size={14} className={item.priority === "High" ? "text-rose-500" : "text-slate-300"} />
                </div>
                <select
                  value={item.status}
                  onChange={(event) => updateStatus(item.id, event.target.value as ItemStatus)}
                  className={`h-9 rounded-xl border-0 px-3 text-xs font-bold outline-none ${statusStyles[item.status]}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            {filter === "Completed" ? (
              <CheckCircle2 className="mx-auto text-emerald-500" size={28} />
            ) : (
              <CircleDashed className="mx-auto text-slate-300" size={28} />
            )}
            <p className="mt-3 text-sm font-bold text-slate-700">Nothing here yet</p>
            <p className="mt-1 text-sm text-slate-400">Add a task or switch the current filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
