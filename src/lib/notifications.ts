// Notifications API Service
import { ApiClient } from './api';

const api = new ApiClient();

export interface Notification {
  id: string;
  notification_type: 'follow' | 'like' | 'comment' | 'project_invite' | 'project_join' | 'mention' | 'announcement';
  title: string;
  message: string;
  sender_username?: string;
  sender_full_name?: string;
  sender_profile_picture?: string | null;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
  total_count: number;
}

export interface FollowSuggestion {
  id: string;
  username: string;
  full_name: string;
  profile_picture: string | null;
  bio: string;
  user_role: 'student' | 'professor' | 'investor';
  university_name: string;
  followers_count: number;
  following_count: number;
}

export interface FollowSuggestionsResponse {
  suggestions: FollowSuggestion[];
  count: number;
}

export class NotificationService {
  /**
   * Get notifications for the current user
   */
  static async getNotifications(params?: {
    is_read?: boolean;
    limit?: number;
  }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.is_read !== undefined) {
      queryParams.append('is_read', params.is_read.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    const url = `/api/notifications/?${queryParams.toString()}`;
    return api.get<NotificationsResponse>(url);
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<number> {
    const response = await api.get<{ unread_count: number }>('/api/notifications/unread_count/');
    return response.unread_count;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/api/notifications/${notificationId}/mark_as_read/`, {});
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    await api.post('/api/notifications/mark_all_as_read/', {});
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}/`);
  }

  /**
   * Delete all read notifications
   */
  static async deleteAllRead(): Promise<void> {
    await api.delete('/api/notifications/delete_all_read/');
  }

  /**
   * Get follow suggestions
   */
  static async getFollowSuggestions(limit: number = 5): Promise<FollowSuggestionsResponse> {
    return api.get<FollowSuggestionsResponse>(`/api/notifications/follow-suggestions/?limit=${limit}`);
  }
}

