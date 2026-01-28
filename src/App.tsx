import { useState, useEffect } from 'react';
import { User } from './models';
import { AuthService } from './services';
import { Header } from './components';
import { SubmitPage, AdminDashboard } from './pages';

function App() {
  const [currentView, setCurrentView] = useState<'submit' | 'admin'>('submit');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authService = new AuthService();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    const authService = new AuthService();
    authService.logout();
    setUser(null);
    setCurrentView('submit');
  };

  const handleNavigate = (view: 'submit' | 'admin') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        isLoggedIn={!!user}
        userName={user?.name}
        onLogout={handleLogout}
      />

      <main>
        {currentView === 'submit' ? (
          <SubmitPage />
        ) : (
          <AdminDashboard user={user} onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;
