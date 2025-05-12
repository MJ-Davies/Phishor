import { createContext, useContext, useState, useEffect } from "react";

// Define context type
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use authentication state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        console.log("No token found.");
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/protected", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Error connecting to the server:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
    window.addEventListener("storage", () => {
      checkAuthentication();
    });

    return () => {
      window.removeEventListener("storage", () => {
        checkAuthentication();
      });
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};