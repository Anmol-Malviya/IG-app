"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  body: string;
  category: string;
  date: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Newtonian Mechanics Basics",
      body: "Force = mass * acceleration. Friction acts opposite to the direction of relative motion. Static friction limit is greater than kinetic friction.",
      category: "Physics",
      date: "2026-08-01"
    },
    {
      id: "2",
      title: "Binary Tree Traversals",
      body: "Preorder: Root -> Left -> Right\nInorder: Left -> Root -> Right\nPostorder: Left -> Right -> Root\nBreadth First uses a queue; Depth First uses a stack or recursion.",
      category: "Computer Science",
      date: "2026-08-03"
    },
    {
      id: "3",
      title: "Chemistry Lab Safety Rules",
      body: "Always wear safety goggles. Never ingest chemicals. Pour acid slowly into water (A&W), never water into acid.",
      category: "Chemistry",
      date: "2026-08-05"
    }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBody) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newTitle,
      body: newBody,
      category: newCategory,
      date: new Date().toISOString().split("T")[0]
    };

    setNotes([note, ...notes]);
    setNewTitle("");
    setNewBody("");
    setNewCategory("General");
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>My Lecture Notes</h1>
          <p>Quickly capture study summaries, code snippets, and research insights.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Search Notes & Write Note toggle */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search notes by keyword or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.875rem",
              borderRadius: "var(--radius)",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              outline: "none",
              flex: 1
            }}
          />
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", backgroundColor: "var(--background)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>Create New Note</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Note Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
                flex: 1
              }}
            />
            <input
              type="text"
              placeholder="Subject / Category (e.g. History)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
                width: "200px"
              }}
            />
          </div>
          <textarea
            placeholder="Start typing your note details here..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            required
            rows={4}
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.875rem",
              borderRadius: "var(--radius)",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              outline: "none",
              resize: "vertical"
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end" }}>
            Save Note
          </button>
        </form>

        {/* Notes Grid Display */}
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <span
                style={{
                  alignSelf: "flex-start",
                  fontSize: "0.7rem",
                  padding: "2px 8px",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "rgb(16, 185, 129)",
                  fontWeight: 600
                }}
              >
                {note.category}
              </span>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-body">{note.body}</p>
              <div className="note-footer">
                <span>{note.date}</span>
                <button onClick={() => handleDeleteNote(note.id)} className="note-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              No notes found. Create a new one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
