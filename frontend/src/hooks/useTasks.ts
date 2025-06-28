import api from '../lib/api';
import { type Task } from '../types/task';

export const useTasks = () => {
  const getTasks = async (token: string): Promise<Task[]> => {
    const res = await api.get('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  return { getTasks };
};
