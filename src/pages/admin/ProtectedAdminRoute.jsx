// src/components/admin/ProtectedAdminRoute.jsx

import React from 'react';
import { Navigate } from "react-router-dom";

/**
 * A utility function to safely retrieve and parse admin information from localStorage.
 * This prevents the application from crashing if the 'adminInfo' key contains invalid JSON.
 * @returns {object|null} The parsed admin info object or null if not found or invalid.
 */
const getAdminInfo = () => {
  try {
    const adminInfo = localStorage.getItem("adminInfo");
    // Return the parsed object if it exists, otherwise return null
    return adminInfo ? JSON.parse(adminInfo) : null;
  } catch (error) {
    // Log the error for debugging purposes and return null
    console.error("Failed to parse adminInfo from localStorage", error);
    return null;
  }
};

/**
 * A component that protects routes by checking for admin status.
 * It renders its children only if the user is an admin; otherwise, it redirects.
 * @param {object} props The component props.
 * @param {React.ReactNode} props.children The child components to render if the user is an admin.
 * @returns {React.ReactNode} The children or a Navigate component.
 */
const ProtectedAdminRoute = ({ children }) => {
  // Use the safe utility function to get the admin info.
  const adminInfo = getAdminInfo();
  
  // A boolean to clearly represent the user's admin status.
  const isAdmin = adminInfo?.isAdmin === true;

  // If the user is not an admin, navigate them to the login page.
  // The 'replace' prop ensures the browser history is replaced, so
  // they can't simply click 'back' to get to the protected page.
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // If the user is an admin, render the child components.
  return children;
};

export default ProtectedAdminRoute;