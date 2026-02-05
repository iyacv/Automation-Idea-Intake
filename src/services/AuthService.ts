import { User, UserRole } from '../models';
import { supabase } from '../lib/supabase';

export class AuthService {
  private currentUser: User | null = null;

  // Use Supabase Auth for secure email/password login
  async login(email: string, password: string): Promise<User | null> {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Login error:', signInError.message);
      return null;
    }

    const authUser = signInData.user;
    if (!authUser) return null;

    const userMetadata = authUser.user_metadata || {};
    const appMetadata = (authUser as any).app_metadata || {};
    const mappedUser: User = {
      id: authUser.id,
      name: userMetadata.full_name || userMetadata.name || appMetadata.full_name || appMetadata.name || authUser.email || 'User',
      email: authUser.email ?? '',
      role: ((appMetadata.role || userMetadata.role) as UserRole) || 'Submitter',
      department: userMetadata.department || appMetadata.department || ''
    };

    this.currentUser = mappedUser;
    return mappedUser;
  }

  logout(): void {
    this.currentUser = null;
    void supabase.auth.signOut();
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