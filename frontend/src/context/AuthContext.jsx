import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import {api} from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. New Loading State (Starts true)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        // 2. Stop loading whether success or fail
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    window.location.href = '/';
  };

  // 3. Expose 'loading' to the app
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
