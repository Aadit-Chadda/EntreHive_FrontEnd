'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftNavigation from '../components/LeftNavigation';
import RightSidebar from '../components/RightSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { NotificationService, Notification } from '@/lib/notifications';
import { Bell, Users, Heart, MessageSquare, FileText, Mail, Briefcase, UserPlus, Trash2 } from 'lucide-react';
import InfiniteScroll from '../components/InfiniteScroll';

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Redirect investors to their dedicated notifications page
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push('/investors/notifications');
    }
  }, [user, router]);

  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

  const fetchNotifications = async (page: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await NotificationService.getNotifications({
        page,
        page_size: 20,
        is_read: filter === 'unread' ? false : undefined,
      });

      if (reset) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }

      setHasMore(!!response.next);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(currentPage + 1, false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await NotificationService.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      showToast('Notification deleted', 'success');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      showToast('Failed to delete notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      showToast('Failed to mark all as read', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <Users className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
      case 'like':
        return <Heart className="w-5 h-5" style={{ color: 'var(--secondary-red)' }} />;
      case 'comment':
        return <MessageSquare className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
      case 'mention':
        return <FileText className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
      case 'message':
        return <Mail className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
      case 'project_invite':
        return <Briefcase className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
      case 'project_join':
        return <UserPlus className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
      default:
        return <Bell className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

    return notificationDate.toLocaleDateString();
  };

  const groupByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);
    const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

    notifications.forEach(notification => {
      const notifDate = new Date(notification.created_at);

      if (notifDate >= todayStart) {
        groups.today.push(notification);
      } else if (notifDate >= yesterdayStart) {
        groups.yesterday.push(notification);
      } else if (notifDate >= weekStart) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  };

  const groupedNotifications = groupByDate(notifications);
  const hasUnread = notifications.some(n => !n.is_read);

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--background)' }}>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between transition-colors duration-200"
          style={{
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)'
          }}>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6" style={{ color: 'var(--primary-orange)' }} />
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Notifications</span>
          </div>

          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          {/* Left Navigation */}
          <LeftNavigation
            showMobileNav={showMobileNav}
            setShowMobileNav={setShowMobileNav}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80 flex">
            <div className="flex-1 min-w-0 max-w-none">
              <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
                {/* Header */}
                <div className="sticky top-0 z-10 border-b-2 p-6" style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}>
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-8 h-8" style={{ color: 'var(--primary-orange)' }} />
                        <h1 className="text-3xl font-extrabold font-roca-two" style={{ color: 'var(--secondary-charcoal)' }}>
                          Notifications
                        </h1>
                      </div>
                      {hasUnread && (
                        <button
                          onClick={handleMarkAllRead}
                          className="px-4 py-2 rounded-xl font-medium font-canva-sans transition-all hover:scale-105 shadow-md"
                          style={{
                            backgroundColor: 'var(--primary-orange)',
                            color: 'white'
                          }}
                        >
                          Mark All Read
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium font-canva-sans transition-all ${
                          filter === 'all' ? 'shadow-md' : ''
                        }`}
                        style={{
                          backgroundColor: filter === 'all' ? 'var(--primary-orange)' : 'var(--background)',
                          color: filter === 'all' ? 'white' : 'var(--secondary-charcoal)'
                        }}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium font-canva-sans transition-all ${
                          filter === 'unread' ? 'shadow-md' : ''
                        }`}
                        style={{
                          backgroundColor: filter === 'unread' ? 'var(--primary-orange)' : 'var(--background)',
                          color: filter === 'unread' ? 'white' : 'var(--secondary-charcoal)'
                        }}
                      >
                        Unread
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 rounded-full" style={{
                          borderColor: 'var(--neutral-light-orange)',
                          borderTopColor: 'var(--primary-orange)'
                        }}></div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--secondary-taupe)', opacity: 0.5 }} />
                        <h3 className="text-xl font-semibold font-roca-two mb-2" style={{ color: 'var(--secondary-charcoal)' }}>
                          {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </h3>
                        <p className="font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                          {filter === 'unread' ? "You're all caught up!" : 'When you get notifications, they will appear here'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {Object.entries(groupedNotifications).map(([group, groupNotifs]) => {
                          if (groupNotifs.length === 0) return null;

                          const groupTitles: { [key: string]: string } = {
                            today: 'Today',
                            yesterday: 'Yesterday',
                            thisWeek: 'This Week',
                            older: 'Older'
                          };

                          return (
                            <div key={group}>
                              <h2 className="text-sm font-semibold font-canva-sans mb-3 px-2" style={{ color: 'var(--text-muted)' }}>
                                {groupTitles[group]}
                              </h2>
                              <div className="space-y-2">
                                {groupNotifs.map((notification) => (
                                  <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="group relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01]"
                                    style={{
                                      backgroundColor: notification.is_read ? 'var(--surface)' : 'var(--neutral-light-orange)',
                                      borderColor: notification.is_read ? 'var(--border)' : 'var(--primary-orange)',
                                    }}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.notification_type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold font-canva-sans" style={{ color: 'var(--secondary-charcoal)' }}>
                                          {notification.title}
                                        </p>
                                        <p className="text-sm font-canva-sans mt-1" style={{ color: 'var(--text-secondary)' }}>
                                          {notification.message}
                                        </p>
                                        <p className="text-xs font-canva-sans mt-2" style={{ color: 'var(--text-muted)' }}>
                                          {getTimeAgo(notification.created_at)}
                                        </p>
                                      </div>
                                      <button
                                        onClick={(e) => handleDelete(notification.id, e)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-100"
                                        style={{ color: 'var(--secondary-red)' }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}

                        {/* Infinite Scroll */}
                        <InfiniteScroll
                          hasMore={hasMore}
                          loading={loadingMore}
                          onLoadMore={handleLoadMore}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Explore Panel */}
            <div className="hidden lg:block fixed right-0 top-0 h-screen" style={{ backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>
              <RightSidebar />
            </div>
          </div>
        </div>

        {/* Overlay for mobile panels */}
        {showMobileNav && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => {
              setShowMobileNav(false);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
