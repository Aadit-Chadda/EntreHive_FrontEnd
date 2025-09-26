'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AuthUser, LoginResponse, UserProfile, EnhancedUserProfile } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  profile: EnhancedUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<EnhancedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Get user profile to verify token and get user data
      const profileData = await apiClient.get<EnhancedUserProfile>('/api/accounts/profile/me/');
      setProfile(profileData);
      
      // Create AuthUser from profile data
      const authUser: AuthUser = {
        pk: profileData.id,
        username: profileData.username,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      };
      setUser(authUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiClient.post<LoginResponse>('/api/auth/login/', {
        email,
        password,
      });

      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Set user data
      setUser(response.user);

      // Get full profile data
      await refreshProfile();

      // Redirect to dashboard/feed
      router.push('/feed');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear state
    setUser(null);
    setProfile(null);
    
    // Redirect to login
    router.push('/login');
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const profileData = await apiClient.get<EnhancedUserProfile>('/api/accounts/profile/me/');
      setProfile(profileData);
      
      // Update user data from profile
      if (profileData && user) {
        const updatedUser: AuthUser = {
          pk: profileData.id,
          username: profileData.username,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const updatedProfile = await apiClient.patch<UserProfile>('/api/accounts/profile/', data);
      setProfile(updatedProfile);
      
      // Update user data if name fields changed
      if (data.first_name || data.last_name || data.email) {
        const updatedUser: AuthUser = {
          pk: updatedProfile.id,
          username: updatedProfile.username,
          email: updatedProfile.email,
          first_name: updatedProfile.first_name,
          last_name: updatedProfile.last_name,
        };
        setUser(updatedUser);
      }
      
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
