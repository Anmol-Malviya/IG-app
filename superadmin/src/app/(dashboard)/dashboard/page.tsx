"use client";

export default function AdminDashboardPage() {
  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p>System overview and metrics.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Active Tenants</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">API Requests (24h)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-info">
            <span className="stat-value">--</span>
            <span className="stat-label">Failed Logins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
