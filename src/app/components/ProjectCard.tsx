'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectData, ProjectUser } from '@/types';
import { projectApi } from '@/lib/api';

interface ProjectCardProps {
  project: ProjectData;
  onUpdate?: (project: ProjectData) => void;
  onDelete?: (projectId: string) => void;
}

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
    bg: 'rgba(33, 79, 56, 0.1)', 
    text: 'var(--accent-pine)', 
    border: 'var(--accent-pine)' 
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
    bg: 'rgba(33, 79, 56, 0.1)', 
    text: 'var(--accent-pine)', 
    border: 'var(--accent-pine)' 
  },
};

const VISIBILITY_ICONS: Record<string, React.ReactElement> = {
  private: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  university: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H7m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-8 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0h4" />
    </svg>
  ),
  public: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Helper function to safely get user display name
  const getUserDisplayName = (user: ProjectUser): string => {
    // Add extra safety checks
    if (!user) return 'Unknown';
    
    try {
      // Check profile exists and has full_name
      if (user.profile && typeof user.profile === 'object' && user.profile.full_name) {
        return user.profile.full_name;
      }
      
      // Fallback to user properties
      if (user.full_name) return user.full_name;
      if (user.username) return user.username;
      
      return 'Unknown';
    } catch (error) {
      console.warn('Error accessing user display name:', error);
      return user.username || 'Unknown';
    }
  };

  // Helper function to safely get user initials
  const getUserInitials = (user: ProjectUser): string => {
    const displayName = getUserDisplayName(user);
    return displayName.charAt(0).toUpperCase();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await projectApi.deleteProject(project.id);
      onDelete?.(project.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="rounded-2xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border-2" 
           style={{
             backgroundColor: 'var(--surface)',
             borderColor: 'var(--border)',
             boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.borderColor = 'var(--primary-orange)';
             e.currentTarget.style.boxShadow = '0 8px 32px rgba(243, 172, 59, 0.2)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.borderColor = 'var(--border)';
             e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
           }}>
        {/* Header with Preview Image or Gradient */}
        <div className="relative h-48 overflow-hidden">
          {project.preview_image ? (
            <>
              <img
                src={project.preview_image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full relative" style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 50%, var(--accent-pine) 100%)'}}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
                }}></div>
              </div>
            </div>
          )}
          
          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium font-canva-sans rounded-full border backdrop-blur-sm"
                  style={{
                    backgroundColor: STATUS_COLORS[project.status].bg,
                    color: STATUS_COLORS[project.status].text,
                    borderColor: STATUS_COLORS[project.status].border
                  }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
              {project.status.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium font-canva-sans rounded-full border backdrop-blur-sm"
                  style={{
                    backgroundColor: VISIBILITY_COLORS[project.visibility].bg,
                    color: VISIBILITY_COLORS[project.visibility].text,
                    borderColor: VISIBILITY_COLORS[project.visibility].border
                  }}>
              {VISIBILITY_ICONS[project.visibility]}
              <span className="ml-1">
                {project.visibility === 'private' ? 'Private' : 
                 project.visibility === 'university' ? 'University' :
                 'Public'}
              </span>
            </span>
          </div>

          {/* Project Type Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full backdrop-blur-sm border border-white/20">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H7m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-8 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0h4" />
              </svg>
              {PROJECT_TYPE_LABELS[project.project_type]}
            </span>
          </div>

          {/* Overlay on Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors line-clamp-2">
              {project.title}
            </h3>
            <div className="flex items-center text-white/90">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">
                  {getUserInitials(project.owner)}
                </span>
              </div>
              <span className="text-sm">by {getUserDisplayName(project.owner)}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Summary */}
          {project.summary && (
            <p className="text-sm leading-relaxed line-clamp-3 font-canva-sans" style={{color: 'var(--text-secondary)'}}>
              {project.summary}
            </p>
          )}

          {/* Project Needs */}
          {project.needs.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-red)'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-xs font-medium font-canva-sans uppercase tracking-wider" style={{color: 'var(--text-muted)'}}>Looking for</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {project.needs.slice(0, 3).map(need => (
                  <span
                    key={need}
                    className="inline-flex items-center px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-full border border-red-200 dark:border-red-800"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                    {need}
                  </span>
                ))}
                {project.needs.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                    +{project.needs.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Categories and Tags */}
          {(project.categories.length > 0 || project.tags.length > 0) && (
            <div>
              <div className="flex flex-wrap gap-1">
                {project.categories.slice(0, 2).map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {category}
                  </span>
                ))}
                {project.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
                {(project.categories.length + project.tags.length) > 4 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                    +{(project.categories.length + project.tags.length) - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Team Section */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {/* Owner Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                    <span className="text-white font-bold text-xs">
                      {getUserInitials(project.owner)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white dark:border-gray-800"></div>
                </div>

                {/* Team Member Avatars */}
                {project.team_members.slice(0, 2).map((member, index) => (
                  <div key={member.id} className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm -ml-2">
                    <span className="text-white font-bold text-xs">
                      {getUserInitials(member)}
                    </span>
                  </div>
                ))}

                {/* More members indicator */}
                {project.team_members.length > 2 && (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm -ml-2">
                    <span className="text-gray-600 dark:text-gray-300 font-bold text-xs">
                      +{project.team_members.length - 2}
                    </span>
                  </div>
                )}
              </div>

              <div className="ml-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.team_count} member{project.team_count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              {/* Member Badge */}
              {project.is_team_member && !project.can_edit && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Member
                </span>
              )}

              {/* Owner Badge */}
              {project.can_edit && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full border border-purple-200 dark:border-purple-800">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Owner
                </span>
              )}
            </div>
          </div>

          {/* Footer with Links and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
              
              {/* External Links */}
              <div className="flex items-center space-x-2">
                {project.pitch_url && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.pitch_url, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-xs transition-colors"
                    title="View Demo"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {project.repo_url && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.repo_url, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors"
                    title="View Code"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Owner Actions */}
            {project.can_edit && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/projects/${project.id}/edit`);
                  }}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium font-canva-sans rounded-md border transition-colors"
                  style={{
                    backgroundColor: 'rgba(33, 79, 56, 0.1)',
                    color: 'var(--accent-pine)',
                    borderColor: 'var(--accent-pine)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(33, 79, 56, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(33, 79, 56, 0.1)'}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium font-canva-sans rounded-md border transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'rgba(119, 11, 11, 0.1)',
                    color: 'var(--secondary-red)',
                    borderColor: 'var(--secondary-red)'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgba(119, 11, 11, 0.2)')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgba(119, 11, 11, 0.1)')}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hover overlay for better visual feedback */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 dark:group-hover:border-blue-500 rounded-2xl transition-colors pointer-events-none opacity-0 group-hover:opacity-100"></div>
      </div>
    </Link>
  );
}