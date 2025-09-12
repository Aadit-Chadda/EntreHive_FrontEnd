'use client';

import { useState, useEffect } from 'react';
import LeftNavigation from '../components/LeftNavigation';
import RightExplore from '../components/RightExplore';
import ProjectCard from '../components/ProjectCard';
import ProjectComposer from '../components/ProjectComposer';
import { ThemeProvider } from '../components/ThemeProvider';
import { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<(Project & { owner: { name: string; handle: string; avatar: string } })[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockProjects: (Project & { owner: { name: string; handle: string; avatar: string } })[] = [
      {
        id: '1',
        ownerId: 'user1',
        title: 'AI-Powered Study Assistant',
        type: 'startup',
        status: 'mvp',
        summary: 'An intelligent study companion that helps students learn more effectively using personalized AI recommendations and spaced repetition algorithms.',
        needs: ['funding', 'marketing', 'dev'],
        categories: ['AI', 'EdTech'],
        tags: ['machine-learning', 'education', 'productivity'],
        previewImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
        pitchUrl: 'https://youtube.com/watch?v=example',
        repoUrl: 'https://github.com/user/study-assistant',
        visibility: 'university',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        teamMembers: ['user2', 'user3'],
        owner: {
          name: 'Sarah Chen',
          handle: 'sarahchen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b167?w=100'
        }
      },
      {
        id: '2',
        ownerId: 'user2',
        title: 'Campus Food Delivery Platform',
        type: 'side_project',
        status: 'concept',
        summary: 'A platform connecting students with local restaurants and campus dining options, featuring group ordering and cost-splitting functionality.',
        needs: ['design', 'dev', 'marketing'],
        categories: ['Food', 'Mobile App'],
        tags: ['food-delivery', 'social', 'campus'],
        visibility: 'cross_university',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        teamMembers: [],
        owner: {
          name: 'Alex Rodriguez',
          handle: 'alexr',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        }
      },
      {
        id: '3',
        ownerId: 'user3',
        title: 'Sustainable Fashion Marketplace',
        type: 'startup',
        status: 'launched',
        summary: 'A peer-to-peer marketplace for students to buy, sell, and trade sustainable clothing. Promoting circular fashion economy on campus.',
        needs: ['mentor', 'funding'],
        categories: ['Fashion', 'Sustainability', 'E-commerce'],
        tags: ['sustainability', 'fashion', 'marketplace', 'circular-economy'],
        previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        repoUrl: 'https://github.com/user/fashion-marketplace',
        visibility: 'public',
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-05'),
        teamMembers: ['user4', 'user5', 'user6'],
        owner: {
          name: 'Emma Thompson',
          handle: 'emmathompson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
        }
      },
      {
        id: '4',
        ownerId: 'user4',
        title: 'Mental Health Check-in App',
        type: 'research',
        status: 'mvp',
        summary: 'Research project studying the effectiveness of daily mental health check-ins and mood tracking for college students.',
        needs: ['research', 'dev'],
        categories: ['Mental Health', 'Research'],
        tags: ['mental-health', 'research', 'wellbeing', 'students'],
        visibility: 'university',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-12'),
        teamMembers: ['user7'],
        owner: {
          name: 'Dr. Michael Kim',
          handle: 'drmichaelkim',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }
      },
      {
        id: '5',
        ownerId: 'user5',
        title: 'Campus Event Discovery',
        type: 'hackathon',
        status: 'concept',
        summary: 'Built during HackU 2024. An app that aggregates all campus events and helps students discover activities based on their interests.',
        needs: ['design', 'marketing'],
        categories: ['Social', 'Events'],
        tags: ['events', 'campus', 'social', 'discovery'],
        previewImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500',
        pitchUrl: 'https://youtube.com/watch?v=example2',
        visibility: 'cross_university',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-03'),
        teamMembers: ['user8', 'user9'],
        owner: {
          name: 'James Wilson',
          handle: 'jameswilson',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
        }
      }
    ];
    
    setProjects(mockProjects);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.type === filter || project.status === filter;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        // Mock popularity based on team size and activity
        return (b.teamMembers.length + 1) - (a.teamMembers.length + 1);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleProjectCreate = (project: Partial<Project>) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      ownerId: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      teamMembers: [],
      owner: {
        name: 'Current User',
        handle: 'currentuser',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      }
    } as Project & { owner: { name: string; handle: string; avatar: string } };

    setProjects(prev => [newProject, ...prev]);
    setShowComposer(false);
  };

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
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
            onClick={() => setShowComposer(true)}
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
                        onClick={() => setShowComposer(true)}
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

                  {/* Projects Grid */}
                  {sortedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {sortedProjects.map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onLike={(projectId) => console.log('Liked project:', projectId)}
                          onSave={(projectId) => console.log('Saved project:', projectId)}
                          onJoinTeam={(projectId) => console.log('Join team:', projectId)}
                        />
                      ))}
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
                            onClick={() => setShowComposer(true)}
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

        {/* Project Composer Modal */}
        {showComposer && (
          <ProjectComposer
            onProjectCreate={handleProjectCreate}
            onClose={() => setShowComposer(false)}
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
  );
}
