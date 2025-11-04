'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import ConditionalLayout from '../../components/ConditionalLayout';
import { apiService } from '@/lib/api';

interface Message {
  id: string;
  sender: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    full_name?: string;
    profile_picture: string | null;
  };
  content: string;
  read: boolean;
  created_at: string;
}

interface ConversationDetail {
  id: string;
  other_participant: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    full_name?: string;
    profile_picture: string | null;
    user_role: string;
  };
  related_project: {
    id: string;
    title: string;
  } | null;
  messages: Message[];
  can_send_message: boolean;
}

export default function ConversationPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      setLoading(true);
      const data = await apiService.getConversation(conversationId);
      setConversation(data);
    } catch (error) {
      console.error('Error loading conversation:', error);
      showToast('Failed to load conversation', 'error');
      router.push('/inbox');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversation?.can_send_message) return;

    try {
      setSending(true);
      await apiService.sendMessage(conversationId, { content: newMessage.trim() });
      setNewMessage('');
      await loadConversation(); // Reload to get new message
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      showToast(errorMessage, 'error');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null, username?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getDisplayName = (firstName: string | null, lastName: string | null, fullName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (fullName && fullName !== username) {
      return fullName;
    }
    if (username) {
      return username;
    }
    return 'Unknown User';
  };

  if (loading) {
    return (
      <ConditionalLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Loading conversation...</div>
        </div>
      </ConditionalLayout>
    );
  }

  if (!conversation) {
    return null;
  }

  return (
    <ConditionalLayout>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
          {/* Header */}
          <div className="px-6 py-4" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/inbox')}
                className="transition-colors hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Participant info */}
              <div className="flex items-center gap-3 flex-1">
                {conversation.other_participant.profile_picture ? (
                  <img
                    src={conversation.other_participant.profile_picture}
                    alt={conversation.other_participant.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--primary-orange)' }}>
                    {getInitials(
                      conversation.other_participant.first_name,
                      conversation.other_participant.last_name,
                      conversation.other_participant.username
                    )}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                    {getDisplayName(
                      conversation.other_participant.first_name,
                      conversation.other_participant.last_name,
                      conversation.other_participant.full_name,
                      conversation.other_participant.username
                    )}
                  </h2>
                  <p className="text-sm font-canva-sans capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {conversation.other_participant.user_role}
                  </p>
                </div>
              </div>

              {conversation.related_project && (
                <button
                  onClick={() => router.push(`/projects/${conversation.related_project!.id}`)}
                  className="px-4 py-2 text-sm font-medium font-canva-sans rounded-lg transition-all hover:opacity-90"
                  style={{
                    color: 'var(--primary-orange)',
                    border: '1px solid var(--primary-orange)'
                  }}
                >
                  View Project
                </button>
              )}
            </div>

            {conversation.related_project && (
              <div className="mt-2 text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-medium">Project:</span> {conversation.related_project.title}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--background)' }}>
            <div className="space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center py-12 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                conversation.messages.map((message, index) => {
                  const isOwnMessage = message.sender.id === user?.pk;
                  const showAvatar =
                    index === 0 ||
                    conversation.messages[index - 1].sender.id !== message.sender.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-8">
                        {showAvatar &&
                          !isOwnMessage &&
                          (message.sender.profile_picture ? (
                            <img
                              src={message.sender.profile_picture}
                              alt={message.sender.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'var(--primary-orange)' }}>
                              {getInitials(
                                message.sender.first_name,
                                message.sender.last_name,
                                message.sender.username
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Message bubble */}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        {showAvatar && !isOwnMessage && (
                          <span className="text-xs font-canva-sans mb-1 px-3" style={{ color: 'var(--text-secondary)' }}>
                            {getDisplayName(
                              message.sender.first_name,
                              message.sender.last_name,
                              message.sender.full_name,
                              message.sender.username
                            )}
                          </span>
                        )}
                        <div
                          className="rounded-2xl px-4 py-2"
                          style={
                            isOwnMessage
                              ? { background: 'var(--primary-orange)', color: 'white' }
                              : { background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
                          }
                        >
                          <p className="text-sm font-canva-sans whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <span className="text-xs font-canva-sans mt-1 px-3" style={{ color: 'var(--text-secondary)' }}>
                          {formatTime(message.created_at)}
                        </span>
                      </div>

                      {/* Spacer for own messages */}
                      {isOwnMessage && <div className="flex-shrink-0 w-8" />}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input */}
          <div className="p-4" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            {conversation.can_send_message ? (
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
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-lg resize-none font-canva-sans focus:outline-none focus:ring-2 transition-all"
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--primary-orange)'
                  } as React.CSSProperties}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 text-white font-medium font-canva-sans rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2 hover:opacity-90"
                  style={{
                    background: !newMessage.trim() || sending ? 'var(--text-secondary)' : 'var(--primary-orange)'
                  }}
                >
                  {sending ? (
                    'Sending...'
                  ) : (
                    <>
                      Send
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  {user?.user_role === 'student'
                    ? 'You can reply once the other person sends you a message or accepts your request.'
                    : 'You cannot send messages in this conversation.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}

