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

  // With httpOnly cookies, we can't check localStorage
  // Authentication is determined by whether we have user data
  const isAuthenticated = !!user;

  useEffect(() => {
    // Skip auth check on public pages to prevent reload loops
    const publicPages = ['/login', '/signup', '/forgot-password', '/', '/about', '/services'];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Only check auth if not on a public page
    if (!publicPages.includes(currentPath)) {
      checkAuthStatus();
    } else {
      // On public pages, just set loading to false
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      // With httpOnly cookies, tokens are sent automatically with requests
      // Try to get user profile - if successful, user is authenticated
      const profileData = await apiClient.get<EnhancedUserProfile>('/api/accounts/profile/me/');
      setProfile(profileData);

      // Create AuthUser from profile data
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
      // If profile fetch fails (401), user is not authenticated
      // Don't log error for expected 401 responses
      if (error && typeof error === 'object' && 'status' in error && error.status !== 401) {
        console.error('Auth check failed:', error);
      }
      // Clear user state if not authenticated
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

      // Tokens are now stored in httpOnly cookies automatically by the backend
      // No need to manually store them in localStorage

      // Set user data
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

      // Handle return URL redirect with validation to prevent open redirect attacks
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');

      // Whitelist of allowed return URL paths
      const allowedPaths = ['/feed', '/profile', '/projects', '/explore', '/settings', '/notifications', '/inbox', '/investors', '/bookmarks', '/posts'];

      // Validate return URL: must start with /, not start with //, and match allowed paths
      const isValidReturnUrl = returnUrl &&
        returnUrl.startsWith('/') &&
        !returnUrl.startsWith('//') && // Prevent protocol-relative URLs like //evil.com
        allowedPaths.some(path => returnUrl.startsWith(path));

      if (isValidReturnUrl) {
        // Safe to redirect to the original page user was trying to access
        router.push(decodeURIComponent(returnUrl));
      } else {
        // Default redirect based on user role
        if (profileData.user_role === 'investor') {
          router.push('/investors');
        } else {
          router.push('/feed');
        }
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
      // Call backend logout to clear httpOnly cookies
      await apiClient.post('/api/auth/logout/', {});

      // Only clear state and redirect if server logout succeeded
      setUser(null);
      setProfile(null);

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Don't clear state if server logout failed - session still active
      // Show error to user
      if (typeof window !== 'undefined') {
        alert('Logout failed. Please try again or close your browser to end your session.');
      }
      throw error;
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
