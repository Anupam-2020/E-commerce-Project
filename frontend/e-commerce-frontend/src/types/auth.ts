export interface User {
  id: number;
  name: string;
  email: string;
  age?: number | null;
  city?: string | null;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  age?: number;
  city: string;
}