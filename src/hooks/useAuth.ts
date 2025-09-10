import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User } from '../types';
import { useUser } from '../contexts/UserContext';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const { setUser: setUserContext } = useUser();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  // Clear any previous errors
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get stored user data
      const storedUserData = await AsyncStorage.getItem('userData');
      
      if (!storedUserData) {
        throw new Error('No account found. Please sign up first.');
      }

      const user: User = JSON.parse(storedUserData);

      // Validate credentials
      if (user.email !== credentials.email) {
        throw new Error('Invalid email address.');
      }

      if (user.password !== credentials.password) {
        throw new Error('Invalid password.');
      }

      // Login successful
      setAuthState(prev => ({ 
        ...prev, 
        user, 
        isLoading: false, 
        error: null 
      }));

      // Update UserContext
      setUserContext(user);

      // Navigate to dashboard
      router.replace('/(tabs)/dashboard');

      return { success: true, user };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Signup function
  const signup = useCallback(async (credentials: SignupCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if user already exists
      const existingUser = await AsyncStorage.getItem('userData');
      if (existingUser) {
        const user: User = JSON.parse(existingUser);
        if (user.email === credentials.email) {
          throw new Error('An account with this email already exists.');
        }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // Simple ID generation
        fullName: credentials.fullName,
        email: credentials.email,
        password: credentials.password,
      };

      // Save user data
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));

      // Signup successful
      setAuthState(prev => ({ 
        ...prev, 
        user: newUser, 
        isLoading: false, 
        error: null 
      }));

      // Update UserContext
      setUserContext(newUser);

      // Navigate to login screen with email pre-filled
      router.replace(`/(auth)/login?email=${encodeURIComponent(credentials.email)}`);

      return { success: true, user: newUser };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // DON'T clear stored user data - keep it for future logins
      // await AsyncStorage.removeItem('userData');
      
      // Clear auth state only
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });

      // Clear UserContext
      setUserContext(null);

      // Navigate to login
      router.replace('/(auth)/login');

    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [setUserContext]);

  // Load user data on app start
  const loadUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user: User = JSON.parse(userData);
        setAuthState(prev => ({ ...prev, user }));
        setUserContext(user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, [setUserContext]);

  return {
    ...authState,
    login,
    signup,
    logout,
    loadUser,
    clearError,
  };
};
