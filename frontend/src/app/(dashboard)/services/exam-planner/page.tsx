"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Exam {
  id: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  syllabusCovered: number; // percentage
}

export default function ExamPlannerPage() {
  const [exams, setExams] = useState<Exam[]>([
    { id: "1", subject: "Advanced Mathematics", topic: "Midterm: Calculus II", date: "2026-08-20", time: "10:00 AM", syllabusCovered: 75 },
    { id: "2", subject: "Computer Science I", topic: "Final Exam: Algorithms & Trees", date: "2026-08-28", time: "02:00 PM", syllabusCovered: 45 },
    { id: "3", subject: "Physics II", topic: "Quiz 3: Electromagnetism", date: "2026-08-14", time: "09:00 AM", syllabusCovered: 90 }
  ]);

  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newSyllabusCovered, setNewSyllabusCovered] = useState(0);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newTopic || !newDate || !newTime) return;

    const exam: Exam = {
      id: Date.now().toString(),
      subject: newSubject,
      topic: newTopic,
      date: newDate,
      time: newTime,
      syllabusCovered: newSyllabusCovered
    };

    setExams([...exams, exam]);
    setNewSubject("");
    setNewTopic("");
    setNewDate("");
    setNewTime("");
    setNewSyllabusCovered(0);
  };

  const handleSyllabusChange = (id: string, covered: number) => {
    setExams(
      exams.map((e) => (e.id === id ? { ...e, syllabusCovered: Math.min(100, Math.max(0, covered)) } : e))
    );
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Exam Planner</h1>
          <p>Organize your test schedule and monitor your syllabus preparation progress.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Add Exam Form */}
        <form onSubmit={handleAddExam} className="form-input-group">
          <input
            type="text"
            placeholder="Subject Name (e.g. Physics)"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Exam Topic (e.g. Midterm)"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            required
            style={{ flex: 1.5 }}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Time (e.g. 10:00 AM)"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Syllabus % (0-100)"
            value={newSyllabusCovered || ""}
            onChange={(e) => setNewSyllabusCovered(parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            style={{ width: "120px" }}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Schedule Exam
          </button>
        </form>

        {/* Exams List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
          {exams.map((exam) => {
            const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            return (
              <div
                key={exam.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.5rem",
                  borderRadius: "var(--radius)",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        background: "rgba(59, 130, 246, 0.15)",
                        color: "rgb(59, 130, 246)"
                      }}
                    >
                      {exam.subject}
                    </span>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.5rem", color: "var(--foreground)" }}>{exam.topic}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.2rem" }}>
                      📅 {exam.date} @ {exam.time}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        display: "inline-block",
                        background: daysLeft > 3 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: daysLeft > 3 ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)",
                        fontWeight: "bold"
                      }}
                    >
                      {daysLeft > 0 ? `${daysLeft} Days Left` : daysLeft === 0 ? "Today" : "Completed"}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                    <span>Syllabus Covered</span>
                    <strong>{exam.syllabusCovered}%</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "var(--border)", overflow: "hidden", display: "flex", alignItems: "center" }}>
                    <div style={{ width: `${exam.syllabusCovered}%`, height: "100%", background: "linear-gradient(90deg, var(--primary) 0%, rgb(59, 130, 246) 100%)", borderRadius: "4px" }} />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Update Prep:</span>
                    <button
                      onClick={() => handleSyllabusChange(exam.id, exam.syllabusCovered - 10)}
                      className="btn btn-ghost"
                      style={{ padding: "2px 8px", fontSize: "0.75rem", minHeight: 0, height: "auto" }}
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleSyllabusChange(exam.id, exam.syllabusCovered + 10)}
                      className="btn btn-ghost"
                      style={{ padding: "2px 8px", fontSize: "0.75rem", minHeight: 0, height: "auto" }}
                    >
                      +10%
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    background: "transparent",
                    border: "none",
                    color: "var(--destructive)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
              </div>
            );
          })}
          {exams.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              No upcoming exams scheduled. Great job!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
