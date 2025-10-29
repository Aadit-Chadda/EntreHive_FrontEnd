'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ConditionalLayout from '../components/ConditionalLayout';
import { apiService } from '@/lib/api';

interface Conversation {
  id: string;
  other_participant: {
    id: number;
    username: string;
    profile: {
      first_name: string;
      last_name: string;
      profile_picture: string | null;
      user_role: string;
    };
  };
  related_project: {
    id: string;
    title: string;
  } | null;
  last_message: {
    content: string;
    sender_id: number;
    created_at: string;
    read: boolean;
  } | null;
  unread_count: number;
  last_message_at: string;
  created_at: string;
}

interface ProjectViewRequest {
  id: string;
  project: {
    id: string;
    title: string;
  };
  requester: {
    id: number;
    username: string;
    profile: {
      first_name: string;
      last_name: string;
      profile_picture: string | null;
    };
  };
  recipient: {
    id: number;
    username: string;
  };
  message: string;
  status: string;
  created_at: string;
}

export default function InboxPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'messages' | 'requests' | 'sent'>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projectRequests, setProjectRequests] = useState<ProjectViewRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ProjectViewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ unread_messages: 0, pending_requests: 0 });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsData = await apiService.getInboxStats();
      setStats(statsData);

      if (activeTab === 'messages') {
        const convData = await apiService.getConversations({ status: 'active' });
        setConversations(convData);
      } else if (activeTab === 'requests') {
        const reqData = await apiService.getProjectViewRequests({ filter: 'received', status: 'pending' });
        setProjectRequests(reqData);
      } else if (activeTab === 'sent') {
        const sentData = await apiService.getProjectViewRequests({ filter: 'sent' });
        setSentRequests(sentData);
      }
    } catch (error) {
      console.error('Error loading inbox data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await apiService.respondToProjectRequest(requestId, action) as { conversation_id?: string };
      
      if (action === 'accept' && response.conversation_id) {
        router.push(`/inbox/${response.conversation_id}`);
      } else {
        loadData(); // Reload requests
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to respond to request');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';
  };

  return (
    <ConditionalLayout>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/feed')}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg font-canva-sans transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--hover-bg)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--active-bg)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--hover-bg)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
              Inbox
            </h1>
            <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
              Manage your conversations and project requests
            </p>
          </div>

          {/* Tabs */}
          <div className="rounded-lg shadow-sm border mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 px-6 py-4 text-sm font-medium font-canva-sans transition-colors relative ${
                  activeTab === 'messages' ? '' : ''
                }`}
                style={{
                  color: activeTab === 'messages' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Messages
                  {stats.unread_messages > 0 && (
                    <span className="text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center" style={{ background: 'var(--primary-orange)' }}>
                      {stats.unread_messages}
                    </span>
                  )}
                </span>
                {activeTab === 'messages' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary-orange)' }} />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 px-6 py-4 text-sm font-medium font-canva-sans transition-colors relative ${
                  activeTab === 'requests' ? '' : ''
                }`}
                style={{
                  color: activeTab === 'requests' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Requests
                  {stats.pending_requests > 0 && (
                    <span className="text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center" style={{ background: 'var(--primary-orange)' }}>
                      {stats.pending_requests}
                    </span>
                  )}
                </span>
                {activeTab === 'requests' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary-orange)' }} />
                )}
              </button>

              {user?.user_role === 'student' && (
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 px-6 py-4 text-sm font-medium font-canva-sans transition-colors relative`}
                  style={{
                    color: activeTab === 'sent' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                  }}
                >
                  Sent Requests
                  {activeTab === 'sent' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary-orange)' }} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="rounded-lg shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {loading ? (
              <div className="p-8 text-center font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                Loading...
              </div>
            ) : activeTab === 'messages' ? (
              conversations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4" style={{ color: 'var(--text-muted)' }}>💬</div>
                  <h3 className="text-lg font-medium font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                    No conversations yet
                  </h3>
                  <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    {user?.user_role === 'student'
                      ? 'Send a project view request to start a conversation'
                      : 'Your conversations will appear here'}
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => router.push(`/inbox/${conv.id}`)}
                      className="p-4 cursor-pointer transition-colors"
                      style={{ background: 'var(--surface)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {conv.other_participant.profile.profile_picture ? (
                            <img
                              src={conv.other_participant.profile.profile_picture}
                              alt={conv.other_participant.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--primary-orange)' }}>
                              {getInitials(
                                conv.other_participant.profile.first_name,
                                conv.other_participant.profile.last_name
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3
                                className="text-sm font-semibold font-canva-sans cursor-pointer hover:underline"
                                style={{ color: 'var(--text-primary)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/profiles/${conv.other_participant.username}`);
                                }}
                              >
                                {conv.other_participant.profile.first_name}{' '}
                                {conv.other_participant.profile.last_name}
                              </h3>
                              <p className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                                {conv.other_participant.profile.user_role}
                              </p>
                            </div>
                            <span className="text-xs font-canva-sans flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                              {formatTime(conv.last_message_at)}
                            </span>
                          </div>

                          {conv.related_project && (
                            <p className="text-xs font-canva-sans mb-1" style={{ color: 'var(--primary-orange)' }}>
                              Re: {conv.related_project.title}
                            </p>
                          )}

                          {conv.last_message && (
                            <p
                              className={`text-sm font-canva-sans truncate ${
                                conv.unread_count > 0 ? 'font-semibold' : ''
                              }`}
                              style={{ color: conv.unread_count > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                            >
                              {conv.last_message.sender_id === user?.pk ? 'You: ' : ''}
                              {conv.last_message.content}
                            </p>
                          )}

                          {conv.unread_count > 0 && (
                            <span className="inline-block mt-1 text-white text-xs rounded-full px-2 py-0.5" style={{ background: 'var(--primary-orange)' }}>
                              {conv.unread_count} new
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : activeTab === 'requests' ? (
              projectRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4" style={{ color: 'var(--text-muted)' }}>📬</div>
                  <h3 className="text-lg font-medium font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                    No pending requests
                  </h3>
                  <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    Project view requests will appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {projectRequests.map((request) => (
                    <div key={request.id} className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {request.requester.profile.profile_picture ? (
                            <img
                              src={request.requester.profile.profile_picture}
                              alt={request.requester.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--primary-orange)' }}>
                              {getInitials(
                                request.requester.profile.first_name,
                                request.requester.profile.last_name
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                                {request.requester.profile.first_name}{' '}
                                {request.requester.profile.last_name}
                              </h3>
                              <p className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                                @{request.requester.username}
                              </p>
                            </div>
                            <span className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                              {formatTime(request.created_at)}
                            </span>
                          </div>

                          <p className="text-sm font-medium font-canva-sans mb-2" style={{ color: 'var(--primary-orange)' }}>
                            Project: {request.project.title}
                          </p>

                          <p className="text-sm font-canva-sans mb-4" style={{ color: 'var(--text-primary)' }}>
                            {request.message}
                          </p>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRespondToRequest(request.id, 'accept')}
                              className="px-4 py-2 text-white text-sm font-medium font-canva-sans rounded-lg transition-colors"
                              style={{ background: 'var(--primary-orange)' }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                              Accept & Start Conversation
                            </button>
                            <button
                              onClick={() => handleRespondToRequest(request.id, 'decline')}
                              className="px-4 py-2 text-sm font-medium font-canva-sans rounded-lg transition-colors"
                              style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--active-bg)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Sent requests tab
              sentRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4" style={{ color: 'var(--text-muted)' }}>📤</div>
                  <h3 className="text-lg font-medium font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                    No sent requests
                  </h3>
                  <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    Send a project view request to professors or investors
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {sentRequests.map((request) => (
                    <div key={request.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                                To: {request.recipient.username}
                              </h3>
                              <p className="text-sm font-medium font-canva-sans" style={{ color: 'var(--primary-orange)' }}>
                                Project: {request.project.title}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium font-canva-sans rounded-full`}
                              style={{
                                background: request.status === 'pending'
                                  ? 'var(--neutral-light-orange)'
                                  : request.status === 'accepted'
                                  ? '#dcfce7'
                                  : 'var(--hover-bg)',
                                color: request.status === 'pending'
                                  ? 'var(--primary-orange)'
                                  : request.status === 'accepted'
                                  ? '#16a34a'
                                  : 'var(--text-secondary)'
                              }}
                            >
                              {request.status}
                            </span>
                          </div>

                          <p className="text-sm font-canva-sans mb-2" style={{ color: 'var(--text-primary)' }}>
                            {request.message}
                          </p>

                          <p className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                            Sent {formatTime(request.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
