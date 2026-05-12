import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const roleToRoute = {
  farmer: '/farmer',
  buyer: '/buyer',
  supplier: '/supplier',
  fra: '/fra',
  cooperative: '/cooperative',
  admin: '/admin',
  extension: '/fra',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('agriconnect_token');
    localStorage.removeItem('agriconnect_user');
    setUser(null);
  };

  const loadCurrentUser = async () => {
    const token = localStorage.getItem('agriconnect_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const currentUser = response?.data?.data?.user;
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('agriconnect_user', JSON.stringify(currentUser));
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('agriconnect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('agriconnect_user');
      }
    }

    loadCurrentUser();

    const onUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', onUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, []);

  const login = async (phone, password) => {
    const response = await api.post('/auth/login', { phone, password });
    const accessToken = response?.data?.data?.accessToken;
    const loggedInUser = response?.data?.data?.user;

    if (!accessToken || !loggedInUser) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem('agriconnect_token', accessToken);
    localStorage.setItem('agriconnect_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return roleToRoute[loggedInUser.role] || '/';
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      roleToRoute,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
