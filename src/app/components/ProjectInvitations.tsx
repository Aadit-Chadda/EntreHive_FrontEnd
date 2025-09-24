'use client';

import { useState, useEffect } from 'react';
import { ProjectInvitation } from '@/types';
import { projectApi } from '@/lib/api';

interface ProjectInvitationsProps {
  projectId?: string; // If provided, shows invitations for this project
  showUserInvitations?: boolean; // If true, shows user's received invitations
}

export default function ProjectInvitations({ projectId, showUserInvitations = false }: ProjectInvitationsProps) {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    loadInvitations();
  }, [projectId, showUserInvitations]);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response: ProjectInvitation[];
      if (showUserInvitations) {
        response = await projectApi.getMyInvitations();
      } else if (projectId) {
        response = await projectApi.getProjectInvitations(projectId);
      } else {
        response = [];
      }
      
      setInvitations(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!projectId || !inviteUsername.trim()) return;

    setIsInviting(true);
    try {
      const invitation = await projectApi.createInvitation(projectId, {
        invitee_username: inviteUsername.trim(),
        message: inviteMessage.trim() || undefined,
      });
      
      setInvitations(prev => [invitation, ...prev]);
      setInviteUsername('');
      setInviteMessage('');
      setShowInviteForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRespondToInvitation = async (invitationId: string, action: 'accept' | 'decline') => {
    try {
      await projectApi.respondToInvitation(invitationId, action);
      // Remove the invitation from the list after responding
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err: any) {
      setError(err.message || `Failed to ${action} invitation`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Header and Invite Button */}
      {projectId && !showUserInvitations && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Project Invitations</h3>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Send Invitation
          </button>
        </div>
      )}

      {showUserInvitations && (
        <h3 className="text-lg font-semibold text-gray-900">Your Invitations</h3>
      )}

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Send Project Invitation</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a personal message..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteUsername('');
                    setInviteMessage('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={isInviting || !inviteUsername.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invitations List */}
      {invitations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {showUserInvitations
            ? 'No pending invitations'
            : 'No invitations sent for this project'
          }
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map(invitation => (
            <div key={invitation.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {showUserInvitations ? (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900">{invitation.project.title}</h4>
                      <p className="text-sm text-gray-600">
                        Invited by {invitation.inviter.full_name || invitation.inviter.username}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {invitation.invitee.full_name || invitation.invitee.username}
                      </h4>
                      <p className="text-sm text-gray-600">@{invitation.invitee.username}</p>
                    </div>
                  )}

                  {invitation.message && (
                    <p className="text-sm text-gray-700 mb-2 italic">
                      "{invitation.message}"
                    </p>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                      {invitation.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Action buttons for received invitations */}
                {showUserInvitations && invitation.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleRespondToInvitation(invitation.id, 'accept')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondToInvitation(invitation.id, 'decline')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
