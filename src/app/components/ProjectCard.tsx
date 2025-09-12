'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { formatTimeAgo } from '@/lib/utils';

interface ProjectCardProps {
  project: Project & {
    owner: {
      name: string;
      handle: string;
      avatar: string;
    };
  };
  onLike?: (projectId: string) => void;
  onSave?: (projectId: string) => void;
  onJoinTeam?: (projectId: string) => void;
}

export default function ProjectCard({ project, onLike, onSave, onJoinTeam }: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(project.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(project.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'mvp':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'launched':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'startup':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'side_project':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'research':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'hackathon':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'course_project':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Project Image */}
      {project.previewImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.previewImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(project.type)}`}>
              {project.type.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={project.owner.avatar}
              alt={project.owner.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{project.owner.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{project.owner.handle}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTimeAgo(project.createdAt)}
          </span>
        </div>

        {/* Project Title & Summary */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {project.title}
          </h2>
          {project.summary && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {project.summary}
            </p>
          )}
        </div>

        {/* Badges without preview image */}
        {!project.previewImage && (
          <div className="flex gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(project.type)}`}>
              {project.type.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Categories & Tags */}
        {(project.categories.length > 0 || project.tags.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
              >
                {category}
              </span>
            ))}
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Looking For */}
        {project.needs.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Looking for:</p>
            <div className="flex flex-wrap gap-2">
              {project.needs.map((need) => (
                <span
                  key={need}
                  className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-700"
                >
                  {need.charAt(0).toUpperCase() + need.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(project.pitchUrl || project.repoUrl) && (
          <div className="flex gap-3 mb-4">
            {project.pitchUrl && (
              <a
                href={project.pitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Pitch
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors group ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-50 dark:bg-red-900/20' 
                  : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/20'
              }`}>
                <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">{likes}</span>
            </button>

            {/* Team Size */}
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm">{project.teamMembers.length + 1}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Save */}
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors ${
                isSaved
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              }`}
            >
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>

            {/* Join Team */}
            {project.needs.length > 0 && (
              <button
                onClick={() => onJoinTeam?.(project.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Join Team
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
