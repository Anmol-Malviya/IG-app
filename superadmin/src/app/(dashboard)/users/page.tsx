"use client";

export default function UsersPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Users Management</h1>
        <button className="btn btn-primary">Add User</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tenant</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="empty-state">
                Connect to backend to load users
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
