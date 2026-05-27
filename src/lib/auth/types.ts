export type AuthProvider = "email" | "google" | "apple";

export type User = {
  id: string;
  email: string;
  provider: AuthProvider;
  name?: string;
  verified: boolean;
  createdAt: string;
};

export type PendingSignup = {
  token: string;
  email: string;
  provider: AuthProvider;
  name?: string;
  expiresAt: number;
};
