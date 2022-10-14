import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface ProtectedProps {
  children?: React.ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const location = useLocation();
  const { token } = useAuth();
  const hash = window.location.hash;
  if (!hash && !token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};
export default Protected;
