'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LeftNavigation from '../../components/LeftNavigation';
// We'll create inline components for PostSummary and ProjectSummary display
import { ThemeProvider } from '../../components/ThemeProvider';
import { api, messagingApi } from '@/lib/api';
import { EnhancedUserProfile, PostSummary, ProjectSummary } from '@/types';
import { getProfileBannerGradient, DEFAULT_PROFILE_BANNER_GRADIENT } from '@/lib/profileBranding';

// Simple post display component for PostSummary
const PostSummaryCard = ({ post, router }: { post: PostSummary; router: any }) => (
  <div className="p-4 rounded-lg transition-colors cursor-pointer group" style={{border: '1px solid var(--border)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
    <div onClick={() => router.push(`/posts/${post.id}`)}>
      <p className="mb-3 line-clamp-3 group-hover:text-[var(--primary-orange)] transition-colors" style={{color: 'var(--text-primary)'}}>{post.content}</p>
      {post.image_url && (
        <div className="mb-3">
          <img src={post.image_url} alt="Post image" className="w-full h-48 object-cover rounded-lg" />
        </div>
      )}
      <div className="flex items-center justify-between text-sm" style={{color: 'var(--text-secondary)'}}>
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes_count}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments_count}
          </span>
        </div>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

// Simple project display component for ProjectSummary
const ProjectSummaryCard = ({ project, router }: { project: ProjectSummary; router: any }) => (
  <div className="p-4 rounded-lg transition-colors cursor-pointer group" style={{border: '1px solid var(--border)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
    <div onClick={() => router.push(`/projects/${project.id}`)}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium group-hover:text-[var(--primary-orange)] transition-colors" style={{color: 'var(--text-primary)'}}>{project.title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          project.status === 'launched' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : project.status === 'mvp'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {project.status}
        </span>
      </div>
      <div className="flex items-center space-x-4 text-sm" style={{color: 'var(--text-secondary)'}}>
        <span className="capitalize">{project.project_type}</span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {project.team_count} members
        </span>
        <span>{new Date(project.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();
  const [profile, setProfile] = useState<EnhancedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
  const [showProjectRequestModal, setShowProjectRequestModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const router = useRouter();

  // Redirect investors to investor-specific profile page
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push(`/investors/profiles/${username}`);
    }
  }, [user, username, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/accounts/profiles/${username}/`);
        setProfile(response as EnhancedUserProfile);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    
    setFollowLoading(true);
    try {
      if (profile.is_following) {
        await api.delete(`/api/accounts/unfollow/${username}/`);
        setProfile(prev => prev ? {
          ...prev,
          is_following: false,
          followers_count: prev.followers_count - 1
        } : null);
      } else {
        await api.post(`/api/accounts/follow/${username}/`);
        setProfile(prev => prev ? {
          ...prev,
          is_following: true,
          followers_count: prev.followers_count + 1
        } : null);
      }
    } catch (error) {
      console.error('Follow/unfollow error:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleStartChat = async () => {
    const currentUserRole = user?.profile?.user_role;
    const targetUserRole = profile?.user_role;

    // If current user is student and target is professor/investor, they need to send a project request
    if (currentUserRole === 'student' && (targetUserRole === 'professor' || targetUserRole === 'investor')) {
      // For now, just inform them - they need to send project request from project page
      alert('To message professors or investors, please send them a project view request from one of your projects.');
      return;
    }
    
    // For all other cases (professor/investor -> student, or same roles), show message modal
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !profile || !user) return;

    try {
      setSendingMessage(true);
      
      // Create conversation with initial message
      const conversation = await messagingApi.createConversation({
        recipient_id: profile.id,
        message: messageText.trim()
      });

      // Navigate to the conversation
      router.push(`/inbox/${conversation.id}`);
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message. You may need to send a project request first if you are a student.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex" style={{backgroundColor: 'var(--background)'}}>
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          <div className="flex-1 min-w-0 pt-16 lg:pt-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--primary-orange)'}}></div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (error || !profile) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex" style={{backgroundColor: 'var(--background)'}}>
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          <div className="flex-1 min-w-0 pt-16 lg:pt-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--hover-bg)'}}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--text-muted)'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{color: 'var(--text-primary)'}}>
                  Profile Not Found
                </h2>
                <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
                  {error || 'The user profile you are looking for does not exist or is private.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const isOwnProfile = user?.username === profile.username;

  // Get all user projects for tabs
  const allUserProjects = [
    ...(profile?.owned_projects || []),
    ...(profile?.member_projects || [])
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-all duration-300 ease-in-out" style={{backgroundColor: 'var(--background)'}}>
        {/* Mobile Header */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-lg" 
          style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid var(--border)'}}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg transition-all duration-200"
            style={{color: 'var(--text-primary)'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold" 
            style={{color: 'var(--text-primary)'}}
          >
            Profile
          </motion.h1>
          <div className="w-10"></div>
        </motion.div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowMobileNav(false)}
            />
          )}
        </AnimatePresence>

        <div className="flex">
          {/* Left Navigation */}
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-w-0 pt-16 lg:pt-0"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Profile Header */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-xl overflow-hidden mb-8" 
                style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}
              >
                {/* Profile Banner */}
                <div className="h-48 relative">
                  {profile?.banner_style === 'image' && profile?.banner_image ? (
                    <>
                      <img
                        src={profile.banner_image}
                        alt="Profile banner"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div 
                      className="w-full h-full relative" 
                      style={{ 
                        background: getProfileBannerGradient(profile?.banner_gradient || DEFAULT_PROFILE_BANNER_GRADIENT).gradient 
                      }}
                    >
                      <div className="absolute inset-0 opacity-10"
                           style={{ 
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
                           }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Profile Content */}
                <div className="relative px-6 pb-6 -mt-16">
                  <div className="flex items-end justify-between mb-6">
                    {/* Profile Picture */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 overflow-hidden" style={{borderColor: 'var(--surface)', backgroundColor: 'var(--surface)'}}>
                        {profile.profile_picture ? (
                          <img
                            src={profile.profile_picture}
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{color: 'var(--text-muted)', backgroundColor: 'var(--hover-bg)'}}>
                            {profile.full_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 rounded-full" style={{borderColor: 'var(--surface)'}}></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {/* Social Links */}
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors"
                          style={{backgroundColor: 'var(--hover-bg)'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{color: 'var(--primary-orange)'}}>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {profile.github_url && (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors"
                          style={{backgroundColor: 'var(--hover-bg)'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{color: 'var(--primary-orange)'}}>
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      {profile.website_url && (
                        <a
                          href={profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors"
                          style={{backgroundColor: 'var(--hover-bg)'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--primary-orange)'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      
                      {/* Message and Follow Buttons */}
                      {user && !isOwnProfile && (
                        <>
                          {/* Message Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStartChat}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                            style={{
                              backgroundColor: 'var(--hover-bg)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Message
                          </motion.button>

                          {/* Follow Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFollowToggle}
                            disabled={followLoading}
                            className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
                            style={{
                              backgroundColor: profile.is_following ? 'var(--hover-bg)' : 'var(--primary-orange)',
                              color: profile.is_following ? 'var(--text-primary)' : 'white',
                              border: profile.is_following ? '1px solid var(--border)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = profile.is_following ? 'var(--active-bg)' : 'var(--accent-terracotta)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = profile.is_following ? 'var(--hover-bg)' : 'var(--primary-orange)';
                            }}
                          >
                            {followLoading ? 'Loading...' : (profile.is_following ? 'Following' : 'Follow')}
                          </motion.button>
                        </>
                      )}
                      
                      {isOwnProfile && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push('/profile')}
                          className="px-6 py-2 rounded-lg font-medium transition-colors"
                          style={{backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                        >
                          Edit Profile
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {/* Name and Username */}
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>
                      {profile.full_name || profile.username}
                    </h1>
                    <p style={{color: 'var(--text-secondary)'}}>@{profile.username}</p>
                  </div>

                  {/* Role Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        profile.user_role === 'student'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : profile.user_role === 'professor'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}
                    >
                      {profile.user_role}
                    </span>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div className="mb-4">
                      <p style={{color: 'var(--text-primary)'}}>{profile.bio}</p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 text-sm" style={{color: 'var(--text-secondary)'}}>
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {profile.location}
                      </span>
                    )}
                    {profile.university_name && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {profile.university_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {profile.followers_count} followers
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {profile.following_count} following
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Content Tabs */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-xl" 
                style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}
              >
                {/* Tab Navigation */}
                <div style={{borderBottom: '1px solid var(--border)'}}>
                  <nav className="flex space-x-8 px-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('posts')}
                      className={`py-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                        activeTab === 'posts'
                          ? 'border-[var(--primary-orange)]'
                          : 'border-transparent'
                      }`}
                      style={{
                        color: activeTab === 'posts' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'posts') e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'posts') e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      Posts ({profile.posts_count || 0})
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('projects')}
                      className={`py-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                        activeTab === 'projects'
                          ? 'border-[var(--primary-orange)]'
                          : 'border-transparent'
                      }`}
                      style={{
                        color: activeTab === 'projects' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'projects') e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'projects') e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      Projects ({typeof profile.projects_count === 'object' ? profile.projects_count.total : profile.projects_count || 0})
                    </motion.button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'posts' && (
                      <motion.div 
                        key="posts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {profile.user_posts && profile.user_posts.length > 0 ? (
                          profile.user_posts.map((post, index) => (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <PostSummaryCard post={post} router={router} />
                            </motion.div>
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12"
                          >
                            <motion.svg 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="w-16 h-16 mx-auto mb-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              style={{color: 'var(--text-muted)'}}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </motion.svg>
                            <motion.h3 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="text-lg font-medium mb-2" 
                              style={{color: 'var(--text-primary)'}}
                            >
                              No posts yet
                            </motion.h3>
                            <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                              style={{color: 'var(--text-secondary)'}}
                            >
                              {isOwnProfile 
                                ? "You haven't created any posts yet." 
                                : `${profile.full_name || profile.username} hasn't shared any posts yet.`}
                            </motion.p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'projects' && (
                      <motion.div 
                        key="projects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {allUserProjects.length > 0 ? (
                          allUserProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <ProjectSummaryCard project={project} router={router} />
                            </motion.div>
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12"
                          >
                            <motion.svg 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="w-16 h-16 mx-auto mb-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              style={{color: 'var(--text-muted)'}}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </motion.svg>
                            <motion.h3 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="text-lg font-medium mb-2" 
                              style={{color: 'var(--text-primary)'}}
                            >
                              No projects yet
                            </motion.h3>
                            <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                              style={{color: 'var(--text-secondary)'}}
                            >
                              {isOwnProfile 
                                ? "You haven't created any projects yet." 
                                : `${profile.full_name || profile.username} hasn't shared any projects yet.`}
                            </motion.p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-lg shadow-xl max-w-lg w-full"
            style={{ background: 'var(--surface)' }}
          >
            <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                  Send Message to {profile?.full_name || profile?.username}
                </h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
                className="w-full px-4 py-2 border rounded-lg font-canva-sans resize-none focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-orange)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />

              <div className="mt-4 flex gap-3 justify-end">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-lg font-canva-sans transition-colors"
                  style={{ color: 'var(--text-primary)', background: 'var(--hover-bg)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--active-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage}
                  className="px-6 py-2 rounded-lg font-canva-sans text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--primary-orange)' }}
                  onMouseEnter={(e) => !sendingMessage && (e.currentTarget.style.background = 'var(--accent-terracotta)')}
                  onMouseLeave={(e) => !sendingMessage && (e.currentTarget.style.background = 'var(--primary-orange)')}
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </ThemeProvider>
  );
}