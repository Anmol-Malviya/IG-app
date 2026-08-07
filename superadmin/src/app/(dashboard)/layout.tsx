"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
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
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🛡️ Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item">
            <span>📊</span> Dashboard
          </a>
          <a href="/users" className="nav-item">
            <span>👥</span> Users
          </a>
          <a href="/tenants" className="nav-item">
            <span>🏢</span> Tenants
          </a>
          <a href="/settings" className="nav-item">
            <span>⚙️</span> Settings
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span>{user?.firstName} {user?.lastName}</span>
            <small>{user?.role}</small>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
