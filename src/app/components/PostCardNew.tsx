'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  // Debug render counter
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`PostCard render #${renderCount.current} - Post ID: ${post.id}`);

  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Only sync state on initial mount or when post ID changes
  useEffect(() => {
    setIsLiked(post.is_liked);
    setLikesCount(post.likes_count);
  }, [post.id]);
  
  // Separate effect to sync content changes
  useEffect(() => {
    setEditContent(post.content);
  }, [post.content]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log('State changed - isLiked:', isLiked, 'likesCount:', likesCount);
  }, [isLiked, likesCount]);

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
    
    console.log('Current state before like:', { isLiked, likesCount });
    setIsLiking(true);
    
    try {
      const response = await postsApi.toggleLike(post.id);
      console.log('Like response:', response); // Debug log
      console.log('About to update state - liked:', response.liked, 'count:', response.likes_count);
      
      // Update with actual server response
      setIsLiked(response.liked);
      setLikesCount(response.likes_count);
      
      console.log('State updated - new values should be:', { liked: response.liked, count: response.likes_count });
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

  const getRoleStyles = (role: string) => {
    const baseStyle = {
      padding: '0.125rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '500',
    };
    
    switch (role) {
      case 'student': 
        return { 
          ...baseStyle, 
          color: 'var(--primary-orange)', 
          backgroundColor: 'var(--active-bg)' 
        };
      case 'professor': 
        return { 
          ...baseStyle, 
          color: 'var(--accent-pine)', 
          backgroundColor: 'rgba(33, 79, 56, 0.1)' 
        };
      case 'investor': 
        return { 
          ...baseStyle, 
          color: 'var(--accent-terracotta)', 
          backgroundColor: 'rgba(231, 159, 116, 0.1)' 
        };
      default: 
        return { 
          ...baseStyle, 
          color: 'var(--text-secondary)', 
          backgroundColor: 'var(--border-light)' 
        };
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
      className="rounded-lg p-6 hover:shadow-md transition-all duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profiles/${post.author.username}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{backgroundColor: 'var(--border-light)'}}>
              {post.author.profile_picture ? (
                <Image
                  src={post.author.profile_picture}
                  alt={post.author.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-medium" style={{color: 'var(--text-muted)'}}>
                  {post.author.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          
          <div className="flex-1 min-w-0">
            <Link 
              href={`/profiles/${post.author.username}`}
              className="font-medium transition-colors"
              style={{color: 'var(--text-primary)'}}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            >
              {post.author.full_name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm" style={{color: 'var(--text-secondary)'}}>@{post.author.username}</span>
              <span style={getRoleStyles(post.author.user_role)}>
                {post.author.user_role}
              </span>
              {post.author.university_name && (
                <>
                  <span className="text-sm" style={{color: 'var(--text-muted)'}}>·</span>
                  <span className="text-sm" style={{color: 'var(--text-secondary)'}}>{post.author.university_name}</span>
                </>
              )}
              <span className="text-sm" style={{color: 'var(--text-muted)'}}>·</span>
              <span className="text-sm" style={{color: 'var(--text-secondary)'}}>{formatTimestamp(post.created_at)}</span>
              {post.is_edited && (
                <>
                  <span className="text-sm" style={{color: 'var(--text-muted)'}}>·</span>
                  <span className="text-sm italic" style={{color: 'var(--text-secondary)'}}>edited</span>
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
              className="p-2 rounded-full transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MoreHorizontal className="w-4 h-4" style={{color: 'var(--text-muted)'}} />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg z-10"
                  style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                    style={{color: 'var(--text-primary)'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                      style={{color: 'var(--secondary-red)'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-red)/10'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
              className="w-full p-3 rounded-lg resize-none focus:ring-2 focus:outline-none"
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
              rows={4}
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                {editContent.length}/2000
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(post.content);
                  }}
                  className="px-3 py-1 text-sm transition-colors"
                  style={{color: 'var(--text-secondary)'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editContent.trim().length === 0 || editContent.trim() === post.content}
                  className="px-3 py-1 text-sm text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{backgroundColor: 'var(--primary-orange)'}}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link href={`/posts/${post.id}`} className="block">
            <p className="whitespace-pre-wrap leading-relaxed transition-colors cursor-pointer" style={{color: 'var(--text-primary)'}}>
              {post.content}
            </p>
          </Link>
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
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors"
                style={{
                  backgroundColor: 'var(--active-bg)',
                  color: 'var(--primary-orange)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
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
          <Link href={`/posts/${post.id}`}>
            <Image
              src={post.image_url}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
          </Link>
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
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs" style={{color: 'var(--text-muted)'}} title={`Debug: isLiked=${isLiked}, count=${likesCount}`}>
                {(() => {
                  console.log('JSX render - isLiked:', isLiked, 'likesCount:', likesCount);
                  return '';
                })()}
              </span>
            )}
          </motion.button>

          <Link
            href={`/posts/${post.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{color: 'var(--text-muted)'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary-orange)';
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments_count}</span>
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{color: 'var(--text-muted)'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-pine)';
              e.currentTarget.style.backgroundColor = 'rgba(33, 79, 56, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
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
