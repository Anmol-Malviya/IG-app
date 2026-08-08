"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  type: "Slide" | "Code" | "PDF" | "Spreadsheet" | "Link";
  course: string;
  url: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(
    [
      { id: "1", name: "Calculus Limits Cheat Sheet", type: "PDF", course: "Advanced Mathematics", url: "#" },
      { id: "2", name: "Binary Tree Traversals Code", type: "Code", course: "Computer Science I", url: "#" },
      { id: "3", name: "Electromagnetism Lecture Slides", type: "Slide", course: "Physics II", url: "#" },
      { id: "4", name: "GPA Calculator Spreadsheet", type: "Spreadsheet", course: "General", url: "#" }
    ]
  );

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<Resource["type"]>("Link");
  const [newCourse, setNewCourse] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCourse || !newUrl) return;

    const resource: Resource = {
      id: Date.now().toString(),
      name: newName,
      type: newType,
      course: newCourse,
      url: newUrl
    };

    setResources([...resources, resource]);
    setNewName("");
    setNewType("Link");
    setNewCourse("");
    setNewUrl("");
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "PDF": return "📄";
      case "Code": return "💻";
      case "Slide": return "📊";
      case "Spreadsheet": return "📈";
      default: return "🔗";
    }
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Resources & Materials</h1>
          <p>Organize worksheets, cheat sheets, past exam papers, and codebase repos in one repository.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Add Resource Form */}
        <form onSubmit={handleAddResource} className="form-input-group">
          <input
            type="text"
            placeholder="Resource Title (e.g. Syllabus)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ flex: 1.5 }}
          />
          <input
            type="text"
            placeholder="Course/Subject (e.g. Physics)"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Resource Link (URL)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
          />
          <select value={newType} onChange={(e) => setNewType(e.target.value as Resource["type"])}>
            <option value="PDF">PDF File</option>
            <option value="Code">Code / Repository</option>
            <option value="Slide">Lecture Slide</option>
            <option value="Spreadsheet">Spreadsheet</option>
            <option value="Link">Web Link</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Save Material
          </button>
        </form>

        {/* Resources Grid Display */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "1.5rem" }}>
          {resources.map((resource) => (
            <div
              key={resource.id}
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: "8px",
                    background: "rgba(168, 85, 247, 0.15)",
                    color: "rgb(168, 85, 247)",
                    fontWeight: 600
                  }}
                >
                  {resource.course}
                </span>
                <span style={{ fontSize: "1.3rem" }}>{getIcon(resource.type)}</span>
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", marginTop: "0.5rem" }}>{resource.name}</h3>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
                <a
                  href={resource.url}
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--primary)", padding: 0, fontWeight: "bold" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resource
                </a>
                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--destructive)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {resources.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              No resources stored yet. Upload one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
