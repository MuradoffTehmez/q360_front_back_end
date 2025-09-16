// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthService } from './services/AuthService';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    // Check if user is already logged in
    const user = AuthService.getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = () => {
    const user = AuthService.getCurrentUser();
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegistrationPage />} 
            />
            <Route 
              path="/forgot-password" 
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <ForgotPasswordPage />} 
            />
            <Route 
              path="/reset-password" 
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <ResetPasswordPage />} 
            />
            <Route 
              path="/verify-email" 
              element={<VerifyEmailPage />} 
            />
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isLoggedIn ? <EnhancedProfilePage onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile-basic" 
              element={isLoggedIn ? <ProfilePage onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/evaluation" 
              element={isLoggedIn ? <EnhancedEvaluationForm onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/evaluation-basic" 
              element={isLoggedIn ? <EvaluationForm onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={isLoggedIn ? <ReportsPage onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/team" 
              element={isLoggedIn ? <TeamDashboard onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={isLoggedIn ? <AdminPanel onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={isLoggedIn ? <SettingsPage onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/evaluation-wizard" 
              element={isLoggedIn ? <EvaluationWizard onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/ideas" 
              element={isLoggedIn ? <IdeasBank onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/notifications" 
              element={isLoggedIn ? <NotificationsCenter onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/report-center" 
              element={isLoggedIn ? <ReportCenter onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;