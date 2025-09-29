'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PostCardNew from '../components/PostCardNew';
import ProjectCard from '../components/ProjectCard';
import LeftNavigation from '../components/LeftNavigation';
import { ThemeProvider } from '../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/lib/auth';
import { User, Post, Project, UserProfile, ProfileUpdateData, PostSummary, EnhancedUserProfile, PostData, ProjectSummary } from '@/types';
import { ApiError } from '@/lib/api';
import { getProjectBannerGradient, DEFAULT_PROJECT_BANNER_GRADIENT } from '@/lib/projectBranding';
import { Palette, Image as ImageIcon } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex">
          {/* Left Navigation */}
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          
          {/* Main Content */}
          <div className="flex-1 lg:ml-0 pt-16 lg:pt-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Status Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600">{success}</p>
                </div>
              )}

              {/* Profile Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                {/* Cover Photo */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                  {/* Avatar */}
                  <div className="flex items-end justify-between -mt-16 mb-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden">
                        {profile.profile_picture ? (
                          <img
                            src={profile.profile_picture}
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold bg-gray-100 dark:bg-gray-700">
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
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex space-x-2">
                      {!isEditing && (
                        <button
                          onClick={handleEditProfile}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Profile</span>
                        </button>
                      )}
                      
                      {isEditing && (
                        <>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                          >
                            Change Photo
                          </button>
                          {profile.profile_picture && (
                            <button
                              onClick={handleDeleteImage}
                              disabled={uploadingImage}
                              className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              Delete Photo
                            </button>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    /* View Mode */
                    <div className="space-y-4">
                      {/* Name and Handle */}
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {profile.full_name || profile.username}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">@{profile.username}</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profile.user_role === 'student' ? 'bg-blue-100 text-blue-800' :
                            profile.user_role === 'professor' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {profile.user_role === 'student' ? '🎓 Student' : 
                             profile.user_role === 'professor' ? '👨‍🏫 Professor' : 
                             '💼 Investor'}
                          </span>
                        </div>
                        
                        {/* Follower/Following Stats */}
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">
                            <span className="font-bold text-gray-900 dark:text-white">{profile.followers_count || 0}</span> followers
                          </span>
                          <span className="font-medium">
                            <span className="font-bold text-gray-900 dark:text-white">{profile.following_count || 0}</span> following
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      {profile.bio && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
                      )}

                      {/* Education & Location */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                          <select
                            name="user_role"
                            value={formData.user_role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            <option value="student">Student</option>
                            <option value="professor">Professor</option>
                            <option value="investor">Investor</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University</label>
                          <input
                            type="text"
                            name="university"
                            value={profile?.university_name || 'No university set'}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            University changes require verification. Contact support if needed.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      {/* Role-specific fields */}
                      {formData.user_role === 'student' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Major</label>
                            <input
                              type="text"
                              name="major"
                              value={formData.major || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="e.g., Computer Science"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Graduation Year</label>
                            <input
                              type="number"
                              name="graduation_year"
                              value={formData.graduation_year || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                            <input
                              type="text"
                              name="department"
                              value={formData.department || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="e.g., Computer Science Department"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Research Interests</label>
                            <textarea
                              name="research_interests"
                              value={formData.research_interests || ''}
                              onChange={handleChange}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="Describe your research interests..."
                            />
                          </div>
                        </>
                      )}

                      {formData.user_role === 'investor' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company/Fund</label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="e.g., Venture Capital Fund"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Focus</label>
                            <textarea
                              name="investment_focus"
                              value={formData.investment_focus || ''}
                              onChange={handleChange}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="Describe your investment focus..."
                            />
                          </div>
                        </>
                      )}

                      {/* Social Links */}
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Social Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                            <input
                              type="url"
                              name="linkedin_url"
                              value={formData.linkedin_url || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="https://linkedin.com/in/yourname"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                            <input
                              type="url"
                              name="website_url"
                              value={formData.website_url || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                            <input
                              type="url"
                              name="github_url"
                              value={formData.github_url || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Tab Headers */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('posts')}
                      className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'posts'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      Posts ({profile?.user_posts?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'projects'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      Projects ({allUserProjects.length})
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'posts' && (
                    <div className="space-y-6">
                      {profile?.user_posts && profile.user_posts.length > 0 ? (
                        profile.user_posts.map(postSummary => {
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
                            <div key={postSummary.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts yet</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Start sharing your thoughts and ideas with the community.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="space-y-6">
                      {/* Owned Projects Section */}
                      {profile?.owned_projects && profile.owned_projects.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Owned Projects ({profile.owned_projects.length})
                          </h3>
                          <div className="grid gap-6 md:grid-cols-2">
                            {profile.owned_projects.map(project => (
                              <ProjectSummaryCard
                                key={project.id}
                                project={project}
                                role="owner"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Member Projects Section */}
                      {profile?.member_projects && profile.member_projects.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Member Projects ({profile.member_projects.length})
                          </h3>
                          <div className="grid gap-6 md:grid-cols-2">
                            {profile.member_projects.map(project => (
                              <ProjectSummaryCard
                                key={project.id}
                                project={project}
                                role="member"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* No Projects State */}
                      {allUserProjects.length === 0 && (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects yet</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create your first project to showcase your work.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {showMobileNav && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowMobileNav(false)}
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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
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
            <span
              className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/90 text-gray-800 shadow-sm"
            >
              {bannerHasImage ? (
                <>
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Custom Banner
                </>
              ) : (
                <>
                  <Palette className="w-3 h-3 mr-1" />
                  {bannerGradient.name}
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Header with role badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
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
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>{project.team_count} {project.team_count === 1 ? 'member' : 'members'}</span>
          <span className="capitalize">{project.visibility}</span>
        </div>
        <span>{new Date(project.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
