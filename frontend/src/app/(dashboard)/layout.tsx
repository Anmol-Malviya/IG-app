"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

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

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>IG App</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active">
            <span>📊</span> Dashboard
          </a>
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
            <h1>Dashboard</h1>
          </div>
        </header>
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
