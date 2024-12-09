import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Salva i token e aggiorna lo stato di login
  const login = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    setIsLoggedIn(true);
  };

  // Rimuove i token e aggiorna lo stato di login
  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  // Rinnova il token di accesso usando il refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      await logout();
    }
  };

  // Controlla lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!accessToken);
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
