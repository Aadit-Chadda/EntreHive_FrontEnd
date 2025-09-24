// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Network error occurred' };
      }

      const error: ApiError = {
        message: errorData.detail || errorData.message || `HTTP ${response.status}`,
        status: response.status,
        details: errorData,
      };

      // Handle token refresh for 401 errors
      if (response.status === 401 && typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshed = await this.refreshToken(refreshToken);
            if (refreshed) {
              // Retry the original request
              return this.handleResponse(response);
            }
          } catch {
            // Refresh failed, logout user
            this.logout();
          }
        } else {
          // No refresh token, logout user
          this.logout();
        }
      }

      throw error;
    }

    try {
      return await response.json();
    } catch {
      return {} as T;
    }
  }

  private logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  private async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }
}

export const apiClient = new ApiClient();

// Project API functions
import { ProjectData, ProjectCreateData, ProjectUpdateData, ProjectInvitation, ProjectInvitationCreate, AddTeamMemberData } from '@/types';

export const projectApi = {
  // Get all projects with filtering
  getProjects: async (params?: {
    search?: string;
    type?: string;
    status?: string;
    visibility?: string;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `/api/projects/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ProjectData[];
    }>(endpoint);
  },

  // Get a specific project
  getProject: async (projectId: string) => {
    return apiClient.get<ProjectData>(`/api/projects/${projectId}/`);
  },

  // Create a new project
  createProject: async (data: ProjectCreateData) => {
    return apiClient.post<ProjectData>('/api/projects/', data);
  },

  // Update a project
  updateProject: async (projectId: string, data: ProjectUpdateData) => {
    return apiClient.patch<ProjectData>(`/api/projects/${projectId}/`, data);
  },

  // Delete a project
  deleteProject: async (projectId: string) => {
    return apiClient.delete(`/api/projects/${projectId}/`);
  },

  // Get projects for a specific user
  getUserProjects: async (userId: number) => {
    return apiClient.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ProjectData[];
    }>(`/api/projects/user/${userId}/`);
  },

  // Team management
  addTeamMember: async (projectId: string, data: AddTeamMemberData) => {
    return apiClient.post(`/api/projects/${projectId}/team/add/`, data);
  },

  removeTeamMember: async (projectId: string, userId: number) => {
    return apiClient.delete(`/api/projects/${projectId}/team/remove/${userId}/`);
  },

  // Invitations
  getProjectInvitations: async (projectId: string) => {
    return apiClient.get<ProjectInvitation[]>(`/api/projects/${projectId}/invitations/`);
  },

  createInvitation: async (projectId: string, data: ProjectInvitationCreate) => {
    return apiClient.post<ProjectInvitation>(`/api/projects/${projectId}/invitations/`, data);
  },

  getMyInvitations: async () => {
    return apiClient.get<ProjectInvitation[]>('/api/projects/invitations/me/');
  },

  respondToInvitation: async (invitationId: string, action: 'accept' | 'decline') => {
    return apiClient.post(`/api/projects/invitations/${invitationId}/respond/`, { action });
  },
};
