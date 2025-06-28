// src/types/index.ts
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}
