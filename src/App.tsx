import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'signin':
      return <AuthPage initialMode="signin" />;
    case 'signup':
      return <AuthPage initialMode="signup" />;
    case 'dashboard':
      return <DashboardLayout />;
    case 'landing':
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
