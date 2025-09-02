import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Register from './auth/Register';
import RegisterSuccess from './auth/RegisterSuccess';
import EmailConfirmed from './auth/EmailConfirmed';
import Onboarding from './auth/Onboarding';
import PasswordReset from './auth/PasswordReset';
import Dashboard from './Dashboard';
import LandingTaxSimulation from './LandingTaxSimulation';
import ApiDocumentation from './ApiDocumentation';
import SecurityPage from './SecurityPage';
import CompanyInfo from './CompanyInfo';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactPage from './ContactPage';

function AuthWrapper() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const { isAuthenticated, loading } = useAuth();

  const handleLoginSuccess = () => {
    // ログイン成功時の処理は useAuth フックで自動的に処理される
  };

  const handleOnboardingComplete = () => {
    // オンボーディング完了時の処理も useAuth フックで自動的に処理される
  };

  const navigateToView = (view: string) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  switch (currentView) {
    case 'landing':
      return <LandingPage onNavigate={navigateToView} />;
    case 'landing-tax-simulation':
      return <LandingTaxSimulation onNavigate={navigateToView} />;
    case 'api-documentation':
      return <ApiDocumentation onNavigate={navigateToView} />;
    case 'security':
      return <SecurityPage onNavigate={navigateToView} />;
    case 'company-info':
      return <CompanyInfo onNavigate={navigateToView} />;
    case 'privacy-policy':
      return <PrivacyPolicy onNavigate={navigateToView} />;
    case 'terms-of-service':
      return <TermsOfService onNavigate={navigateToView} />;
    case 'contact':
      return <ContactPage onNavigate={navigateToView} />;
    case 'login':
      return <Login onNavigate={navigateToView} onLoginSuccess={handleLoginSuccess} />;
    case 'register':
      return <Register onNavigate={navigateToView} />;
    case 'register-success':
      return <RegisterSuccess onNavigate={navigateToView} />;
    case 'email-confirmed':
      return <EmailConfirmed onNavigate={navigateToView} />;
    case 'onboarding':
      return <Onboarding onNavigate={navigateToView} onComplete={handleOnboardingComplete} />;
    case 'password-reset':
      return <PasswordReset onNavigate={navigateToView} />;
    default:
      return <LandingPage onNavigate={navigateToView} />;
  }
}

export default AuthWrapper;