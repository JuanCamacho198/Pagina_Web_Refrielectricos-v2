export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  provider?: 'LOCAL' | 'GOOGLE';
  emailVerified?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}
