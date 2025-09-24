'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeftNavigation from '../../components/LeftNavigation';
import RightExplore from '../../components/RightExplore';
import TeamManagement from '../../components/TeamManagement';
import ProjectInvitations from '../../components/ProjectInvitations';
import { ThemeProvider } from '../../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectData } from '@/types';
import { projectApi } from '@/lib/api';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setProject(projectData);
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
      if (err.status === 404) {
        router.push('/projects');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProject(updatedProject);
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

  const PROJECT_TYPE_LABELS: Record<string, string> = {
    startup: 'Startup',
    side_project: 'Side Project',
    research: 'Research',
    hackathon: 'Hackathon',
    course_project: 'Course Project',
  };

  const STATUS_COLORS: Record<string, string> = {
    concept: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
    mvp: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    launched: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  };

  const VISIBILITY_COLORS: Record<string, string> = {
    private: 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
    university: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
    cross_university: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
    public: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  };

  const VISIBILITY_ICONS: Record<string, string> = {
    private: 'M12 1l3.09 6.26L22 9l-5.45 5.32L18.18 21 12 17.77 5.82 21l1.64-6.68L2 9l6.91-1.74L12 1z',
    university: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    cross_university: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    public: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
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
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The project you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}</p>
              <button
                onClick={() => router.push('/projects')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </ThemeProvider>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setShowMobileNav(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white truncate">{project.title}</span>
            </div>

            <button
              onClick={() => router.push('/projects')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            <div className="flex-1 min-h-screen pt-16 lg:pt-0 flex">
              <div className="flex-1 min-w-0 max-w-none">
                <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  {/* Header */}
                  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => router.push('/projects')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                          </button>
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Details</h1>
                        </div>
                        
                        {project.can_edit && (
                          <div className="flex items-center space-x-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => router.push(`/projects/${project.id}/edit`)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Project
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Hero Section */}
                        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12">
                          <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                              <div className="flex-1 space-y-6">
                                {/* Title and Type */}
                                <div>
                                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{project.title}</h1>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H7m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-8 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0h4" />
                                      </svg>
                                      {PROJECT_TYPE_LABELS[project.project_type]}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${STATUS_COLORS[project.status]}`}>
                                      <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                      {project.status.toUpperCase()}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${VISIBILITY_COLORS[project.visibility]}`}>
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={VISIBILITY_ICONS[project.visibility]} />
                                      </svg>
                                      {project.visibility === 'private' ? 'Private' : 
                                       project.visibility === 'university' ? 'University' :
                                       project.visibility === 'cross_university' ? 'Cross University' : 'Public'}
                                    </span>
                                  </div>
                                </div>

                                {/* Owner and Team Info */}
                                <div className="space-y-3">
                                  <div className="flex items-center text-blue-100">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-white font-bold text-sm">
                                        {(project.owner.full_name || project.owner.username).charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">
                                        Created by {project.owner.full_name || project.owner.username}
                                      </p>
                                      <p className="text-blue-100 text-sm">@{project.owner.username}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center text-blue-100 text-sm">
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
                                      className="w-full lg:w-80 h-48 lg:h-64 object-cover rounded-xl shadow-2xl border-4 border-white/20"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
                            }}></div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        {project.can_edit && (
                          <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your project</p>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => setShowTeamManagement(true)}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  Manage Team
                                </button>
                                <button
                                  onClick={() => setShowInvitations(true)}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
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
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                          {/* About Project */}
                          {project.summary && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                About this project
                              </h2>
                              <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                  {project.summary}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Project Needs */}
                          {project.needs.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Looking for help with
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {project.needs.map(need => (
                                  <div
                                    key={need}
                                    className="flex items-center px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800"
                                  >
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                    <span className="font-medium capitalize">{need}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Categories and Tags */}
                          {(project.categories.length > 0 || project.tags.length > 0) && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Categories & Tags
                              </h3>
                              <div className="space-y-4">
                                {project.categories.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {project.categories.map(category => (
                                        <span
                                          key={category}
                                          className="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800"
                                        >
                                          {category}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {project.tags.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {project.tags.map(tag => (
                                        <span
                                          key={tag}
                                          className="inline-flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-600"
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
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    className="flex items-center justify-center px-6 py-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
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
                                    className="flex items-center justify-center px-6 py-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
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
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Team ({project.team_count})
                              </h3>
                            </div>

                            <div className="space-y-4">
                              {/* Project Owner */}
                              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">
                                    {(project.owner.full_name || project.owner.username).charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {project.owner.full_name || project.owner.username}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">@{project.owner.username}</p>
                                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full mt-1">
                                    Owner
                                  </span>
                                </div>
                              </div>

                              {/* Team Members */}
                              {project.team_members.map(member => (
                                <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {(member.full_name || member.username).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                      {member.full_name || member.username}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">@{member.username}</p>
                                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-full mt-1">
                                      Member
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {/* Add Member CTA */}
                              {project.can_edit && (
                                <button
                                  onClick={() => setShowTeamManagement(true)}
                                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                >
                                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-500 transition-colors">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Add Team Member</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Invite collaborators</p>
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Project Information */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                              <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Project Info
                            </h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {new Date(project.updated_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {PROJECT_TYPE_LABELS[project.project_type]}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</span>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${VISIBILITY_COLORS[project.visibility]}`}>
                                  {project.visibility === 'private' ? 'Private' : 
                                   project.visibility === 'university' ? 'University' :
                                   project.visibility === 'cross_university' ? 'Cross University' : 'Public'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Explore Panel */}
              <div className={`
                fixed lg:static inset-y-0 right-0 z-40 w-80 lg:w-80 xl:w-80 transform transition-transform duration-300 ease-in-out
                lg:transform-none xl:block lg:flex-shrink-0
                ${showRightPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                hidden lg:block
              `}>
                <RightExplore 
                  showRightPanel={showRightPanel}
                  setShowRightPanel={setShowRightPanel}
                />
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Project</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Are you sure you want to delete <span className="font-semibold">"{project.title}"</span>? 
                    This will permanently delete the project and all associated data.
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProjectDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Invitations</h3>
                  <button
                    onClick={() => setShowInvitations(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {(showMobileNav || showRightPanel) && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => {
                setShowMobileNav(false);
                setShowRightPanel(false);
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}