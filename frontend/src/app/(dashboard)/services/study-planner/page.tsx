"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface StudyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export default function StudyPlannerPage() {
  // Timer states
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Study goals
  const [goals, setGoals] = useState<StudyGoal[]>([
    { id: "1", text: "Read 2 chapters of Physics II textbook", completed: false },
    { id: "2", text: "Review binary trees code implementations", completed: true },
    { id: "3", text: "Outline English Literature research essay", completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState("");

  const modeTimes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    setTimeLeft(modeTimes[mode]);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Optional: play alert sound
            alert(`Timer complete! Time for a break or start studying!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Goals CRUD
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText) return;

    const goal: StudyGoal = {
      id: Date.now().toString(),
      text: newGoalText,
      completed: false
    };

    setGoals([...goals, goal]);
    setNewGoalText("");
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Study Planner & Pomodoro</h1>
          <p>Boost your productivity with the Pomodoro technique and track your daily session targets.</p>
        </div>
      </div>

      <div className="service-content-card">
        <div className="study-planner-container">
          {/* Pomodoro Timer widget */}
          <div className="pomodoro-container">
            <div className="pomodoro-modes">
              <button
                className={`pomodoro-mode-btn ${mode === "pomodoro" ? "active" : ""}`}
                onClick={() => setMode("pomodoro")}
              >
                Pomodoro
              </button>
              <button
                className={`pomodoro-mode-btn ${mode === "shortBreak" ? "active" : ""}`}
                onClick={() => setMode("shortBreak")}
              >
                Short Break
              </button>
              <button
                className={`pomodoro-mode-btn ${mode === "longBreak" ? "active" : ""}`}
                onClick={() => setMode("longBreak")}
              >
                Long Break
              </button>
            </div>

            <div className="pomodoro-timer">{formatTime(timeLeft)}</div>

            <div className="pomodoro-buttons">
              <button onClick={toggleTimer} className="btn btn-primary btn-lg">
                {isRunning ? "Pause" : "Start"}
              </button>
              <button onClick={resetTimer} className="btn btn-secondary btn-lg">
                Reset
              </button>
            </div>
          </div>

          {/* Today's Goals checklist */}
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>Today's Study Targets</h2>
            
            <form onSubmit={handleAddGoal} className="form-input-group">
              <input
                type="text"
                placeholder="e.g. Solve 5 calculus problems"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                Add Target
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    opacity: goal.completed ? 0.6 : 1,
                    textDecoration: goal.completed ? "line-through" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoal(goal.id)}
                      style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--primary)" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "var(--foreground)" }}>{goal.text}</span>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
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
              ))}
              {goals.length === 0 && (
                <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
                  No study goals set. Add one to keep track!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
