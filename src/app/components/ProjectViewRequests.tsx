'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface ProjectViewRequestsProps {
  projectId: string;
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
    full_name?: string;
  };
  recipient: {
    id: number;
    username: string;
    full_name?: string;
  };
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export default function ProjectViewRequests({ projectId }: ProjectViewRequestsProps) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<ProjectViewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [message, setMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [projectId]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get all requests for this project (sent by team members)
      const allRequests = await apiService.getProjectViewRequests({ filter: 'sent' });
      const projectRequests = allRequests.filter((req: ProjectViewRequest) => req.project.id === projectId);

      setRequests(projectRequests);
    } catch (err: any) {
      setError(err.message || 'Failed to load view requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!recipientUsername.trim() || !message.trim()) {
      showToast('Please enter username and message', 'error');
      return;
    }

    setIsSending(true);
    try {
      await apiService.createProjectViewRequest({
        project_id: projectId,
        recipient_username: recipientUsername.trim(),
        message: message.trim(),
      });

      showToast('View request sent successfully! The recipient will see it in their inbox.', 'success');
      setRecipientUsername('');
      setMessage('');
      setShowRequestForm(false);
      loadRequests(); // Reload the list
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send view request';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e', label: 'PENDING' };
      case 'accepted':
        return { bg: '#d1fae5', color: '#065f46', label: 'ACCEPTED' };
      case 'declined':
        return { bg: '#fee2e2', color: '#991b1b', label: 'DECLINED' };
      default:
        return { bg: 'var(--hover-bg)', color: 'var(--text-secondary)', label: status.toUpperCase() };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary-orange)' }}></div>
          <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Explanation Banner */}
      <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary-orange)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold font-canva-sans mb-1" style={{ color: 'var(--text-primary)' }}>
              Request Investors or Professors to View Your Project
            </h4>
            <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
              Send a personalized request to investors or professors. They'll receive it in their inbox and can accept to start a conversation about your project.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg flex items-start gap-3" style={{ background: '#fee2e2', border: '1px solid #fecaca' }}>
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-canva-sans text-sm" style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Header and Send Request Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
            Sent Requests
          </h3>
          <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
            Track your outgoing view requests
          </p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          className="px-4 py-2 rounded-lg font-canva-sans font-medium text-white transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ background: 'var(--primary-orange)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Send Request
        </button>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg w-full max-w-lg" style={{ background: 'var(--surface)' }}>
            <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                  Send Project View Request
                </h4>
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setRecipientUsername('');
                    setMessage('');
                    setError(null);
                  }}
                  className="transition-colors rounded-lg p-1"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold font-canva-sans mb-2" style={{ color: 'var(--text-primary)' }}>
                  Recipient Username <span style={{ color: 'var(--primary-orange)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg font-canva-sans focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--primary-orange)'
                  } as React.CSSProperties}
                  placeholder="e.g., investor_john or prof_smith"
                />
                <p className="text-xs mt-2 font-canva-sans flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Only investors and professors can receive view requests
                </p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold font-canva-sans mb-2" style={{ color: 'var(--text-primary)' }}>
                  Your Message <span style={{ color: 'var(--primary-orange)' }}>*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg font-canva-sans resize-none focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--primary-orange)'
                  } as React.CSSProperties}
                  placeholder="Explain why you'd like them to view your project and how they might help..."
                />
                <p className="text-xs mt-2 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  Make your message personal and specific to increase chances of acceptance
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setRecipientUsername('');
                    setMessage('');
                    setError(null);
                  }}
                  className="px-5 py-2.5 rounded-lg font-canva-sans transition-colors"
                  style={{ color: 'var(--text-primary)', background: 'var(--hover-bg)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--active-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={isSending || !recipientUsername.trim() || !message.trim()}
                  className="px-5 py-2.5 rounded-lg font-canva-sans text-white font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ background: 'var(--primary-orange)' }}
                  onMouseEnter={(e) => !isSending && (e.currentTarget.style.background = 'var(--accent-terracotta)')}
                  onMouseLeave={(e) => !isSending && (e.currentTarget.style.background = 'var(--primary-orange)')}
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12 rounded-lg" style={{ background: 'var(--hover-bg)', border: '1px solid var(--border)' }}>
          <div className="text-5xl mb-3">📬</div>
          <h4 className="font-semibold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
            No requests sent yet
          </h4>
          <p className="text-sm font-canva-sans mb-4" style={{ color: 'var(--text-secondary)' }}>
            Send your first view request to connect with investors or professors
          </p>
          <button
            onClick={() => setShowRequestForm(true)}
            className="px-4 py-2 rounded-lg font-canva-sans font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary-orange)' }}
          >
            Send Your First Request
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(request => {
            const statusStyle = getStatusStyle(request.status);
            return (
              <div
                key={request.id}
                className="border rounded-lg p-5"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white" style={{ background: 'var(--primary-orange)' }}>
                        {(request.recipient.full_name || request.recipient.username).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                          {request.recipient.full_name || request.recipient.username}
                        </h4>
                        <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                          @{request.recipient.username}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-canva-sans mb-3 px-4 py-3 rounded-lg italic" style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                      &quot;{request.message}&quot;
                    </p>

                    <div className="flex items-center gap-3 text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold font-canva-sans whitespace-nowrap"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
