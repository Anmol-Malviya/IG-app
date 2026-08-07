"use client";

export default function SettingsPage() {
  return (
    <div className="page">
      <h1>System Settings</h1>
      <div className="settings-grid">
        <div className="settings-section">
          <h2>General</h2>
          <div className="form-group">
            <label>Application Name</label>
            <input type="text" defaultValue="IG App" />
          </div>
        </div>

        <div className="settings-section">
          <h2>Security</h2>
          <div className="form-group">
            <label>Max Login Attempts</label>
            <input type="number" defaultValue={10} />
          </div>
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input type="number" defaultValue={15} />
          </div>
        </div>
      </div>
    </div>
  );
}
