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

    // Fetch profile data from a public profiles table keyed by auth user id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileError) {
      console.warn('Profile fetch warning:', profileError.message);
    }

    const mappedUser: User = {
      id: authUser.id,
      name: profile?.name ?? authUser.user_metadata?.full_name ?? authUser.email ?? 'User',
      email: authUser.email ?? '',
      role: (profile?.role as UserRole) ?? 'Admin',
      department: profile?.department ?? ''
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