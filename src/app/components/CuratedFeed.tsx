'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, Settings, TrendingUp, Home, University, Globe } from 'lucide-react';
import Image from 'next/image';
import PostComposerNew from './PostComposerNew';
import PostCardNew from './PostCardNew';
import ProjectCard from './ProjectCard';
import { FeedItem, FeedResponse, PostData, ProjectData } from '@/types';
import { feedApi } from '@/lib/api';

interface CuratedFeedProps {
  feedType?: 'home' | 'university' | 'public';
  showComposer?: boolean;
}

export default function CuratedFeed({ 
  feedType = 'home', 
  showComposer = true 
}: CuratedFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);

      let response: FeedResponse;
      
      switch (feedType) {
        case 'university':
          response = await feedApi.getUniversityFeed({
            page: pageNum,
            page_size: 15
          });
          break;
        case 'public':
          response = await feedApi.getPublicFeed({
            page: pageNum,
            page_size: 15
          });
          break;
        case 'home':
        default:
          response = await feedApi.getHomeFeed({
            page: pageNum,
            page_size: 15
          });
          break;
      }

      const newItems = response.results || [];
      
      if (append) {
        setFeedItems(prev => [...(prev || []), ...newItems]);
      } else {
        setFeedItems(newItems);
      }
      
      setHasMore(!!response.next);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Failed to load feed:', error);
      setError('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [feedType]);

  useEffect(() => {
    loadFeed(1, false);
  }, [loadFeed]);

  const handlePostCreated = (newPost: PostData) => {
    // Add new post to the top of the feed
    const newFeedItem: FeedItem = {
      id: `new-${Date.now()}`,
      content_type: 'post',
      content_id: newPost.id,
      feed_type: feedType,
      score: 100, // New posts get high score
      viewed: false,
      clicked: false,
      created_at: newPost.created_at,
      content: newPost
    };
    setFeedItems(prev => [newFeedItem, ...(prev || [])]);
  };

  const handleItemUpdate = (updatedContent: PostData | ProjectData, contentType: 'post' | 'project') => {
    setFeedItems(prev => (prev || []).map(item => 
      item.content_type === contentType && item.content_id === updatedContent.id 
        ? { ...item, content: updatedContent }
        : item
    ));
  };

  const handleItemDelete = (contentId: string, contentType: 'post' | 'project') => {
    setFeedItems(prev => (prev || []).filter(item => 
      !(item.content_type === contentType && item.content_id === contentId)
    ));
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFeed(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeed(1, false);
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

  const trackInteraction = async (feedItemId: string, action: 'view' | 'click') => {
    try {
      await feedApi.trackInteraction({
        feed_item_id: feedItemId,
        action
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const getFeedIcon = () => {
    switch (feedType) {
      case 'university':
        return <University className="w-5 h-5" />;
      case 'public':
        return <Globe className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  const getFeedTitle = () => {
    switch (feedType) {
      case 'university':
        return 'University Feed';
      case 'public':
        return 'Global Feed';
      default:
        return 'Your Feed';
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
            onClick={() => loadFeed(1, false)}
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

      {/* Feed Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {getFeedIcon()}
          <h2 className="text-lg font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
            {getFeedTitle()}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
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

      {/* Feed Items */}
      <AnimatePresence>
        {!feedItems || feedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative py-16 px-8"
          >
            {/* Empty State */}
            <div className="relative z-10 max-w-md mx-auto text-center">
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

              <h3 className="text-2xl font-bold font-roca-two mb-3" style={{ color: 'var(--text-primary)' }}>
                Welcome to the Hive!
              </h3>
              <p className="text-base font-canva-sans mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Your curated feed is ready! Share your entrepreneurial journey, discover amazing projects, 
                and connect with fellow innovators from your university and beyond.
              </p>

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
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {feedItems.map((feedItem, index) => (
              <motion.div
                key={feedItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => trackInteraction(feedItem.id, 'click')}
              >
                {feedItem.content_type === 'post' ? (
                  <PostCardNew
                    post={feedItem.content as PostData}
                    onPostUpdate={(post) => handleItemUpdate(post, 'post')}
                    onPostDelete={(postId) => handleItemDelete(postId, 'post')}
                  />
                ) : (
                  <ProjectCard
                    project={feedItem.content as ProjectData}
                    onProjectUpdate={(project) => handleItemUpdate(project, 'project')}
                    onProjectDelete={(projectId) => handleItemDelete(projectId, 'project')}
                  />
                )}
                
                {/* Feed Score Indicator (for debugging - can be removed) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-400 mt-2 px-4">
                    Score: {feedItem.score.toFixed(1)} | Type: {feedItem.content_type}
                  </div>
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
            
            {!hasMore && feedItems.length > 0 && (
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
                  You've seen all the content in your {getFeedTitle().toLowerCase()}. Check back later for new updates!
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
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => loadFeed(page + 1, true)}
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
