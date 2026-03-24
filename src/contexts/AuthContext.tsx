'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';
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

  const isAuthenticated = !!user;

  useEffect(() => {
    // Skip auth check on public pages to prevent reload loops
    const publicPages = ['/login', '/signup', '/forgot-password', '/', '/about', '/services'];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Only check auth if not on a public page
    const isPublicPage = publicPages.includes(currentPath) || currentPath.startsWith('/reset-password');
    if (!isPublicPage) {
      checkAuthStatus();
    } else {
      // On public pages, just set loading to false
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    if (!tokenStorage.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const profileData = await apiClient.get<EnhancedUserProfile>('/api/accounts/profile/me/');
      setProfile(profileData);

      const authUser: AuthUser = {
        pk: profileData.id,
        username: profileData.username,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        user_role: profileData.user_role,
      };
      setUser(authUser);
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status !== 401) {
        console.error('Auth check failed:', error);
      }
      tokenStorage.clearTokens();
      setUser(null);
      setProfile(null);
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

      // Store tokens from response body
      if (response.access && response.refresh) {
        tokenStorage.setTokens(response.access, response.refresh);
      }

      setUser(response.user);

      // Get full profile data
      const profileData = await apiClient.get<EnhancedUserProfile>('/api/accounts/profile/me/');
      setProfile(profileData);

      // Update user with role from profile
      const updatedUser: AuthUser = {
        ...response.user,
        user_role: profileData.user_role,
      };
      setUser(updatedUser);

      // Handle return URL redirect with strict validation to prevent open redirect attacks
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');

      // Whitelist of allowed return URL paths
      const allowedPaths = ['/feed', '/profile', '/projects', '/explore', '/settings', '/notifications', '/inbox', '/investors', '/bookmarks', '/posts'];

      // Strict validation function to prevent open redirect attacks
      const validateReturnUrl = (url: string | null): string | null => {
        if (!url) return null;

        try {
          // Parse URL to extract just the pathname - this prevents attacks like:
          // /feed?redirectTo=http://evil.com or /feed@evil.com
          const parsedUrl = new URL(url, window.location.origin);

          // Only allow same-origin URLs
          if (parsedUrl.origin !== window.location.origin) return null;

          // Check against exact allowed paths or paths starting with allowed prefix + /
          const isAllowed = allowedPaths.some(
            path => parsedUrl.pathname === path || parsedUrl.pathname.startsWith(path + '/')
          );

          // Return only the pathname (no external query params that could contain URLs)
          return isAllowed ? parsedUrl.pathname : null;
        } catch {
          // Invalid URL format
          return null;
        }
      };

      const validatedUrl = validateReturnUrl(returnUrl);

      if (validatedUrl) {
        // Safe to redirect to the validated path
        router.push(validatedUrl);
      } else {
        // Default redirect to feed for all users
        router.push('/feed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      await apiClient.post('/api/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
      setProfile(null);
      router.push('/login');
    }
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
          user_role: profileData.user_role,
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
      let updatedProfile: UserProfile;

      // Check if we have a file upload (banner_image) that needs FormData
      const hasFileUpload = data.banner_image instanceof File;

      if (hasFileUpload) {
        // Create FormData for file upload
        const formData = new FormData();

        // Add all the form fields to FormData, but skip empty strings and undefined values
        Object.entries(data).forEach(([key, value]) => {
          // Skip user_role - it should not be editable
          if (key === 'user_role') {
            return;
          }

          if (value !== undefined && value !== null && value !== '') {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        updatedProfile = await apiClient.uploadFile<UserProfile>('/api/accounts/profile/', formData);
      } else {
        // Filter out empty strings and undefined values for JSON updates too
        const filteredData: Partial<ProfileUpdateData> = {};
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Special handling for banner_image: if it's a string URL, don't include it in JSON updates
            // (it means it's already saved and we're not changing it)
            if (key === 'banner_image' && typeof value === 'string') {
              return;
            }
            // Skip user_role - it should not be editable
            if (key === 'user_role') {
              return;
            }
            filteredData[key as keyof ProfileUpdateData] = value;
          }
        });

        updatedProfile = await apiClient.patch<UserProfile>('/api/accounts/profile/', filteredData);
      }

      // Refresh the full enhanced profile to get updated projects and posts
      await refreshProfile();

      return updatedProfile;
    } catch (error) {
      console.error('Profile update error:', error);
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
