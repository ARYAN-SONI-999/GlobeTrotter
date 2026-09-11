import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate the stored token against the server on every app mount.
    // This catches expired/revoked tokens that localStorage would otherwise
    // silently accept until the first authenticated API call fails.
    const token = localStorage.getItem('gt_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('gt_user', JSON.stringify(res.data));
        })
        .catch(() => {
          // Token is invalid or expired — clear stored credentials
          localStorage.removeItem('gt_token');
          localStorage.removeItem('gt_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('gt_token', res.data.token);
    localStorage.setItem('gt_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('gt_token', res.data.token);
    localStorage.setItem('gt_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('gt_token');
    localStorage.removeItem('gt_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
