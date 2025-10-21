'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LeftNavigation from '../../components/LeftNavigation';
import RightSidebar from '../../components/RightSidebar';
import TeamManagement from '../../components/TeamManagement';
import ProjectInvitations from '../../components/ProjectInvitations';
import { ThemeProvider } from '../../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectData, ProjectUpdateData } from '@/types';
import { projectApi } from '@/lib/api';
import { Palette, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { PROJECT_BANNER_GRADIENTS, getProjectBannerGradient, DEFAULT_PROJECT_BANNER_GRADIENT } from '@/lib/projectBranding';
import type { ProjectBannerStyle } from '@/lib/projectBranding';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isUpdatingBanner, setIsUpdatingBanner] = useState(false);

  // Redirect investors to investor-specific project page
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push(`/investors/projects/${projectId}`);
    }
  }, [user, projectId, router]);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectData = await projectApi.getProject(projectId);
      
      // Ensure project data has required fields with proper defaults
      const sanitizedProject = {
        ...projectData,
        owner: projectData.owner || null,
        team_members: projectData.team_members || [],
        needs: projectData.needs || [],
        categories: projectData.categories || [],
        tags: projectData.tags || [],
        team_count: projectData.team_count || 0,
      };
      
      setProject(sanitizedProject);
    } catch (err: any) {
      console.error('Failed to load project:', err);
      setError(err.message || 'Failed to load project');
      if (err.status === 404) {
        router.push('/projects');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    // Ensure updated project data has required fields with proper defaults
    const sanitizedProject = {
      ...updatedProject,
      owner: updatedProject.owner || null,
      team_members: updatedProject.team_members || [],
      needs: updatedProject.needs || [],
      categories: updatedProject.categories || [],
      tags: updatedProject.tags || [],
      team_count: updatedProject.team_count || 0,
    };
    
    setProject(sanitizedProject);
  };

  const handleProjectDelete = async () => {
    if (!project) return;

    try {
      setIsDeleting(true);
      await projectApi.deleteProject(project.id);
      router.push('/projects');
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  const handleBannerUpdate = async ({
    style,
    gradientId,
    file,
  }: {
    style: ProjectBannerStyle;
    gradientId: string;
    file?: File | null;
  }) => {
    if (!project) return;

    setIsUpdatingBanner(true);
    try {
      let updatedProject: ProjectData;

      if (style === 'image') {
        if (file) {
          const formData = new FormData();
          formData.append('banner_style', 'image');
          formData.append('banner_gradient', gradientId || project.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT);
          formData.append('banner_image', file);
          updatedProject = await projectApi.updateProjectBannerImage(project.id, formData);
        } else {
          const payload: ProjectUpdateData = {
            banner_style: 'image',
            banner_gradient: gradientId || project.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT,
          };
          updatedProject = await projectApi.updateProject(project.id, payload);
        }
      } else {
        const payload: ProjectUpdateData = {
          banner_style: 'gradient',
          banner_gradient: gradientId || DEFAULT_PROJECT_BANNER_GRADIENT,
          banner_image: null,
        };
        updatedProject = await projectApi.updateProject(project.id, payload);
      }

      // Ensure updated project data has required fields with proper defaults
      const sanitizedProject = {
        ...updatedProject,
        owner: updatedProject.owner || null,
        team_members: updatedProject.team_members || [],
        needs: updatedProject.needs || [],
        categories: updatedProject.categories || [],
        tags: updatedProject.tags || [],
        team_count: updatedProject.team_count || 0,
      };
      
      setProject(sanitizedProject);
    } catch (updateError: any) {
      console.error('Failed to update banner', updateError);
      
      // More detailed error message
      const errorMessage = updateError?.message || 'Unknown error occurred';
      const errorDetails = updateError?.details ? JSON.stringify(updateError.details) : '';
      
      alert(`Failed to update banner: ${errorMessage}${errorDetails ? '\n\nDetails: ' + errorDetails : ''}`);
    } finally {
      setIsUpdatingBanner(false);
      setIsBannerModalOpen(false);
    }
  };

  const PROJECT_TYPE_LABELS: Record<string, string> = {
    startup: 'Startup',
    side_project: 'Side Project',
    research: 'Research',
    hackathon: 'Hackathon',
    course_project: 'Course Project',
  };

  const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    concept: {
      bg: 'rgba(243, 172, 59, 0.1)',
      text: 'var(--primary-orange)',
      border: 'var(--primary-orange)'
    },
    mvp: {
      bg: 'rgba(54, 69, 79, 0.12)',
      text: 'var(--secondary-charcoal)',
      border: 'var(--secondary-charcoal)'
    },
    launched: {
      bg: 'rgba(231, 159, 116, 0.1)',
      text: 'var(--accent-terracotta)',
      border: 'var(--accent-terracotta)'
    },
  };

  const VISIBILITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    private: { 
      bg: 'rgba(54, 69, 79, 0.1)', 
      text: 'var(--secondary-charcoal)', 
      border: 'var(--secondary-charcoal)' 
    },
    university: { 
      bg: 'rgba(119, 11, 11, 0.1)', 
      text: 'var(--secondary-red)', 
      border: 'var(--secondary-red)' 
    },
    public: {
      bg: 'rgba(0, 0, 128, 0.12)',
      text: 'var(--accent-navy)',
      border: 'var(--accent-navy)'
    },
  };

  const VISIBILITY_ICONS: Record<string, string> = {
    private: 'M12 1l3.09 6.26L22 9l-5.45 5.32L18.18 21 12 17.77 5.82 21l1.64-6.68L2 9l6.91-1.74L12 1z',
    university: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    public: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <ThemeProvider>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4"
                style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
              ></div>
              <p style={{ color: 'var(--text-secondary)' }}>Loading project...</p>
            </div>
          </div>
        </ThemeProvider>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <ThemeProvider>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--secondary-red)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Project Not Found
              </h2>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-4">
                {error || "The project you're looking for doesn't exist or you don't have permission to view it."}
              </p>
              <button
                onClick={() => router.push('/projects')}
                className="px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--secondary-charcoal)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-orange)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--secondary-charcoal)')}
              >
                Back to Projects
              </button>
            </div>
          </div>
        </ThemeProvider>
      </ProtectedRoute>
    );
  }

  const bannerGradient = getProjectBannerGradient(project.banner_gradient);
  const bannerHasImage = project.banner_style === 'image' && Boolean(project.banner_image);
  const heroBackgroundStyle = bannerHasImage
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.45), rgba(0,0,0,0.2)), url(${project.banner_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        background: bannerGradient.gradient
      };

  const patternOverlayStyle = bannerHasImage
    ? {
        background: 'linear-gradient(120deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2))'
      }
    : {
        opacity: 0.12,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      };

  return (
    <ProtectedRoute>
      <ThemeProvider>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen transition-colors duration-200" 
          style={{ backgroundColor: 'var(--background)' }}
        >
          {/* Mobile Header */}
          <div
            className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setShowMobileNav(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-orange)' }}
              >
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span
                className="font-bold text-lg font-roca-two truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </span>
            </div>

            <button
              onClick={() => router.push('/projects')}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                  <div
                    className="sticky top-0 z-30"
                    style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', zIndex: 30 }}
                  >
                    <div className="px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => router.push('/projects')}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: 'var(--text-primary)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                          </button>
                          <h1
                            className="text-2xl font-bold font-roca-two"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Project Details
                          </h1>
                        </div>
                        
                        {project.can_edit && (
                          <div className="flex items-center space-x-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => router.push(`/projects/${project.id}/edit`)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'var(--surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Project
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'rgba(119, 11, 11, 0.12)',
                                color: 'var(--secondary-red)',
                                border: '1px solid rgba(119, 11, 11, 0.25)'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(119, 11, 11, 0.2)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(119, 11, 11, 0.12)')}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                      {/* Project Header Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl shadow-sm border overflow-hidden"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        {/* Hero Section */}
                        <div
                          className="relative p-8 md:p-12"
                          style={heroBackgroundStyle}
                        >
                          <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                              <div className="flex-1 space-y-6">
                                {/* Title and Type */}
                                <div>
                                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{project.title}</h1>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span
                                      className="inline-flex items-center px-3 py-1 text-white text-sm font-medium rounded-full"
                                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(8px)' }}
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H7m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-8 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0h4" />
                                      </svg>
                                      {PROJECT_TYPE_LABELS[project.project_type]}
                                    </span>
                                    <span
                                      className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border"
                                      style={{
                                        backgroundColor: STATUS_COLORS[project.status]?.bg,
                                        color: STATUS_COLORS[project.status]?.text,
                                        borderColor: STATUS_COLORS[project.status]?.border
                                      }}
                                    >
                                      <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                      {project.status.toUpperCase()}
                                    </span>
                                    <span
                                      className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border"
                                      style={{
                                        backgroundColor: VISIBILITY_COLORS[project.visibility]?.bg,
                                        color: VISIBILITY_COLORS[project.visibility]?.text,
                                        borderColor: VISIBILITY_COLORS[project.visibility]?.border
                                      }}
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={VISIBILITY_ICONS[project.visibility]} />
                                      </svg>
                                      {project.visibility === 'private' ? 'Private' :
                                        project.visibility === 'university' ? 'University' :
                                        'Public'}
                                    </span>
                                    {!bannerHasImage ? (
                                      <span
                                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border"
                                        style={{
                                          backgroundColor: 'rgba(0, 0, 128, 0.14)',
                                          color: 'var(--accent-navy)',
                                          borderColor: 'rgba(0, 0, 128, 0.24)'
                                        }}
                                      >
                                        <Palette className="w-3 h-3 mr-1" />
                                        {bannerGradient.name}
                                      </span>
                                    ) : (
                                      <span
                                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border"
                                        style={{
                                          backgroundColor: 'rgba(243, 172, 59, 0.2)',
                                          color: 'var(--primary)',
                                          borderColor: 'rgba(243, 172, 59, 0.32)'
                                        }}
                                      >
                                        <ImageIcon className="w-3 h-3 mr-1" />
                                        Custom Banner
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Owner and Team Info */}
                                <div className="space-y-3">
                                  {project.owner && (
                                    <div className="flex items-center text-white/80">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.22)' }}>
                                        <span className="text-white font-bold text-sm">
                                          {(project.owner.full_name || project.owner.username || 'U').charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">
                                          Created by {project.owner.full_name || project.owner.username || 'Unknown User'}
                                        </p>
                                        <div className="flex items-center gap-2 text-white/70 text-sm">
                                          <span>@{project.owner.username || 'unknown'}</span>
                                          {project.owner.profile?.university && (
                                            <>
                                              <span>·</span>
                                              <span>{project.owner.profile.university.name}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center text-white/80 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {project.team_count} team member{project.team_count !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Preview Image */}
                              {project.preview_image && (
                                <div className="flex-shrink-0">
                                  <div className="relative">
                                    <img
                                      src={project.preview_image}
                                      alt={project.title}
                                      className="w-full lg:w-80 h-48 lg:h-64 object-cover rounded-xl shadow-2xl"
                                      style={{ border: '4px solid rgba(255, 255, 255, 0.28)' }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent rounded-xl"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Background Overlay */}
                          <div className="absolute inset-0 pointer-events-none" style={patternOverlayStyle}></div>
                        </div>

                        {/* Quick Actions */}
                        {project.can_edit && (
                          <div
                            className="px-8 py-4"
                            style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Manage your project
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <button
                                  onClick={() => setIsBannerModalOpen(true)}
                                  disabled={isUpdatingBanner}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                  style={{
                                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                    color: '#d97706',
                                    border: '1px solid rgba(245, 158, 11, 0.3)'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) {
                                      e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.25)';
                                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!e.currentTarget.disabled) {
                                      e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                                    }
                                  }}
                                >
                                  <Palette className="w-4 h-4 mr-2" />
                                  Customize Banner
                                </button>
                                <button
                                  onClick={() => setShowTeamManagement(true)}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                                  style={{
                                    backgroundColor: 'rgba(54, 69, 79, 0.14)',
                                    color: 'var(--secondary-charcoal)',
                                    border: '1px solid rgba(54, 69, 79, 0.3)'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(54, 69, 79, 0.22)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(54, 69, 79, 0.14)')}
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  Manage Team
                                </button>
                                <button
                                  onClick={() => setShowInvitations(true)}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                                  style={{
                                    backgroundColor: 'rgba(231, 159, 116, 0.16)',
                                    color: 'var(--accent-terracotta)',
                                    border: '1px solid rgba(231, 159, 116, 0.32)'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(231, 159, 116, 0.24)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(231, 159, 116, 0.16)')}
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Invitations
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Content Grid */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                      >
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                          {/* About Project */}
                          {project.summary && (
                            <div
                              className="rounded-2xl shadow-sm border p-8"
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                              <h2
                                className="text-2xl font-bold mb-6 flex items-center gap-3"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: 'var(--secondary-charcoal)' }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                About this project
                              </h2>
                              <div className="space-y-4">
                                <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                                  {project.summary}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Project Needs */}
                          {project.needs.length > 0 && (
                            <div
                              className="rounded-2xl shadow-sm border p-8"
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                              <h3
                                className="text-xl font-bold mb-6 flex items-center gap-3"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: 'var(--secondary-red)' }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Looking for help with
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {project.needs.map(need => (
                                  <div
                                    key={need}
                                    className="flex items-center px-4 py-3 rounded-xl border"
                                    style={{
                                      backgroundColor: 'rgba(231, 159, 116, 0.16)',
                                      borderColor: 'rgba(231, 159, 116, 0.32)',
                                      color: 'var(--accent-terracotta)'
                                    }}
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full mr-3"
                                      style={{ backgroundColor: 'var(--accent-terracotta)' }}
                                    ></span>
                                    <span className="font-medium capitalize">{need}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Categories and Tags */}
                          {(project.categories.length > 0 || project.tags.length > 0) && (
                            <div
                              className="rounded-2xl shadow-sm border p-8"
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                              <h3
                                className="text-xl font-bold mb-6 flex items-center gap-3"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: 'var(--secondary-charcoal)' }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Categories & Tags
                              </h3>
                              <div className="space-y-4">
                                {project.categories.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                      Categories
                                    </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {project.categories.map(category => (
                                          <span
                                            key={category}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-full border"
                                            style={{
                                            backgroundColor: 'rgba(138, 107, 83, 0.16)',
                                            color: 'var(--secondary-taupe)',
                                            borderColor: 'rgba(138, 107, 83, 0.3)'
                                          }}
                                          >
                                            {category}
                                          </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {project.tags.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                      Tags
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {project.tags.map(tag => (
                                        <span
                                          key={tag}
                                          className="inline-flex items-center px-3 py-2 text-sm rounded-full border"
                                          style={{
                                            backgroundColor: 'rgba(243, 172, 59, 0.14)',
                                            color: 'var(--primary)',
                                            borderColor: 'rgba(243, 172, 59, 0.32)'
                                          }}
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Project Links */}
                          {(project.pitch_url || project.repo_url) && (
                            <div
                              className="rounded-2xl shadow-sm border p-8"
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                              <h3
                                className="text-xl font-bold mb-6 flex items-center gap-3"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: 'var(--secondary-charcoal)' }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Project Links
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.pitch_url && (
                                  <a
                                    href={project.pitch_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-6 py-4 rounded-xl border transition-colors group"
                                    style={{
                                      backgroundColor: 'rgba(0, 0, 128, 0.12)',
                                      color: 'var(--accent-navy)',
                                      borderColor: 'rgba(0, 0, 128, 0.24)'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 128, 0.22)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 128, 0.12)')}
                                  >
                                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">View Demo/Pitch</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                                {project.repo_url && (
                                  <a
                                    href={project.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-6 py-4 rounded-xl border transition-colors group"
                                    style={{
                                      backgroundColor: 'rgba(243, 172, 59, 0.14)',
                                      color: 'var(--primary)',
                                      borderColor: 'rgba(243, 172, 59, 0.32)'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(243, 172, 59, 0.22)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(243, 172, 59, 0.14)')}
                                  >
                                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    <span className="font-medium">View Source Code</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                          {/* Team Members */}
                          <div
                            className="rounded-2xl shadow-sm border p-8"
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h3
                                className="text-xl font-bold flex items-center gap-3"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: 'var(--secondary-charcoal)' }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Team ({project.team_count})
                              </h3>
                            </div>

                            <div className="space-y-4">
                              {/* Project Owner */}
                              {project.owner && (
                                <div
                                  className="flex items-center space-x-4 p-4 rounded-xl border"
                                  style={{
                                    backgroundColor: 'rgba(243, 172, 59, 0.16)',
                                    borderColor: 'rgba(243, 172, 59, 0.32)'
                                  }}
                                >
                                  <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--primary-orange)', color: '#ffffff' }}
                                  >
                                    <span className="font-bold text-lg">
                                      {(project.owner.full_name || project.owner.username || 'U').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                      {project.owner.full_name || project.owner.username || 'Unknown User'}
                                    </h4>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                      @{project.owner.username || 'unknown'}
                                    </p>
                                    <span
                                      className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                                      style={{
                                        backgroundColor: 'rgba(243, 172, 59, 0.2)',
                                        color: 'var(--primary)'
                                      }}
                                    >
                                      Owner
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Team Members */}
                              {project.team_members && project.team_members.length > 0 && project.team_members.map(member => (
                                <div
                                  key={member.id}
                                  className="flex items-center space-x-4 p-4 rounded-xl border"
                                  style={{
                                    backgroundColor: 'rgba(138, 107, 83, 0.14)',
                                    borderColor: 'rgba(138, 107, 83, 0.3)'
                                  }}
                                >
                                  <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--secondary-taupe)', color: '#ffffff' }}
                                  >
                                    <span className="font-bold text-lg">
                                      {(member.full_name || member.username).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                      {member.full_name || member.username}
                                    </h4>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                      @{member.username}
                                    </p>
                                    <span
                                      className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                                      style={{
                                        backgroundColor: 'rgba(138, 107, 83, 0.22)',
                                        color: 'var(--secondary-taupe)'
                                      }}
                                    >
                                      Member
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {/* Add Member CTA */}
                              {project.can_edit && (
                                <button
                                  onClick={() => setShowTeamManagement(true)}
                                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed rounded-xl transition-colors group"
                                  style={{ borderColor: 'var(--border)' }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                  <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                                    style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}
                                  >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                      Add Team Member
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                      Invite collaborators
                                    </p>
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Project Information */}
                          <div
                            className="rounded-2xl shadow-sm border p-8"
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                          >
                            <h3
                              className="text-xl font-bold mb-6 flex items-center gap-3"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: 'var(--secondary-charcoal)' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Project Info
                            </h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Created
                                </span>
                                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Last Updated
                                </span>
                                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {new Date(project.updated_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Type
                                </span>
                                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {PROJECT_TYPE_LABELS[project.project_type]}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Visibility
                                </span>
                                <span
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border"
                                  style={{
                                    backgroundColor: VISIBILITY_COLORS[project.visibility]?.bg,
                                    color: VISIBILITY_COLORS[project.visibility]?.text,
                                    borderColor: VISIBILITY_COLORS[project.visibility]?.border
                                  }}
                                >
                                  {project.visibility === 'private'
                                    ? 'Private'
                                    : project.visibility === 'university'
                                    ? 'University'
                                    : 'Public'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Explore Panel */}
              <div className={`
                hidden lg:block fixed right-0 top-0 h-screen
              `} style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
                <RightSidebar />
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
            >
              <div
                className="rounded-2xl shadow-2xl w-full max-w-md border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: 'rgba(119, 11, 11, 0.15)', color: 'var(--secondary-red)' }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Delete Project
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to delete <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>&quot;{project.title}&quot;</span>? 
                    This will permanently delete the project and all associated data.
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProjectDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--secondary-red)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#590808')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--secondary-red)')}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isBannerModalOpen && (
            <BannerCustomizationModal
              isOpen={isBannerModalOpen}
              onClose={() => {
                if (!isUpdatingBanner) {
                  setIsBannerModalOpen(false);
                }
              }}
              onApply={handleBannerUpdate}
              isSubmitting={isUpdatingBanner}
              currentStyle={project.banner_style === 'image' ? 'image' : 'gradient'}
              currentGradient={project.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT}
              currentImage={project.banner_image || null}
            />
          )}

          {/* Team Management Modal */}
          {showTeamManagement && (
            <TeamManagement
              project={project}
              onProjectUpdate={handleProjectUpdate}
              onClose={() => setShowTeamManagement(false)}
            />
          )}

          {/* Project Invitations Modal */}
          {showInvitations && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
            >
              <div
                className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div
                  className="flex justify-between items-center p-6"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Project Invitations
                  </h3>
                  <button
                    onClick={() => setShowInvitations(false)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <ProjectInvitations projectId={project.id} />
                </div>
              </div>
            </div>
          )}

          {/* Overlay for mobile panels */}
          {showMobileNav && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => {
                setShowMobileNav(false);
              }}
            />
          )}
        </motion.div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}

interface BannerCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (payload: { style: ProjectBannerStyle; gradientId: string; file?: File | null }) => void | Promise<void>;
  isSubmitting: boolean;
  currentStyle: ProjectBannerStyle;
  currentGradient: string;
  currentImage?: string | null;
}

function BannerCustomizationModal({
  isOpen,
  onClose,
  onApply,
  isSubmitting,
  currentStyle,
  currentGradient,
  currentImage,
}: BannerCustomizationModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<ProjectBannerStyle>(currentStyle);
  const [selectedGradient, setSelectedGradient] = useState<string>(currentGradient || DEFAULT_PROJECT_BANNER_GRADIENT);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentStyle === 'image' ? currentImage ?? null : null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedStyle(currentStyle);
    setSelectedGradient(currentGradient || DEFAULT_PROJECT_BANNER_GRADIENT);
    setSelectedFile(null);
    setPreviewUrl(currentStyle === 'image' ? currentImage ?? null : null);
  }, [currentStyle, currentGradient, currentImage, isOpen]);

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}>
      <div
        className="w-full max-w-3xl rounded-2xl border shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div 
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)'
          }}
        >
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Customize Project Banner
            </h3>
            <p className="text-sm text-white/90">
              Choose a gradient or upload a custom banner image to personalize your project.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="flex gap-3" role="tablist">
            <button
              type="button"
              onClick={() => setSelectedStyle('gradient')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedStyle === 'gradient' ? 'text-white' : ''}`}
              style={selectedStyle === 'gradient'
                ? { backgroundColor: 'var(--accent-navy)' }
                : { backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              <Palette className="w-4 h-4" />
              Gradients
            </button>
            <button
              type="button"
              onClick={() => setSelectedStyle('image')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedStyle === 'image' ? 'text-white' : ''}`}
              style={selectedStyle === 'image'
                ? { backgroundColor: 'var(--primary)' }
                : { backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              <ImageIcon className="w-4 h-4" />
              Banner Image
            </button>
          </div>

          {selectedStyle === 'gradient' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROJECT_BANNER_GRADIENTS.map((option) => {
                const isActive = option.id === selectedGradient;
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setSelectedGradient(option.id)}
                    className={`w-full text-left rounded-2xl border transition-all duration-200 shadow-lg hover:shadow-xl ${isActive ? 'ring-3 ring-orange-500 scale-[1.02] shadow-orange-200' : 'hover:scale-[1.01]'}`}
                    style={{ 
                      borderColor: isActive ? '#f59e0b' : '#e5e7eb',
                      borderWidth: isActive ? '2px' : '1px'
                    }}
                  >
                    <div className="h-32 rounded-t-2xl relative overflow-hidden" style={{ background: option.gradient }}>
                      {/* Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      {/* Gradient name overlay */}
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="font-bold text-white text-lg drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                          {option.name}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 space-y-1 bg-white border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                      {isActive && (
                        <div className="flex items-center mt-2 text-orange-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold">Selected</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedStyle === 'image' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 px-6 py-8 text-center"
                style={{ borderColor: 'var(--border)' }}
              >
                {previewUrl ? (
                  <div className="w-full max-w-md overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <img src={previewUrl} alt="Banner preview" className="w-full h-40 object-cover" />
                  </div>
                ) : (
                  <ImageIcon className="w-16 h-16" style={{ color: 'var(--text-secondary)' }} />
                )}
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Upload a high-resolution image (JPG, PNG, or WebP recommended).
                  </p>
                  <label
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
                  >
                    <UploadCloud className="w-4 h-4" />
                    Choose Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                {currentImage && !selectedFile && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Current banner will be kept unless you upload a new image or switch to a gradient.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isSubmitting || (selectedStyle === 'image' && !previewUrl)}
            className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
              }
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : (
              'Save Banner'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
