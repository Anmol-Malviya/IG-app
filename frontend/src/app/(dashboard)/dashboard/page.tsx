"use client";

import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="welcome-card">
        <h2>Welcome back, {user?.firstName}! 👋</h2>
        <p>Here&apos;s what&apos;s happening with your account today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Performance</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
}
