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
  Heart,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PostData, PostComment, CommentCreateData } from '@/types';
import { postsApi, commentsApi } from '@/lib/api';
import PostCardNew from '@/app/components/PostCardNew';

interface PostDetailsPageProps {
  params: { id: string };
}

export default function PostDetailsPage({ params }: PostDetailsPageProps) {
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const loadPost = useCallback(async () => {
    try {
      const postData = await postsApi.getPost(params.id);
      setPost(postData);
      
      if (postData.comments) {
        setComments(postData.comments);
      } else {
        // Load comments separately if not included in post data
        setCommentsLoading(true);
        const commentsData = await commentsApi.getComments(params.id);
        setComments(commentsData);
        setCommentsLoading(false);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handlePostUpdate = (updatedPost: PostData) => {
    setPost(updatedPost);
  };

  const handlePostDelete = () => {
    router.push('/'); // Redirect to home after post deletion
  };

  const handleCommentSubmit = async (parentId?: string) => {
    const content = parentId ? replyContent.trim() : newComment.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    try {
      const commentData: CommentCreateData = {
        content,
        parent: parentId || undefined,
      };

      const newCommentObj = await commentsApi.createComment(params.id, commentData);
      
      if (parentId) {
        // Add reply to parent comment
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...comment.replies, newCommentObj], replies_count: comment.replies_count + 1 }
            : comment
        ));
        setReplyContent('');
        setReplyTo(null);
      } else {
        // Add new top-level comment
        setComments(prev => [newCommentObj, ...prev]);
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
    try {
      const updatedComment = await commentsApi.updateComment(params.id, commentId, { content });
      
      if (parentId) {
        // Update reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { 
                ...comment, 
                replies: comment.replies.map(reply => 
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

    try {
      await commentsApi.deleteComment(params.id, commentId);
      
      if (parentId) {
        // Remove reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { 
                ...comment, 
                replies: comment.replies.filter(reply => reply.id !== commentId),
                replies_count: Math.max(0, comment.replies_count - 1)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Post not found'}
            </h1>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Post</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
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
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comments ({post.comments_count})
              </h2>
            </div>

            {/* New Comment Form */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                  maxLength={1000}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{newComment.length}/1000</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCommentSubmit()}
                    disabled={!newComment.trim() || submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
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
            <AnimatePresence>
              {commentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      postId={params.id}
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
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${isReply ? 'ml-12' : ''}`}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${comment.author.username}`}>
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                {comment.author.profile_picture ? (
                  <Image
                    src={comment.author.profile_picture}
                    alt={comment.author.full_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                    {comment.author.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
            
            <div>
              <Link 
                href={`/profile/${comment.author.username}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {comment.author.full_name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>@{comment.author.username}</span>
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
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
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
                        className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
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
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{editContent.length}/1000</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={editContent.trim().length === 0 || editContent.trim() === comment.content}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {/* Comment Actions */}
        {!isReply && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
            {comment.replies_count > 0 && (
              <span className="text-xs text-gray-500">
                {comment.replies_count} {comment.replies_count === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
        )}

        {/* Reply Form */}
        <AnimatePresence>
          {replyTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author.full_name}...`}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                rows={2}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{replyContent.length}/1000</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReply(comment.id)}
                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onReplySubmit}
                    disabled={!replyContent.trim() || submitting}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </AnimatePresence>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-4"
          >
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
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
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
