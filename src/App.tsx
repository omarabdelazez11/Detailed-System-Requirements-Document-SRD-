import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { bookingService } from './services/bookingService';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthorityManagementPage from './pages/AuthorityManagementPage';
import ManagerApprovalPage from './pages/ManagerApprovalPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isLoading } = useAuth();
  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#3b82f6', fontWeight: 'bold' }}>
      Loading AASTMT System...
    </div>
  );
  return userProfile ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  // SEED INITIAL DATA
  useEffect(() => {
    bookingService.seedInitialData();
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/authority" element={<PrivateRoute><AuthorityManagementPage /></PrivateRoute>} />
            <Route path="/final-approvals" element={<PrivateRoute><ManagerApprovalPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
