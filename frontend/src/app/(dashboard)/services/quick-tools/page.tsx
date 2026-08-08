"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CourseGrade {
  id: string;
  credits: number;
  grade: string;
}

export default function QuickToolsPage() {
  // Tool 1: GPA Calculator
  const [courses, setCourses] = useState<CourseGrade[]>([
    { id: "1", credits: 4, grade: "A" },
    { id: "2", credits: 3, grade: "B" },
    { id: "3", credits: 4, grade: "A" }
  ]);
  const [newCredits, setNewCredits] = useState(3);
  const [newGrade, setNewGrade] = useState("A");

  // Tool 2: Text Formatter
  const [textInput, setTextInput] = useState("");

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: CourseGrade = {
      id: Date.now().toString(),
      credits: newCredits,
      grade: newGrade
    };
    setCourses([...courses, course]);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Calculate GPA
  const totalCredits = courses.reduce((acc, curr) => acc + curr.credits, 0);
  const totalPoints = courses.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 0) * curr.credits, 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  // Case conversions
  const handleCaseChange = (type: "upper" | "lower" | "camel" | "slug") => {
    if (!textInput) return;
    if (type === "upper") {
      setTextInput(textInput.toUpperCase());
    } else if (type === "lower") {
      setTextInput(textInput.toLowerCase());
    } else if (type === "camel") {
      const camel = textInput
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
        .replace(/\s+/g, "");
      setTextInput(camel);
    } else if (type === "slug") {
      const slug = textInput
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setTextInput(slug);
    }
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Quick Tools</h1>
          <p>Handy converters, GPA calculators, and helper utility widgets for rapid calculations.</p>
        </div>
      </div>

      <div className="service-content-card">
        <div className="quick-tools-grid">
          
          {/* GPA Calculator */}
          <div className="tool-widget-card">
            <h3>GPA Calculator</h3>
            <form onSubmit={handleAddCourse} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="number"
                placeholder="Credits"
                value={newCredits || ""}
                onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
                min="1"
                max="6"
                required
                style={{
                  padding: "0.5rem",
                  fontSize: "0.85rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  width: "80px"
                }}
              />
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                style={{
                  padding: "0.5rem",
                  fontSize: "0.85rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  flex: 1
                }}
              >
                {Object.keys(gradePoints).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: "0.5rem 1rem" }}>
                Add
              </button>
            </form>

            <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {courses.map((course) => (
                <div key={course.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", padding: "0.4rem 0.6rem", background: "var(--secondary)", borderRadius: "6px" }}>
                  <span>Credits: <strong>{course.credits}</strong>, Grade: <strong>{course.grade}</strong></span>
                  <button onClick={() => handleDeleteCourse(course.id)} style={{ background: "transparent", border: "none", color: "var(--destructive)", cursor: "pointer", fontWeight: "bold" }}>✕</button>
                </div>
              ))}
            </div>

            <div className="widget-result">
              Semester GPA: <span style={{ fontSize: "1.2rem", color: "var(--primary)" }}>{gpa}</span>
              <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", fontWeight: "normal", marginTop: "2px" }}>
                Total Credits: {totalCredits}
              </div>
            </div>
          </div>

          {/* Text Formatter */}
          <div className="tool-widget-card">
            <h3>Text Formatter</h3>
            <textarea
              placeholder="Type or paste text here to convert casing..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                fontSize: "0.85rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
                resize: "none",
                marginBottom: "1rem"
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => handleCaseChange("upper")} className="btn btn-secondary btn-sm">UPPERCASE</button>
              <button onClick={() => handleCaseChange("lower")} className="btn btn-secondary btn-sm">lowercase</button>
              <button onClick={() => handleCaseChange("camel")} className="btn btn-secondary btn-sm">camelCase</button>
              <button onClick={() => handleCaseChange("slug")} className="btn btn-secondary btn-sm">kebab-case</button>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--muted-foreground)", textAlign: "center" }}>
              Characters: {textInput.length} | Words: {textInput.trim() ? textInput.trim().split(/\s+/).length : 0}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
