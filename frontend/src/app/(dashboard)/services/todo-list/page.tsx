"use client";

import React, { useState } from "react";
import Link from "next/link";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Buy chemistry lab notebook", completed: false },
    { id: "2", text: "Email professor regarding CS homework question", completed: false },
    { id: "3", text: "Print lecture slides for Monday", completed: true },
    { id: "4", text: "Return library books", completed: false }
  ]);

  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo) return;

    const item: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false
    };

    setTodos([...todos, item]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>To-Do List</h1>
          <p>Organize your daily tasks, household chores, and quick checkpoints.</p>
        </div>
      </div>

      <div className="service-content-card">
        <div className="todo-container">
          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="form-input-group">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Add Task
            </button>
          </form>

          {/* Filter options */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border)",
              flexWrap: "wrap",
              gap: "0.75rem"
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setFilter("all")}
                className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`btn btn-sm ${filter === "active" ? "btn-primary" : "btn-ghost"}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`btn btn-sm ${filter === "completed" ? "btn-primary" : "btn-ghost"}`}
              >
                Completed
              </button>
            </div>
            
            {todos.some((t) => t.completed) && (
              <button
                onClick={clearCompleted}
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--destructive)" }}
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Checklist Items */}
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <div className="todo-left">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="todo-delete">
                  Delete
                </button>
              </div>
            ))}
            {filteredTodos.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                No tasks found. Relax or add a task!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
