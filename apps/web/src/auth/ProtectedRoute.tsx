import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { ActorRole } from "@umb/shared";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  role: ActorRole;
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { status, actor } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div className="workspace-placeholder">Verificando sesión...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ reason: "unauthenticated", from: location.pathname }}
      />
    );
  }

  if (actor?.activeRole !== role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ reason: "forbidden", from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
