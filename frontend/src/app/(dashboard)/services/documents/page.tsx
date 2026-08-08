"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DocFile {
  id: string;
  name: string;
  folder: string;
  size: string;
  date: string;
}

export default function DocumentsPage() {
  const folders = ["Mathematics", "Computer Science", "Physics", "General"];
  
  const [files, setFiles] = useState<DocFile[]>([
    { id: "1", name: "Calculus_Homework_3.pdf", folder: "Mathematics", size: "1.4 MB", date: "2026-08-01" },
    { id: "2", name: "CS101_Lecture_4_Slides.pdf", folder: "Computer Science", size: "4.2 MB", date: "2026-08-04" },
    { id: "3", name: "Physics_Lab_Report_Final.docx", folder: "Physics", size: "850 KB", date: "2026-08-05" },
    { id: "4", name: "Term_Schedule_2026.pdf", folder: "General", size: "320 KB", date: "2026-08-02" }
  ]);

  const [selectedFolder, setSelectedFolder] = useState("Mathematics");
  const [newFileName, setNewFileName] = useState("");

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    const file: DocFile = {
      id: Date.now().toString(),
      name: newFileName.endsWith(".pdf") || newFileName.endsWith(".docx") ? newFileName : `${newFileName}.pdf`,
      folder: selectedFolder,
      size: `${(Math.random() * 5 + 0.1).toFixed(1)} MB`,
      date: new Date().toISOString().split("T")[0]
    };

    setFiles([...files, file]);
    setNewFileName("");
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>My Documents</h1>
          <p>Organize worksheets, assignments, lab sheets, and ebooks by subject folders.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Upload Doc Form */}
        <form onSubmit={handleAddFile} className="form-input-group">
          <input
            type="text"
            placeholder="Document Name (e.g. Lab_Report_2)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            required
            style={{ flex: 2 }}
          />
          <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
            {folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Upload Mock File
          </button>
        </form>

        {/* Folders Section */}
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem" }}>Directories</h3>
        <div className="documents-grid" style={{ marginBottom: "2.5rem" }}>
          {folders.map((folder) => {
            const count = files.filter((f) => f.folder === folder).length;
            return (
              <div key={folder} className="doc-folder-card">
                <span className="doc-folder-icon">📂</span>
                <span className="doc-folder-title">{folder}</span>
                <span className="doc-folder-meta">{count} files</span>
              </div>
            );
          })}
        </div>

        {/* Recent Files Table */}
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem" }}>All Files</h3>
        <div className="assignment-table-container">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Subject Directory</th>
                <th>File Size</th>
                <th>Uploaded On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td style={{ fontWeight: 600, color: "var(--foreground)" }}>📄 {file.name}</td>
                  <td>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        background: "rgba(139, 92, 246, 0.15)",
                        color: "rgb(139, 92, 246)"
                      }}
                    >
                      {file.folder}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted-foreground)" }}>{file.size}</td>
                  <td style={{ color: "var(--muted-foreground)" }}>{file.date}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
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
              {files.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                    No documents found. Upload files to display them.
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
