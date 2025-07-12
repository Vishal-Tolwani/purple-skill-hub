import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { ProfileSettings } from '@/components/Profile/ProfileSettings';
import { BrowseSkills } from '@/components/Browse/BrowseSkills';
import { SwapManagement } from '@/components/Swaps/SwapManagement';
import { AdminPanel } from '@/components/Admin/AdminPanel';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'login');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterForm onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileSettings onNavigate={handleNavigate} />;
      case 'browse':
        return <BrowseSkills onNavigate={handleNavigate} />;
      case 'swaps':
        return <SwapManagement onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPanel onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  if (!isAuthenticated && currentPage !== 'register') {
    return <LoginForm onNavigate={handleNavigate} />;
  }

  if (!isAuthenticated && currentPage === 'register') {
    return <RegisterForm onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
