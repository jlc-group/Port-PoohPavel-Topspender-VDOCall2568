import { useState, useEffect } from 'react';
import { ADMIN_CREDENTIALS, STORAGE_KEYS, ERROR_MESSAGES } from '@utils/constants';

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (inputUsername, inputPassword) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (inputUsername === ADMIN_CREDENTIALS.USERNAME && inputPassword === ADMIN_CREDENTIALS.PASSWORD) {
        const token = btoa(`${inputUsername}:${Date.now()}`);
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
        setIsAuthenticated(true);
        setUsername(inputUsername);
        setLoading(false);
        return { success: true };
      } else {
        setError(ERROR_MESSAGES.AUTH_ERROR);
        setLoading(false);
        return { success: false, error: ERROR_MESSAGES.AUTH_ERROR };
      }
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const validateToken = (token) => {
    if (!token) return false;

    try {
      const decoded = atob(token);
      const [storedUsername] = decoded.split(':');
      return storedUsername === ADMIN_CREDENTIALS.USERNAME;
    } catch {
      return false;
    }
  };

  const checkAuthentication = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (token && validateToken(token)) {
      const decoded = atob(token);
      const [storedUsername] = decoded.split(':');
      setIsAuthenticated(true);
      setUsername(storedUsername);
      return true;
    } else {
      logout();
      return false;
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    // State
    isAuthenticated,
    loading,
    error,
    username,
    password,

    // Actions
    login,
    logout,
    checkAuthentication,
    clearError,

    // Setters
    setUsername,
    setPassword,

    // Computed
    isLoading: loading,
    hasError: !!error,
  };
};