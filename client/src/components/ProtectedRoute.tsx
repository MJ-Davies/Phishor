/**
 * Purpose: A component to declare which webpages require a user login
 */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Purpose: For any webpage with Protectedroute element, redirect to login if authentication not valid
// Parameters: children(React.ReactNode)
// Returns: React Element
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div></div> // Wait for loading to finish
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;