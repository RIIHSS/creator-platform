/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext(null);

// Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Initialize from localStorage (no useEffect needed)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  const [loading] = useState(false); // no async loading needed anymore

  // ✅ Login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    navigate('/dashboard'); // optional but useful
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  // ✅ Auth check
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};