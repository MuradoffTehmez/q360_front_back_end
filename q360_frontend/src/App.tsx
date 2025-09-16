// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import MFAPage from './pages/MFAPage';
import MFAVerifyPage from './pages/MFAVerifyPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import EnhancedProfilePage from './pages/EnhancedProfilePage';
import EvaluationForm from './pages/EvaluationForm';
import EnhancedEvaluationForm from './pages/EnhancedEvaluationForm';
import ReportsPage from './pages/ReportsPage';
import TeamDashboard from './pages/TeamDashboard';
import AdminPanel from './pages/AdminPanel';
import SettingsPage from './pages/SettingsPage';
import EvaluationWizard from './pages/EvaluationWizard';
import IdeasBank from './pages/IdeasBank';
import NotificationsCenter from './pages/NotificationsCenter';
import ReportCenter from './pages/ReportCenter';
import NotFoundPage from './pages/NotFoundPage';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/mfa" element={<MFAPage />} />
              <Route path="/mfa-verify" element={<MFAVerifyPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<EnhancedProfilePage />} />
              <Route path="/profile-basic" element={<ProfilePage />} />
              <Route path="/evaluation" element={<EnhancedEvaluationForm />} />
              <Route path="/evaluation-basic" element={<EvaluationForm />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/team" element={<TeamDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/evaluation-wizard" element={<EvaluationWizard />} />
              <Route path="/ideas" element={<IdeasBank />} />
              <Route path="/notifications" element={<NotificationsCenter />} />
              <Route path="/report-center" element={<ReportCenter />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;