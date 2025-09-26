'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  X, 
  Send, 
  Globe, 
  Lock, 
  School, 
  Tag,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { PostCreateData, ProjectData, PostData } from '@/types';
import { postsApi, projectApi } from '@/lib/api';

interface PostComposerProps {
  onPostCreated?: (post: PostData) => void;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
}

export default function PostComposer({ 
  onPostCreated, 
  placeholder = "What's on your mind?",
  autoFocus = false,
  compact = false
}: PostComposerProps) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'university' | 'private'>('public');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadUserProjects = useCallback(async () => {
    if (projects.length > 0) return; // Already loaded
    
    setProjectsLoading(true);
    try {
      // For now, get all projects and filter on client side
      // TODO: Implement proper user projects endpoint
      const response = await projectApi.getProjects({ 
        page_size: 50 
      });
      setProjects(response.results);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  }, [projects.length]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const postData: PostCreateData = {
        content: content.trim(),
        visibility,
        tagged_project_ids: selectedProjects,
        image: selectedImage || undefined,
      };

      const newPost = await postsApi.createPost(postData);
      
      // Reset form
      setContent('');
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedProjects([]);
      setVisibility('public');
      if (!compact) setIsExpanded(false);
      
      onPostCreated?.(newPost);
    } catch (error: any) {
      console.error('Failed to create post:', error);
      setError(error?.response?.data?.detail || error?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this post' },
    { value: 'university', label: 'University', icon: School, description: 'Only people from your university' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you can see this post' },
  ] as const;

  const selectedVisibility = visibilityOptions.find(opt => opt.value === visibility)!;

  if (compact && !isExpanded) {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(true)}
        className="w-full p-6 rounded-xl text-left font-canva-sans transition-all duration-300 shadow-sm border-2"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
          e.currentTarget.style.borderColor = 'var(--primary-orange)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(243, 172, 59, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface)';
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        data-composer
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--primary-orange)'}}>
            <span className="text-white font-bold font-roca-two">✨</span>
          </div>
          <span className="text-base">{placeholder}</span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-6 space-y-5 shadow-lg border-2"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--primary-orange)',
        boxShadow: '0 10px 40px rgba(243, 172, 59, 0.1)'
      }}
      data-composer
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--primary-orange)'}}>
            <span className="text-white text-sm font-bold font-roca-two">📝</span>
          </div>
          <h3 className="font-semibold font-roca-two text-lg" style={{color: 'var(--text-primary)'}}>Create Post</h3>
        </div>
        {compact && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-full transition-colors"
            style={{color: 'var(--text-muted)'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.color = 'var(--secondary-red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Content Input */}
      <div className="space-y-4">
        <motion.textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full p-4 rounded-xl resize-none transition-all duration-300 font-canva-sans text-base border-2"
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
          rows={4}
          maxLength={2000}
          initial={{ height: 100 }}
          animate={{ height: content.length > 100 ? 120 : 100 }}
        />
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>
            {content.length}/2000
          </span>
          {content.length > 1900 && (
            <span className="text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>
              {2000 - content.length} characters remaining
            </span>
          )}
        </div>
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative rounded-lg overflow-hidden"
          >
            <Image
              src={imagePreview}
              alt="Preview"
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tagged Projects */}
      <AnimatePresence>
        {selectedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tagged Projects:</p>
            <div className="flex flex-wrap gap-2">
              {selectedProjects.map((projectId) => {
                const project = projects.find(p => p.id === projectId);
                if (!project) return null;
                
                return (
                  <motion.div
                    key={projectId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    <span>{project.title}</span>
                    <button
                      onClick={() => toggleProjectSelection(projectId)}
                      className="hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Selector */}
      <AnimatePresence>
        {showProjectSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tag Projects:</p>
              <button
                onClick={() => setShowProjectSelector(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
              {projectsLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No projects found
                </div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => toggleProjectSelection(project.id)}
                    className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      selectedProjects.includes(project.id) 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.project_type} • {project.status}</div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between pt-5" style={{borderTop: '1px solid var(--border)'}}>
        <div className="flex items-center gap-3">
          {/* Image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl transition-all duration-300 shadow-sm border"
            style={{
              backgroundColor: 'var(--hover-bg)',
              borderColor: 'var(--border)',
              color: 'var(--accent-terracotta)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--active-bg)';
              e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(231, 159, 116, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
            title="Add image"
          >
            <ImageIcon className="w-5 h-5" />
          </motion.button>

          {/* Project tagging */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowProjectSelector(!showProjectSelector);
              if (!showProjectSelector) loadUserProjects();
            }}
            className="p-3 rounded-xl transition-all duration-300 shadow-sm border"
            style={{
              backgroundColor: 'var(--hover-bg)',
              borderColor: 'var(--border)',
              color: 'var(--accent-pine)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--active-bg)';
              e.currentTarget.style.borderColor = 'var(--accent-pine)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 79, 56, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
            title="Tag projects"
          >
            <Tag className="w-5 h-5" />
          </motion.button>

          {/* Visibility selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 shadow-sm border"
              style={{
                backgroundColor: 'var(--hover-bg)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--active-bg)';
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(243, 172, 59, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <selectedVisibility.icon className="w-4 h-4" />
              <span className="text-sm font-canva-sans font-medium">{selectedVisibility.label}</span>
            </motion.button>

            <AnimatePresence>
              {showVisibilityDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                >
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setVisibility(option.value);
                        setShowVisibilityDropdown(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 first:rounded-t-lg last:rounded-b-lg ${
                        visibility === option.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="flex items-center gap-3 px-8 py-3 text-white rounded-xl font-semibold font-canva-sans transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
          style={{
            backgroundColor: !content.trim() || isSubmitting ? 'var(--text-muted)' : 'var(--primary-orange)',
            boxShadow: !content.trim() || isSubmitting ? 'none' : '0 4px 16px rgba(243, 172, 59, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(231, 159, 116, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(243, 172, 59, 0.3)';
            }
          }}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span className="text-base">
            {isSubmitting ? 'Sharing...' : 'Share Post'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
