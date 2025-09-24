'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/types';
import { projectApi } from '@/lib/api';
import ProjectInvitations from './ProjectInvitations';

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

const STATUS_COLORS: Record<string, string> = {
  concept: 'bg-yellow-100 text-yellow-800',
  mvp: 'bg-blue-100 text-blue-800',
  launched: 'bg-green-100 text-green-800',
};

const VISIBILITY_COLORS: Record<string, string> = {
  university: 'bg-purple-100 text-purple-800',
  cross_university: 'bg-indigo-100 text-indigo-800',
  public: 'bg-gray-100 text-gray-800',
};

export default function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showInvitationsModal, setShowInvitationsModal] = useState(false);
  const [teamMemberUsername, setTeamMemberUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTeamMember = async () => {
    if (!teamMemberUsername.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await projectApi.addTeamMember(project.id, { username: teamMemberUsername.trim() });
      // Refresh project data
      const updatedProject = await projectApi.getProject(project.id);
      onUpdate?.(updatedProject);
      setTeamMemberUsername('');
      setShowTeamModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeamMember = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      await projectApi.removeTeamMember(project.id, userId);
      // Refresh project data
      const updatedProject = await projectApi.getProject(project.id);
      onUpdate?.(updatedProject);
    } catch (err: any) {
      setError(err.message || 'Failed to remove team member');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            href={`/projects/${project.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {project.title}
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            by {project.owner.full_name || project.owner.username}
          </p>
        </div>
        
        {/* Status badges */}
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
            {project.status.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${VISIBILITY_COLORS[project.visibility]}`}>
            {project.visibility.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Preview image */}
      {project.preview_image && (
        <div className="mb-4">
          <img
            src={project.preview_image}
            alt={project.title}
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Project type and summary */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {PROJECT_TYPE_LABELS[project.project_type]}
          </span>
          <span className="text-sm text-gray-500">
            {project.team_count} team member{project.team_count !== 1 ? 's' : ''}
          </span>
        </div>
        
        {project.summary && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {project.summary}
          </p>
        )}
      </div>

      {/* Needs */}
      {project.needs.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Looking for:</p>
          <div className="flex flex-wrap gap-1">
            {project.needs.map(need => (
              <span
                key={need}
                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
              >
                {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categories and tags */}
      {(project.categories.length > 0 || project.tags.length > 0) && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.categories.map(category => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team members */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Team:</p>
        <div className="flex flex-wrap gap-2">
          {/* Owner */}
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-900">
              {project.owner.full_name || project.owner.username}
            </span>
            <span className="text-xs text-blue-600 bg-blue-200 px-2 py-0.5 rounded-full">
              Owner
            </span>
          </div>

          {/* Team members */}
          {project.team_members.map(member => (
            <div key={member.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
              <span className="text-sm text-gray-900">
                {member.full_name || member.username}
              </span>
              {project.can_edit && (
                <button
                  onClick={() => handleRemoveTeamMember(member.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                  title="Remove team member"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Add team member and manage invitations buttons */}
          {project.can_edit && (
            <>
              <button
                onClick={() => setShowTeamModal(true)}
                className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-300 rounded-full hover:bg-blue-50"
              >
                + Add Member
              </button>
              <button
                onClick={() => setShowInvitationsModal(true)}
                className="text-sm text-green-600 hover:text-green-800 px-3 py-1 border border-green-300 rounded-full hover:bg-green-50"
              >
                📧 Invitations
              </button>
            </>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex space-x-4 mb-4">
        {project.pitch_url && (
          <a
            href={project.pitch_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            🎥 Demo
          </a>
        )}
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            💻 Code
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
        <span>
          Created {new Date(project.created_at).toLocaleDateString()}
        </span>
        
        {project.can_edit && (
          <div className="space-x-2">
            <Link
              href={`/projects/${project.id}/edit`}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete?.(project.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Add Team Member Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={teamMemberUsername}
                onChange={(e) => setTeamMemberUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTeamModal(false);
                  setTeamMemberUsername('');
                  setError(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeamMember}
                disabled={isLoading || !teamMemberUsername.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Invitations Modal */}
      {showInvitationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Invitations</h3>
              <button
                onClick={() => setShowInvitationsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <ProjectInvitations projectId={project.id} />
          </div>
        </div>
      )}
    </div>
  );
}