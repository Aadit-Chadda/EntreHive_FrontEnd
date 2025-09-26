'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import Image from 'next/image';
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
          <div className="animate-pulse rounded-lg h-32" style={{ backgroundColor: 'var(--hover-bg)' }}></div>
        )}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg h-64 relative overflow-hidden" style={{ backgroundColor: 'var(--hover-bg)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && (!posts || posts.length === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-8"
      >
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              style={{ backgroundColor: 'var(--secondary-red)' }}
            >
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h3 className="text-xl font-bold font-roca-two mb-3" style={{ color: 'var(--text-primary)' }}>
            Oops! Something went wrong
          </h3>
          <p className="font-canva-sans mb-6" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadPosts(1, false)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold font-canva-sans text-white shadow-lg transition-all duration-300"
            style={{ backgroundColor: 'var(--primary-orange)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-orange)'}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        </div>
      </motion.div>
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
        <h2 className="text-lg font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
          {feedType === 'public' ? 'Public Feed' : 
           feedType === 'my_posts' ? 'My Posts' : 
           'Your Feed'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-canva-sans transition-colors rounded-lg"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-orange)';
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </div>

      {/* Posts List */}
      <AnimatePresence>
        {!posts || posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative py-16 px-8"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="hexagon-pattern h-full w-full"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 max-w-md mx-auto text-center">
              {/* Animated Bee Hive Icon */}
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)'
                    }}
                  >
                    <div className="animate-bounce">
                      <Image
                        src="/logo_w_name.png"
                        alt="EntreHive Logo"
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* Floating hexagons */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded opacity-60"
                    style={{ backgroundColor: 'var(--accent-pine)' }}
                  />
                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-1 -left-3 w-4 h-4 rounded opacity-40"
                    style={{ backgroundColor: 'var(--accent-terracotta)' }}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold font-roca-two mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {feedType === 'my_posts' ? 'Your Hive Awaits' : 'Welcome to the Hive!'}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base font-canva-sans mb-8 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {feedType === 'my_posts' 
                  ? 'Share your entrepreneurial journey, showcase your projects, and connect with fellow innovators. Your story starts here!' 
                  : 'This is where student entrepreneurs share ideas, showcase projects, and build the future together. Be the first to start the conversation!'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Scroll to composer or trigger composer focus
                    const composer = document.querySelector('[data-composer]') as HTMLElement;
                    if (composer) {
                      composer.scrollIntoView({ behavior: 'smooth' });
                      composer.focus();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold font-canva-sans text-white shadow-lg transition-all duration-300"
                  style={{ backgroundColor: 'var(--primary-orange)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-orange)'}
                >
                  <span className="text-lg">✨</span>
                  {feedType === 'my_posts' ? 'Share Your First Post' : 'Start the Conversation'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold font-canva-sans border-2 transition-all duration-300"
                  style={{ 
                    borderColor: 'var(--primary-orange)', 
                    color: 'var(--primary-orange)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Feed
                </motion.button>
              </motion.div>

              {/* Fun Stats or Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 pt-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-1">🚀</div>
                    <div className="text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                      Share Ideas
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🤝</div>
                    <div className="text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                      Connect
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">💡</div>
                    <div className="text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                      Innovate
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-8"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--primary-orange)' }} />
                  <span className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    Loading more posts...
                  </span>
                </div>
              </motion.div>
            )}
            
            {!hasMore && posts && posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                  All caught up!
                </h3>
                <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  You've seen all the posts in your feed. Check back later for new updates!
                </p>
              </motion.div>
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
