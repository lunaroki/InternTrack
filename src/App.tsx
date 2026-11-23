import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppDataProvider } from './contexts/AppDataContext';
import { AppLayout } from './components/layout/AppLayout';
import { RequireAuth } from './components/auth/RequireAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Internships } from './pages/Internships';
import { Applications } from './pages/Applications';
import { Calendar } from './pages/Calendar';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

interface AppProps {
  startSignedIn?: boolean;
}

export function App({ startSignedIn = false }: AppProps) {
  return (
    <AppDataProvider key={String(startSignedIn)} initialAuthenticated={startSignedIn}>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
            <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }>
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>);

}