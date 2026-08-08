"use client";

import React, { useState, useEffect } from "react";
import { EventCategory, CATEGORY_CONFIG } from "@/types/schedule";
import { getCategoryIcon } from "./schedule-event-card";
import { X, Plus } from "lucide-react";

interface QuickAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    category: EventCategory;
    startDate: string;
    startTime: string;
    endTime: string;
    location?: string;
    faculty?: string;
  }) => Promise<void>;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
}

export function QuickAddSheet({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  initialStartTime = "09:00",
  initialEndTime = "10:00",
}: QuickAddSheetProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("class");
  const [startDate, setStartDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [location, setLocation] = useState("");
  const [faculty, setFaculty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update date/time when modal is opened with new initial values
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (initialDate) setStartDate(initialDate);
      if (initialStartTime) setStartTime(initialStartTime);
      if (initialEndTime) setEndTime(initialEndTime);
      setErrorMessage("");
    }
  }

  // Escape key closes modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: EventCategory[] = [
    "class",
    "lab",
    "study",
    "assignment",
    "exam",
    "personal",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter an event title");
      return;
    }

    if (endTime <= startTime) {
      setErrorMessage("End time must be after start time");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        category,
        startDate,
        startTime,
        endTime,
        location: location.trim() || undefined,
        faculty: faculty.trim() || undefined,
      });
      setTitle("");
      setLocation("");
      setFaculty("");
      onClose();
    } catch {
      setErrorMessage("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-scheduler
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="animate-fadeIn max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[24px] border border-slate-200 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_24px_64px_rgba(15,23,42,0.22)] sm:rounded-[20px] sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_7px_16px_rgba(79,70,229,0.22)]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 id="quick-add-title" className="text-base font-bold tracking-[-0.02em] text-slate-950">Create schedule event</h3>
              <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">Add the essentials now—you can edit details later.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
            aria-label="Close add event form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="quick-add-title-input" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Title / Subject *
            </label>
            <input
              type="text"
              id="quick-add-title-input"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Structures, Lab Session, Reading..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-[13px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2.5 rounded-[10px] border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {getCategoryIcon(cat, "w-3 h-3")}
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-[10px] border border-slate-200 text-[13px] bg-slate-50/50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-[10px] border border-slate-200 text-[13px] bg-slate-50/50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-[10px] border border-slate-200 text-[13px] bg-slate-50/50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
              />
            </div>
          </div>

          {/* Location & Faculty (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 204, Online"
                className="w-full px-3 py-2 rounded-[10px] border border-slate-200 text-[12.5px] bg-slate-50/50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Faculty (Optional)
              </label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                placeholder="e.g. Dr. Miller"
                className="w-full px-3 py-2 rounded-[10px] border border-slate-200 text-[12.5px] bg-slate-50/50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-4 py-2.5 rounded-[10px] border border-slate-200 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-[12.5px] font-bold text-white shadow-[0_7px_16px_rgba(79,70,229,0.22)] transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
