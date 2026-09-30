import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminProtectedRoute: React.FC = () => {
  const { currentGovUser } = useAuth();
  const location = useLocation();

  if (!currentGovUser) {
    return <Navigate to="/government/login" state={{ from: location }} replace />;
  }

  const isAdmin = ['System Administrator', 'State Administrator'].includes(
    String(currentGovUser.officialRole)
  );

  if (!isAdmin) {
    return <Navigate to="/government/dashboard" replace />;
  }

  return <Outlet />;
};
