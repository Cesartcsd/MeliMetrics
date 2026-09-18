import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import Login from '@/components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Basic local auth check
    const auth = localStorage.getItem('melimetrics_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-bg-base flex items-center justify-center text-text-main">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DashboardShell onLogout={() => {
    localStorage.removeItem('melimetrics_auth');
    setIsAuthenticated(false);
  }} />;
}
