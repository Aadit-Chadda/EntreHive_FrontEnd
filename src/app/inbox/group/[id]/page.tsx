'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import ConditionalLayout from '@/app/components/ConditionalLayout';
import { apiService } from '@/lib/api';

interface GroupConversationDetail {
  id: string;
  project: {
    id: string;
    title: string;
    description?: string;
  };
  created_by: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  participants: Array<{
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
    user_role?: string;
  }>;
  participant_count: number;
  last_message_at: string;
  created_at: string;
}

interface GroupMessage {
  id: string;
  sender: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  content: string;
  attachment?: string;
  read_by: number[];
  created_at: string;
}

export default function GroupConversationPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [groupConversation, setGroupConversation] = useState<GroupConversationDetail | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (groupId && user) {
      loadGroupConversation();
      loadMessages();

      // Set up polling for new messages every 5 seconds
      pollingIntervalRef.current = setInterval(() => {
        loadMessages(false); // Don't show loading spinner during polling
      }, 5000);
    }

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [groupId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadGroupConversation = async () => {
    try {
      const data = await apiService.getGroupConversationDetail(groupId);
      setGroupConversation(data);

      // Notify inbox page that messages have been marked as read (backend does this automatically)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('messagesMarkedAsRead'));
      }
    } catch (err) {
      console.error('Error loading group conversation:', err);
      showToast('Failed to load group conversation', 'error');
    }
  };

  const loadMessages = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const data = await apiService.getGroupMessages(groupId);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      if (showLoadingSpinner) {
        showToast('Failed to load messages', 'error');
      }
    } finally {
      if (showLoadingSpinner) {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const sentMessage = await apiService.sendGroupMessage(groupId, newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');

      // Update group conversation to refresh last_message_at
      await loadGroupConversation();
    } catch (err) {
      console.error('Error sending message:', err);
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
  };

  const getInitials = (fullName?: string, username?: string) => {
    if (fullName) {
      const parts = fullName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    return username?.substring(0, 2).toUpperCase() || '??';
  };

  if (!groupConversation && loading) {
    return (
      <ConditionalLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-orange)' }}></div>
            <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Loading conversation...</p>
          </div>
        </div>
      </ConditionalLayout>
    );
  }

  if (!groupConversation) {
    return (
      <ConditionalLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div className="text-center">
            <h2 className="text-xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
              Conversation not found
            </h2>
            <button
              onClick={() => router.push('/inbox')}
              className="mt-4 px-4 py-2 rounded-lg font-canva-sans font-medium text-white"
              style={{ background: 'var(--primary-orange)' }}
            >
              Back to Inbox
            </button>
          </div>
        </div>
      </ConditionalLayout>
    );
  }

  return (
    <ConditionalLayout>
      <div className="h-screen flex flex-col" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div className="border-b px-4 py-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/inbox')}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--accent-blue)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                    {groupConversation.project.title}
                  </h1>
                  <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    {groupConversation.participant_count} participants
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="px-4 py-2 rounded-lg font-canva-sans text-sm font-medium transition-colors"
              style={{
                background: showParticipants ? 'var(--primary-orange)' : 'var(--hover-bg)',
                color: showParticipants ? 'white' : 'var(--text-primary)'
              }}
            >
              {showParticipants ? 'Hide' : 'Show'} Participants
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-6xl mx-auto h-full flex">
            {/* Messages Area */}
            <div className={`flex-1 flex flex-col ${showParticipants ? 'border-r' : ''}`} style={{ borderColor: 'var(--border)' }}>
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-orange)' }}></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwnMessage = message.sender.id === user?.id;
                    const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id;
                    const showName = !isOwnMessage && showAvatar;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-8">
                          {showAvatar ? (
                            message.sender.profile_picture ? (
                              <img
                                src={message.sender.profile_picture}
                                alt={message.sender.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'var(--primary-orange)' }}>
                                {getInitials(message.sender.full_name, message.sender.username)}
                              </div>
                            )
                          ) : (
                            <div className="w-8 h-8"></div>
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          {showName && (
                            <p className="text-sm font-canva-sans font-medium mb-1 px-3" style={{ color: 'var(--text-primary)' }}>
                              {message.sender.full_name || message.sender.username}
                            </p>
                          )}
                          <div
                            className="rounded-2xl px-4 py-2"
                            style={{
                              background: isOwnMessage ? 'var(--primary-orange)' : 'var(--surface)',
                              color: isOwnMessage ? 'white' : 'var(--text-primary)',
                              border: isOwnMessage ? 'none' : '1px solid var(--border)'
                            }}
                          >
                            <p className="text-sm font-canva-sans whitespace-pre-wrap break-words">{message.content}</p>
                          </div>
                          <p className="text-xs font-canva-sans mt-1 px-3" style={{ color: 'var(--text-secondary)' }}>
                            {formatTime(message.created_at)}
                            {isOwnMessage && message.read_by && message.read_by.length > 1 && (
                              <span className="ml-2">· Read by {message.read_by.length - 1}</span>
                            )}
                          </p>
                        </div>

                        {/* Spacer for own messages */}
                        {isOwnMessage && <div className="flex-shrink-0 w-8" />}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
                    className="flex-1 px-4 py-3 border rounded-lg font-canva-sans resize-none focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--primary-orange)'
                    } as React.CSSProperties}
                    rows={1}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-3 rounded-lg font-canva-sans font-medium text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--primary-orange)' }}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Participants Sidebar */}
            {showParticipants && (
              <div className="w-80 overflow-y-auto p-4" style={{ background: 'var(--surface)' }}>
                <h3 className="font-semibold font-roca-two mb-4" style={{ color: 'var(--text-primary)' }}>
                  Participants ({groupConversation.participants.length})
                </h3>
                <div className="space-y-2">
                  {groupConversation.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer"
                      style={{ background: 'var(--background)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--background)'}
                      onClick={() => router.push(`/${participant.user_role}s/profile/${participant.username}`)}
                    >
                      {participant.profile_picture ? (
                        <img
                          src={participant.profile_picture}
                          alt={participant.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--primary-orange)' }}>
                          {getInitials(participant.full_name, participant.username)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium font-canva-sans truncate" style={{ color: 'var(--text-primary)' }}>
                          {participant.full_name || participant.username}
                          {participant.id === user?.id && (
                            <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>(You)</span>
                          )}
                        </p>
                        <p className="text-sm font-canva-sans truncate" style={{ color: 'var(--text-secondary)' }}>
                          @{participant.username}
                        </p>
                      </div>
                      {participant.id === groupConversation.created_by.id && (
                        <span className="px-2 py-1 rounded text-xs font-canva-sans font-medium" style={{ background: 'var(--accent-blue)', color: 'white' }}>
                          Creator
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
