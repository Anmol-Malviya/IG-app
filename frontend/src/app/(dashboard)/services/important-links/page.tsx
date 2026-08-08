"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: "University Portals" | "Coding & Learning" | "Tools & Math" | "Entertainment";
  desc: string;
}

export default function ImportantLinksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: "1",
      title: "Student Portal (LMS)",
      url: "https://lms.university.edu",
      category: "University Portals",
      desc: "University login portal to view registered courses, syllabi, grades, and attendance."
    },
    {
      id: "2",
      title: "GitHub Web",
      url: "https://github.com",
      category: "Coding & Learning",
      desc: "Version control repo platform for managing projects, submissions, and code reviews."
    },
    {
      id: "3",
      title: "Desmos Graphing Calculator",
      url: "https://www.desmos.com/calculator",
      category: "Tools & Math",
      desc: "A beautiful free online graphing calculator to visualize math functions and equations."
    },
    {
      id: "4",
      title: "Stack Overflow",
      url: "https://stackoverflow.com",
      category: "Coding & Learning",
      desc: "Collaborative developer Q&A forum for quick code fixes and debugging."
    }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<Bookmark["category"]>("University Portals");
  const [newDesc, setNewDesc] = useState("");

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    // Auto-prefix http/https if missing
    let formattedUrl = newUrl;
    if (!/^https?:\/\//i.test(newUrl)) {
      formattedUrl = `https://${newUrl}`;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      title: newTitle,
      url: formattedUrl,
      category: newCategory,
      desc: newDesc || "No description provided."
    };

    setBookmarks([...bookmarks, bookmark]);
    setNewTitle("");
    setNewUrl("");
    setNewCategory("University Portals");
    setNewDesc("");
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "link";
    }
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Important Links</h1>
          <p>Bookmarked shortcuts, college administration sites, and educational references.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Add Bookmark Form */}
        <form onSubmit={handleAddBookmark} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", backgroundColor: "var(--background)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>Add New Link</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Portal Title (e.g. LMS)"
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
                outline: "none"
              }}
            />
            <input
              type="text"
              placeholder="URL (e.g. lms.university.edu)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none"
              }}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Bookmark["category"])}
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.875rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="University Portals">University Portals</option>
              <option value="Coding & Learning">Coding & Learning</option>
              <option value="Tools & Math">Tools & Math</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Brief Description of this portal..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.875rem",
              borderRadius: "var(--radius)",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              outline: "none"
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end" }}>
            Add Bookmark
          </button>
        </form>

        {/* Bookmarks Grid Display */}
        <div className="bookmarks-grid">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bookmark-card">
              <div className="bookmark-header">
                <span className="bookmark-domain">{getDomain(bookmark.url)}</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "rgba(14, 165, 233, 0.15)",
                    color: "rgb(14, 165, 233)",
                    fontWeight: "bold"
                  }}
                >
                  {bookmark.category}
                </span>
              </div>
              <h3 className="bookmark-title">{bookmark.title}</h3>
              <p className="bookmark-desc">{bookmark.desc}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
                <a
                  href={bookmark.url}
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--primary)", padding: 0, fontWeight: "bold" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Portal ↗
                </a>
                <button
                  onClick={() => handleDeleteBookmark(bookmark.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--destructive)",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {bookmarks.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              No important links saved yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
