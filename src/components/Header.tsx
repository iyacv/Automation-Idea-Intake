interface HeaderProps {
  currentView: 'submit' | 'admin';
  onNavigate: (view: 'submit' | 'admin') => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export function Header({ currentView, onNavigate, isLoggedIn, userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo/madison88ltd_logo-removebg-preview.png" 
              alt="Madison 88 Ltd" 
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => onNavigate('submit')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'submit'
                  ? 'text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Submit Idea
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'admin'
                  ? 'text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin Dashboard
            </button>
          </nav>

          {/* Right Side - Login/User */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">{userName}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-md transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
