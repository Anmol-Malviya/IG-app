"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth2-page">
      {/* Blobs */}
      <div className="auth2-blob auth2-blob-1" />
      <div className="auth2-blob auth2-blob-2" />

      <div className="auth2-card">
        {/* Top mini-brand */}
        <div className="auth2-brand">
          <div className="auth2-logo-wrap">
            <Image src="/auth-hero.png" alt="IG App" width={64} height={64} className="auth2-logo-img" />
          </div>
          <h1 className="auth2-title">Welcome Back</h1>
          <p className="auth2-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="auth2-alert" role="alert">
            <span className="auth2-alert-icon">⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth2-form">
          <div className="auth2-field">
            <label htmlFor="email">Email address</label>
            <div className="auth2-input-wrap">
              <span className="auth2-input-icon">✉</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            className="auth2-submit-btn"
            disabled={isLoading}
            id="btn-login-submit"
          >
            {isLoading ? (
              <span className="auth2-spinner" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="auth2-divider">
          <span>or</span>
        </div>

        <p className="auth2-switch">
          Don&apos;t have an account?{" "}
          <Link href="/register" id="link-to-register">Sign Up</Link>
        </p>

        <Link href="/" className="auth2-back-link" id="link-back-home">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
