'use client';

import { useState } from 'react';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  tags: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFollowing: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onFollow: (postId: string) => void;
}

export default function PostCard({ post, onLike, onFollow }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm">@{post.author.username}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{formatTimestamp(post.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Follow Button (if not following) */}
        {!post.isFollowing && (
          <button
            onClick={() => onFollow(post.id)}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
          >
            Follow
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 dark:text-white leading-relaxed mb-3">{post.content}</p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-2 transition-colors group ${
              post.isLiked 
                ? 'text-red-500' 
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <div className={`p-2 rounded-full transition-colors ${
              post.isLiked 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/20'
            }`}>
              <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          {/* Share */}
          <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-3">
            {/* Comment Input */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs">JD</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-3 ml-11">
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">alex_dev</span>
                <span className="text-gray-600 dark:text-gray-300 ml-2">This looks amazing! Would love to try it out.</span>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>2h</span>
                  <button className="hover:text-gray-700 dark:hover:text-gray-300">Like</button>
                  <button className="hover:text-gray-700 dark:hover:text-gray-300">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
