'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AuthUser, LoginResponse, UserProfile, EnhancedUserProfile, ProfileUpdateData } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  profile: EnhancedUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<UserProfile>;
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

  const updateProfile = async (data: ProfileUpdateData): Promise<UserProfile> => {
    try {
      console.log('=== FRONTEND DEBUG: Profile Update Start ===');
      console.log('Original form data received:', JSON.stringify(data, null, 2));
      console.log('Data keys:', Object.keys(data));
      console.log('Data values:', Object.values(data));
      
      let updatedProfile: UserProfile;

      // Check if we have a file upload (banner_image) that needs FormData
      const hasFileUpload = data.banner_image instanceof File;

      console.log('Has file upload:', hasFileUpload);
      console.log('Banner image type:', typeof data.banner_image);
      console.log('Banner image value:', data.banner_image);

      if (hasFileUpload) {
        // Create FormData for file upload
        const formData = new FormData();
        
        console.log('=== FRONTEND DEBUG: FormData Creation ===');
        
        // Add all the form fields to FormData, but skip empty strings and undefined values
        Object.entries(data).forEach(([key, value]) => {
          console.log(`Processing field: ${key} = ${value} (type: ${typeof value})`);
          
          // Skip user_role - it should not be editable
          if (key === 'user_role') {
            console.log(`Skipping user_role - not editable: ${value}`);
            return;
          }
          
          if (value !== undefined && value !== null && value !== '') {
            if (value instanceof File) {
              console.log(`Adding File: ${key} = ${value.name} (${value.size} bytes)`);
              formData.append(key, value);
            } else {
              console.log(`Adding String: ${key} = ${String(value)}`);
              formData.append(key, String(value));
            }
          } else {
            console.log(`Skipping empty field: ${key} = ${value}`);
          }
        });

        // Debug: Log what's in FormData
        console.log('=== FRONTEND DEBUG: Final FormData Contents ===');
        for (let [key, value] of formData.entries()) {
          console.log(`FormData: ${key} = ${value}`);
        }

        console.log('=== FRONTEND DEBUG: Sending FormData Request ===');
        updatedProfile = await apiClient.uploadFile<UserProfile>('/api/accounts/profile/', formData);
      } else {
        console.log('=== FRONTEND DEBUG: JSON PATCH Creation ===');
        
        // Filter out empty strings and undefined values for JSON updates too
        const filteredData: Partial<ProfileUpdateData> = {};
        Object.entries(data).forEach(([key, value]) => {
          console.log(`Processing JSON field: ${key} = ${value} (type: ${typeof value})`);
          if (value !== undefined && value !== null && value !== '') {
            // Special handling for banner_image: if it's a string URL, don't include it in JSON updates
            // (it means it's already saved and we're not changing it)
            if (key === 'banner_image' && typeof value === 'string') {
              console.log(`Skipping banner_image URL in JSON update: ${value}`);
              return;
            }
            // Skip user_role - it should not be editable
            if (key === 'user_role') {
              console.log(`Skipping user_role - not editable: ${value}`);
              return;
            }
            console.log(`Adding to JSON: ${key} = ${value}`);
            filteredData[key as keyof ProfileUpdateData] = value;
          } else {
            console.log(`Skipping empty JSON field: ${key} = ${value}`);
          }
        });
        
        console.log('=== FRONTEND DEBUG: Final JSON Data ===');
        console.log('Filtered data for JSON PATCH:', JSON.stringify(filteredData, null, 2));
        
        console.log('=== FRONTEND DEBUG: Sending JSON PATCH Request ===');
        updatedProfile = await apiClient.patch<UserProfile>('/api/accounts/profile/', filteredData);
      }
      
      console.log('=== FRONTEND DEBUG: Profile Update Success ===');
      console.log('Updated profile response:', updatedProfile);
      
      // Refresh the full enhanced profile to get updated projects and posts
      await refreshProfile();
      
      console.log('=== FRONTEND DEBUG: Profile Update Complete ===');
      return updatedProfile;
    } catch (error) {
      console.error('=== FRONTEND DEBUG: Profile Update Error ===');
      console.error('Error object:', error);
      console.error('Error message:', (error as any)?.message);
      console.error('Error response:', (error as any)?.response);
      console.error('Error response data:', (error as any)?.response?.data);
      console.error('Error response status:', (error as any)?.response?.status);
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
