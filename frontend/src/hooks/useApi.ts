"use client";

import { useState, useCallback } from "react";
import { api, ApiError } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for API calls with loading/error state management.
 *
 * @example
 * const { data, isLoading, error, execute } = useApi<User[]>();
 * useEffect(() => { execute(() => api.get("/users")); }, []);
 */
export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<{ success: boolean; data: T; message: string }>
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiCall();
      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "An error occurred";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
