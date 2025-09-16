// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          // Verify token is still valid by fetching user data
          const refreshedUser = await AuthService.fetchCurrentUser();
          if (refreshedUser) {
            setUser(refreshedUser);
            setIsAuthenticated(true);
          } else {
            // Token invalid, logout
            AuthService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);
      if (result) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Re-throw error for UI to handle
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const result = await AuthService.register(userData);
      if (result) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Re-throw error for UI to handle
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    if (isAuthenticated) {
      try {
        const refreshedUser = await AuthService.fetchCurrentUser();
        if (refreshedUser) {
          setUser(refreshedUser);
        } else {
          // User no longer authenticated
          logout();
        }
      } catch (error) {
        console.error('Failed to refresh user:', error);
        logout();
      }
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated,
    loading,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};