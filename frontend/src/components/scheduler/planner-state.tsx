import {
  CalendarPlus,
  RefreshCw,
  SearchX,
  SlidersHorizontal,
  WifiOff,
} from "lucide-react";

type PlannerStateType = "empty" | "search" | "filter" | "error";

interface PlannerStateProps {
  type: PlannerStateType;
  searchQuery?: string;
  message?: string;
  onPrimaryAction: () => void;
}

const stateContent = {
  empty: {
    icon: CalendarPlus,
    title: "Build your first week",
    description:
      "Add classes, labs, study blocks and deadlines. Your data will be saved to your account.",
    action: "Add schedule",
    tone: "bg-indigo-50 text-indigo-600",
  },
  search: {
    icon: SearchX,
    title: "No matching schedules",
    description: "Try another keyword or clear your search to see the full week.",
    action: "Clear search",
    tone: "bg-slate-100 text-slate-600",
  },
  filter: {
    icon: SlidersHorizontal,
    title: "Nothing matches these filters",
    description: "Reset the active filters and all schedules in this period will appear again.",
    action: "Reset filters",
    tone: "bg-slate-100 text-slate-600",
  },
  error: {
    icon: WifiOff,
    title: "We could not load your schedule",
    description: "Check the backend connection and try again. Your saved data has not been changed.",
    action: "Try again",
    tone: "bg-rose-50 text-rose-600",
  },
};

export function PlannerState({
  type,
  searchQuery,
  message,
  onPrimaryAction,
}: PlannerStateProps) {
  const content = stateContent[type];
  const Icon = content.icon;

  return (
    <div className="flex min-h-[430px] items-center justify-center bg-white px-6 py-12 text-center lg:min-h-[480px]">
      <div className="max-w-sm">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${content.tone}`}>
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-[17px] font-semibold tracking-[-0.025em] text-slate-950">
          {content.title}
        </h2>
        <p className="mt-2 text-[12.5px] leading-5 text-slate-500">
          {message || content.description}
        </p>
        {type === "search" && searchQuery ? (
          <p className="mt-2 truncate rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
            “{searchQuery}”
          </p>
        ) : null}
        <button
          type="button"
          onClick={onPrimaryAction}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-500/20"
        >
          {type === "error" ? <RefreshCw className="h-3.5 w-3.5" /> : null}
          {content.action}
        </button>
      </div>
    </div>
  );
}

export function PlannerLoading() {
  return (
    <div className="min-h-[430px] animate-pulse bg-white p-4 lg:min-h-[480px] lg:p-5">
      <div className="grid grid-cols-7 gap-2 border-b border-slate-100 pb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="mx-auto h-8 w-16 rounded-lg bg-slate-100" />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-xl border border-slate-100 bg-slate-50"
          />
        ))}
      </div>
    </div>
  );
}
