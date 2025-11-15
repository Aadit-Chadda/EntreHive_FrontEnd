'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/lib/api';
import { ProjectCreateData } from '@/types';
import { PROJECT_BANNER_GRADIENTS, DEFAULT_PROJECT_BANNER_GRADIENT } from '@/lib/projectBranding';
import { Palette } from 'lucide-react';

interface ProjectCreateFormProps {
  onSuccess?: (project: any) => void;
  onCancel?: () => void;
}

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
  { value: 'private', label: 'Private (Only you and team members)' },
  { value: 'university', label: 'University Only' },
  { value: 'public', label: 'Public' },
];

const NEED_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'dev', label: 'Development' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'research', label: 'Research' },
  { value: 'funding', label: 'Funding' },
  { value: 'mentor', label: 'Mentor' },
];

export default function ProjectCreateForm({ onSuccess, onCancel }: ProjectCreateFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProjectCreateData>({
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

  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNeedToggle = (need: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs?.includes(need as any)
        ? prev.needs.filter(n => n !== need)
        : [...(prev.needs || []), need as any]
    }));
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories?.includes(categoryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), categoryInput.trim()]
      }));
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.filter(c => c !== category) || []
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleBannerGradientSelect = (gradientId: string) => {
    setFormData(prev => ({
      ...prev,
      banner_style: 'gradient',
      banner_gradient: gradientId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Clean up empty fields
      const cleanData: ProjectCreateData = {
        ...formData,
        summary: formData.summary?.trim() || undefined,
        preview_image: formData.preview_image?.trim() || undefined,
        pitch_url: formData.pitch_url?.trim() || undefined,
        repo_url: formData.repo_url?.trim() || undefined,
      };

      const project = await projectApi.createProject(cleanData);
      
      // Ensure the project has a valid ID before proceeding
      if (!project || !project.id) {
        throw new Error('Invalid project response from server');
      }
      
      if (onSuccess) {
        onSuccess(project);
      } else {
        // Add a small delay to ensure the project is fully created
        setTimeout(() => {
          router.push(`/projects/${project.id}`);
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onCancel) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
      onClick={handleBackdropClick}
    >
      <div className="rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2" 
           style={{
             backgroundColor: 'var(--surface)',
             borderColor: 'var(--primary-orange)',
             boxShadow: '0 20px 60px rgba(243, 172, 59, 0.3)'
           }}>
        {/* Modal Header */}
        <div className="px-6 py-4 flex justify-between items-center"
             style={{
               background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)'
             }}>
          <div>
            <h2 className="text-2xl font-bold text-white font-roca-two">Create New Project</h2>
            <p className="text-white/90 text-sm font-canva-sans">Bring your ideas to life and find collaborators</p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-full"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Approval Notice */}
            <div className="mb-6 p-4 rounded-lg border-2" style={{
              backgroundColor: 'rgba(243, 172, 59, 0.1)',
              borderColor: 'var(--primary-orange)'
            }}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 mt-0.5" style={{color: 'var(--primary-orange)'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-semibold font-canva-sans mb-1" style={{color: 'var(--text-primary)'}}>
                    Project Review Required
                  </h4>
                  <p className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                    Your project will be submitted for admin review before it becomes visible to others. You&apos;ll see a &quot;Pending Review&quot; status until it&apos;s approved.
                    Approved projects will be visible according to your visibility settings, while rejected projects will remain visible only to you.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      minLength={3}
                      maxLength={140}
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter your project title (3-140 characters)"
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      {formData.title.length}/140 characters
                    </p>
                  </div>

                  {/* Project Type and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="project_type" className="block text-sm font-medium text-gray-900 mb-2">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="project_type"
                        name="project_type"
                        required
                        value={formData.project_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      >
                        {PROJECT_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
                        Project Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      >
                        {PROJECT_STATUS.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-900 mb-2">
                      Project Summary
                    </label>
                    <textarea
                      id="summary"
                      name="summary"
                      rows={4}
                      maxLength={5000}
                      value={formData.summary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Describe your project in detail - what problem does it solve? What makes it unique?"
                    />
                    <p className="mt-1 text-xs text-gray-600">
                {formData.summary?.length || 0}/5000 characters
              </p>
            </div>
          </div>
        </div>

        {/* Banner Appearance */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-col lg:flex-row mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-500" />
                Banner Appearance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pick a branded gradient for your project banner. You can upload a custom image later from the project page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECT_BANNER_GRADIENTS.map((option) => {
              const isActive = option.id === (formData.banner_gradient || DEFAULT_PROJECT_BANNER_GRADIENT);
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => handleBannerGradientSelect(option.id)}
                  className={`w-full text-left rounded-2xl border transition-transform ${isActive ? 'ring-2 ring-amber-500 scale-[1.01]' : ''}`}
                  style={{ borderColor: isActive ? 'rgba(243, 172, 59, 0.6)' : 'var(--border)' }}
                >
                  <div className="h-24 rounded-t-2xl" style={{ background: option.gradient }}></div>
                  <div className="p-4 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {option.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Needs */}
        <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  What do you need help with?
                </h3>
                <p className="text-sm text-gray-700 mb-4">Select all areas where you&apos;re looking for collaborators or support</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {NEED_OPTIONS.map(need => (
                    <label 
                      key={need.value} 
                      className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white hover:border-red-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.needs?.includes(need.value as any) || false}
                        onChange={() => handleNeedToggle(need.value)}
                        className="text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                      <span className="text-sm font-medium text-gray-900">{need.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories & Tags
                </h3>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Categories
                  </label>
                  <p className="text-xs text-gray-600 mb-3">Add broad categories like "AI", "EdTech", &quot;FinTech&quot;, etc.</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.categories?.map(category => (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Add category (e.g., AI, EdTech)"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tags
                  </label>
                  <p className="text-xs text-gray-600 mb-3">Add specific keywords that describe your project</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags?.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Add tag (e.g., machine-learning, mobile-app)"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-6 py-2 bg-gray-600 text-white font-medium rounded-r-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Links and Resources */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Links & Resources
                </h3>
                <p className="text-sm text-gray-700 mb-4">Optional: Add links to showcase your project</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="preview_image" className="block text-sm font-medium text-gray-900 mb-2">
                      Preview Image URL
                    </label>
                    <input
                      type="url"
                      id="preview_image"
                      name="preview_image"
                      value={formData.preview_image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label htmlFor="pitch_url" className="block text-sm font-medium text-gray-900 mb-2">
                      Pitch/Demo URL
                    </label>
                    <input
                      type="url"
                      id="pitch_url"
                      name="pitch_url"
                      value={formData.pitch_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label htmlFor="repo_url" className="block text-sm font-medium text-gray-900 mb-2">
                      Repository URL
                    </label>
                    <input
                      type="url"
                      id="repo_url"
                      name="repo_url"
                      value={formData.repo_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Project Visibility
                </h3>
                <p className="text-sm text-gray-700 mb-4">Choose who can see your project</p>
                
                <div>
                  <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    {VISIBILITY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs text-gray-600">
                    <div className="space-y-1">
                      <p><strong>Private:</strong> Only visible to you and your team members</p>
                      <p><strong>University Only:</strong> Visible to students and faculty from your university</p>
                      <p><strong>Public:</strong> Visible to everyone on the platform</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6" style={{borderTop: '1px solid var(--border)'}}>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 font-medium font-canva-sans rounded-lg transition-all duration-300"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--hover-bg)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--secondary-charcoal)';
                      e.currentTarget.style.backgroundColor = 'var(--active-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !formData.title.trim()}
                  className="px-8 py-3 text-white font-medium font-canva-sans rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  style={{
                    background: !isLoading && formData.title.trim() 
                      ? 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)'
                      : 'var(--text-muted)',
                    boxShadow: !isLoading && formData.title.trim() 
                      ? '0 4px 16px rgba(243, 172, 59, 0.3)'
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--primary-orange) 100%)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(231, 159, 116, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(243, 172, 59, 0.3)';
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Project...
                    </div>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
