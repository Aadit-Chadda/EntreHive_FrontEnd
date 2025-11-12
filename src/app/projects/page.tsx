'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LeftNavigation from '../components/LeftNavigation';
import RightSidebar from '../components/RightSidebar';
import ProjectCard from '../components/ProjectCard';
import ProjectCreateForm from '../components/ProjectCreateForm';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectData } from '@/types';
import { projectApi } from '@/lib/api';

export default function ProjectsPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for create query parameter and auto-open form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('create') === 'true') {
      setShowCreateForm(true);
      // Remove the query parameter from URL without refreshing
      window.history.replaceState({}, '', '/projects');
    }
  }, []);

  // Load projects from API
  useEffect(() => {
    loadProjects();
  }, [filter, searchQuery]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: Record<string, string> = {};
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      alert(errorMessage);
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
          
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
              <Image
                src="/Logoblacktransparent.png"
                alt="EntreHive Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="font-bold text-lg font-roca-two" style={{color: 'var(--text-primary)'}}>Projects</span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="p-2 text-white rounded-lg transition-all duration-200"
            style={{backgroundColor: 'var(--primary-orange)'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--accent-terracotta)'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--primary-orange)'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          {/* Left Navigation */}
          <LeftNavigation 
            showMobileNav={showMobileNav}
            setShowMobileNav={setShowMobileNav}
          />

          {/* Main Content Area - Takes remaining space */}
          <div className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80 flex">
            {/* Main Projects Content - Takes maximum available space */}
            <div className="flex-1 min-w-0 max-w-none">
              <div className="h-screen overflow-y-auto" style={{backgroundColor: 'var(--background)'}}>
                {/* Header */}
                <div className="sticky top-0 z-10" style={{backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)'}}>
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold font-roca-two" style={{color: 'var(--text-primary)'}}>Projects</h1>
                        <span className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                          {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="hidden lg:flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-semibold font-canva-sans transition-all duration-300 shadow-lg"
                        style={{backgroundColor: 'var(--primary-orange)'}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(243, 172, 59, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(243, 172, 59, 0.2)';
                        }}
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
                  <div className="rounded-xl p-4 lg:p-6 mb-6 shadow-lg border-2" style={{backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'}}>
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
                            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm font-canva-sans border-2 transition-all duration-300"
                            style={{
                              backgroundColor: 'var(--hover-bg)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--primary-orange)';
                              e.target.style.boxShadow = '0 0 0 3px rgba(243, 172, 59, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'var(--border)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="px-3 py-2 rounded-lg text-sm font-canva-sans border-2 transition-all duration-300"
                          style={{
                            backgroundColor: 'var(--hover-bg)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-primary)'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-orange)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(243, 172, 59, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>

                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 rounded-lg text-sm font-canva-sans border-2 transition-all duration-300"
                          style={{
                            backgroundColor: 'var(--hover-bg)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-primary)'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-orange)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(243, 172, 59, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border)';
                            e.target.style.boxShadow = 'none';
                          }}
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
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--primary-orange)'}}></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <div className="mb-4 font-canva-sans" style={{color: 'var(--secondary-red)'}}>{error}</div>
                      <button
                        onClick={loadProjects}
                        className="px-4 py-2 text-white rounded-lg font-semibold font-canva-sans transition-all duration-300"
                        style={{backgroundColor: 'var(--primary-orange)'}}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--accent-terracotta)'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--primary-orange)'}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : sortedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {sortedProjects.map((project, index) => {
                        // Additional safety check to ensure project has required fields
                        if (!project || !project.id) {
                          console.warn('Invalid project data:', project);
                          return null;
                        }
                        
                        return (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <ProjectCard
                              project={project}
                              onUpdate={handleProjectUpdate}
                              onDelete={handleProjectDelete}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
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
                        style={{color: 'var(--text-muted)'}} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </motion.svg>
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-2 text-sm font-medium font-roca-two" 
                        style={{color: 'var(--text-primary)'}}
                      >
                        No projects found
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="mt-1 text-sm font-canva-sans" 
                        style={{color: 'var(--text-secondary)'}}
                      >
                        {searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first project.'}
                      </motion.p>
                      {!searchQuery && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="mt-6"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium font-canva-sans rounded-md text-white transition-all duration-300"
                            style={{backgroundColor: 'var(--primary-orange)'}}
                            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--accent-terracotta)'}
                            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'var(--primary-orange)'}
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Project
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
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

        {/* Project Create Form Modal */}
        {showCreateForm && (
          <ProjectCreateForm
            onSuccess={handleProjectCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Overlay for mobile panels */}
        {showMobileNav && (
          <div 
            className="fixed inset-0 z-30 lg:hidden"
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            onClick={() => {
              setShowMobileNav(false);
            }}
          />
        )}
      </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
