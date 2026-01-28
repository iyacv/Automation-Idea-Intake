interface HeaderProps {
  currentView: 'submit' | 'admin';
  onNavigate: (view: 'submit' | 'admin') => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Header({ currentView, onNavigate, isLoggedIn, userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-700 font-bold text-xl">AI</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">
              Automation Idea Intake
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('submit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'submit'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Submit Idea
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'admin'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Admin Dashboard
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm hidden sm:block">{userName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 rounded-lg text-sm font-medium transition-colors"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
