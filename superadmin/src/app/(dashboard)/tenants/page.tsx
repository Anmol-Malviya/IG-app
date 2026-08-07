"use client";

export default function TenantsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Tenants Management</h1>
        <button className="btn btn-primary">Add Tenant</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Plan</th>
              <th>Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="empty-state">
                Connect to backend to load tenants
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
