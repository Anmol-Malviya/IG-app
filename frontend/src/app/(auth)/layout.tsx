import React from "react";

/**
 * Auth layout — passthrough wrapper.
 * Each auth page (login/register) manages its own full-page layout.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
