'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  Reply,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PostData, PostComment, CommentCreateData } from '@/types';
import { postsApi, commentsApi } from '@/lib/api';
import PostCardNew from '@/app/components/PostCardNew';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '../../components/LeftNavigation';
import RightSidebar from '../../components/RightSidebar';
import { ThemeProvider } from '../../components/ThemeProvider';

interface PostDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Helper function to deduplicate comments and their replies
const deduplicateComments = (comments: PostComment[]): PostComment[] => {
  const seen = new Set<string>();
  return comments
    .filter(comment => {
      if (seen.has(comment.id)) {
        return false;
      }
      seen.add(comment.id);
      return true;
    })
    .map(comment => ({
      ...comment,
      replies: comment.replies ? deduplicateComments(comment.replies) : []
    }));
};

export default function PostDetailsPage({ params }: PostDetailsPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const router = useRouter();

  const loadPost = useCallback(async (postId: string) => {
    try {
      const postData = await postsApi.getPost(postId);
      setPost(postData);
      
      if (postData.comments) {
        // Deduplicate comments and their replies
        const deduplicatedComments = deduplicateComments(postData.comments);
        setComments(deduplicatedComments);
      } else {
        // Load comments separately if not included in post data
        setCommentsLoading(true);
        const commentsData = await commentsApi.getComments(postId);
        const deduplicatedComments = deduplicateComments(commentsData);
        setComments(deduplicatedComments);
        setCommentsLoading(false);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
        loadPost(resolved.id);
      } catch (error) {
        console.error('Failed to resolve params:', error);
        setError('Failed to load post. Please try again.');
        setLoading(false);
      }
    };
    
    resolveParams();
  }, [params, loadPost]);

  const handlePostUpdate = (updatedPost: PostData) => {
    setPost(updatedPost);
  };

  const handlePostDelete = () => {
    router.push('/'); // Redirect to home after post deletion
  };

  const handleCommentSubmit = async (parentId?: string) => {
    const content = parentId ? replyContent.trim() : newComment.trim();
    if (!content || submitting || !resolvedParams) return;

    setSubmitting(true);
    try {
      const commentData: CommentCreateData = {
        content,
        parent: parentId || undefined,
      };

      const newCommentObj = await commentsApi.createComment(resolvedParams.id, commentData);
      
      if (parentId) {
        // Add reply to parent comment with deduplication
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { 
                ...comment, 
                replies: [
                  ...(comment.replies || []).filter(reply => reply.id !== newCommentObj.id),
                  newCommentObj
                ], 
                replies_count: (comment.replies_count || 0) + 1 
              }
            : comment
        ));
        setReplyContent('');
        setReplyTo(null);
      } else {
        // Add new top-level comment with deduplication
        setComments(prev => {
          const existingCommentIndex = prev.findIndex(c => c.id === newCommentObj.id);
          if (existingCommentIndex >= 0) {
            // Replace existing comment
            const newComments = [...prev];
            newComments[existingCommentIndex] = newCommentObj;
            return newComments;
          } else {
            // Add new comment
            return [newCommentObj, ...prev];
          }
        });
        setNewComment('');
      }

      // Update post comments count
      if (post) {
        setPost(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentEdit = async (commentId: string, content: string, parentId?: string) => {
    if (!resolvedParams) return;
    
    try {
      const updatedComment = await commentsApi.updateComment(resolvedParams.id, commentId, { content });
      
      if (parentId) {
        // Update reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { 
                ...comment, 
                replies: (comment.replies || []).map(reply => 
                  reply.id === commentId ? updatedComment : reply
                )
              }
            : comment
        ));
      } else {
        // Update top-level comment
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ));
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCommentDelete = async (commentId: string, parentId?: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    if (!resolvedParams) return;

    try {
      await commentsApi.deleteComment(resolvedParams.id, commentId);
      
      if (parentId) {
        // Remove reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { 
                ...comment, 
                replies: (comment.replies || []).filter(reply => reply.id !== commentId),
                replies_count: Math.max(0, (comment.replies_count || 0) - 1)
              }
            : comment
        ));
      } else {
        // Remove top-level comment
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }

      // Update post comments count
      if (post) {
        setPost(prev => prev ? { ...prev, comments_count: Math.max(0, prev.comments_count - 1) } : null);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading || !resolvedParams) {
    return (
      <ProtectedRoute>
        <ThemeProvider>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--primary)' }} />
              <span>Loading post...</span>
            </div>
          </div>
        </ThemeProvider>
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <ThemeProvider>
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="text-center space-y-4" style={{ color: 'var(--text-primary)' }}>
              <h1 className="text-2xl font-bold">{error || 'Post not found'}</h1>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
              >
                Return to home
              </Link>
            </div>
          </div>
        </ThemeProvider>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ThemeProvider>
        <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--background)' }}>
          {/* Mobile Header */}
          <div
            className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setShowMobileNav(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-orange)' }}
              >
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span
                className="font-bold text-lg font-roca-two"
                style={{ color: 'var(--text-primary)' }}
              >
                Post
              </span>
            </div>

            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex min-h-screen">
            <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />

            <div className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80 flex">
              <div className="flex-1 min-w-0 max-w-none">
                <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
                  {/* Header */}
                  <div
                    className="sticky top-0 z-10"
                    style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => router.back()}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: 'var(--text-primary)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <h1
                            className="text-2xl font-bold font-roca-two"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Post
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {/* Post */}
                      <PostCardNew
                        post={post}
                        onPostUpdate={handlePostUpdate}
                        onPostDelete={handlePostDelete}
                        showComments={false}
                      />

                      {/* Comments Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Comments ({post.comments_count})
                          </h2>
                        </div>

                        {/* New Comment Form */}
                        <div
                          className="rounded-xl border p-4"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                          <div className="space-y-3">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              className="w-full p-3 rounded-lg resize-none border transition-colors focus:outline-none"
                              style={{
                                backgroundColor: 'var(--surface)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-primary)',
                                caretColor: 'var(--primary)'
                              }}
                              rows={3}
                              maxLength={1000}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {newComment.length}/1000
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCommentSubmit()}
                                disabled={!newComment.trim() || submitting}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: newComment.trim() && !submitting ? 'var(--primary)' : 'var(--border)',
                                  color: newComment.trim() && !submitting ? '#ffffff' : 'var(--text-secondary)'
                                }}
                                onMouseEnter={(e) => {
                                  if (!newComment.trim() || submitting) return;
                                  e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                                }}
                                onMouseLeave={(e) => {
                                  if (!newComment.trim() || submitting) return;
                                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                                }}
                              >
                                {submitting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                                Comment
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div>
                          {commentsLoading ? (
                            <div className="flex items-center justify-center py-8" style={{ color: 'var(--primary)' }}>
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          ) : comments.length === 0 ? (
                            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                              No comments yet. Be the first to comment!
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <AnimatePresence mode="popLayout">
                                {comments.map((comment) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    layout
                                  >
                                    <CommentCard
                                      comment={comment}
                                      postId={resolvedParams?.id || ''}
                                      onEdit={handleCommentEdit}
                                      onDelete={handleCommentDelete}
                                      onReply={(commentId) => {
                                        setReplyTo(replyTo === commentId ? null : commentId);
                                        setReplyContent('');
                                      }}
                                      replyTo={replyTo}
                                      replyContent={replyContent}
                                      setReplyContent={setReplyContent}
                                      onReplySubmit={() => handleCommentSubmit(replyTo!)}
                                      submitting={submitting}
                                    />
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`
                hidden lg:block fixed right-0 top-0 h-screen
              `} style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
                <RightSidebar />
              </div>
            </div>
          </div>

          {showMobileNav && (
            <div
              className="fixed inset-0 z-30 lg:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => {
                setShowMobileNav(false);
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}

// Comment Card Component
interface CommentCardProps {
  comment: PostComment;
  postId: string;
  onEdit: (commentId: string, content: string, parentId?: string) => void;
  onDelete: (commentId: string, parentId?: string) => void;
  onReply: (commentId: string) => void;
  replyTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onReplySubmit: () => void;
  submitting: boolean;
  isReply?: boolean;
  parentId?: string;
}

function CommentCard({ 
  comment, 
  postId, 
  onEdit, 
  onDelete, 
  onReply,
  replyTo,
  replyContent,
  setReplyContent,
  onReplySubmit,
  submitting,
  isReply = false,
  parentId
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diff = now.getTime() - commentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${Math.max(1, minutes)}m`;
    }
  };

  const handleEdit = () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    onEdit(comment.id, editContent.trim(), parentId);
    setIsEditing(false);
  };

  return (
    <div className={isReply ? 'ml-6' : ''}>
      {isReply && (
        <div className="flex items-center mb-2" style={{ color: 'var(--accent-pine)' }}>
          <div className="w-6 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
          <Reply className="w-3 h-3 ml-1" />
        </div>
      )}
      <div
        className="rounded-lg border p-4"
        style={{
          backgroundColor: isReply ? 'rgba(33, 79, 56, 0.08)' : 'var(--surface)',
          borderColor: isReply ? 'rgba(33, 79, 56, 0.26)' : 'var(--border)',
          borderLeftColor: isReply ? 'var(--accent-pine)' : undefined,
          borderLeftWidth: isReply ? '3px' : undefined,
          borderLeftStyle: isReply ? 'solid' : undefined
        }}
      >
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link href={`/profiles/${comment.author?.username || ''}`}>
              <div
                className={`relative ${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full overflow-hidden flex-shrink-0`}
                style={{ backgroundColor: 'var(--border)' }}
              >
                {comment.author?.profile_picture ? (
                  <Image
                    src={comment.author.profile_picture}
                    alt={comment.author?.full_name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {comment.author?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </Link>

            <div>
              <Link
                href={`/profiles/${comment.author?.username || ''}`}
                className={`font-medium transition-colors ${isReply ? 'text-xs' : 'text-sm'}`}
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              >
                {comment.author?.full_name || 'Unknown User'}
              </Link>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span>@{comment.author?.username || 'unknown'}</span>
                <span>·</span>
                <span>{formatTimestamp(comment.created_at)}</span>
                {comment.is_edited && (
                  <>
                    <span>·</span>
                    <span className="italic">edited</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comment Actions */}
          {comment.can_edit && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-full transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 w-32 rounded-lg border shadow-lg z-10"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    {comment.can_delete && (
                      <button
                        onClick={() => {
                          onDelete(comment.id, parentId);
                          setShowDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                        style={{ color: 'var(--secondary-red)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(119, 11, 11, 0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 rounded-lg resize-none border text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  caretColor: 'var(--primary)'
                }}
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {editContent.length}/1000
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="px-2 py-1 text-xs transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={editContent.trim().length === 0 || editContent.trim() === comment.content}
                    className="px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget.hasAttribute('disabled')) return;
                      e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget.hasAttribute('disabled')) return;
                      e.currentTarget.style.backgroundColor = 'var(--primary)';
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p
              className={`${isReply ? 'text-xs' : 'text-sm'} leading-relaxed`}
              style={{ color: 'var(--text-primary)' }}
            >
              {comment.content}
            </p>
          )}
        </div>

        {/* Comment Actions */}
        {!isReply && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
            {(comment.replies_count || 0) > 0 && (
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {comment.replies_count || 0} {(comment.replies_count || 0) === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
        )}

        {/* Reply Form */}
        {replyTo === comment.id && (
          <AnimatePresence>
            <motion.div
              key={`reply-form-${comment.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author?.full_name || 'this comment'}...`}
                className="w-full p-2 rounded-lg resize-none border text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  caretColor: 'var(--primary)'
                }}
                rows={2}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {replyContent.length}/1000
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReply(comment.id)}
                    className="px-2 py-1 text-xs transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onReplySubmit}
                    disabled={!replyContent.trim() || submitting}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--accent-terracotta)', color: '#ffffff' }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget.hasAttribute('disabled')) return;
                      e.currentTarget.style.backgroundColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget.hasAttribute('disabled')) return;
                      e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                    }}
                  >
                    {submitting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {comment.replies.map((reply) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <CommentCard
                  comment={reply}
                  postId={postId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={onReply}
                  replyTo={replyTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  onReplySubmit={onReplySubmit}
                  submitting={submitting}
                  isReply={true}
                  parentId={comment.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
