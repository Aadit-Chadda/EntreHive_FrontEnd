'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ConditionalLayout from '../../components/ConditionalLayout';
import { apiService } from '@/lib/api';

interface Message {
  id: string;
  sender: {
    id: number;
    username: string;
    profile: {
      first_name: string;
      last_name: string;
      profile_picture: string | null;
    };
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
  messages: Message[];
  can_send_message: boolean;
}

export default function ConversationPage() {
  const { user } = useAuth();
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
      alert('Failed to load conversation');
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
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message');
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';
  };

  if (loading) {
    return (
      <ConditionalLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading conversation...</div>
        </div>
      </ConditionalLayout>
    );
  }

  if (!conversation) {
    return null;
  }

  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/inbox')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Participant info */}
              <div className="flex items-center gap-3 flex-1">
                {conversation.other_participant.profile.profile_picture ? (
                  <img
                    src={conversation.other_participant.profile.profile_picture}
                    alt={conversation.other_participant.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(
                      conversation.other_participant.profile.first_name,
                      conversation.other_participant.profile.last_name
                    )}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {conversation.other_participant.profile.first_name}{' '}
                    {conversation.other_participant.profile.last_name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {conversation.other_participant.profile.user_role}
                  </p>
                </div>
              </div>

              {conversation.related_project && (
                <button
                  onClick={() => router.push(`/projects/${conversation.related_project!.id}`)}
                  className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  View Project
                </button>
              )}
            </div>

            {conversation.related_project && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Project:</span> {conversation.related_project.title}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            <div className="space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                conversation.messages.map((message, index) => {
                  const isOwnMessage = message.sender.id === user?.id;
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
                          (message.sender.profile.profile_picture ? (
                            <img
                              src={message.sender.profile.profile_picture}
                              alt={message.sender.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                              {getInitials(
                                message.sender.profile.first_name,
                                message.sender.profile.last_name
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Message bubble */}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        {showAvatar && !isOwnMessage && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 px-3">
                            {message.sender.profile.first_name} {message.sender.profile.last_name}
                          </span>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-3">
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
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
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
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.profile?.user_role === 'student'
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

