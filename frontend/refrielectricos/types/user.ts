export type Role = 'USER' | 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  provider?: 'LOCAL' | 'GOOGLE';
  emailVerified?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}
