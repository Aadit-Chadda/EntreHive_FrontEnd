'use client';

import { useState, useEffect } from 'react';
import { ProjectData, ProjectUser } from '@/types';
import { projectApi } from '@/lib/api';

interface TeamManagementProps {
  project: ProjectData;
  onProjectUpdate: (project: ProjectData) => void;
  onClose: () => void;
}

export default function TeamManagement({ project, onProjectUpdate, onClose }: TeamManagementProps) {
  const [searchUsername, setSearchUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddTeamMember = async () => {
    if (!searchUsername.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await projectApi.addTeamMember(project.id, { 
        username: searchUsername.trim() 
      });
      
      // Refresh project data
      const updatedProject = await projectApi.getProject(project.id);
      onProjectUpdate(updatedProject);
      
      setSuccessMessage(`Successfully added ${searchUsername} to the team!`);
      setSearchUsername('');
    } catch (err: any) {
      setError(err.message || 'Failed to add team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeamMember = async (member: ProjectUser) => {
    if (!confirm(`Are you sure you want to remove ${member.full_name || member.username} from the team?`)) {
      return;
    }

    try {
      await projectApi.removeTeamMember(project.id, member.id);
      
      // Refresh project data
      const updatedProject = await projectApi.getProject(project.id);
      onProjectUpdate(updatedProject);
      
      setSuccessMessage(`Successfully removed ${member.full_name || member.username} from the team`);
    } catch (err: any) {
      setError(err.message || 'Failed to remove team member');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Clear messages after a few seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{backgroundColor: 'var(--surface)'}}>
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center" style={{background: 'linear-gradient(135deg, var(--primary-orange), var(--accent-terracotta))'}}>
          <div>
            <h2 className="text-xl font-bold text-white">Manage Team</h2>
            <p className="text-white/80 text-sm">{project.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white transition-colors p-2 rounded-full"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 rounded-md" style={{backgroundColor: 'var(--secondary-red)/10', borderLeft: '4px solid var(--secondary-red)'}}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--secondary-red)'}}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm" style={{color: 'var(--secondary-red)'}}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 rounded-md" style={{backgroundColor: 'var(--accent-pine)/10', borderLeft: '4px solid var(--accent-pine)'}}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--accent-pine)'}}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm" style={{color: 'var(--accent-pine)'}}>{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Add Team Member Section */}
          <div className="rounded-lg p-6 mb-6" style={{backgroundColor: 'var(--background)', border: '2px solid var(--primary-orange)'}}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{color: 'var(--text-primary)'}}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--primary-orange)'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Team Member
            </h3>
            <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
              Enter the username of the person you want to add to your project team
            </p>
            
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddTeamMember()}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-500"
                  style={{
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter username (e.g. @johndoe)"
                />
              </div>
              <button
                onClick={handleAddTeamMember}
                disabled={isLoading || !searchUsername.trim()}
                className="px-6 py-3 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-all transform hover:scale-105"
                style={{backgroundColor: 'var(--primary-orange)'}}
                onMouseEnter={(e) => {
                  if (!isLoading && searchUsername.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-orange)/20';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  'Add Member'
                )}
              </button>
            </div>
          </div>

          {/* Current Team Section */}
          <div className="rounded-lg p-6" style={{backgroundColor: 'var(--background)', border: '2px solid var(--border)'}}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{color: 'var(--text-primary)'}}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--primary-orange)'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Current Team Members ({project.team_count})
            </h3>

            <div className="space-y-3">
              {/* Project Owner */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--primary-orange), var(--accent-terracotta)'}}>
                    <span className="text-white font-bold text-sm">
                      {(project.owner.full_name || project.owner.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium" style={{color: 'var(--text-primary)'}}>
                      {project.owner.full_name || project.owner.username}
                    </p>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>@{project.owner.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={{backgroundColor: 'var(--primary-orange)/20', color: 'var(--primary-orange)'}}>
                    Owner
                  </span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--primary-orange)'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Team Members */}
              {project.team_members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--accent-pine), var(--accent-terracotta)'}}>
                      <span className="text-white font-bold text-sm">
                        {(member.full_name || member.username).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium" style={{color: 'var(--text-primary)'}}>
                        {member.full_name || member.username}
                      </p>
                      <p className="text-sm" style={{color: 'var(--text-secondary)'}}>@{member.username}</p>
                      {member.email && (
                        <p className="text-xs" style={{color: 'var(--text-muted)'}}>{member.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full" style={{backgroundColor: 'var(--accent-pine)/20', color: 'var(--accent-pine)'}}>
                      Member
                    </span>
                    {project.can_edit && (
                      <button
                        onClick={() => handleRemoveTeamMember(member)}
                        className="p-2 rounded-full transition-colors"
                        style={{color: 'var(--secondary-red)'}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--secondary-red)';
                          e.currentTarget.style.backgroundColor = 'var(--secondary-red)/10';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--secondary-red)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Remove team member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {project.team_members.length === 0 && (
                <div className="text-center py-8" style={{color: 'var(--text-secondary)'}}>
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: 'var(--text-muted)'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>No team members yet</p>
                  <p className="text-sm">Add collaborators to your project above</p>
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: 'var(--background)', border: '2px solid var(--primary-orange)'}}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--primary-orange)'}}>
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium" style={{color: 'var(--primary-orange)'}}>
                  Team Management Tips
                </h3>
                <div className="mt-2 text-sm" style={{color: 'var(--text-primary)'}}>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Only project owners can add or remove team members</li>
                    <li>Team members can collaborate and help manage the project</li>
                    <li>Use the invitations feature for more formal collaboration requests</li>
                    <li>Usernames are case-sensitive</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 text-white font-medium rounded-lg focus:outline-none transition-colors"
              style={{backgroundColor: '#8a6b53'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d543f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8a6b53'}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(138, 107, 83, 0.3)'}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
