'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, Filter, Grid, List } from 'lucide-react';
import Image from 'next/image';
import PostComposerNew from './PostComposerNew';
import PostCardNew from './PostCardNew';
import ProjectCard from './ProjectCard';
import { PostData, ProjectData } from '@/types';
import { postsApi } from '@/lib/api';

interface FeedItem {
  type: 'post' | 'project';
  id: string;
  data: PostData | ProjectData;
  created_at: string;
  updated_at: string;
}

interface UnifiedFeedResponse {
  results: FeedItem[];
  count: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

interface UnifiedFeedProps {
  feedType?: 'home' | 'public' | 'university' | 'private';
  showComposer?: boolean;
}

export default function UnifiedFeed({ 
  feedType = 'home', 
  showComposer = true 
}: UnifiedFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter states
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'posts' | 'projects'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'private' | 'university' | 'public'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const loadFeedItems = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);

      // Map feed type to visibility
      let visibility: 'private' | 'university' | 'public' | undefined;
      if (feedType === 'public') visibility = 'public';
      else if (feedType === 'university') visibility = 'university';
      else if (feedType === 'private') visibility = 'private';
      
      // Override with user filter if set
      if (visibilityFilter !== 'all') {
        visibility = visibilityFilter as 'private' | 'university' | 'public';
      }

      const response = await postsApi.getUnifiedFeed({
        page: pageNum,
        page_size: 15,
        visibility: visibility,
        type: contentTypeFilter === 'all' ? undefined : contentTypeFilter
      });

      const newItems = response.results;
      
      if (append) {
        setFeedItems(prev => [...(prev || []), ...newItems]);
      } else {
        setFeedItems(newItems);
      }
      
      setHasMore(response.has_next);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Failed to load feed:', error);
      setError('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [feedType, contentTypeFilter, visibilityFilter]);

  useEffect(() => {
    loadFeedItems(1, false);
  }, [loadFeedItems]);

  const handlePostCreated = (newPost: PostData) => {
    const newItem: FeedItem = {
      type: 'post',
      id: newPost.id,
      data: newPost,
      created_at: newPost.created_at,
      updated_at: newPost.updated_at
    };
    setFeedItems(prev => [newItem, ...(prev || [])]);
  };

  const handlePostUpdate = (updatedPost: PostData) => {
    setFeedItems(prev => (prev || []).map(item => 
      item.type === 'post' && item.id === updatedPost.id 
        ? { ...item, data: updatedPost, updated_at: updatedPost.updated_at }
        : item
    ));
  };

  const handlePostDelete = (postId: string) => {
    setFeedItems(prev => (prev || []).filter(item => 
      !(item.type === 'post' && item.id === postId)
    ));
  };

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setFeedItems(prev => (prev || []).map(item => 
      item.type === 'project' && item.id === updatedProject.id 
        ? { ...item, data: updatedProject, updated_at: updatedProject.updated_at }
        : item
    ));
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFeedItems(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeedItems(1, false);
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

  const getFeedTitle = () => {
    switch (feedType) {
      case 'public': return 'Public Feed';
      case 'university': return 'University Feed';
      case 'private': return 'My Content';
      default: return 'Your Feed';
    }
  };

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

  if (error && (!feedItems || feedItems.length === 0)) {
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
            onClick={() => loadFeedItems(1, false)}
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

      {/* Feed Header with Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
            {getFeedTitle()}
          </h2>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-canva-sans transition-colors rounded-lg"
              style={{ 
                color: showFilters ? 'var(--primary-orange)' : 'var(--text-secondary)',
                backgroundColor: showFilters ? 'var(--hover-bg)' : 'transparent'
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>
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
        </div>

        {/* Filter Controls */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg p-4 border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--border)' 
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Content Type Filter */}
                <div>
                  <label className="block text-sm font-semibold font-canva-sans mb-2" 
                         style={{ color: 'var(--text-primary)' }}>
                    Content Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'posts', 'projects'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setContentTypeFilter(type)}
                        className="px-3 py-1.5 text-sm font-canva-sans rounded-lg transition-all"
                        style={{
                          backgroundColor: contentTypeFilter === type ? 'var(--primary-orange)' : 'var(--hover-bg)',
                          color: contentTypeFilter === type ? 'white' : 'var(--text-secondary)'
                        }}
                      >
                        {type === 'all' ? 'All' : type === 'posts' ? 'Posts' : 'Projects'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility Filter */}
                <div>
                  <label className="block text-sm font-semibold font-canva-sans mb-2" 
                         style={{ color: 'var(--text-primary)' }}>
                    Visibility
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'public', 'university', 'private'] as const).map((visibility) => (
                      <button
                        key={visibility}
                        onClick={() => setVisibilityFilter(visibility)}
                        className="px-3 py-1.5 text-sm font-canva-sans rounded-lg transition-all"
                        style={{
                          backgroundColor: visibilityFilter === visibility ? 'var(--primary-orange)' : 'var(--hover-bg)',
                          color: visibilityFilter === visibility ? 'white' : 'var(--text-secondary)'
                        }}
                      >
                        {visibility === 'all' ? 'All' : 
                         visibility === 'public' ? 'Public' : 
                         visibility === 'university' ? 'University' : 'Private'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feed Items */}
      <AnimatePresence>
        {!feedItems || feedItems.length === 0 ? (
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
                Welcome to the Hive!
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base font-canva-sans mb-8 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                This is where student entrepreneurs share ideas, showcase projects, and build the future together. 
                Be the first to start the conversation!
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
                  Start the Conversation
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {feedItems && feedItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.type === 'post' ? (
                  <PostCardNew
                    post={item.data as PostData}
                    onPostUpdate={handlePostUpdate}
                    onPostDelete={handlePostDelete}
                  />
                ) : (
                  <ProjectCard
                    project={item.data as ProjectData}
                    onUpdate={handleProjectUpdate}
                  />
                )}
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
                    Loading more content...
                  </span>
                </div>
              </motion.div>
            )}
            
            {!hasMore && feedItems && feedItems.length > 0 && (
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
                  You've seen all the content in your feed. Check back later for new updates!
                </p>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Error Message for Failed Load More */}
      {error && feedItems && feedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--secondary-red)' 
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--secondary-red)' }} />
            <p className="font-canva-sans" style={{ color: 'var(--secondary-red)' }}>{error}</p>
            <button
              onClick={() => loadFeedItems(page + 1, true)}
              className="ml-auto px-3 py-1 text-sm text-white rounded transition-colors"
              style={{ backgroundColor: 'var(--secondary-red)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-red)'}
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
