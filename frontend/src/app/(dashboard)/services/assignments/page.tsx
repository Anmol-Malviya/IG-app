"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Assignment {
  id: string;
  course: string;
  title: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Submitted";
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "1", course: "Computer Science I", title: "Lab 3: Binary Trees", dueDate: "2026-08-12", status: "In Progress" },
    { id: "2", course: "Advanced Mathematics", title: "Calculus Problem Set 6", dueDate: "2026-08-15", status: "Pending" },
    { id: "3", course: "Physics II", title: "Thermodynamics Lab Report", dueDate: "2026-08-10", status: "Submitted" },
    { id: "4", course: "Chemistry II", title: "Organic Chemistry Homework", dueDate: "2026-08-18", status: "Pending" }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState<Assignment["status"]>("Pending");

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCourse || !newDueDate) return;

    const assignment: Assignment = {
      id: Date.now().toString(),
      course: newCourse,
      title: newTitle,
      dueDate: newDueDate,
      status: newStatus
    };

    setAssignments([...assignments, assignment]);
    setNewTitle("");
    setNewCourse("");
    setNewDueDate("");
    setNewStatus("Pending");
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Assignments & Deadline Tracker</h1>
          <p>Track assignments, projects, labs, and ensure you submit before the deadline.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Add Assignment Form */}
        <form onSubmit={handleAddAssignment} className="form-input-group">
          <input
            type="text"
            placeholder="Course Name (e.g. CS 101)"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Assignment Title (e.g. Essay 2)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ flex: 1.5 }}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            required
          />
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Assignment["status"])}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Track Item
          </button>
        </form>

        {/* Assignments Table */}
        <div className="assignment-table-container">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assignment</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td style={{ fontWeight: 600, color: "var(--foreground)" }}>{assignment.course}</td>
                  <td>{assignment.title}</td>
                  <td style={{ color: "var(--muted-foreground)" }}>{assignment.dueDate}</td>
                  <td>
                    <select
                      value={assignment.status}
                      onChange={(e) => handleStatusChange(assignment.id, e.target.value as Assignment["status"])}
                      style={{
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--destructive)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                    No assignments found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
