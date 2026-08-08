"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface TenantItem {
  _id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  settings: {
    maxUsers: number;
    features: string[];
  };
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState("free");
  const [maxUsers, setMaxUsers] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTenants = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<TenantItem[]>("/tenants");
      if (response.success && response.data) {
        setTenants(response.data);
      } else {
        setError(response.message || "Failed to load tenants");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleDelete = async (tenantId: string) => {
    if (!confirm("Are you sure you want to delete this tenant? All associated data will be deleted.")) return;
    try {
      const response = await api.delete(`/tenants/${tenantId}`);
      // Delete endpoint returns 204 No Content, ApiClient resolves as response.success
      setTenants((prev) => prev.filter((t) => t._id !== tenantId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post<TenantItem>("/tenants", {
        name,
        slug,
        plan,
        settings: {
          maxUsers,
          features: [],
        },
      });

      if (response.success && response.data) {
        setTenants((prev) => [...prev, response.data]);
        setIsModalOpen(false);
        // Reset form
        setName("");
        setSlug("");
        setPlan("free");
        setMaxUsers(10);
      } else {
        alert(response.message || "Failed to create tenant");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Automatically suggest slug based on name
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tenants Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Add Tenant</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Plan</th>
              <th>Max Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx}>
                  <td><div className="skeleton-text medium"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                  <td><div className="skeleton-text short"></div></td>
                </tr>
              ))
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No tenants found
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant._id}>
                  <td><strong>{tenant.name}</strong></td>
                  <td><code>{tenant.slug}</code></td>
                  <td>
                    <span className="badge badge-role badge-admin">
                      {tenant.plan}
                    </span>
                  </td>
                  <td>{tenant.settings?.maxUsers || "N/A"}</td>
                  <td>
                    <span className={`badge ${tenant.isActive ? "badge-active" : "badge-inactive"}`}>
                      {tenant.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(tenant._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: "var(--destructive)" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Tenant Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Create New Tenant</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-button">&times;</button>
            </div>
            <form onSubmit={handleCreateTenant}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="tenant-name">Tenant Name</label>
                  <input
                    id="tenant-name"
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tenant-slug">Tenant Slug</label>
                  <input
                    id="tenant-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. acme-corp"
                    required
                    pattern="^[a-z0-9-]+$"
                    title="Slug must be lowercase alphanumeric with hyphens"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tenant-plan">Pricing Plan</label>
                  <select
                    id="tenant-plan"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    style={{
                      backgroundColor: "rgba(9, 9, 11, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="tenant-users">Max Allowed Users</label>
                  <input
                    id="tenant-users"
                    type="number"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(parseInt(e.target.value, 10))}
                    min={1}
                    max={10000}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Tenant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
