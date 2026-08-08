"use client";

import { Popover, Switch, Tabs } from "radix-ui";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Search,
  X,
} from "lucide-react";
import { ViewMode } from "@/hooks/use-scheduler-view";
import { EventCategory, ScheduleStatus, CATEGORY_CONFIG } from "@/types/schedule";
import { format, formatWeekRange } from "@/lib/date-utils";
import { cn } from "@/lib/cn";

export interface PlannerFilterState {
  category: EventCategory | "all";
  status: ScheduleStatus | "all";
  day: number | "all";
  hideCompleted: boolean;
}

interface PlannerToolbarProps {
  currentDate: Date;
  selectedDay: Date;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  filters: PlannerFilterState;
  onFiltersChange: (filters: PlannerFilterState) => void;
  activeFilterCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const categories: Array<EventCategory | "all"> = [
  "all",
  "class",
  "lab",
  "study",
  "assignment",
  "exam",
  "personal",
];

const weekdays: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: 1, label: "M" },
  { value: 2, label: "T" },
  { value: 3, label: "W" },
  { value: 4, label: "T" },
  { value: 5, label: "F" },
  { value: 6, label: "S" },
  { value: 0, label: "S" },
];

const emptyFilters: PlannerFilterState = {
  category: "all",
  status: "all",
  day: "all",
  hideCompleted: false,
};

export function PlannerToolbar({
  currentDate,
  selectedDay,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
  filters,
  onFiltersChange,
  activeFilterCount,
  searchQuery,
  onSearchChange,
}: PlannerToolbarProps) {
  const periodLabel =
    viewMode === "day"
      ? format(selectedDay, "EEEE, MMM d, yyyy")
      : formatWeekRange(currentDate);

  return (
    <div className="shrink-0 border-b border-slate-200/80 bg-white">
      <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:flex-nowrap lg:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={onPrevious}
              aria-label="Previous period"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next period"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0 px-1 sm:px-2">
            <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-slate-950 sm:text-[14px]">
              {periodLabel}
            </p>
            <p className="mt-0.5 hidden text-[10.5px] font-medium text-slate-400 sm:block">
              Times shown in your local timezone
            </p>
          </div>

          <button
            type="button"
            onClick={onToday}
            className="hidden h-9 rounded-xl border border-slate-200 px-3 text-[12px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15 sm:inline-flex sm:items-center"
          >
            Today
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Tabs.Root
            value={viewMode}
            onValueChange={(value) => onViewModeChange(value as ViewMode)}
            className="hidden xl:block"
          >
            <Tabs.List
              aria-label="Calendar view"
              className="flex h-10 items-center rounded-xl bg-slate-100 p-1"
            >
              <ViewTab value="day" icon={<CalendarDays className="h-3.5 w-3.5" />}>
                Day
              </ViewTab>
              <ViewTab value="week" icon={<CalendarDays className="h-3.5 w-3.5" />}>
                Week
              </ViewTab>
              <ViewTab value="agenda" icon={<List className="h-3.5 w-3.5" />}>
                Agenda
              </ViewTab>
            </Tabs.List>
          </Tabs.Root>

          <PlannerFilterPopover
            filters={filters}
            onFiltersChange={onFiltersChange}
            activeCount={activeFilterCount}
          />
        </div>

        <div className="relative order-last w-full md:hidden">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search schedules"
            aria-label="Search schedules"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ViewTab({
  value,
  icon,
  children,
}: {
  value: ViewMode;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-semibold text-slate-500 outline-none transition hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500/20 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
    >
      {icon}
      {children}
    </Tabs.Trigger>
  );
}

function PlannerFilterPopover({
  filters,
  onFiltersChange,
  activeCount,
}: {
  filters: PlannerFilterState;
  onFiltersChange: (filters: PlannerFilterState) => void;
  activeCount: number;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "relative inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15",
            activeCount
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filter</span>
          {activeCount ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          ) : null}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[70] w-[min(340px,calc(100vw-24px))] rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-[0_20px_60px_rgba(15,23,42,0.16)] outline-none transition duration-150 data-[state=open]:opacity-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-slate-950">
                Filter schedules
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Narrow the current calendar view
              </p>
            </div>
            {activeCount ? (
              <button
                type="button"
                onClick={() => onFiltersChange(emptyFilters)}
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-4">
            <fieldset>
              <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Category
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => {
                  const selected = filters.category === category;
                  const config = category === "all" ? null : CATEGORY_CONFIG[category];
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => onFiltersChange({ ...filters, category })}
                      aria-pressed={selected}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition",
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {config ? (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                      ) : null}
                      {config?.label ?? "All"}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </span>
                <select
                  value={filters.status}
                  onChange={(event) =>
                    onFiltersChange({
                      ...filters,
                      status: event.target.value as ScheduleStatus | "all",
                    })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="all">All status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <fieldset>
                <legend className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Day
                </legend>
                <div className="flex h-10 items-center rounded-xl border border-slate-200 p-1">
                  {weekdays.map((day) => (
                    <button
                      key={String(day.value)}
                      type="button"
                      title={day.value === "all" ? "All days" : undefined}
                      onClick={() => onFiltersChange({ ...filters, day: day.value })}
                      className={cn(
                        "h-8 min-w-0 flex-1 rounded-lg text-[10px] font-semibold transition",
                        filters.day === day.value
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-[12px] font-semibold text-slate-800">
                  Hide completed
                </p>
                <p className="mt-0.5 text-[10.5px] text-slate-500">
                  Show only active schedules
                </p>
              </div>
              <Switch.Root
                checked={filters.hideCompleted}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, hideCompleted: checked })
                }
                aria-label="Hide completed schedules"
                className="relative h-6 w-11 rounded-full bg-slate-300 outline-none transition data-[state=checked]:bg-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
              >
                <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          </div>

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
