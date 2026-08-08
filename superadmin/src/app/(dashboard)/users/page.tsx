"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface UserItem {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<UserItem[]>("/users");
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || "Failed to load users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: false } : u))
        );
      } else {
        alert(response.message || "Failed to deactivate user");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users Management</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx}>
                  <td><div className="skeleton-text medium"></div></td>
                  <td><div className="skeleton-text medium"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-role badge-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.tenantId || "None"}</td>
                  <td>
                    <span className={`badge ${user.isActive ? "badge-active" : "badge-inactive"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeactivate(user._id)}
                      className="btn btn-secondary btn-sm"
                      disabled={!user.isActive}
                      style={{ color: user.isActive ? "var(--destructive)" : "var(--muted-foreground)" }}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
