import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      const response = await authAPI.getCurrentUser();
      
      console.log('📡 Auth response:', response);
      
      if (response.data && response.data.user) {
        const userData = response.data.user;
        const formattedUser = {
          ...userData,
          username: userData.username || userData.name || 'User',
          avatar: userData.avatar || ''
        };
        
        console.log('✅ User authenticated:', formattedUser.email);
        setUser(formattedUser);
        setLoading(false);
        return true; // ✅ CRITICAL: Must return true
      } else {
        console.log('❌ No user data in response');
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Authentication check failed:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Logging in with email/password...');
      const response = await authAPI.login(credentials);
      const userData = response.data.user;
      const formattedUser = {
        ...userData,
        username: userData.username || userData.name || 'User',
        avatar: userData.avatar || ''
      };
      
      console.log('✅ Login successful:', formattedUser.email);
      setUser(formattedUser);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Registering new user...');
      const response = await authAPI.register(userData);
      const user = response.data.user;
      const formattedUser = {
        ...user,
        username: user.username || user.name || 'User',
        avatar: user.avatar || ''
      };
      
      console.log('✅ Registration successful:', formattedUser.email);
      setUser(formattedUser);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      await authAPI.logout();
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still clear user even if API call fails
      setUser(null);
    }
  };

  const googleLogin = () => {
    console.log('🔗 Redirecting to Google OAuth...');
    authAPI.googleLogin();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
