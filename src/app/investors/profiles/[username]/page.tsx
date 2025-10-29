'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Building2, GraduationCap, ArrowLeft, ExternalLink, Briefcase, TrendingUp, Inbox, Bell, ChevronDown, Users, Calendar, FileText, Eye } from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_picture: string | null;
  banner_image: string | null;
  user_role: string;
  university: {
    id: number;
    name: string;
  } | null;
  location: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  skills: string[];
  interests: string[];
  date_joined: string;
  owned_projects: ProjectSummary[];
  member_projects: ProjectSummary[];
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

interface ProjectSummary {
  id: string;
  title: string;
  summary: string;
  status: string;
  project_type: string;
  categories: string[];
  needs: string[];
  team_count: number;
  created_at: string;
  banner_gradient: string;
}

export default function InvestorProfileView() {
  const { user, profile: currentUserProfile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (user && user.user_role !== 'investor') {
      router.push(`/profiles/${username}`);
      return;
    }

    if (username) {
      loadProfile();
    }
  }, [username, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(`/api/accounts/profile/investor/${username}/`) as UserProfile & { is_following?: boolean, followers_count?: number };
      setProfile(data);
      
      // Set follow status from profile data
      setIsFollowing(data.is_following || false);
      setFollowersCount(data.followers_count || 0);
    } catch (err: unknown) {
      console.error('Failed to load profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (followLoading) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/api/accounts/unfollow/${username}/`);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await api.post(`/api/accounts/follow/${username}/`);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (err: unknown) {
      console.error('Failed to toggle follow:', err);
      alert(err instanceof Error ? err.message : 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
                 style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary-orange)' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold mb-2 font-roca-two" style={{ color: 'var(--text-primary)' }}>
              Profile Not Found
            </h2>
            <p className="mb-6 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
              {error || 'The profile you\'re looking for doesn\'t exist or is not accessible.'}
            </p>
            <Link href="/investors" className="inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold font-canva-sans"
                  style={{ background: 'var(--primary-orange)' }}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg border-b" 
             style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
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

              <div className="hidden md:flex items-center space-x-2">
                <Link href="/investors" className="font-canva-sans text-sm transition-colors" 
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-orange)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  Discover
                </Link>
                <span style={{ color: 'var(--text-secondary)' }}>/</span>
                <span className="font-canva-sans text-sm font-semibold" style={{ color: 'var(--primary-orange)' }}>
                  Profile
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link href="/inbox" className="relative p-2 rounded-lg transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Inbox className="w-5 h-5" />
                </Link>
                <Link href="/investors/notifications" className="relative p-2 rounded-lg transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Bell className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--accent-pine) 100%)' }}>
                      {currentUserProfile?.profile_picture ? (
                        <img src={currentUserProfile.profile_picture} alt={user?.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm font-roca-two">
                          {user?.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 hidden lg:block" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                          <div className="font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                            {currentUserProfile?.full_name || user?.username}
                          </div>
                          <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                            @{user?.username}
                          </div>
                          <div className="mt-1 px-2 py-1 rounded text-xs font-semibold inline-block"
                               style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                            💼 Investor
                          </div>
                        </div>
                        <div className="py-2">
                          <Link href="/investors/profile" className="block px-4 py-2 text-sm font-canva-sans transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            View Profile
                          </Link>
                          <Link href="/settings" className="block px-4 py-2 text-sm font-canva-sans transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Settings
                          </Link>
                          <div className="border-t my-2" style={{ borderColor: 'var(--border)' }}></div>
                          <button onClick={() => { localStorage.clear(); router.push('/login'); }}
                            className="w-full text-left px-4 py-2 text-sm font-canva-sans transition-colors"
                            style={{ color: 'var(--secondary-red)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/investors"
            className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors duration-200 font-canva-sans text-sm"
            style={{ color: 'var(--text-secondary)', background: 'var(--surface)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden shadow-lg mb-6"
            style={{ background: 'var(--surface)' }}>
            {/* Banner with Investor View Badge */}
            <div className="h-48 relative"
                 style={{
                   background: profile.banner_image 
                     ? `url(${profile.banner_image})` 
                     : 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}>
              {/* Investor View Badge */}
              <div className="absolute top-4 right-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-canva-sans"
                     style={{ background: 'rgba(251, 146, 60, 0.3)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <Eye className="w-3 h-3 mr-1" />
                  Investor View
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-8 pb-8">
              {/* Profile Picture - Overlapping Banner */}
              <div className="flex items-start justify-between -mt-16 mb-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-xl"
                       style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)', borderColor: 'var(--surface)' }}>
                    {profile.profile_picture ? (
                      <img src={profile.profile_picture} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold font-roca-two">
                        {getInitials(profile.first_name, profile.last_name)}
                      </div>
                    )}
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 bg-green-500"
                       style={{ borderColor: 'var(--surface)' }}></div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-20">
                  <button 
                    onClick={() => router.push('/inbox')}
                    className="inline-flex items-center px-6 py-3 rounded-xl font-semibold font-canva-sans transition-all hover:scale-105 shadow-md border-2"
                    style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                    <Mail className="w-5 h-5 mr-2" />
                    Message
                  </button>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className="inline-flex items-center px-6 py-3 rounded-xl font-semibold font-canva-sans text-white transition-all hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: isFollowing ? '#6b7280' : 'var(--primary-orange)' }}>
                    {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 font-roca-two" style={{ color: 'var(--text-primary)' }}>
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-lg mb-3 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  @{profile.username}
                </p>
                
                {/* Role Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold font-canva-sans mb-4 capitalize"
                     style={{ background: 'var(--accent-pine)', color: 'white' }}>
                  {profile.user_role === 'student' ? '🎓 student' : profile.user_role === 'professor' ? '👨‍🏫 professor' : '💼 ' + profile.user_role}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-base mb-4 font-canva-sans leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {profile.bio}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.university && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{profile.university.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{followersCount} follower{followersCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{profile.following_count || 0} following</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(profile.linkedin_url || profile.github_url || profile.website_url) && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-canva-sans transition-colors"
                       style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                       onMouseEnter={(e) => e.currentTarget.style.background = 'var(--active-bg)'}
                       onMouseLeave={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}>
                      <Briefcase className="w-4 h-4" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-canva-sans transition-colors"
                       style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                       onMouseEnter={(e) => e.currentTarget.style.background = 'var(--active-bg)'}
                       onMouseLeave={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}>
                      GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-canva-sans transition-colors"
                       style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                       onMouseEnter={(e) => e.currentTarget.style.background = 'var(--active-bg)'}
                       onMouseLeave={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}>
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Skills and Interests */}
              {(profile.skills?.length > 0 || profile.interests?.length > 0) && (
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                  {profile.skills?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                        SKILLS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium font-canva-sans"
                                style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.interests?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                        INTERESTS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium font-canva-sans"
                                style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Projects Section Header */}
          <div className="rounded-t-2xl shadow-sm border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="px-8 py-4">
              <div className="font-semibold font-canva-sans relative inline-block"
                   style={{ color: 'var(--primary-orange)' }}>
                Projects ({((profile.owned_projects?.length || 0) + (profile.member_projects?.length || 0))})
                <div className="absolute bottom-0 left-0 right-0 h-0.5"
                     style={{ background: 'var(--primary-orange)' }}></div>
              </div>
            </div>
          </div>

          {/* Projects Content */}
          <div className="rounded-b-2xl shadow-sm p-8" style={{ background: 'var(--surface)' }}>
            <div>
              {((profile.owned_projects && profile.owned_projects.length > 0) || (profile.member_projects && profile.member_projects.length > 0)) ? (
                [...(profile.owned_projects || []), ...(profile.member_projects || [])].map((project) => (
                  <Link key={project.id} href={`/investors/projects/${project.id}`} className="block mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl border transition-all hover:shadow-lg cursor-pointer"
                      style={{ borderColor: 'var(--border)', background: 'var(--hover-bg)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'var(--primary-orange)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                            {project.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-sm font-canva-sans capitalize" style={{ color: 'var(--text-secondary)' }}>
                              {project.project_type.replace('_', ' ')}
                            </span>
                            <span className="flex items-center gap-1 text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                              <Users className="w-4 h-4" />
                              {project.team_count} members
                            </span>
                            <span className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                              {formatDate(project.created_at)}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-canva-sans capitalize flex-shrink-0 ${
                          project.status === 'launched' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : project.status === 'mvp'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      {project.summary && (
                        <p className="text-sm mb-3 font-canva-sans line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {project.summary}
                        </p>
                      )}

                      {project.categories && project.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.categories.slice(0, 4).map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-semibold font-canva-sans"
                              style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-lg font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    No public projects available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
