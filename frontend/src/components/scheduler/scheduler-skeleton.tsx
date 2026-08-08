"use client";

import React from "react";

export function SchedulerSkeleton() {
  return (
    <div
      className="h-full min-h-[360px] animate-pulse bg-white p-4"
      aria-label="Loading schedule"
    >
        <div className="grid grid-cols-8 gap-2 h-full">
          <div className="h-full bg-slate-50 rounded" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-full bg-slate-50/50 rounded flex flex-col gap-3 p-2">
              <div className="h-6 bg-slate-100 rounded" />
              {i % 2 === 0 && <div className="h-20 bg-slate-100 rounded" />}
              {i % 3 === 0 && <div className="h-16 bg-slate-100 rounded" />}
            </div>
          ))}
        </div>
    </div>
  );
}
