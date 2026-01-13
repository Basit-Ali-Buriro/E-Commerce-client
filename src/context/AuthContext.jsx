// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const [user, setUser] = useState(null);

  // Load user data if token exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      apiClient
        .get("/users/me")
        .then((res) => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    // Fetch user details after login
    apiClient
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
