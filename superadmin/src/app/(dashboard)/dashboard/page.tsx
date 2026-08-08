"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTenants: number;
  activeTenants: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get<DashboardStats>("/stats/overview");
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.message || "Failed to load dashboard metrics");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const renderValue = (value: number | undefined) => {
    if (isLoading) {
      return <div className="skeleton-text short" style={{ margin: "4px 0" }}></div>;
    }
    return value !== undefined ? value.toLocaleString() : "--";
  };

  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p style={{ marginBottom: "2rem" }}>System overview and metrics.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{renderValue(stats?.totalUsers)}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <span className="stat-value">{renderValue(stats?.activeUsers)}</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <span className="stat-value">{renderValue(stats?.totalTenants)}</span>
            <span className="stat-label">Total Tenants</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">{renderValue(stats?.activeTenants)}</span>
            <span className="stat-label">Active Tenants</span>
          </div>
        </div>
      </div>
    </div>
  );
}
