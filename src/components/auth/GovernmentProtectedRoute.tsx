import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const GovernmentProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { currentGovUser } = useAuth();
  const location = useLocation();

  if (!currentGovUser) {
    return <Navigate to="/government/login" state={{ from: location }} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};
