"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: "Food" | "Transport" | "Rent" | "Study Materials" | "Leisure";
  date: string;
}

export default function ExpensesPage() {
  const [budget, setBudget] = useState(5000); // monthly budget
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", title: "Chemistry Textbook", amount: 1200, category: "Study Materials", date: "2026-08-02" },
    { id: "2", title: "Monthly Metro Pass", amount: 800, category: "Transport", date: "2026-08-01" },
    { id: "3", title: "Pizza Night with Friends", amount: 650, category: "Food", date: "2026-08-04" },
    { id: "4", title: "Notebooks and Pens", amount: 350, category: "Study Materials", date: "2026-08-06" }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newCategory, setNewCategory] = useState<Transaction["category"]>("Food");
  const [newDate, setNewDate] = useState("");

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || newAmount <= 0 || !newDate) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      title: newTitle,
      amount: newAmount,
      category: newCategory,
      date: newDate
    };

    setTransactions([...transactions, transaction]);
    setNewTitle("");
    setNewAmount(0);
    setNewCategory("Food");
    setNewDate("");
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = budget - totalSpent;

  return (
    <div className="service-page">
      <div className="service-page-header">
        <Link href="/dashboard" className="back-btn">
          ←
        </Link>
        <div className="service-title-container">
          <h1>Expense Tracker</h1>
          <p>Manage your monthly academic budget and log transactions dynamically.</p>
        </div>
      </div>

      <div className="service-content-card">
        {/* Budget Overview Cards */}
        <div className="expense-overview">
          <div className="overview-card">
            <div className="overview-label">Monthly Budget</div>
            <div className="overview-value" style={{ color: "var(--primary)" }}>
              ₹{budget}
              <div style={{ marginTop: "0.25rem" }}>
                <input
                  type="number"
                  placeholder="Set budget"
                  value={budget || ""}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  style={{
                    fontSize: "0.8rem",
                    padding: "2px 8px",
                    width: "100px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    textAlign: "center"
                  }}
                />
              </div>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-label">Total Spent</div>
            <div className="overview-value spent">₹{totalSpent}</div>
          </div>
          <div className="overview-card">
            <div className="overview-label">Remaining Balance</div>
            <div className="overview-value remaining">₹{remainingBudget}</div>
          </div>
        </div>

        {/* Add Transaction Form */}
        <form onSubmit={handleAddTransaction} className="form-input-group">
          <input
            type="text"
            placeholder="Expense Detail (e.g. Groceries)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ flex: 1.5 }}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={newAmount || ""}
            onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
            required
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Transaction["category"])}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Rent">Rent</option>
            <option value="Study Materials">Study Materials</option>
            <option value="Leisure">Leisure</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Log Expense
          </button>
        </form>

        {/* Transactions Table */}
        <div className="assignment-table-container" style={{ marginTop: "1rem" }}>
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600, color: "var(--foreground)" }}>{t.title}</td>
                  <td>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        background: "rgba(34, 197, 94, 0.15)",
                        color: "rgb(34, 197, 94)"
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted-foreground)" }}>{t.date}</td>
                  <td style={{ fontWeight: "bold", color: "var(--destructive)" }}>₹{t.amount}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteTransaction(t.id)}
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
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                    No expenses logged yet. Save money!
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
