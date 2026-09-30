import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const CitizenProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/citizen/login" state={{ from: location }} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

