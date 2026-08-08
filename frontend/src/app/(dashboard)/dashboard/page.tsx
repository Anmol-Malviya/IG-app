"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

interface FeatureItem {
  id: string;
  name: string;
  desc: string;
  path: string;
  colorClass: string;
  svgIcon: React.ReactNode;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const features: FeatureItem[] = [
    {
      id: "reminders",
      name: "Reminders",
      desc: "Stay updated on notifications",
      path: "/services/reminders",
      colorClass: "icon-reminders",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      )
    },
    {
      id: "assignments",
      name: "Assignments",
      desc: "Track assignment deadlines",
      path: "/services/assignments",
      colorClass: "icon-assignments",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
      )
    },
    {
      id: "notes",
      name: "Notes",
      desc: "Jot down lectures and tasks",
      path: "/services/notes",
      colorClass: "icon-notes",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      )
    },
    {
      id: "exam-planner",
      name: "Exam Planner",
      desc: "Prep and schedule upcoming exams",
      path: "/services/exam-planner",
      colorClass: "icon-exams",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
      )
    },
    {
      id: "study-planner",
      name: "Study Planner",
      desc: "Pomodoro sessions & goals",
      path: "/services/study-planner",
      colorClass: "icon-study",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
      )
    },
    {
      id: "todo-list",
      name: "To-Do List",
      desc: "Quick checklist for your day",
      path: "/services/todo-list",
      colorClass: "icon-todo",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      )
    },
    {
      id: "resources",
      name: "Resources",
      desc: "Organize files and study sheets",
      path: "/services/resources",
      colorClass: "icon-resources",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>
      )
    },
    {
      id: "expenses",
      name: "Expenses",
      desc: "Track and budget daily spendings",
      path: "/services/expenses",
      colorClass: "icon-expenses",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="12" x2="12" y1="5" y2="19"/><circle cx="12" cy="12" r="3"/></svg>
      )
    },
    {
      id: "quick-tools",
      name: "Quick Tools",
      desc: "Converters and calculators",
      path: "/services/quick-tools",
      colorClass: "icon-tools",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      )
    },
    {
      id: "documents",
      name: "Documents",
      desc: "Manage academic worksheets",
      path: "/services/documents",
      colorClass: "icon-docs",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
      )
    },
    {
      id: "important-links",
      name: "Important Links",
      desc: "Bookmarked portals and urls",
      path: "/services/important-links",
      colorClass: "icon-links",
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      )
    }
  ];

  const filteredFeatures = features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <div className="welcome-card">
        <h2>Welcome back, {user?.firstName || "Student"}! 👋</h2>
        <p>Your workspace is ready. Access all tools and trackers below.</p>
      </div>

      {/* Grid container */}
      <div className="features-container">
        <div className="features-top">
          <h2 className="features-title">All Features</h2>
          
          {/* Search box matching reference image design icon indicator */}
          <div className="features-search">
            <span className="features-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="features-search-input"
            />
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="features-grid">
          {filteredFeatures.map((feature) => (
            <Link key={feature.id} href={feature.path} className="feature-card">
              <div className={`feature-icon-wrapper ${feature.colorClass}`}>
                {feature.svgIcon}
              </div>
              <div className="feature-info">
                <span className="feature-name">{feature.name}</span>
                <span className="feature-desc">{feature.desc}</span>
              </div>
            </Link>
          ))}
          {filteredFeatures.length === 0 && (
            <div className="no-results-message" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              No matching features found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
