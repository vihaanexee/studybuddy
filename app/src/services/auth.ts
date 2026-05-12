import { apiPost, apiGet } from "./api";

export interface User {
  id: string;
  email: string;
  createdAt: string;
  profile?: { displayName: string } | null;
}

interface AuthResponse {
  data: User;
}

export async function register(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  const res = await apiPost<AuthResponse>("/api/v1/auth/register", {
    email,
    password,
    displayName,
  });
  return res.data;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await apiPost<AuthResponse>("/api/v1/auth/login", {
    email,
    password,
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiPost("/api/v1/auth/logout");
}

export async function getMe(): Promise<User> {
  const res = await apiGet<AuthResponse>("/api/v1/me");
  return res.data;
}
