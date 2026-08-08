"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth2-page">
      {/* Blobs */}
      <div className="auth2-blob auth2-blob-1" />
      <div className="auth2-blob auth2-blob-2" />

      <div className="auth2-card auth2-card-wide">
        {/* Top mini-brand */}
        <div className="auth2-brand">
          <div className="auth2-logo-wrap">
            <Image src="/auth-hero.png" alt="IG App" width={64} height={64} className="auth2-logo-img" />
          </div>
          <h1 className="auth2-title">Create Account</h1>
          <p className="auth2-subtitle">Join IG App today</p>
        </div>

        {error && (
          <div className="auth2-alert" role="alert">
            <span className="auth2-alert-icon">⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth2-form">
          <div className="auth2-form-row">
            <div className="auth2-field">
              <label htmlFor="firstName">First name</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">👤</span>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
            </div>
            <div className="auth2-field">
              <label htmlFor="lastName">Last name</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">👤</span>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

          <div className="auth2-field">
            <label htmlFor="email">Email address</label>
            <div className="auth2-input-wrap">
              <span className="auth2-input-icon">✉</span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth2-field">
            <label htmlFor="password">Password</label>
            <div className="auth2-input-wrap">
              <span className="auth2-input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth2-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {/* Password strength indicator */}
            {formData.password && (
              <div className="auth2-strength">
                <div
                  className={`auth2-strength-bar ${
                    formData.password.length < 6
                      ? "weak"
                      : formData.password.length < 10
                      ? "medium"
                      : "strong"
                  }`}
                />
                <span>
                  {formData.password.length < 6
                    ? "Weak"
                    : formData.password.length < 10
                    ? "Medium"
                    : "Strong"}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="auth2-submit-btn"
            disabled={isLoading}
            id="btn-register-submit"
          >
            {isLoading ? <span className="auth2-spinner" /> : "Create Account"}
          </button>
        </form>

        <div className="auth2-divider">
          <span>or</span>
        </div>

        <p className="auth2-switch">
          Already have an account?{" "}
          <Link href="/login" id="link-to-login">Login</Link>
        </p>

        <Link href="/" className="auth2-back-link" id="link-back-home-register">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
