'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeftNavigation from '../../../components/LeftNavigation';
import RightExplore from '../../../components/RightExplore';
import { ThemeProvider } from '../../../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectData, ProjectUpdateData } from '@/types';
import { projectApi } from '@/lib/api';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProjectUpdateData>({
    title: '',
    project_type: 'startup',
    status: 'concept',
    summary: '',
    needs: [],
    categories: [],
    tags: [],
    preview_image: '',
    pitch_url: '',
    repo_url: '',
    visibility: 'private',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
      
      // Check if user can edit this project
      if (!projectData.can_edit) {
        router.push(`/projects/${projectId}`);
        return;
      }

      setProject(projectData);
      
      // Initialize form data with project data
      setFormData({
        title: projectData.title,
        project_type: projectData.project_type,
        status: projectData.status,
        summary: projectData.summary || '',
        needs: projectData.needs,
        categories: projectData.categories,
        tags: projectData.tags,
        preview_image: projectData.preview_image || '',
        pitch_url: projectData.pitch_url || '',
        repo_url: projectData.repo_url || '',
        visibility: projectData.visibility,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
      if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
        router.push('/projects');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 140) {
      errors.title = 'Title must be less than 140 characters';
    }

    // Summary validation
    if (formData.summary && formData.summary.length > 5000) {
      errors.summary = 'Summary must be less than 5000 characters';
    }

    // URL validations
    const urlPattern = /^https?:\/\/.+/;
    if (formData.preview_image && !urlPattern.test(formData.preview_image)) {
      errors.preview_image = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.pitch_url && !urlPattern.test(formData.pitch_url)) {
      errors.pitch_url = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.repo_url && !urlPattern.test(formData.repo_url)) {
      errors.repo_url = 'Please enter a valid URL starting with http:// or https://';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      await projectApi.updateProject(projectId, formData);
      
      // Navigate back to project details
      router.push(`/projects/${projectId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      
      // Handle validation errors from backend
      if (err && typeof err === 'object' && 'details' in err && err.details) {
        const backendErrors: Record<string, string> = {};
        Object.entries(err.details as Record<string, string[]>).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            backendErrors[field] = messages[0];
          }
        });
        setValidationErrors(backendErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProjectUpdateData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayInputChange = (field: 'needs' | 'categories' | 'tags', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    handleInputChange(field, items);
  };

  const PROJECT_TYPES = [
    { value: 'startup', label: 'Startup' },
    { value: 'side_project', label: 'Side Project' },
    { value: 'research', label: 'Research' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'course_project', label: 'Course Project' },
  ];

  const PROJECT_STATUS = [
    { value: 'concept', label: 'Concept' },
    { value: 'mvp', label: 'MVP' },
    { value: 'launched', label: 'Launched' },
  ];

  const VISIBILITY_OPTIONS = [
    { value: 'private', label: 'Private', description: 'Only you and team members can see this project' },
    { value: 'university', label: 'University', description: 'Only people from your university can see this project' },
    { value: 'cross_university', label: 'Cross University', description: 'All verified students can see this project' },
    { value: 'public', label: 'Public', description: 'Anyone can see this project' },
  ];

  const NEED_OPTIONS = ['design', 'dev', 'marketing', 'research', 'funding', 'mentor'];

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

  if (error && !project) {
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Edit Project</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
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
        <div className="min-h-screen transition-colors duration-200" style={{backgroundColor: 'var(--background)'}}>
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
              <span className="font-bold text-lg text-gray-900 dark:text-white">Edit Project</span>
            </div>

            <button
              onClick={() => router.push(`/projects/${projectId}`)}
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
                            onClick={() => router.push(`/projects/${projectId}`)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                          </button>
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => router.push(`/projects/${projectId}`)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                      {/* Error Alert */}
                      {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="text-sm text-red-800 dark:text-red-300">{error}</div>
                          </div>
                        </div>
                      )}

                      {/* Edit Form */}
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="lg:col-span-2">
                              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Project Title *
                              </label>
                              <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter your project title"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  validationErrors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                maxLength={140}
                              />
                              {validationErrors.title && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>
                              )}
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {formData.title.length}/140 characters
                              </p>
                            </div>

                            {/* Project Type */}
                            <div>
                              <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Project Type *
                              </label>
                              <select
                                id="project_type"
                                value={formData.project_type}
                                onChange={(e) => handleInputChange('project_type', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              >
                                {PROJECT_TYPES.map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Status */}
                            <div>
                              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Project Status *
                              </label>
                              <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              >
                                {PROJECT_STATUS.map(status => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-2">
                              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Project Summary
                              </label>
                              <textarea
                                id="summary"
                                value={formData.summary}
                                onChange={(e) => handleInputChange('summary', e.target.value)}
                                placeholder="Describe your project in detail..."
                                rows={6}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  validationErrors.summary ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                maxLength={5000}
                              />
                              {validationErrors.summary && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.summary}</p>
                              )}
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {formData.summary?.length || 0}/5000 characters
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Project Needs */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Project Needs</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              What kind of help are you looking for?
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {NEED_OPTIONS.map(need => (
                                <label key={need} className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.needs.includes(need as any)}
                                    onChange={(e) => {
                                      const newNeeds = e.target.checked
                                        ? [...formData.needs, need]
                                        : formData.needs.filter(n => n !== need);
                                      handleInputChange('needs', newNeeds);
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                    {need}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Categories and Tags */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Categories & Tags</h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Categories */}
                            <div>
                              <label htmlFor="categories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categories
                              </label>
                              <input
                                type="text"
                                id="categories"
                                value={formData.categories.join(', ')}
                                onChange={(e) => handleArrayInputChange('categories', e.target.value)}
                                placeholder="e.g., AI, EdTech, FinTech"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              />
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Separate multiple categories with commas
                              </p>
                            </div>

                            {/* Tags */}
                            <div>
                              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tags
                              </label>
                              <input
                                type="text"
                                id="tags"
                                value={formData.tags.join(', ')}
                                onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                                placeholder="e.g., machine-learning, mobile-app, social-impact"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              />
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Separate multiple tags with commas
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Media & Links */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Media & Links</h2>
                          
                          <div className="space-y-6">
                            {/* Preview Image */}
                            <div>
                              <label htmlFor="preview_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preview Image URL
                              </label>
                              <input
                                type="url"
                                id="preview_image"
                                value={formData.preview_image}
                                onChange={(e) => handleInputChange('preview_image', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  validationErrors.preview_image ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                }`}
                              />
                              {validationErrors.preview_image && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.preview_image}</p>
                              )}
                            </div>

                            {/* Pitch URL */}
                            <div>
                              <label htmlFor="pitch_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Demo/Pitch URL
                              </label>
                              <input
                                type="url"
                                id="pitch_url"
                                value={formData.pitch_url}
                                onChange={(e) => handleInputChange('pitch_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  validationErrors.pitch_url ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                }`}
                              />
                              {validationErrors.pitch_url && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.pitch_url}</p>
                              )}
                            </div>

                            {/* Repository URL */}
                            <div>
                              <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Repository URL
                              </label>
                              <input
                                type="url"
                                id="repo_url"
                                value={formData.repo_url}
                                onChange={(e) => handleInputChange('repo_url', e.target.value)}
                                placeholder="https://github.com/username/repo"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  validationErrors.repo_url ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                }`}
                              />
                              {validationErrors.repo_url && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.repo_url}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Visibility Settings */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Visibility Settings</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                              Who can see this project?
                            </label>
                            <div className="space-y-4">
                              {VISIBILITY_OPTIONS.map(option => (
                                <label key={option.value} className="flex items-start cursor-pointer">
                                  <input
                                    type="radio"
                                    name="visibility"
                                    value={option.value}
                                    checked={formData.visibility === option.value}
                                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                                  />
                                  <div className="ml-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {option.label}
                                    </span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {option.description}
                                    </p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                          <button
                            type="button"
                            onClick={() => router.push(`/projects/${projectId}`)}
                            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSaving ? 'Saving Changes...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
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
