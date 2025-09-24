'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftNavigation from '../components/LeftNavigation';
import RightExplore from '../components/RightExplore';
import ProjectCard from '../components/ProjectCard';
import ProjectCreateForm from '../components/ProjectCreateForm';
import { ThemeProvider } from '../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectData } from '@/types';
import { projectApi } from '@/lib/api';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from API
  useEffect(() => {
    loadProjects();
  }, [filter, searchQuery]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      if (filter !== 'all') {
        // Map filter to appropriate parameter
        if (['startup', 'side_project', 'research', 'hackathon', 'course_project'].includes(filter)) {
          params.type = filter;
        } else if (['concept', 'mvp', 'launched'].includes(filter)) {
          params.status = filter;
        }
      }
      
      const response = await projectApi.getProjects(params);
      let filteredResults = response.results;
      
      // Apply client-side filtering for user-specific options
      if (filter === 'my_projects') {
        filteredResults = response.results.filter(project => project.can_edit);
      } else if (filter === 'team_projects') {
        filteredResults = response.results.filter(project => project.is_team_member && !project.can_edit);
      }
      
      // Ensure unique projects by ID to prevent duplicate keys
      const uniqueProjects = filteredResults.filter((project, index, self) => 
        project && project.id && self.findIndex(p => p.id === project.id) === index
      );
      setProjects(uniqueProjects);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Sort projects based on selection
  const sortedProjects = (projects || [])
    .filter(project => project && project.id) // Ensure valid projects with IDs
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          return b.team_count - a.team_count;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleProjectCreate = (project: ProjectData) => {
    setProjects(prev => {
      // Check if project already exists (avoid duplicates)
      const exists = prev.some(p => p.id === project.id);
      if (exists) {
        return prev.map(p => p.id === project.id ? project : p);
      }
      return [project, ...prev];
    });
    setShowCreateForm(false);
    
    // Redirect to the newly created project
    router.push(`/projects/${project.id}`);
  };

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleProjectDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectApi.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'my_projects', label: 'My Projects' },
    { value: 'team_projects', label: 'Team Projects' },
    { value: 'startup', label: 'Startups' },
    { value: 'side_project', label: 'Side Projects' },
    { value: 'research', label: 'Research' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'course_project', label: 'Course Projects' },
    { value: 'concept', label: 'Concepts' },
    { value: 'mvp', label: 'MVPs' },
    { value: 'launched', label: 'Launched' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

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
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg">Projects</span>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

          {/* Main Content Area - Takes remaining space */}
          <div className="flex-1 min-h-screen pt-16 lg:pt-0 flex">
            {/* Main Projects Content - Takes maximum available space */}
            <div className="flex-1 min-w-0 max-w-none">
              <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Project</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 lg:px-8 py-6">
                  {/* Filters and Search */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6">
                    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:gap-4">
                      {/* Search */}
                      <div className="flex-1">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects, categories, or tags..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>

                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <div className="text-red-500 mb-4">{error}</div>
                      <button
                        onClick={loadProjects}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : sortedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {sortedProjects.map(project => {
                        // Additional safety check to ensure project has required fields
                        if (!project || !project.id) {
                          console.warn('Invalid project data:', project);
                          return null;
                        }
                        
                        return (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onUpdate={handleProjectUpdate}
                            onDelete={handleProjectDelete}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first project.'}
                      </p>
                      {!searchQuery && (
                        <div className="mt-6">
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Project
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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

            {/* Toggle button for right panel on lg screens */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="hidden lg:block xl:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Project Create Form Modal */}
        {showCreateForm && (
          <ProjectCreateForm
            onSuccess={handleProjectCreate}
            onCancel={() => setShowCreateForm(false)}
          />
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
