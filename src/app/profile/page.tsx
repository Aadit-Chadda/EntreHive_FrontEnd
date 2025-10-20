'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PostCardNew from '../components/PostCardNew';
import ProjectCard from '../components/ProjectCard';
import LeftNavigation from '../components/LeftNavigation';
import RightSidebar from '../components/RightSidebar';
import { ThemeProvider } from '../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/lib/auth';
import { User, Post, Project, UserProfile, ProfileUpdateData, PostSummary, EnhancedUserProfile, PostData, ProjectSummary } from '@/types';
import { ApiError } from '@/lib/api';
import { getProjectBannerGradient, DEFAULT_PROJECT_BANNER_GRADIENT } from '@/lib/projectBranding';
import { getProfileBannerGradient, DEFAULT_PROFILE_BANNER_GRADIENT, PROFILE_BANNER_GRADIENTS } from '@/lib/profileBranding';
import type { ProfileBannerStyle } from '@/lib/profileBranding';
import { Palette, Image as ImageIcon, Edit3 } from 'lucide-react';
import VerificationWarningBanner from '../components/VerificationWarningBanner';

export default function ProfilePage() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isUpdatingBanner, setIsUpdatingBanner] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  // Redirect investors to their dedicated profile page
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push('/investors/profile');
    }
  }, [user, router]);

  // Form state for editing
  const [formData, setFormData] = useState<ProfileUpdateData>({
    first_name: '',
    last_name: '',
    user_role: 'student',
    bio: '',
    location: '',
    university: '',
    major: '',
    graduation_year: undefined,
    department: '',
    research_interests: '',
    investment_focus: '',
    company: '',
    linkedin_url: '',
    website_url: '',
    github_url: '',
    banner_style: 'gradient',
    banner_gradient: DEFAULT_PROFILE_BANNER_GRADIENT,
    banner_image: undefined,
    is_profile_public: true,
    show_email: false,
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        user_role: profile.user_role || 'student',
        bio: profile.bio || '',
        location: profile.location || '',
        university: profile.university || '',
        major: profile.major || '',
        graduation_year: profile.graduation_year || undefined,
        department: profile.department || '',
        research_interests: profile.research_interests || '',
        investment_focus: profile.investment_focus || '',
        company: profile.company || '',
        linkedin_url: profile.linkedin_url || '',
        website_url: profile.website_url || '',
        github_url: profile.github_url || '',
        banner_style: profile.banner_style || 'gradient',
        banner_gradient: profile.banner_gradient || DEFAULT_PROFILE_BANNER_GRADIENT,
        banner_image: profile.banner_image || undefined,
        is_profile_public: profile.is_profile_public ?? true,
        show_email: profile.show_email ?? false,
      });
    }
  }, [profile]);

  // Get projects from enhanced profile (both owned and member projects)
  const allUserProjects = [
    ...(profile?.owned_projects || []),
    ...(profile?.member_projects || [])
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form data to current profile data
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        user_role: profile.user_role || 'student',
        bio: profile.bio || '',
        location: profile.location || '',
        university: profile.university || '',
        major: profile.major || '',
        graduation_year: profile.graduation_year || undefined,
        department: profile.department || '',
        research_interests: profile.research_interests || '',
        investment_focus: profile.investment_focus || '',
        company: profile.company || '',
        linkedin_url: profile.linkedin_url || '',
        website_url: profile.website_url || '',
        github_url: profile.github_url || '',
        banner_style: profile.banner_style || 'gradient',
        banner_gradient: profile.banner_gradient || DEFAULT_PROFILE_BANNER_GRADIENT,
        banner_image: profile.banner_image || undefined,
        is_profile_public: profile.is_profile_public ?? true,
        show_email: profile.show_email ?? false,
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      await AuthService.uploadProfilePicture(file);
      await refreshProfile(); // Refresh profile data
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!profile?.profile_picture) return;

    setUploadingImage(true);
    setError('');

    try {
      await AuthService.deleteProfilePicture();
      await refreshProfile(); // Refresh profile data
      setSuccess('Profile picture deleted successfully!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${apiUrl}/api/accounts/resend-verification/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to send verification email');
        return;
      }

      const data = await response.json();
      setSuccess('Verification email sent! Please check your inbox.');
      await refreshProfile(); // Refresh to update verification_sent_at
    } catch (err) {
      setError('An error occurred while sending verification email');
      console.error('Resend verification error:', err);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleBannerUpdate = async ({
    style,
    gradientId,
    file,
  }: {
    style: ProfileBannerStyle;
    gradientId: string;
    file?: File | null;
  }) => {
    if (!profile) return;

    setIsUpdatingBanner(true);
    setError('');

    try {
      const updatedData: ProfileUpdateData = {
        banner_style: style,
        banner_gradient: gradientId || DEFAULT_PROFILE_BANNER_GRADIENT,
        banner_image: style === 'image' ? file : null,
      };

      await updateProfile(updatedData);
      setSuccess('Profile banner updated successfully!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update banner');
    } finally {
      setIsUpdatingBanner(false);
      setIsBannerModalOpen(false);
    }
  };

  const getRoleSpecificDisplay = () => {
    if (!profile) return null;

    switch (profile.user_role) {
      case 'student':
        return (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {profile.major && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
                <span>{profile.major}</span>
              </div>
            )}
            {profile.graduation_year && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6" />
                </svg>
                <span>Class of {profile.graduation_year}</span>
              </div>
            )}
          </div>
        );
      case 'professor':
        return (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {profile.department && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                </svg>
                <span>{profile.department}</span>
              </div>
            )}
          </div>
        );
      case 'investor':
        return (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {profile.company && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                </svg>
                <span>{profile.company}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!profile || !user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-48 rounded mb-4"></div>
            <div className="bg-gray-300 h-64 rounded"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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

        <div className="flex">
          {/* Left Navigation */}
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-w-0 pt-16 lg:pt-0 lg:mr-80"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Status Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-[var(--secondary-red)]/10 border border-[var(--secondary-red)]/20 rounded-lg"
                  >
                    <p className="text-[var(--secondary-red)]">{error}</p>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-[var(--accent-pine)]/10 border border-[var(--accent-pine)]/20 rounded-lg"
                  >
                    <p className="text-[var(--accent-pine)]">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Verification Warning */}
              {profile && profile.should_show_verification_warning && (
                <VerificationWarningBanner
                  daysUntilDisabled={profile.days_until_disabled}
                  onResendEmail={handleResendVerification}
                  isResending={isResendingVerification}
                />
              )}

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
                  
                  {/* Banner Edit Button - Only visible in edit mode */}
                  <AnimatePresence>
                    {isEditing && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsBannerModalOpen(true)}
                        className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors shadow-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit Banner</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                  {/* Avatar */}
                  <div className="flex items-end justify-between -mt-16 mb-4">
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
                            {profile.first_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 rounded-full" style={{borderColor: 'var(--surface)'}}></div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex space-x-2">
                      <AnimatePresence>
                        {!isEditing && (
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditProfile}
                            className="flex items-center space-x-2 px-4 py-2 border border-[var(--primary-orange)] text-[var(--primary-orange)] rounded-lg hover:bg-[var(--neutral-light-orange)] transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Profile</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {isEditing && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex space-x-2"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
                            >
                              Change Photo
                            </motion.button>
                            {profile.profile_picture && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDeleteImage}
                                disabled={uploadingImage}
                                className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                              >
                                Delete Photo
                              </motion.button>
                            )}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {!isEditing ? (
                    /* View Mode */
                    <div className="space-y-4">
                      {/* Name and Handle */}
                      <div>
                        <h1 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>
                          {profile.full_name || profile.username}
                        </h1>
                        <p className="text-lg" style={{color: 'var(--text-secondary)'}}>@{profile.username}</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profile.user_role === 'student' ? 'bg-[var(--neutral-light-orange)] text-[var(--primary-orange)] border border-[var(--primary-orange)]/20' :
                            profile.user_role === 'professor' ? 'bg-[var(--accent-pine)]/10 text-[var(--accent-pine)] border border-[var(--accent-pine)]/20' :
                            'bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)] border border-[var(--accent-terracotta)]/20'
                          }`}>
                            {profile.user_role === 'student' ? '🎓 Student' : 
                             profile.user_role === 'professor' ? '👨‍🏫 Professor' : 
                             '💼 Investor'}
                          </span>
                        </div>
                        
                        {/* Follower/Following Stats */}
                        <div className="flex items-center space-x-4 mt-3 text-sm" style={{color: 'var(--text-secondary)'}}>
                          <span className="font-medium">
                            <span className="font-bold" style={{color: 'var(--text-primary)'}}>{profile.followers_count || 0}</span> followers
                          </span>
                          <span className="font-medium">
                            <span className="font-bold" style={{color: 'var(--text-primary)'}}>{profile.following_count || 0}</span> following
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      {profile.bio && (
                        <p className="leading-relaxed" style={{color: 'var(--text-primary)'}}>{profile.bio}</p>
                      )}

                      {/* Education & Location */}
                      <div className="flex flex-wrap gap-4 text-sm" style={{color: 'var(--text-secondary)'}}>
                        {profile.university_name && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                            </svg>
                            <span>{profile.university_name}</span>
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{profile.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Role Specific Info */}
                      {getRoleSpecificDisplay()}

                      {/* Links */}
                      {(profile.website_url || profile.github_url || profile.linkedin_url) && (
                        <div className="flex flex-wrap gap-3">
                          {profile.website_url && (
                            <a
                              href={profile.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <span>Website</span>
                            </a>
                          )}
                          {profile.github_url && (
                            <a
                              href={profile.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              <span>GitHub</span>
                            </a>
                          )}
                          {profile.linkedin_url && (
                            <a
                              href={profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              <span>LinkedIn</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Member since */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500">
                          Member since {new Date(profile.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Role</label>
                          <div className="w-full px-3 py-2 rounded-lg" style={{border: '1px solid var(--border)', backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)'}}>
                            <span className="capitalize">{formData.user_role}</span>
                            <span className="text-xs ml-2" style={{color: 'var(--text-muted)'}}>(Contact support to change)</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>University</label>
                          <input
                            type="text"
                            name="university"
                            value={profile?.university_name || 'No university set'}
                            disabled
                            className="w-full px-3 py-2 rounded-lg cursor-not-allowed"
                            style={{border: '1px solid var(--border)', backgroundColor: 'var(--hover-bg)', color: 'var(--text-muted)'}}
                          />
                          <p className="text-xs mt-1" style={{color: 'var(--text-muted)'}}>
                            University changes require verification. Contact support if needed.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-primary)'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-orange)';
                            e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                          style={{
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-primary)'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-orange)';
                            e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      {/* Role-specific fields */}
                      {formData.user_role === 'student' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Major</label>
                            <input
                              type="text"
                              name="major"
                              value={formData.major || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="e.g., Computer Science"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Graduation Year</label>
                            <input
                              type="number"
                              name="graduation_year"
                              value={formData.graduation_year || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="e.g., 2025"
                              min="1950"
                              max="2030"
                            />
                          </div>
                        </div>
                      )}

                      {formData.user_role === 'professor' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Department</label>
                            <input
                              type="text"
                              name="department"
                              value={formData.department || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="e.g., Computer Science Department"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Research Interests</label>
                            <textarea
                              name="research_interests"
                              value={formData.research_interests || ''}
                              onChange={handleChange}
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="Describe your research interests..."
                            />
                          </div>
                        </>
                      )}

                      {formData.user_role === 'investor' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Company/Fund</label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="e.g., Venture Capital Fund"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Investment Focus</label>
                            <textarea
                              name="investment_focus"
                              value={formData.investment_focus || ''}
                              onChange={handleChange}
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="Describe your investment focus..."
                            />
                          </div>
                        </>
                      )}

                      {/* Social Links */}
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-4" style={{color: 'var(--text-primary)'}}>Social Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>LinkedIn</label>
                            <input
                              type="url"
                              name="linkedin_url"
                              value={formData.linkedin_url || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="https://linkedin.com/in/yourname"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Website</label>
                            <input
                              type="url"
                              name="website_url"
                              value={formData.website_url || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>GitHub</label>
                            <input
                              type="url"
                              name="github_url"
                              value={formData.github_url || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary-orange)';
                              e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                              placeholder="https://github.com/yourusername"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg hover:bg-[var(--secondary-taupe)] disabled:opacity-50 transition-colors"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Content Tabs */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-xl overflow-hidden" 
                style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}
              >
                {/* Tab Headers */}
                <div style={{borderBottom: '1px solid var(--border)'}}>
                  <nav className="flex">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('posts')}
                      className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 ${
                        activeTab === 'posts'
                          ? 'border-[var(--primary-orange)]'
                          : 'border-transparent hover:border-[var(--primary-orange)]/30'
                      }`}
                      style={{
                        color: activeTab === 'posts' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                      }}
                    >
                      Posts ({profile?.user_posts?.length || 0})
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('projects')}
                      className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 ${
                        activeTab === 'projects'
                          ? 'border-[var(--primary-orange)]'
                          : 'border-transparent hover:border-[var(--primary-orange)]/30'
                      }`}
                      style={{
                        color: activeTab === 'projects' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                      }}
                    >
                      Projects ({allUserProjects.length})
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
                        className="space-y-6"
                      >
                        {profile?.user_posts && profile.user_posts.length > 0 ? (
                          profile.user_posts.map((postSummary, index) => {
                          // Convert PostSummary to PostData format for PostCardNew
                          const postData: PostData = {
                            id: postSummary.id,
                            author: {
                              id: profile.id,
                              username: profile.username,
                              full_name: profile.full_name || profile.username,
                              profile_picture: profile.profile_picture,
                              user_role: profile.user_role
                            },
                            content: postSummary.content,
                            image_url: postSummary.image_url,
                            visibility: postSummary.visibility,
                            tagged_projects: [], // Will be populated from API if needed
                            is_edited: postSummary.is_edited,
                            likes_count: postSummary.likes_count,
                            comments_count: postSummary.comments_count,
                            is_liked: false, // Will be determined by API
                            can_edit: true, // User can edit their own posts
                            can_delete: true, // User can delete their own posts
                            created_at: postSummary.created_at,
                            updated_at: postSummary.created_at
                          };

                          return (
                            <motion.div 
                              key={postSummary.id} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="rounded-lg overflow-hidden"
                            >
                              <PostCardNew
                                post={postData}
                                onPostUpdate={(updatedPost) => {
                                  // Refresh profile to get updated posts
                                  refreshProfile();
                                }}
                                onPostDelete={(deletedPostId) => {
                                  // Refresh profile to remove deleted post
                                  refreshProfile();
                                }}
                              />
                            </motion.div>
                          );
                        })
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
                            className="mx-auto h-12 w-12" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            style={{color: 'var(--text-muted)'}}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </motion.svg>
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-2 text-sm font-medium" 
                            style={{color: 'var(--text-primary)'}}
                          >
                            No posts yet
                          </motion.h3>
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="mt-1 text-sm" 
                            style={{color: 'var(--text-secondary)'}}
                          >
                            Start sharing your thoughts and ideas with the community.
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
                        className="space-y-6"
                      >
                      {/* Owned Projects Section */}
                      {profile?.owned_projects && profile.owned_projects.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <motion.h3 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="text-lg font-semibold mb-4" 
                            style={{color: 'var(--text-primary)'}}
                          >
                            Owned Projects ({profile.owned_projects.length})
                          </motion.h3>
                          <div className="grid gap-6 md:grid-cols-2">
                            {profile.owned_projects.map((project, index) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                              >
                                <ProjectSummaryCard
                                  project={project}
                                  role="owner"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Member Projects Section */}
                      {profile?.member_projects && profile.member_projects.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <motion.h3 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="text-lg font-semibold mb-4" 
                            style={{color: 'var(--text-primary)'}}
                          >
                            Member Projects ({profile.member_projects.length})
                          </motion.h3>
                          <div className="grid gap-6 md:grid-cols-2">
                            {profile.member_projects.map((project, index) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                              >
                                <ProjectSummaryCard
                                  project={project}
                                  role="member"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* No Projects State */}
                      {allUserProjects.length === 0 && (
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
                            className="mx-auto h-12 w-12" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            style={{color: 'var(--text-muted)'}}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </motion.svg>
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-2 text-sm font-medium" 
                            style={{color: 'var(--text-primary)'}}
                          >
                            No projects yet
                          </motion.h3>
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="mt-1 text-sm" 
                            style={{color: 'var(--text-secondary)'}}
                          >
                            Create your first project to showcase your work.
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

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden lg:block fixed right-0 top-0 h-screen" style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
            <RightSidebar />
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowMobileNav(false)}
            />
          )}
        </AnimatePresence>

        {/* Profile Banner Editor Modal */}
        {isBannerModalOpen && (
          <ProfileBannerEditor
            isOpen={isBannerModalOpen}
            onClose={() => setIsBannerModalOpen(false)}
            onApply={handleBannerUpdate}
            isSubmitting={isUpdatingBanner}
            currentStyle={profile?.banner_style || 'gradient'}
            currentGradient={profile?.banner_gradient || DEFAULT_PROFILE_BANNER_GRADIENT}
            currentImage={profile?.banner_image}
          />
        )}
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}

// ProjectSummaryCard component for profile display
interface ProjectSummaryCardProps {
  project: ProjectSummary;
  role: 'owner' | 'member';
}

function ProjectSummaryCard({ project, role }: ProjectSummaryCardProps) {
  const router = useRouter();

  const handleProjectClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'startup': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'side_project': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'research': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'hackathon': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'course_project': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'mvp': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'launched': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const bannerImageUrl = project.banner_image ?? undefined;
  const bannerGradient = getProjectBannerGradient(project.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT);
  const bannerHasImage = project.banner_style === 'image' && Boolean(bannerImageUrl);

  return (
    <div 
      className="rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}
      onClick={handleProjectClick}
    >
      <div className="rounded-lg overflow-hidden mb-4">
        <div className="relative h-28">
          {bannerHasImage ? (
            <>
              <img
                src={bannerImageUrl}
                alt={`${project.title} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full relative" style={{ background: bannerGradient.gradient }}>
              <div className="absolute inset-0 opacity-16"
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
              ></div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/90 text-gray-800 shadow-sm`}>
              {project.project_type.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/90 text-gray-800 shadow-sm`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Header with role badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-2" style={{color: 'var(--text-primary)'}}>
            {project.title}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectTypeColor(project.project_type)}`}>
              {project.project_type.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          role === 'owner' 
            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {role === 'owner' ? 'Owner' : 'Member'}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm" style={{color: 'var(--text-secondary)'}}>
        <div className="flex items-center gap-4">
          <span>{project.team_count} {project.team_count === 1 ? 'member' : 'members'}</span>
          <span className="capitalize">{project.visibility}</span>
        </div>
        <span>{new Date(project.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

// Profile Banner Editor Component
interface ProfileBannerEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (payload: { style: ProfileBannerStyle; gradientId: string; file?: File | null }) => void | Promise<void>;
  isSubmitting: boolean;
  currentStyle: ProfileBannerStyle;
  currentGradient: string;
  currentImage?: string | null;
}

function ProfileBannerEditor({
  isOpen,
  onClose,
  onApply,
  isSubmitting,
  currentStyle,
  currentGradient,
  currentImage,
}: ProfileBannerEditorProps) {
  const [selectedStyle, setSelectedStyle] = useState<ProfileBannerStyle>(currentStyle);
  const [selectedGradient, setSelectedGradient] = useState<string>(currentGradient || DEFAULT_PROFILE_BANNER_GRADIENT);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentStyle === 'image' ? currentImage ?? null : null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedStyle(currentStyle);
    setSelectedGradient(currentGradient || DEFAULT_PROFILE_BANNER_GRADIENT);
    setSelectedFile(null);
    setPreviewUrl(currentStyle === 'image' ? currentImage ?? null : null);
  }, [currentStyle, currentGradient, currentImage, isOpen]);

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (selectedStyle !== 'image') {
        setSelectedStyle('image');
      }
    }
  };

  const handleApply = () => {
    onApply({
      style: selectedStyle,
      gradientId: selectedGradient,
      file: selectedStyle === 'image' ? selectedFile ?? null : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{backgroundColor: 'var(--surface)'}}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>
              Customize Profile Banner
            </h2>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{color: 'var(--text-muted)'}}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
            <div className="h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {selectedStyle === 'image' && (previewUrl || currentImage) ? (
                <img
                  src={previewUrl || currentImage || ''}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: getProfileBannerGradient(selectedGradient).gradient }}
                />
              )}
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Banner Style</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedStyle('gradient')}
                className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-colors ${
                  selectedStyle === 'gradient'
                    ? 'border-[var(--primary-orange)] bg-[var(--neutral-light-orange)]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium">Gradient</span>
              </button>
              <button
                onClick={() => setSelectedStyle('image')}
                className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-colors ${
                  selectedStyle === 'image'
                    ? 'border-[var(--primary-orange)] bg-[var(--neutral-light-orange)]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Custom Image</span>
              </button>
            </div>
          </div>

          {/* Gradient Selection */}
          {selectedStyle === 'gradient' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Choose Gradient</h3>
              <div className="grid grid-cols-2 gap-3">
                {PROFILE_BANNER_GRADIENTS.map((gradient) => (
                  <button
                    key={gradient.id}
                    onClick={() => setSelectedGradient(gradient.id)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedGradient === gradient.id
                        ? 'border-[var(--primary-orange)] ring-2 ring-[var(--primary-orange)]/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-full"
                      style={{ background: gradient.gradient }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2">
                      <span className="text-white text-xs font-medium">{gradient.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          {selectedStyle === 'image' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upload Image</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg hover:bg-[var(--secondary-taupe)] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
