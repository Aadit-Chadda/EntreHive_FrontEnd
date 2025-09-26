'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import PostComposerNew from './PostComposerNew';
import PostCardNew from './PostCardNew';
import { PostData, PostsResponse } from '@/types';
import { postsApi } from '@/lib/api';

interface MainFeedProps {
  feedType?: 'home' | 'public' | 'my_posts';
  showComposer?: boolean;
}

export default function MainFeed({ 
  feedType = 'home', 
  showComposer = true 
}: MainFeedProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);

      let response: PostsResponse;
      
      switch (feedType) {
        case 'public':
          response = await postsApi.getPosts({
            page: pageNum,
            page_size: 10,
            visibility: 'public',
            ordering: '-created_at'
          });
          break;
        case 'my_posts':
          response = await postsApi.getMyPosts({
            page: pageNum,
            page_size: 10
          });
          break;
        case 'home':
        default:
          try {
            response = await postsApi.getFeed({
              page: pageNum,
              page_size: 10
            });
          } catch (feedError: any) {
            // If feed fails due to auth issues, fallback to public posts
            if (feedError?.status === 401 || feedError?.status === 403) {
              console.warn('Feed endpoint failed, falling back to public posts:', feedError);
              response = await postsApi.getPosts({
                page: pageNum,
                page_size: 10,
                visibility: 'public',
                ordering: '-created_at'
              });
            } else {
              throw feedError;
            }
          }
          break;
      }

      const newPosts = response.results;
      
      if (append) {
        setPosts(prev => [...(prev || []), ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(!!response.next);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [feedType]);

  useEffect(() => {
    loadPosts(1, false);
  }, [loadPosts]);

  const handlePostCreated = (newPost: PostData) => {
    setPosts(prev => [newPost, ...(prev || [])]);
  };

  const handlePostUpdate = (updatedPost: PostData) => {
    setPosts(prev => (prev || []).map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId: string) => {
    setPosts(prev => (prev || []).filter(post => post.id !== postId));
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPosts(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts(1, false);
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 &&
      !loadingMore &&
      hasMore
    ) {
      handleLoadMore();
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading) {
    return (
      <div className="space-y-6">
        {showComposer && (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-32"></div>
        )}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (error && (!posts || posts.length === 0)) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => loadPosts(1, false)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Post Composer */}
      {showComposer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PostComposerNew 
            onPostCreated={handlePostCreated}
            placeholder="What's happening in your projects?"
            compact={true}
          />
        </motion.div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {feedType === 'public' ? 'Public Feed' : 
           feedType === 'my_posts' ? 'My Posts' : 
           'Your Feed'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </div>

      {/* Posts List */}
      <AnimatePresence>
        {!posts || posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feedType === 'my_posts' 
                ? 'You haven\'t created any posts yet. Share your first post!' 
                : 'Be the first to share something with the community!'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts && posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCardNew
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              </motion.div>
            ))}
            
            {/* Load More */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}
            
            {!hasMore && posts && posts.length > 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">🎉</div>
                <p>You've caught up with all posts!</p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Error Message for Failed Load More */}
      {error && posts && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => loadPosts(page + 1, true)}
              className="ml-auto px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
