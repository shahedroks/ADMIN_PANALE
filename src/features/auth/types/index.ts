export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthSession = {
  token: string;
  expiresAt: string;
};
