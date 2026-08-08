"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

/**
 * Dashboard layout — protected route group with sidebar and header.
 * Redirects to login if not authenticated.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  // Determine current active section name for header
  const getHeaderTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Workspace";
    if (pathname.includes("/services/reminders")) return "Reminders";
    if (pathname.includes("/services/assignments")) return "Assignments Tracker";
    if (pathname.includes("/services/notes")) return "Lecture Notes";
    if (pathname.includes("/services/exam-planner")) return "Exam Planner";
    if (pathname.includes("/services/study-planner")) return "Study Planner & Pomodoro";
    if (pathname.includes("/services/todo-list")) return "To-Do Checklist";
    if (pathname.includes("/services/resources")) return "Academic Resources";
    if (pathname.includes("/services/expenses")) return "Expense Tracker";
    if (pathname.includes("/services/quick-tools")) return "Quick Calculators & Converters";
    if (pathname.includes("/services/documents")) return "My Worksheets & Documents";
    if (pathname.includes("/services/important-links")) return "Saved Portals & Links";
    return "Services Workspace";
  };

  const isDashboardActive = pathname === "/dashboard";
  const isServicesActive = pathname.startsWith("/services");

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--foreground)" }}>IG App</h2>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link href="/dashboard" className={`nav-item ${isDashboardActive ? "active" : ""}`}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/dashboard" className={`nav-item ${isServicesActive ? "active" : ""}`}>
            <span>🛠️</span> Services
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span>{user?.firstName} {user?.lastName}</span>
            <small>{user?.email}</small>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{getHeaderTitle()}</h1>
          </div>
        </header>
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
