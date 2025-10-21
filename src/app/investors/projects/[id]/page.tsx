'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { getProjectBannerGradient } from '@/lib/projectBranding';
import { ThemeToggle } from '../../../components/ThemeProvider';
import { TrendingUp, ArrowLeft, Inbox, Bell, ChevronDown, ExternalLink, Users, Calendar, FileText, Tag, AlertTriangle, Info, Mail } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface InvestorProjectData {
  id: string;
  title: string;
  summary: string;
  project_type: string;
  status: string;
  visibility: string;
  categories: string[];
  tags: string[];
  needs: string[];
  banner_style: string;
  banner_gradient: string;
  banner_image: string | null;
  repo_url: string | null;
  pitch_url: string | null;
  owner: {
    id: number;
    username: string;
    profile: {
      first_name: string;
      last_name: string;
      profile_picture: string | null;
      user_role: string;
      university: {
        name: string;
      } | null;
    };
  };
  team_members: Array<{
    id: number;
    username: string;
    profile: {
      first_name: string;
      last_name: string;
      profile_picture: string | null;
    };
  }>;
  university: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
  is_investor_view?: boolean;
  can_send_request?: boolean;
}

export default function InvestorProjectDetailPage() {
  const { user, profile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<InvestorProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (projectId && user) {
      if (user.user_role !== 'investor') {
        router.push(`/projects/${projectId}`);
        return;
      }
      loadProject();
    }
  }, [projectId, user, router]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await api.get<InvestorProjectData>(
        `/api/projects/investor/${projectId}/`
      );
      setProject(response);
    } catch (error: any) {
      console.error('Error loading project:', error);
      if (error.status === 403 || error.status === 404) {
        alert(error.message || 'Project not found or you do not have permission to view it');
        router.push('/investors');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !project) return;
    try {
      setSending(true);
      router.push('/inbox');
      setShowMessageModal(false);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
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
            <p style={{ color: 'var(--text-secondary)' }}>Loading project...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return null;
  }

  const bannerGradient = getProjectBannerGradient(project.banner_gradient);

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
                  Project Details
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
                      {profile?.profile_picture ? (
                        <img src={profile.profile_picture} alt={user?.username} className="w-full h-full object-cover" />
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
                            {profile?.full_name || user?.username}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/investors"
            className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors duration-200 font-canva-sans text-sm"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          {/* Hero Banner - Matching the screenshot exactly */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden shadow-lg mb-8"
            style={{
              background: bannerGradient.gradient,
              padding: '48px',
            }}>
            {/* Project Type Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold font-canva-sans bg-white/20 backdrop-blur-sm text-white">
                <FileText className="w-4 h-4 mr-2" />
                {project.project_type.replace('_', ' ')}
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold font-canva-sans border-2 border-white/30 text-white">
                🌍 {project.visibility}
              </div>
              {project.categories && project.categories[0] && (
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold font-canva-sans"
                     style={{ background: 'rgba(139, 92, 246, 0.3)', color: 'white' }}>
                  🎨 {project.categories[0]}
                </div>
              )}
            </div>

            {/* Project Title */}
            <h1 className="text-5xl font-bold text-white mb-8 font-roca-two">
              {project.title}
            </h1>

            {/* Creator Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                   style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                {project.owner.profile.profile_picture ? (
                  <img src={project.owner.profile.profile_picture} alt={project.owner.username}
                       className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg font-roca-two">
                    {getInitials(project.owner.profile.first_name, project.owner.profile.last_name)}
                  </span>
                )}
              </div>
              <div>
                <div className="text-white font-semibold font-canva-sans">
                  Created by {project.owner.profile.first_name} {project.owner.profile.last_name}
                </div>
                <div className="text-white/80 text-sm font-canva-sans">
                  @{project.owner.username} • {project.university?.name || 'No University'}
                </div>
              </div>
            </div>

            {/* Team Count */}
            <div className="mt-6 text-white/90 text-sm font-canva-sans flex items-center gap-2">
              <Users className="w-4 h-4" />
              {(project.team_members?.length || 0) + 1} team member{(project.team_members?.length || 0) + 1 !== 1 ? 's' : ''}
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="rounded-2xl p-8 shadow-sm" style={{ background: 'var(--surface)' }}>
                <h2 className="text-xl font-bold mb-4 font-roca-two flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-5 h-5" />
                  About this project
                </h2>
                <p className="leading-relaxed font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  {project.summary || 'No description provided.'}
                </p>
              </motion.div>

              {/* Looking for help */}
              {project.needs && project.needs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="rounded-2xl p-8 shadow-sm" style={{ background: 'var(--surface)' }}>
                  <h2 className="text-xl font-bold mb-4 font-roca-two flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: 'var(--secondary-red)' }} />
                    Looking for help with
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.needs.map((need, idx) => (
                      <div key={idx} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium font-canva-sans"
                           style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                        {need === 'funding' && '💰'}
                        {need === 'dev' && '💻'}
                        {need === 'design' && '🎨'}
                        {need === 'marketing' && '📈'}
                        {need === 'research' && '🔬'}
                        {need === 'mentor' && '👨‍🏫'}
                        {' '}{need}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Categories & Tags */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-8 shadow-sm" style={{ background: 'var(--surface)' }}>
                <h2 className="text-xl font-bold mb-4 font-roca-two flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <Tag className="w-5 h-5" />
                  Categories & Tags
                </h2>
                
                {project.categories && project.categories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.map((category, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium font-canva-sans"
                              style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium font-canva-sans"
                              style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(!project.categories || project.categories.length === 0) && (!project.tags || project.tags.length === 0) && (
                  <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>No categories or tags added yet.</p>
                )}
              </motion.div>

              {/* Links Section */}
              {(project.repo_url || project.pitch_url) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="rounded-2xl p-8 shadow-sm" style={{ background: 'var(--surface)' }}>
                  <h2 className="text-xl font-bold mb-4 font-roca-two flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                    <ExternalLink className="w-5 h-5" />
                    Project Links
                  </h2>
                  <div className="space-y-3">
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md"
                        style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--text-primary)' }}>
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>Repository</div>
                            <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>View source code</div>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                      </a>
                    )}
                    {project.pitch_url && (
                      <a href={project.pitch_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md"
                        style={{ background: 'var(--hover-bg)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-orange)' }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>Pitch Deck</div>
                            <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>View presentation</div>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Team Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="rounded-2xl p-6 shadow-sm" style={{ background: 'var(--surface)' }}>
                <h3 className="text-xl font-bold mb-4 font-roca-two flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Users className="w-5 h-5" />
                  Team ({(project.team_members?.length || 0) + 1})
                </h3>
                <div className="space-y-3">
                  {/* Owner */}
                  <Link href={`/investors/profiles/${project.owner.username}`}>
                    <div className="p-4 rounded-xl transition-all cursor-pointer"
                         style={{ background: 'var(--neutral-light-orange)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                             style={{ background: 'var(--primary-orange)' }}>
                          {project.owner.profile.profile_picture ? (
                            <img src={project.owner.profile.profile_picture} alt={project.owner.username}
                                 className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-lg font-roca-two">
                              {getInitials(project.owner.profile.first_name, project.owner.profile.last_name)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold font-canva-sans truncate" style={{ color: 'var(--text-primary)' }}>
                            {project.owner.profile.first_name} {project.owner.profile.last_name}
                          </div>
                          <div className="text-sm font-canva-sans truncate" style={{ color: 'var(--text-secondary)' }}>
                            @{project.owner.username}
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-semibold font-canva-sans"
                             style={{ background: 'var(--primary-orange)', color: 'white' }}>
                          Owner
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Team Members */}
                  {project.team_members && project.team_members.map((member) => (
                    <Link key={member.id} href={`/investors/profiles/${member.username}`}>
                      <div className="p-4 rounded-xl transition-all cursor-pointer"
                           style={{ background: 'transparent' }}
                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                               style={{ background: 'var(--hover-bg)' }}>
                            {member.profile.profile_picture ? (
                              <img src={member.profile.profile_picture} alt={member.username}
                                   className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-lg font-roca-two" style={{ color: 'var(--text-secondary)' }}>
                                {getInitials(member.profile.first_name, member.profile.last_name)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold font-canva-sans truncate" style={{ color: 'var(--text-primary)' }}>
                              {member.profile.first_name} {member.profile.last_name}
                            </div>
                            <div className="text-sm font-canva-sans truncate" style={{ color: 'var(--text-secondary)' }}>
                              @{member.username}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Project Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl p-6 shadow-sm" style={{ background: 'var(--surface)' }}>
                <h3 className="text-xl font-bold mb-4 font-roca-two flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Info className="w-5 h-5" />
                  Project Info
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Created</span>
                    <span className="font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                      {formatDate(project.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Last Updated</span>
                    <span className="font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                      {formatDate(project.updated_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Type</span>
                    <span className="font-semibold font-canva-sans capitalize" style={{ color: 'var(--text-primary)' }}>
                      {project.project_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-canva-sans capitalize ${
                      project.status === 'launched' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : project.status === 'mvp'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Contact Button */}
              <button onClick={() => setShowMessageModal(true)}
                className="w-full px-6 py-4 rounded-xl font-semibold font-canva-sans text-white transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
                <Mail className="w-5 h-5" />
                Contact Team
              </button>
            </div>
          </div>
        </div>

        {/* Message Modal */}
        <AnimatePresence>
          {showMessageModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setShowMessageModal(false)}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg rounded-2xl shadow-xl p-6"
                style={{ background: 'var(--surface)' }}
                onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4 font-roca-two" style={{ color: 'var(--text-primary)' }}>
                  Contact Project Team
                </h3>
                <p className="mb-4 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  Send a message to {project.owner.profile.first_name} and the team.
                </p>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..." rows={5}
                  className="w-full p-4 rounded-lg border font-canva-sans focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    background: 'var(--hover-bg)', 
                    color: 'var(--text-primary)', 
                    borderColor: 'var(--border)',
                    '--tw-ring-color': 'var(--primary-orange)' 
                  } as React.CSSProperties}
                />
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={handleSendMessage} disabled={!message.trim() || sending}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold font-canva-sans text-white transition-all disabled:opacity-50"
                    style={{ background: 'var(--primary-orange)' }}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                  <button onClick={() => setShowMessageModal(false)}
                    className="px-6 py-3 rounded-lg font-semibold font-canva-sans transition-all"
                    style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
