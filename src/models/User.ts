// User Model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export type UserRole = 'Submitter' | 'Reviewer' | 'Approver' | 'Admin';

export const USER_ROLES: UserRole[] = ['Submitter', 'Reviewer', 'Approver', 'Admin'];
