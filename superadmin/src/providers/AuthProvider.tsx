"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { AuthUser, AuthTokens, setAuth, getUser, clearAuth, isAuthenticated } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser && isAuthenticated()) {
      // Verify the user is a superadmin
      if (storedUser.role === "superadmin") {
        setUser(storedUser);
      } else {
        clearAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{
      user: AuthUser;
      tokens: AuthTokens;
    }>("/auth/login", { email, password });

    if (response.success && response.data) {
      // Only allow superadmin access
      if (response.data.user.role !== "superadmin") {
        clearAuth();
        throw new Error("Access denied. Superadmin privileges required.");
      }
      setAuth(response.data.user, response.data.tokens);
      setUser(response.data.user);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
