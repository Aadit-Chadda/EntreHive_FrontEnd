'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationService, Notification, FollowSuggestion } from '@/lib/notifications';
import { AuthService } from '@/lib/auth';
import { Bell, Users, LogOut, Clock, Calendar, X, Check, User, KeyRound, ChevronDown } from 'lucide-react';

interface RightSidebarProps {
  className?: string;
}

export default function RightSidebar({ className = '' }: RightSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [followSuggestions, setFollowSuggestions] = useState<FollowSuggestion[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await NotificationService.getNotifications({ limit: 10 });
        setNotifications(response.notifications);
        setUnreadCount(response.unread_count);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Fetch follow suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const response = await NotificationService.getFollowSuggestions(5);
        setFollowSuggestions(response.suggestions);
      } catch (error) {
        console.error('Failed to fetch follow suggestions:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    router.push('/login');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/profile');
  };

  const handleResetPasswordClick = () => {
    setIsDropdownOpen(false);
    router.push('/settings#security');
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await NotificationService.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleFollowUser = async (username: string) => {
    try {
      setFollowingUsers(prev => new Set(prev).add(username));
      await AuthService.followUser(username);
      // Remove from suggestions after following
      setFollowSuggestions(prev => prev.filter(s => s.username !== username));
    } catch (error) {
      console.error('Failed to follow user:', error);
      setFollowingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: Notification['notification_type']) => {
    switch (type) {
      case 'follow':
        return <Users className="w-4 h-4" />;
      case 'like':
        return <span className="text-red-500">❤️</span>;
      case 'comment':
        return <span>💬</span>;
      case 'project_invite':
        return <span>📨</span>;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className={`w-80 h-screen sticky top-0 flex flex-col ${className}`}>
      {/* Header with Time, Date, and User Menu */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {/* User Menu Dropdown */}
        <div className="relative mb-4" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors"
            style={{
              backgroundColor: 'var(--primary-orange)',
              color: 'white'
            }}
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Account</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)'
                }}
              >
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-3 flex items-center space-x-3 transition-colors hover:bg-opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <User className="w-4 h-4" style={{ color: 'var(--primary-orange)' }} />
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={handleResetPasswordClick}
                  className="w-full px-4 py-3 flex items-center space-x-3 transition-colors hover:bg-opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <KeyRound className="w-4 h-4" style={{ color: 'var(--primary-orange)' }} />
                  <span className="font-medium">Change Password</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center space-x-3 transition-colors hover:bg-opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--secondary-red)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time and Date */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
            <Clock className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
            <span className="text-2xl font-bold">{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text-secondary)' }}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Notifications Section */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <Bell className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--secondary-red)] text-white">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="text-xs px-2 py-1 rounded hover:bg-opacity-80"
                style={{ color: 'var(--primary-orange)' }}
              >
                Mark all read
              </motion.button>
            )}
          </div>

          <div className="space-y-2">
            {loadingNotifications ? (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                <div className="animate-spin w-6 h-6 border-2 border-[var(--primary-orange)] border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNotificationClick(notification)}
                  className="p-3 rounded-lg cursor-pointer transition-all"
                  style={{
                    backgroundColor: notification.is_read ? 'transparent' : 'var(--neutral-light-orange)',
                    border: `1px solid ${notification.is_read ? 'var(--border)' : 'var(--primary-orange)'}`,
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.sender_profile_picture ? (
                        <img
                          src={notification.sender_profile_picture}
                          alt={notification.sender_username || 'User'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {notification.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {getTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Follow Suggestions Section */}
        <div className="p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
            <Users className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
            <span>Who to Follow</span>
          </h3>

          <div className="space-y-3">
            {loadingSuggestions ? (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                <div className="animate-spin w-6 h-6 border-2 border-[var(--primary-orange)] border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : followSuggestions.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions available</p>
              </div>
            ) : (
              followSuggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex items-start space-x-3 flex-1 cursor-pointer"
                      onClick={() => router.push(`/profile/${suggestion.username}`)}
                    >
                      <div className="flex-shrink-0">
                        {suggestion.profile_picture ? (
                          <img
                            src={suggestion.profile_picture}
                            alt={suggestion.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-muted)' }}>
                            {suggestion.full_name?.[0]?.toUpperCase() || suggestion.username[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {suggestion.full_name || suggestion.username}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                          @{suggestion.username}
                        </p>
                        {suggestion.bio && (
                          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                            {suggestion.bio}
                          </p>
                        )}
                        <div className="flex items-center mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>{suggestion.followers_count} followers</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFollowUser(suggestion.username)}
                      disabled={followingUsers.has(suggestion.username)}
                      className="ml-2 px-3 py-1.5 text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: followingUsers.has(suggestion.username) ? 'var(--accent-pine)' : 'var(--primary-orange)',
                        color: 'white'
                      }}
                    >
                      {followingUsers.has(suggestion.username) ? 'Following' : 'Follow'}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

