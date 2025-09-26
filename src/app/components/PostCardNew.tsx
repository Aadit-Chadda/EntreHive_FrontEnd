'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PostData } from '@/types';
import { postsApi } from '@/lib/api';

interface PostCardProps {
  post: PostData;
  onPostUpdate?: (updatedPost: PostData) => void;
  onPostDelete?: (postId: string) => void;
  showComments?: boolean;
}

export default function PostCard({ 
  post, 
  onPostUpdate, 
  onPostDelete,
  showComments = false 
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const formatTimestamp = useCallback((timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diff = now.getTime() - postTime.getTime();
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
  }, []);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await postsApi.toggleLike(post.id);
      setIsLiked(response.liked);
      setLikesCount(response.likes_count);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = async () => {
    if (editContent.trim() === post.content) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedPost = await postsApi.updatePost(post.id, {
        content: editContent.trim()
      });
      onPostUpdate?.(updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      setEditContent(post.content); // Reset content on error
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await postsApi.deletePost(post.id);
      onPostDelete?.(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      const response = await postsApi.sharePost(post.id);
      
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author.full_name}`,
          text: post.content,
          url: response.share_url
        });
      } else {
        await navigator.clipboard.writeText(response.share_url);
        setShowShareModal(true);
        setTimeout(() => setShowShareModal(false), 2000);
      }
    } catch (error) {
      console.error('Failed to share post:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30';
      case 'professor': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30';
      case 'investor': return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return '🔒';
      case 'university': return '🏫';
      case 'public': return '🌍';
      default: return '';
    }
  };

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {post.author.profile_picture ? (
                <Image
                  src={post.author.profile_picture}
                  alt={post.author.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                  {post.author.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          
          <div className="flex-1 min-w-0">
            <Link 
              href={`/profile/${post.author.username}`}
              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.author.full_name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 text-sm">@{post.author.username}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(post.author.user_role)}`}>
                {post.author.user_role}
              </span>
              <span className="text-gray-400 text-sm">·</span>
              <span className="text-gray-500 text-sm">{formatTimestamp(post.created_at)}</span>
              {post.is_edited && (
                <>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-500 text-sm italic">edited</span>
                </>
              )}
              <span className="text-sm" title={`Visibility: ${post.visibility}`}>
                {getVisibilityIcon(post.visibility)}
              </span>
            </div>
          </div>
        </div>

        {/* More options */}
        {post.can_edit && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit post
                  </button>
                  {post.can_delete && (
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowDropdown(false);
                      }}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Deleting...' : 'Delete post'}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {editContent.length}/2000
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(post.content);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editContent.trim().length === 0 || editContent.trim() === post.content}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        )}
      </div>

      {/* Tagged Projects */}
      {post.tagged_projects.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {post.tagged_projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {project.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Image
            src={post.image_url}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              isLiked 
                ? 'text-red-600 bg-red-50 dark:bg-red-900/30' 
                : 'text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </motion.button>

          <Link
            href={`/posts/${post.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments_count}</span>
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </motion.button>
        </div>
      </div>

      {/* Share success modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
            >
              <p className="text-green-600 dark:text-green-400 font-medium">
                ✓ Link copied to clipboard!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
