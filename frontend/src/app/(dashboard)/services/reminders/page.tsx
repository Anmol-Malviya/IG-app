"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Reminder {
  id: string;
  title: string;
  category: "Academic" | "Personal" | "Exam" | "Social";
  dueDate: string;
  completed: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", title: "Submit Mathematics Assignment 4", category: "Academic", dueDate: "Today, 11:59 PM", completed: false },
    { id: "2", title: "Doctor Appointment", category: "Personal", dueDate: "Tomorrow, 04:30 PM", completed: false },
    { id: "3", title: "Register for Physics Exam", category: "Exam", dueDate: "12 Aug 2026, 12:00 PM", completed: false },
    { id: "4", title: "Team Project Brainstorming Session", category: "Academic", dueDate: "15 Aug 2026, 02:00 PM", completed: true }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Reminder["category"]>("Academic");
  const [newDueDate, setNewDueDate] = useState("");

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      dueDate: newDueDate,
      completed: false
    };

    setReminders([reminder, ...reminders]);
    setNewTitle("");
    setNewDueDate("");
  };

  const toggleComplete = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Reminders & Notifications</h1>
          <p>Get alerts and notifications for your deadlines, events, and tasks.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Create Reminder Form */}
        <form onSubmit={handleAddReminder} className="form-input-group">
          <input
            type="text"
            placeholder="Add new reminder (e.g. Call Advisor)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ flex: 2 }}
          />
          <input
            type="text"
            placeholder="Due date (e.g. Today, 5 PM)"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            required
          />
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Reminder["category"])}>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
            <option value="Exam">Exam</option>
            <option value="Social">Social</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Remind Me
          </button>
        </form>

        {/* Reminders List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                opacity: reminder.completed ? 0.6 : 1,
                textDecoration: reminder.completed ? "line-through" : "none",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={() => toggleComplete(reminder.id)}
                  style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--primary)" }}
                />
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      marginRight: "0.5rem",
                      background:
                        reminder.category === "Academic"
                          ? "rgba(139, 92, 246, 0.15)"
                          : reminder.category === "Personal"
                          ? "rgba(245, 158, 11, 0.15)"
                          : reminder.category === "Exam"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(16, 185, 129, 0.15)",
                      color:
                        reminder.category === "Academic"
                          ? "rgb(139, 92, 246)"
                          : reminder.category === "Personal"
                          ? "rgb(245, 158, 11)"
                          : reminder.category === "Exam"
                          ? "rgb(239, 68, 68)"
                          : "rgb(16, 185, 129)"
                    }}
                  >
                    {reminder.category}
                  </span>
                  <strong style={{ fontSize: "0.95rem", color: "var(--foreground)" }}>{reminder.title}</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                    ⏰ Due: {reminder.dueDate}
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteReminder(reminder.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--destructive)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}
              >
                Delete
              </button>
            </div>
          ))}
          {reminders.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              No reminders set. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
