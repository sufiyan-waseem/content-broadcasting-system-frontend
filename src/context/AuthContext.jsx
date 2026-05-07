import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Synchronously read auth state — no useEffect, no async, no flash
const getInitialAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (token && raw) {
      const user = JSON.parse(raw);
      if (user && user.id && user.role) return { user, token };
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialAuth);

  const loginUser = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ user, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, loading: false, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
