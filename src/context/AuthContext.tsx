import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

type User = {
  id?: string;
  email: string;
  name?: string;
} | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/auth/me');
      console.log('User profile response:', res.data);
      
      // Handle different response formats
      const userData = res.data.user || res.data.data?.user || res.data;
      setUser(userData);
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error.response?.data || error);
      // Token invalid/expired, clear auth
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const res = await axios.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      
      // Handle different response formats
      const responseData = res.data.data || res.data;
      const t = responseData.token || responseData.access_token;
      const userData = responseData.user || { email };
      
      if (!t) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', t);
      setToken(t);
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Attempting register with:', { email });
      const res = await axios.post('/auth/register', { email, password });
      console.log('Register response:', res.data);
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};