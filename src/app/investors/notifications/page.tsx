'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Bell, ChevronDown, Check, X, TrendingUp as TrendingIcon, Rocket, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeToggle } from '../../components/ThemeProvider';

export default function InvestorNotifications() {
  const { user, profile } = useAuth();
  const router = useRouter();

  // Check if user is investor
  useEffect(() => {
    if (user && user.user_role && user.user_role !== 'investor') {
      router.push('/forbidden');
    }
  }, [user, router]);

  if (!user || user.user_role !== 'investor') {
    return null;
  }

  // Sample notifications (replace with actual API call)
  const notifications = [
    {
      id: 1,
      type: 'project_update',
      title: 'New AI Project Posted',
      message: 'Stanford University student just posted an AI EdTech project that matches your interests.',
      time: '2 hours ago',
      read: false,
      icon: Rocket,
      color: 'var(--primary-orange)',
    },
    {
      id: 2,
      type: 'trending',
      title: 'Trending in Fintech',
      message: '5 new fintech projects are gaining traction this week.',
      time: '5 hours ago',
      read: false,
      icon: TrendingIcon,
      color: 'var(--accent-pine)',
    },
    {
      id: 3,
      type: 'team_update',
      title: 'Team Seeking Funding',
      message: 'Climate tech startup is now actively seeking funding.',
      time: '1 day ago',
      read: true,
      icon: Users,
      color: 'var(--accent-terracotta)',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg border-b" 
             style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/investors" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>EntreHive</span>
                  <span className="text-xl font-bold font-roca-two" style={{ color: 'var(--primary-orange)' }}>Investors</span>
                </div>
              </Link>

              {/* Center - Discover */}
              <div className="hidden md:block">
                <Link href="/investors" className="font-canva-sans font-semibold text-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                  Discover
                </Link>
              </div>

              {/* Right Side - Theme Toggle, Notifications, Profile */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="relative p-2 rounded-lg ring-2 ring-orange-500"
                     style={{ color: 'var(--text-primary)', background: 'var(--hover-bg)' }}>
                  <Bell className="w-5 h-5" />
                </div>
                <Link href="/investors/profile">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                       style={{ background: 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--accent-pine) 100%)' }}>
                    {profile?.profile_picture ? (
                      <img src={profile.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm font-roca-two">
                        {user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </h1>
            <p className="text-lg font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
              Stay updated on projects and opportunities
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="px-4 py-2 rounded-lg font-semibold font-canva-sans text-white"
                    style={{ background: 'var(--primary-orange)' }}>
              All
            </button>
            <button className="px-4 py-2 rounded-lg font-canva-sans"
                    style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
              Unread
            </button>
            <button className="px-4 py-2 rounded-lg font-canva-sans"
                    style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
              Projects
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ 
                    background: notification.read ? 'var(--surface)' : 'var(--active-bg)', 
                    borderColor: 'var(--border)' 
                  }}>
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: `${notification.color}20` }}>
                      <Icon className="w-6 h-6" style={{ color: notification.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold font-roca-two mb-1" style={{ color: 'var(--text-primary)' }}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 rounded-full inline-block"
                                    style={{ background: 'var(--primary-orange)' }}></span>
                            )}
                          </h3>
                          <p className="text-sm font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                            {notification.message}
                          </p>
                          <p className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                            {notification.time}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-1.5 rounded-lg hover:bg-opacity-50 transition-colors"
                                  style={{ background: 'var(--hover-bg)' }}>
                            <Check className="w-4 h-4" style={{ color: 'var(--accent-pine)' }} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-opacity-50 transition-colors"
                                  style={{ background: 'var(--hover-bg)' }}>
                            <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State (when no notifications) */}
          {notifications.length === 0 && (
            <div className="text-center py-16 rounded-xl" style={{ background: 'var(--surface)' }}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--hover-bg)' }}>
                <Bell className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 className="text-2xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                No notifications yet
              </h3>
              <p className="text-lg font-canva-sans mb-6" style={{ color: 'var(--text-secondary)' }}>
                We&apos;ll notify you when there are updates on projects you&apos;re interested in
              </p>
              <Link href="/investors"
                    className="inline-block px-6 py-3 rounded-lg font-semibold font-canva-sans text-white transition-all duration-200 hover:scale-105"
                    style={{ background: 'var(--primary-orange)' }}>
                Discover Projects
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

