import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

export function RequireAuth({ children }: {children: React.ReactNode;}) {
  const { isAuthenticated } = useAppData();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}