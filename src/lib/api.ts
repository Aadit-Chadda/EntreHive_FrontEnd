// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
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
import { 
  ProjectData, ProjectCreateData, ProjectUpdateData, ProjectInvitation, ProjectInvitationCreate, AddTeamMemberData,
  PostData, PostCreateData, PostUpdateData, PostComment, CommentCreateData, PostLike, PostsResponse 
} from '@/types';

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

// Posts API
export const postsApi = {
  // Get posts feed
  getPosts: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    visibility?: string;
    author__profile__user_role?: string;
    ordering?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<PostsResponse>(`/api/posts/${query ? `?${query}` : ''}`);
  },

  // Get single post
  getPost: async (postId: string) => {
    return apiClient.get<PostData>(`/api/posts/${postId}/`);
  },

  // Create post
  createPost: async (data: PostCreateData) => {
    if (data.image) {
      // Handle file upload
      const formData = new FormData();
      formData.append('content', data.content);
      if (data.visibility) formData.append('visibility', data.visibility);
      if (data.tagged_project_ids && data.tagged_project_ids.length > 0) {
        // Append each project ID individually for proper array handling
        data.tagged_project_ids.forEach(projectId => {
          formData.append('tagged_project_ids', projectId);
        });
      }
      formData.append('image', data.image);
      
      return apiClient.postFormData<PostData>('/api/posts/', formData);
    } else {
      // Filter out empty arrays to avoid sending empty tagged_project_ids
      const postPayload: any = {
        content: data.content,
        visibility: data.visibility,
      };
      
      if (data.tagged_project_ids && data.tagged_project_ids.length > 0) {
        postPayload.tagged_project_ids = data.tagged_project_ids;
      }
      
      return apiClient.post<PostData>('/api/posts/', postPayload);
    }
  },

  // Update post
  updatePost: async (postId: string, data: PostUpdateData) => {
    return apiClient.patch<PostData>(`/api/posts/${postId}/`, data);
  },

  // Delete post
  deletePost: async (postId: string) => {
    return apiClient.delete(`/api/posts/${postId}/`);
  },

  // Like/unlike post
  toggleLike: async (postId: string) => {
    return apiClient.post<{
      message: string;
      liked: boolean;
      likes_count: number;
    }>(`/api/posts/${postId}/like/`);
  },

  // Get post likes
  getPostLikes: async (postId: string) => {
    return apiClient.get<PostLike[]>(`/api/posts/${postId}/likes/`);
  },

  // Share post
  sharePost: async (postId: string) => {
    return apiClient.post<{
      message: string;
      share_url: string;
    }>(`/api/posts/${postId}/share/`);
  },

  // Get my posts
  getMyPosts: async (params?: { page?: number; page_size?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<PostsResponse>(`/api/posts/my_posts/${query ? `?${query}` : ''}`);
  },

  // Get personalized feed
  getFeed: async (params?: { page?: number; page_size?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<PostsResponse>(`/api/posts/feed/${query ? `?${query}` : ''}`);
  },
};

// Comments API
export const commentsApi = {
  // Get comments for a post
  getComments: async (postId: string) => {
    return apiClient.get<PostComment[]>(`/api/posts/${postId}/comments/`);
  },

  // Create comment
  createComment: async (postId: string, data: CommentCreateData) => {
    return apiClient.post<PostComment>(`/api/posts/${postId}/comments/`, data);
  },

  // Update comment
  updateComment: async (postId: string, commentId: string, data: { content: string }) => {
    return apiClient.patch<PostComment>(`/api/posts/${postId}/comments/${commentId}/`, data);
  },

  // Delete comment
  deleteComment: async (postId: string, commentId: string) => {
    return apiClient.delete(`/api/posts/${postId}/comments/${commentId}/`);
  },
};
