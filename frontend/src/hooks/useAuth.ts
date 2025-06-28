import api from '../lib/api';
import { type LoginPayload, type RegisterPayload } from '../types';

export const useAuth = () => {
  const register = async (payload: RegisterPayload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  };

  const login = async (payload: LoginPayload) => {
    const res = await api.post('/auth/login', payload);
    return res.data;
  };

  const getProfile = async (token: string) => {
    const res = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  return { register, login, getProfile };
};
