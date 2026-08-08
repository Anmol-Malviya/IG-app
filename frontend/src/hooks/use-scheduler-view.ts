/**
 * Hook for managing scheduler view state (view mode, current date, selected day).
 */

"use client";

import { useState, useCallback } from "react";
import { nextWeek, prevWeek } from "@/lib/date-utils";

export type ViewMode = "day" | "week" | "agenda";

export function useSchedulerView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDay, setSelectedDay] = useState(new Date());

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  }, []);

  const goNextWeek = useCallback(() => {
    setCurrentDate((d) => nextWeek(d));
    setSelectedDay((d) => nextWeek(d));
  }, []);

  const goPrevWeek = useCallback(() => {
    setCurrentDate((d) => prevWeek(d));
    setSelectedDay((d) => prevWeek(d));
  }, []);

  const selectDay = useCallback((date: Date) => {
    setSelectedDay(date);
    setCurrentDate(date);
  }, []);

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay: selectDay,
    goToToday,
    goNextWeek,
    goPrevWeek,
  };
}
