"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

/**
 * AuthProvider — checks session on mount and provides auth context.
 * Renders children immediately; loading state is handled by individual pages.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}
