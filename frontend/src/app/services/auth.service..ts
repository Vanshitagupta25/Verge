import api from '@/app/api/api';

export const signup = async (
  name: string,
  email: string,
  password: string
) => {
  return api.post('/auth/signup', {
    name,
    email,
    password,
  });
};

export const login = async (
  email: string,
  password: string,
  role: 'user' | 'admin'
) => {
  return api.post('/auth/login', {
    email,
    password,
    role,
  });
};