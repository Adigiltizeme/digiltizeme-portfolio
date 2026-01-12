import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import QuestionnairePage from './pages/QuestionnairePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Wrapper
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes - Wrapped in MainLayout */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/plan" element={<MainLayout><QuestionnairePage /></MainLayout>} />

        {/* Admin Routes - No Public Layout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        } />

        {/* Redirect /admin to /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App;
