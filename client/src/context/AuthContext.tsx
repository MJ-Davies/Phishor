/**
 * Purpose: Handles authentication context to ensure that user has been authorized to access via JWT token
 */
import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { API_BASE_URL } from "../config";

// Define context type
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
}

// Define token payload type
interface JwtPayload {
  exp: number;
  [key: string]: any;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Purpose: Custom hook to use authentication state
// Parameters: None
// Returns: AuthContextType
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Purpose: The provider component that wraps authentication and functions
// Parameters: children
// Returns: None
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Purpose: VAlidates the JWT token
  // Parameters: None
  // Returns: None
  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwt");

    // Check if token exists
    if (!token) {
      console.log("No token found.");
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Decode and checks expiration
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        console.log("Token expired.");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      // Verifies that token is valid with the backend
      const response = await fetch(`${API_BASE_URL}/api/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error("Error validating token:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Purpose: Runs checkAuthentication on mount and listens on localStorage for changes
  // Parameters: None
  // Returns: None
  useEffect(() => {
    checkAuthentication();

    const handleStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};