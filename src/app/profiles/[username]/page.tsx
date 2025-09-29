'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LeftNavigation from '../../components/LeftNavigation';
import { api } from '@/lib/api';
import { EnhancedUserProfile } from '@/types';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();
  const [profile, setProfile] = useState<EnhancedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
        <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
        <div className="flex-1 lg:ml-0">
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-orange)' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
        <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
        <div className="flex-1 lg:ml-0">
          <div className="max-w-6xl mx-auto p-6">
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
                <svg className="w-12 h-12" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-roca-two mb-3" style={{ color: 'var(--text-primary)' }}>
                Profile Not Found
              </h2>
              <p className="text-lg font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                {error || 'The user profile you are looking for does not exist or is private.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
      
      {/* Mobile Nav Overlay */}
      {showMobileNav && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileNav(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 sticky top-0 z-30" 
             style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--hover-bg)' }}
          >
            <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
            Profile
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {/* Enhanced Profile Header */}
          <div className="relative rounded-2xl overflow-hidden mb-8" 
               style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--hover-bg) 100%)', 
                        border: '1px solid var(--border)', 
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Hexagonal Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-8 h-8 transform rotate-45" style={{ backgroundColor: 'var(--primary-orange)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="absolute top-12 right-12 w-6 h-6 transform rotate-12" style={{ backgroundColor: 'var(--accent-pine)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="absolute bottom-8 left-8 w-10 h-10 transform -rotate-12" style={{ backgroundColor: 'var(--accent-terracotta)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="absolute bottom-4 right-20 w-4 h-4 transform rotate-45" style={{ backgroundColor: 'var(--accent-navy)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="absolute top-1/2 left-4 w-5 h-5 transform -rotate-30" style={{ backgroundColor: 'var(--primary-orange)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
            </div>

            <div className="relative p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                {/* Enhanced Profile Picture */}
                <div className="flex-shrink-0 relative">
                  <div className="relative">
                    <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl" 
                         style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))',
                                  border: '4px solid var(--surface)' }}>
                      {profile.profile_picture ? (
                        <div 
                          className="w-full h-full object-cover bg-cover bg-center"
                          style={{ backgroundImage: `url(${profile.profile_picture})` }}
                          aria-label={profile.full_name}
                        />
                      ) : (
                        <span className="text-white font-bold text-5xl lg:text-6xl font-roca-two">
                          {profile.full_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-lg"
                         style={{ backgroundColor: 'var(--accent-pine)' }}></div>
                  </div>
                </div>

                {/* Enhanced Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                        <div className="flex items-center space-x-4">
                          <h1 className="text-3xl lg:text-4xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                            {profile.full_name || profile.username}
                          </h1>
                          <span
                            className="px-4 py-2 text-sm font-semibold font-canva-sans rounded-full shadow-sm"
                            style={{
                              backgroundColor: profile.user_role === 'student' ? 'var(--accent-pine)' : 
                                               profile.user_role === 'professor' ? 'var(--accent-navy)' : 'var(--accent-terracotta)',
                              color: 'white'
                            }}
                          >
                            {profile.user_role}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xl font-canva-sans mb-4" style={{ color: 'var(--text-secondary)' }}>
                        @{profile.username}
                      </p>

                      {profile.bio && (
                        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <p className="text-base font-canva-sans leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {profile.bio}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-6 text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                        {profile.location && (
                          <span className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {profile.location}
                          </span>
                        )}
                        {profile.university_name && (
                          <span className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {profile.university_name}
                          </span>
                        )}
                        <span className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {profile.followers_count} followers
                        </span>
                        <span className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {profile.following_count} following
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Actions */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      {/* Social Links */}
                      <div className="flex space-x-3">
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                          >
                            <svg className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                        {profile.github_url && (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                          >
                            <svg className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {profile.website_url && (
                          <a
                            href={profile.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                          >
                            <svg className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* Follow Button */}
                      {user && !isOwnProfile && (
                        <button
                          onClick={handleFollowToggle}
                          disabled={followLoading}
                          className="px-8 py-3 rounded-xl font-semibold font-canva-sans transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 min-w-32"
                          style={{
                            backgroundColor: profile.is_following ? 'var(--surface)' : 'var(--primary-orange)',
                            color: profile.is_following ? 'var(--text-primary)' : 'white',
                            border: profile.is_following ? '2px solid var(--border)' : 'none'
                          }}
                        >
                          {followLoading ? 'Loading...' : (profile.is_following ? 'Following' : 'Follow')}
                        </button>
                      )}

                      {/* Edit Profile Button for own profile */}
                      {isOwnProfile && (
                        <a
                          href="/profile"
                          className="px-8 py-3 rounded-xl font-semibold font-canva-sans transition-all duration-200 hover:scale-105 hover:shadow-lg inline-block"
                          style={{
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-primary)',
                            border: '2px solid var(--border)'
                          }}
                        >
                          Edit Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Enhanced Stats with Hexagonal Design */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="relative text-center p-6 rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden" 
                 style={{ backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
              {/* Hexagonal background decoration */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-20 transform rotate-12" 
                   style={{ backgroundColor: 'var(--primary-orange)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center transform rotate-45"
                   style={{ backgroundColor: 'var(--primary-orange)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', opacity: 0.15 }}>
                <svg className="w-7 h-7 transform -rotate-45" style={{ color: 'var(--primary-orange)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--primary-orange)' }}>
                {profile.posts_count}
              </div>
              <div className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Posts</div>
            </div>
            
            <div className="relative text-center p-6 rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden" 
                 style={{ backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
              {/* Hexagonal background decoration */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-20 transform -rotate-12" 
                   style={{ backgroundColor: 'var(--accent-pine)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center transform rotate-45"
                   style={{ backgroundColor: 'var(--accent-pine)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', opacity: 0.15 }}>
                <svg className="w-7 h-7 transform -rotate-45" style={{ color: 'var(--accent-pine)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                </svg>
              </div>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--accent-pine)' }}>
                {typeof profile.projects_count === 'object' ? profile.projects_count.total : profile.projects_count}
              </div>
              <div className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Projects</div>
            </div>
            
            <div className="relative text-center p-6 rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden" 
                 style={{ backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
              {/* Hexagonal background decoration */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-20 transform rotate-30" 
                   style={{ backgroundColor: 'var(--accent-terracotta)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center transform rotate-45"
                   style={{ backgroundColor: 'var(--accent-terracotta)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', opacity: 0.15 }}>
                <svg className="w-7 h-7 transform -rotate-45" style={{ color: 'var(--accent-terracotta)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.1.9-2 2-2s2 .9 2 2v1h2v-1c0-1.1.9-2 2-2s2 .9 2 2v1h2v-1c0-1.1.9-2 2-2s2 .9 2 2v1h2c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2h2z"/>
                </svg>
              </div>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--accent-terracotta)' }}>
                {profile.followers_count}
              </div>
              <div className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Followers</div>
            </div>
            
            <div className="relative text-center p-6 rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden" 
                 style={{ backgroundColor: 'var(--surface)', 
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
              {/* Hexagonal background decoration */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-20 transform -rotate-30" 
                   style={{ backgroundColor: 'var(--accent-navy)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
              <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center transform rotate-45"
                   style={{ backgroundColor: 'var(--accent-navy)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', opacity: 0.15 }}>
                <svg className="w-7 h-7 transform -rotate-45" style={{ color: 'var(--accent-navy)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--accent-navy)' }}>
                {profile.following_count}
              </div>
              <div className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Following</div>
            </div>
          </div>

          {/* Enhanced Content Tabs */}
          <div className="space-y-8 mt-12">
            {/* Recent Posts */}
            {profile.user_posts && profile.user_posts.length > 0 && (
              <div className="rounded-2xl p-8" 
                   style={{ backgroundColor: 'var(--surface)', 
                            border: '1px solid var(--border)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{ backgroundColor: 'var(--primary-orange)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                    Recent Posts
                  </h2>
                </div>
                <div className="space-y-6">
                  {profile.user_posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="p-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg" 
                         style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border)' }}>
                      <p className="font-canva-sans text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likes_count} likes
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post.comments_count} comments
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <a
                          href={`/posts/${post.id}`}
                          className="px-4 py-2 rounded-lg text-sm font-semibold font-canva-sans transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}
                        >
                          View Post
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Projects */}
            {((profile.owned_projects && profile.owned_projects.length > 0) || 
              (profile.member_projects && profile.member_projects.length > 0)) && (
              <div className="rounded-2xl p-8" 
                   style={{ backgroundColor: 'var(--surface)', 
                            border: '1px solid var(--border)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{ backgroundColor: 'var(--accent-pine)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                    Projects
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Owned Projects */}
                  {profile.owned_projects && profile.owned_projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="p-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg" 
                         style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                              {project.title}
                            </h3>
                            <span className="px-3 py-1 text-xs font-bold font-canva-sans rounded-full" 
                                  style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}>
                              OWNER
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="text-sm font-semibold font-canva-sans px-3 py-1 rounded-lg" 
                                  style={{ backgroundColor: 'var(--surface)', color: 'var(--primary-orange)', border: '1px solid var(--border)' }}>
                              {project.project_type}
                            </span>
                            <span className="text-sm font-canva-sans flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {project.status}
                            </span>
                            <span className="text-sm font-canva-sans flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {project.team_count} members
                            </span>
                          </div>
                        </div>
                        <a
                          href={`/projects/${project.id}`}
                          className="px-4 py-2 rounded-lg text-sm font-semibold font-canva-sans transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  ))}
                  
                  {/* Member Projects */}
                  {profile.member_projects && profile.member_projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="p-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg" 
                         style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                              {project.title}
                            </h3>
                            <span className="px-3 py-1 text-xs font-bold font-canva-sans rounded-full" 
                                  style={{ backgroundColor: 'var(--accent-pine)', color: 'white' }}>
                              MEMBER
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="text-sm font-semibold font-canva-sans px-3 py-1 rounded-lg" 
                                  style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-pine)', border: '1px solid var(--border)' }}>
                              {project.project_type}
                            </span>
                            <span className="text-sm font-canva-sans flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {project.status}
                            </span>
                            <span className="text-sm font-canva-sans flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {project.team_count} members
                            </span>
                          </div>
                        </div>
                        <a
                          href={`/projects/${project.id}`}
                          className="px-4 py-2 rounded-lg text-sm font-semibold font-canva-sans transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: 'var(--accent-pine)', color: 'white' }}
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Empty state */}
            {(!profile.user_posts || profile.user_posts.length === 0) && 
             (!profile.owned_projects || profile.owned_projects.length === 0) && 
             (!profile.member_projects || profile.member_projects.length === 0) && (
              <div className="text-center py-20 rounded-2xl" 
                   style={{ 
                     backgroundColor: 'var(--surface)', 
                     border: '1px solid var(--border)',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' 
                   }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" 
                     style={{ backgroundColor: 'var(--hover-bg)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-roca-two mb-3" style={{ color: 'var(--text-primary)' }}>
                  No Content Yet
                </h3>
                <p className="text-lg font-canva-sans max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  {isOwnProfile 
                    ? "You haven't created any posts or projects yet. Start sharing your ideas and projects with the community!" 
                    : `${profile.full_name || profile.username} hasn't shared any content yet. Check back later for updates!`}
                </p>
                {isOwnProfile && (
                  <div className="flex justify-center gap-4 mt-8">
                    <a
                      href="/feed"
                      className="px-6 py-3 rounded-xl font-semibold font-canva-sans transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}
                    >
                      Create Post
                    </a>
                    <a
                      href="/projects"
                      className="px-6 py-3 rounded-xl font-semibold font-canva-sans transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: 'var(--accent-pine)', color: 'white' }}
                    >
                      Start Project
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
