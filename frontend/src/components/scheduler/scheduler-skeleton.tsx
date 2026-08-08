"use client";

import React from "react";

export function SchedulerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting row skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 rounded-[8px]" />
          <div className="h-4 w-36 bg-slate-100 rounded-[6px]" />
        </div>
        <div className="h-10 w-48 bg-slate-200 rounded-[10px]" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-white rounded-[14px] border border-slate-200 p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-[10px] bg-slate-100" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-6 w-14 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-14 bg-white rounded-[14px] border border-slate-200 p-3 flex items-center justify-between">
        <div className="h-8 w-40 bg-slate-100 rounded-[8px]" />
        <div className="h-8 w-64 bg-slate-100 rounded-[8px]" />
      </div>

      {/* Grid Skeleton */}
      <div className="h-[480px] bg-white rounded-[14px] border border-slate-200 p-4">
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
    </div>
  );
}
