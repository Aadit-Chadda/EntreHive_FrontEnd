'use client';

import { useState, useEffect, useCallback } from 'react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import InfiniteScroll from './InfiniteScroll';

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

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Mock data for posts
  const mockPosts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Just launched our AI-powered study buddy app! 🚀 Looking for beta testers from different universities. Who\'s interested?',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=300&fit=crop',
      tags: ['AI', 'EdTech', 'Startup'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 42,
      comments: 8,
      shares: 3,
      isLiked: false,
      isFollowing: false,
    },
    {
      id: '2',
      author: {
        name: 'Marcus Johnson',
        username: 'marcusj',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      content: 'The future of fintech is being built by students! Our peer-to-peer payment solution just got accepted into the university incubator. Grateful for this amazing community 🙏',
      tags: ['FinTech', 'P2P', 'Incubator'],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: true,
      isFollowing: true,
    },
    {
      id: '3',
      author: {
        name: 'Emma Rodriguez',
        username: 'emmarodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Climate action starts with us! Our carbon tracking app for university campuses is now live. Every small action counts 🌱',
      image: 'https://images.unsplash.com/photo-1569163139394-de44cb689035?w=600&h=300&fit=crop',
      tags: ['Climate', 'Sustainability', 'Impact'],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      likes: 89,
      comments: 15,
      shares: 7,
      isLiked: false,
      isFollowing: false,
    },
    {
      id: '4',
      author: {
        name: 'David Kim',
        username: 'davidkim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Building a decentralized research collaboration platform. Imagine if researchers from different universities could seamlessly share data and insights 🔬',
      tags: ['Research', 'Blockchain', 'Collaboration'],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      likes: 73,
      comments: 19,
      shares: 5,
      isLiked: true,
      isFollowing: false,
    },
    {
      id: '5',
      author: {
        name: 'Priya Patel',
        username: 'priyapatel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Our mental health support network for students just reached 1000 active users! Mental health matters, especially during exam season 💙',
      tags: ['MentalHealth', 'Community', 'WellBeing'],
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      likes: 234,
      comments: 45,
      shares: 18,
      isLiked: false,
      isFollowing: true,
    },
  ];

  // Initialize with some posts
  useEffect(() => {
    setPosts(mockPosts.slice(0, 3));
  }, []);

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const startIndex = posts.length;
      const newPosts = mockPosts.slice(startIndex, startIndex + 2);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      
      setLoading(false);
    }, 1000);
  }, [posts.length, loading, hasMore]);

  const handlePostCreate = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
      },
      content,
      image,
      tags: [],
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isFollowing: false,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleFollow = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isFollowing: !post.isFollowing }
          : post
      )
    );
  };

  return (
    <div className="w-full max-w-none pb-6">
      {/* Sticky Composer */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 lg:top-0">
        <PostComposer onPostCreate={handlePostCreate} />
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onFollow={handleFollow}
          />
        ))}
      </div>

      {/* Infinite Scroll */}
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMorePosts}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>You've caught up! 🎉</p>
        </div>
      )}
    </div>
  );
}
