import { apiClient } from './api';
import { LoginResponse, RegistrationData, UserProfile } from '@/types';

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  new_password1: string;
  new_password2: string;
  uid: string;
  token: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export interface UsernameCheckResponse {
  available: boolean;
}

export interface EmailCheckResponse {
  available: boolean;
}

export class AuthService {
  static async register(data: RegistrationData): Promise<{ detail: string }> {
    return apiClient.post('/api/auth/registration/', data);
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post('/api/auth/login/', { email, password });
  }

  static async logout(refreshToken?: string): Promise<{ detail: string }> {
    const refresh = refreshToken || localStorage.getItem('refresh_token');
    return apiClient.post('/api/auth/logout/', { refresh });
  }

  static async refreshToken(refreshToken: string): Promise<{ access: string; access_token_expiration: string }> {
    return apiClient.post('/api/auth/token/refresh/', { refresh: refreshToken });
  }

  static async requestPasswordReset(data: PasswordResetData): Promise<{ detail: string }> {
    return apiClient.post('/api/auth/password/reset/', data);
  }

  static async confirmPasswordReset(data: PasswordResetConfirmData): Promise<{ detail: string }> {
    return apiClient.post('/api/accounts/password-reset-confirm/', data);
  }

  static async changePassword(data: ChangePasswordData): Promise<{ detail: string }> {
    return apiClient.post('/api/auth/password/change/', data);
  }

  static async checkUsername(username: string): Promise<UsernameCheckResponse> {
    return apiClient.get(`/api/accounts/check-username/?username=${encodeURIComponent(username)}`);
  }

  static async checkEmail(email: string): Promise<EmailCheckResponse> {
    return apiClient.get(`/api/accounts/check-email/?email=${encodeURIComponent(email)}`);
  }

  static async getMyProfile(): Promise<UserProfile> {
    return apiClient.get('/api/accounts/profile/me/');
  }

  static async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.patch('/api/accounts/profile/', data);
  }

  static async uploadProfilePicture(file: File, additionalData?: Record<string, string>): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    // Add any additional form data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return apiClient.uploadFile('/api/accounts/profile/', formData);
  }

  static async deleteProfilePicture(): Promise<{ message: string }> {
    return apiClient.delete('/api/accounts/profile/delete-picture/');
  }

  static async getPublicProfiles(params?: {
    search?: string;
    role?: string;
    university?: string;
    location?: string;
  }): Promise<UserProfile[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    
    const queryString = searchParams.toString();
    return apiClient.get(`/api/accounts/profiles/${queryString ? `?${queryString}` : ''}`);
  }

  static async getPublicProfile(username: string): Promise<UserProfile> {
    return apiClient.get(`/api/accounts/profiles/${username}/`);
  }

  static async getProfileStats(): Promise<{
    total_public_profiles: number;
    students: number;
    professors: number;
    investors: number;
    with_pictures: number;
  }> {
    return apiClient.get('/api/accounts/profiles/stats/');
  }

  static async followUser(username: string): Promise<{ message: string; following: boolean }> {
    return apiClient.post(`/api/accounts/follow/${username}/`, {});
  }

  static async unfollowUser(username: string): Promise<{ message: string; following: boolean }> {
    return apiClient.delete(`/api/accounts/unfollow/${username}/`);
  }

  static async getFollowStatus(username: string): Promise<{ following: boolean }> {
    return apiClient.get(`/api/accounts/follow-status/${username}/`);
  }
}

// Utility functions for form validation
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): string[] => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 150) {
    errors.push('Username must be less than 150 characters');
  }
  
  if (!/^[a-zA-Z0-9@._+-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and @/./+/-/_ characters');
  }
  
  return errors;
};
