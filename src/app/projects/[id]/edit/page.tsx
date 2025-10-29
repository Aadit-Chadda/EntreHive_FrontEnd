'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeftNavigation from '../../../components/LeftNavigation';
import RightSidebar from '../../../components/RightSidebar';
import { ThemeProvider } from '../../../components/ThemeProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectData, ProjectUpdateData } from '@/types';
import { projectApi } from '@/lib/api';
import { Palette, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { PROJECT_BANNER_GRADIENTS, DEFAULT_PROJECT_BANNER_GRADIENT } from '@/lib/projectBranding';
import type { ProjectBannerStyle } from '@/lib/projectBranding';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);

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
    banner_style: 'gradient',
    banner_gradient: DEFAULT_PROJECT_BANNER_GRADIENT,
    pitch_url: '',
    repo_url: '',
    visibility: 'private',
  });

  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  useEffect(() => {
    if (!bannerImageFile) return;
    const objectUrl = URL.createObjectURL(bannerImageFile);
    setBannerImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [bannerImageFile]);

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
        banner_style: projectData.banner_style,
        banner_gradient: projectData.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT,
        pitch_url: projectData.pitch_url || '',
        repo_url: projectData.repo_url || '',
        visibility: projectData.visibility,
      });
      setBannerImagePreview(projectData.banner_image || null);
      setBannerImageFile(null);
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
      
      const { banner_image: _ignored, ...rest } = formData;
      const updatePayload: ProjectUpdateData = {
        ...rest,
      };

      if ((formData.banner_style || 'gradient') === 'gradient') {
        updatePayload.banner_image = null;
      }

      let updatedProject = await projectApi.updateProject(projectId, updatePayload);

      if ((formData.banner_style || 'gradient') === 'image' && bannerImageFile) {
        const uploadData = new FormData();
        uploadData.append('banner_style', 'image');
        uploadData.append('banner_gradient', formData.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT);
        uploadData.append('banner_image', bannerImageFile);
        updatedProject = await projectApi.updateProjectBannerImage(projectId, uploadData);
      }

      setProject(updatedProject);
      setBannerImageFile(null);
      setBannerImagePreview(updatedProject.banner_image || null);

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

  const handleBannerStyleChange = (style: ProjectBannerStyle) => {
    setFormData(prev => ({ ...prev, banner_style: style }));
    if (style === 'gradient') {
      setBannerImageFile(null);
      setBannerImagePreview(null);
    }
  };

  const handleBannerGradientSelect = (gradientId: string) => {
    setFormData(prev => ({ ...prev, banner_gradient: gradientId }));
  };

  const handleBannerImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setFormData(prev => ({ ...prev, banner_style: 'image' }));
    }
  };

  const handleClearBannerImage = () => {
    setBannerImageFile(null);
    setBannerImagePreview(null);
    setFormData(prev => ({ ...prev, banner_style: 'gradient' }));
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
    { value: 'public', label: 'Public', description: 'Anyone can see this project' },
  ];

  const NEED_OPTIONS = ['design', 'dev', 'marketing', 'research', 'funding', 'mentor'] as const;

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

  if (error && !project) {
    return (
      <ProtectedRoute>
        <ThemeProvider>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="text-center space-y-4">
              <div>
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
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Unable to Edit Project
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
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

  return (
    <ProtectedRoute>
      <ThemeProvider>
        <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--background)' }}>
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
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span
                className="font-bold text-lg font-roca-two"
                style={{ color: 'var(--text-primary)' }}
              >
                Edit Project
              </span>
            </div>

            <button
              onClick={() => router.push(`/projects/${projectId}`)}
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
                            onClick={() => router.push(`/projects/${projectId}`)}
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
                            Edit Project
                          </h1>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => router.push(`/projects/${projectId}`)}
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
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--primary)' }}
                            onMouseEnter={(e) => {
                              if (isSaving) return;
                              e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                            }}
                            onMouseLeave={(e) => {
                              if (isSaving) return;
                              e.currentTarget.style.backgroundColor = 'var(--primary)';
                            }}
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
                        <div
                          className="mb-6 rounded-lg p-4"
                          style={{ backgroundColor: 'rgba(119, 11, 11, 0.12)', border: '1px solid rgba(119, 11, 11, 0.3)' }}
                        >
                          <div className="flex" style={{ color: 'var(--secondary-red)' }}>
                            <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="text-sm">{error}</div>
                          </div>
                        </div>
                      )}

                      {/* Edit Form */}
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div
                          className="rounded-2xl shadow-sm border p-8"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <h2
                            className="text-xl flex items-center gap-3 font-bold mb-6"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Basic Information
                          </h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="lg:col-span-2">
                              <label
                                htmlFor="title"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Project Title *
                              </label>
                              <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter your project title"
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                                  validationErrors.title ? 'border-red-300' : 'border-[var(--border)]'
                                }`}
                                maxLength={140}
                              />
                              {validationErrors.title && (
                                <p className="mt-1 text-sm" style={{ color: 'var(--secondary-red)' }}>
                                  {validationErrors.title}
                                </p>
                              )}
                              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {formData.title?.length || 0}/140 characters
                              </p>
                            </div>

                            {/* Project Type */}
                            <div>
                              <label
                                htmlFor="project_type"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Project Type *
                              </label>
                              <select
                                id="project_type"
                                value={formData.project_type}
                                onChange={(e) => handleInputChange('project_type', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)]"
                                style={{ borderColor: 'var(--border)' }}
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
                              <label
                                htmlFor="status"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Project Status *
                              </label>
                              <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)]"
                                style={{ borderColor: 'var(--border)' }}
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
                              <label
                                htmlFor="summary"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Project Summary
                              </label>
                              <textarea
                                id="summary"
                                value={formData.summary}
                                onChange={(e) => handleInputChange('summary', e.target.value)}
                                placeholder="Describe your project in detail..."
                                rows={6}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                                  validationErrors.summary ? 'border-red-300' : 'border-[var(--border)]'
                                }`}
                                maxLength={5000}
                              />
                              {validationErrors.summary && (
                                <p className="mt-1 text-sm" style={{ color: 'var(--secondary-red)' }}>
                                  {validationErrors.summary}
                                </p>
                              )}
                              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {formData.summary?.length || 0}/5000 characters
                              </p>
                            </div>
                        </div>
                      </div>

                        {/* Banner Appearance */}
                        <div
                          className="rounded-2xl shadow-sm border p-8"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <div className="flex items-start justify-between gap-4 mb-6 flex-col lg:flex-row">
                            <div>
                              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                Banner Appearance
                              </h2>
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Pick a branded gradient or upload your own banner image.
                              </p>
                            </div>
                            {bannerImagePreview && formData.banner_style === 'image' && (
                              <button
                                type="button"
                                onClick={handleClearBannerImage}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                                style={{
                                  backgroundColor: 'rgba(119, 11, 11, 0.12)',
                                  color: 'var(--secondary-red)',
                                  border: '1px solid rgba(119, 11, 11, 0.25)'
                                }}
                              >
                                Remove Uploaded Image
                              </button>
                            )}
                          </div>

                          <div className="flex gap-3 flex-wrap" role="tablist">
                            <button
                              type="button"
                              onClick={() => handleBannerStyleChange('gradient')}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                (formData.banner_style || 'gradient') === 'gradient' ? 'text-white' : ''
                              }`}
                              style={(formData.banner_style || 'gradient') === 'gradient'
                                ? { backgroundColor: 'var(--accent-navy)' }
                                : { backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                            >
                              <Palette className="w-4 h-4" />
                              Gradient
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBannerStyleChange('image')}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                (formData.banner_style || 'gradient') === 'image' ? 'text-white' : ''
                              }`}
                              style={(formData.banner_style || 'gradient') === 'image'
                                ? { backgroundColor: 'var(--primary)' }
                                : { backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                            >
                              <ImageIcon className="w-4 h-4" />
                              Image
                            </button>
                          </div>

                          {(formData.banner_style || 'gradient') === 'gradient' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                              {PROJECT_BANNER_GRADIENTS.map((option) => {
                                const isActive = option.id === (formData.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT);
                                return (
                                  <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => handleBannerGradientSelect(option.id)}
                                    className={`w-full text-left rounded-2xl border transition-transform ${isActive ? 'ring-2 ring-[var(--accent-navy)] scale-[1.01]' : ''}`}
                                    style={{ borderColor: isActive ? 'var(--accent-navy)' : 'var(--border)' }}
                                  >
                                    <div className="h-28 rounded-t-2xl" style={{ background: option.gradient }}></div>
                                    <div className="p-4 space-y-1" style={{ backgroundColor: 'var(--surface)' }}>
                                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {option.name}
                                      </p>
                                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {option.description}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {(formData.banner_style || 'gradient') === 'image' && (
                            <div className="mt-6 space-y-4">
                              <div
                                className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 px-6 py-8 text-center"
                                style={{ borderColor: 'var(--border)' }}
                              >
                                {bannerImagePreview ? (
                                  <div className="w-full max-w-md overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                                    <img src={bannerImagePreview} alt="Banner preview" className="w-full h-40 object-cover" />
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
                                    <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageChange} />
                                  </label>
                                </div>
                                {project?.banner_image && !bannerImageFile && (
                                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    The existing banner image will remain unless you upload a new image or switch back to a gradient.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Project Needs */}
                        <div
                          className="rounded-2xl shadow-sm border p-8"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <h2
                            className="text-xl font-bold mb-6"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Project Needs
                          </h2>
                          
                          <div>
                            <label
                              className="block text-sm font-medium mb-3"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              What kind of help are you looking for?
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {NEED_OPTIONS.map(need => (
                                <label key={need} className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.needs?.includes(need) || false}
                                    onChange={(e) => {
                                      const currentNeeds = formData.needs || [];
                                      const newNeeds = e.target.checked
                                        ? [...currentNeeds, need]
                                        : currentNeeds.filter(n => n !== need);
                                      handleInputChange('needs', newNeeds);
                                    }}
                                    className="w-4 h-4 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] accent-[var(--primary)]"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                                  />
                                  <span
                                    className="ml-2 text-sm capitalize"
                                    style={{ color: 'var(--text-secondary)' }}
                                  >
                                    {need}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Categories and Tags */}
                        <div
                          className="rounded-2xl shadow-sm border p-8"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <h2
                            className="text-xl font-bold mb-6"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Categories & Tags
                          </h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Categories */}
                            <div>
                              <label
                                htmlFor="categories"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Categories
                              </label>
                              <input
                                type="text"
                                id="categories"
                                value={formData.categories?.join(', ') || ''}
                                onChange={(e) => handleArrayInputChange('categories', e.target.value)}
                                placeholder="e.g., AI, EdTech, FinTech"
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                                style={{ borderColor: 'var(--border)' }}
                              />
                              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Separate multiple categories with commas
                              </p>
                            </div>

                            {/* Tags */}
                            <div>
                              <label
                                htmlFor="tags"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Tags
                              </label>
                              <input
                                type="text"
                                id="tags"
                                value={formData.tags?.join(', ') || ''}
                                onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                                placeholder="e.g., machine-learning, mobile-app, social-impact"
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                                style={{ borderColor: 'var(--border)' }}
                              />
                              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Separate multiple tags with commas
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Media & Links */}
                        <div
                          className="rounded-2xl shadow-sm border p-8"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <h2
                            className="text-xl font-bold mb-6"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Media & Links
                          </h2>
                          
                          <div className="space-y-6">
                            {/* Preview Image */}
                            <div>
                              <label
                                htmlFor="preview_image"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Preview Image URL
                              </label>
                              <input
                                type="url"
                                id="preview_image"
                                value={formData.preview_image}
                                onChange={(e) => handleInputChange('preview_image', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                                  validationErrors.preview_image ? 'border-red-300' : 'border-[var(--border)]'
                                }`}
                              />
                              {validationErrors.preview_image && (
                                <p className="mt-1 text-sm" style={{ color: 'var(--secondary-red)' }}>
                                  {validationErrors.preview_image}
                                </p>
                              )}
                            </div>

                            {/* Pitch URL */}
                            <div>
                              <label
                                htmlFor="pitch_url"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Demo/Pitch URL
                              </label>
                              <input
                                type="url"
                                id="pitch_url"
                                value={formData.pitch_url}
                                onChange={(e) => handleInputChange('pitch_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                                  validationErrors.pitch_url ? 'border-red-300' : 'border-[var(--border)]'
                                }`}
                              />
                              {validationErrors.pitch_url && (
                                <p className="mt-1 text-sm" style={{ color: 'var(--secondary-red)' }}>
                                  {validationErrors.pitch_url}
                                </p>
                              )}
                            </div>

                            {/* Repository URL */}
                            <div>
                              <label
                                htmlFor="repo_url"
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Repository URL
                              </label>
                              <input
                                type="url"
                                id="repo_url"
                                value={formData.repo_url}
                                onChange={(e) => handleInputChange('repo_url', e.target.value)}
                                placeholder="https://github.com/username/repo"
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
                                  validationErrors.repo_url ? 'border-red-300' : 'border-[var(--border)]'
                                }`}
                              />
                              {validationErrors.repo_url && (
                                <p className="mt-1 text-sm" style={{ color: 'var(--secondary-red)' }}>
                                  {validationErrors.repo_url}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Visibility Settings */}
                        <div
                          className="rounded-2xl shadow-sm border p-8"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <h2
                            className="text-xl font-bold mb-6"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Visibility Settings
                          </h2>
                          
                          <div>
                            <label
                              className="block text-sm font-medium mb-4"
                              style={{ color: 'var(--text-secondary)' }}
                            >
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
                                    className="w-4 h-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] accent-[var(--primary)] mt-1"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                                  />
                                  <div className="ml-3">
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: 'var(--text-primary)' }}
                                    >
                                      {option.label}
                                    </span>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                            className="px-6 py-3 text-sm font-medium rounded-lg transition-colors"
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
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--primary)' }}
                            onMouseEnter={(e) => {
                              if (isSaving) return;
                              e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                            }}
                            onMouseLeave={(e) => {
                              if (isSaving) return;
                              e.currentTarget.style.backgroundColor = 'var(--primary)';
                            }}
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
              <div className="hidden lg:block fixed right-0 top-0 h-screen" style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
                <RightSidebar />
              </div>
            </div>
          </div>

          {/* Overlay for mobile panels */}
          {showMobileNav && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
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
