"use client";

import { useEffect, useState } from "react";

/** Keeps countdowns and current-time labels fresh without re-rendering every second. */
export function useCurrentMinute(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return now;
}
