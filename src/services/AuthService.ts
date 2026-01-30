import { User, UserRole } from '../models';

export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
  }

  private saveToStorage(): void {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  login(email: string, password: string): User | null {
    const demoUsers: Record<string, User> = {
      'admin@company.com': {
        id: 'user_admin',
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'Admin',
        department: 'IT'
      },
    
    };

    if (password === 'password123' && demoUsers[email]) {
      this.currentUser = demoUsers[email];
      this.saveToStorage();
      return this.currentUser;
    }

    return null;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }
}
