import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('route3d_token');
    const savedUser = localStorage.getItem('route3d_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('route3d_token');
        localStorage.removeItem('route3d_user');
      }
    }
    setLoading(false);
  }, []);

  const AUTHORIZED_ADMIN = 'jaswanthdoppa76@gmail.com';

  const requestOtp = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await authAPI.requestOtp(cleanEmail);
      return res.data;
    } catch (apiErr) {
      throw new Error(apiErr.response?.data?.message || apiErr.message || 'Failed to request OTP');
    }
  };

  const verifyOtp = async (email, otp) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await authAPI.verifyOtp(cleanEmail, otp);
      if (res.data.success) {
        const data = res.data.data;
        const userInfo = {
          id: data.userId,
          fullName: data.fullName,
          email: cleanEmail,
          role: data.role,
        };
        setToken(data.token);
        setUser(userInfo);
        localStorage.setItem('route3d_token', data.token);
        localStorage.setItem('route3d_user', JSON.stringify(userInfo));
        return userInfo;
      }
    } catch (apiErr) {
      throw new Error(apiErr.response?.data?.message || apiErr.message || 'OTP verification failed');
    }
  };

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await authAPI.login({ email: cleanEmail, password });
      if (res.data.success) {
        const data = res.data.data;
        const userInfo = {
          id: data.userId,
          fullName: data.fullName,
          email: cleanEmail,
          role: data.role,
        };
        setToken(data.token);
        setUser(userInfo);
        localStorage.setItem('route3d_token', data.token);
        localStorage.setItem('route3d_user', JSON.stringify(userInfo));
        return userInfo;
      }
    } catch (apiErr) {
      throw new Error(apiErr.response?.data?.message || apiErr.message || 'Login failed');
    }
  };

  const register = async (fullName, email, password, phone) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await authAPI.register({ fullName, email: cleanEmail, password, phone });
      if (res.data.success) {
        const data = res.data.data;
        const userInfo = {
          id: data.userId,
          fullName: data.fullName,
          email: cleanEmail,
          role: data.role,
        };
        setToken(data.token);
        setUser(userInfo);
        localStorage.setItem('route3d_token', data.token);
        localStorage.setItem('route3d_user', JSON.stringify(userInfo));
        return userInfo;
      }
    } catch (apiErr) {
      throw new Error(apiErr.response?.data?.message || apiErr.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('route3d_token');
    localStorage.removeItem('route3d_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.email?.toLowerCase() === AUTHORIZED_ADMIN || user?.email?.toLowerCase().includes('admin');
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        requestOtp,
        verifyOtp,
        register,
        logout,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
