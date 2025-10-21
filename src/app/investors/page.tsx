'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, TrendingUp, Rocket, Users, Sparkles, ChevronDown, Bookmark, MessageCircle, Menu, Bell, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeToggle } from '../components/ThemeProvider';
import { api } from '@/lib/api';

// Types
interface Topic {
  id: string;
  label: string;
  icon: string;
}

interface University {
  id: string;
  name: string;
  logo?: string;
}

interface Project {
  id: string;
  title: string;
  summary: string;
  categories?: string[];
  needs?: string[];
  status: string;
  team_size?: number;
  university?: {
    id: string;
    name: string;
  };
  owner?: {
    username: string;
    profile_picture?: string;
  };
  created_at: string;
  item_type: 'project';
}

interface Post {
  id: string;
  content: string;
  author: {
    username: string;
    profile_picture?: string;
  };
  project?: {
    id: string;
    title: string;
  };
  created_at: string;
  item_type: 'post';
  likes_count: number;
  comments_count: number;
}

type FeedItem = Project | Post;

export default function InvestorFeed() {
  const { user, profile } = useAuth();
  const router = useRouter();
  
  // State management
  const [feedType, setFeedType] = useState<'public' | 'university'>('public');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('best_match');
  
  // Data state
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [stats, setStats] = useState({ total_projects: 0, raising_funding: 0, prototypes_ready: 0 });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Refs
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Check if user is investor
  useEffect(() => {
    if (user && user.user_role && user.user_role !== 'investor') {
      router.push('/forbidden');
    }
  }, [user, router]);

  // Load persistence from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFeedType = localStorage.getItem('investor_feed_type');
      const savedTopics = localStorage.getItem('investor_topics');
      const savedUniversity = localStorage.getItem('investor_university');
      const savedSort = localStorage.getItem('investor_sort');
      
      if (savedFeedType) setFeedType(savedFeedType as 'public' | 'university');
      if (savedTopics) setSelectedTopics(JSON.parse(savedTopics));
      if (savedUniversity) setSelectedUniversity(savedUniversity);
      if (savedSort) setSortBy(savedSort);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('investor_feed_type', feedType);
      localStorage.setItem('investor_topics', JSON.stringify(selectedTopics));
      if (selectedUniversity) localStorage.setItem('investor_university', selectedUniversity);
      localStorage.setItem('investor_sort', sortBy);
    }
  }, [feedType, selectedTopics, selectedUniversity, sortBy]);

  // Fetch topics
  useEffect(() => {
    fetchTopics();
  }, []);

  // Fetch universities
  useEffect(() => {
    fetchUniversities();
  }, []);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch feed when filters change
  useEffect(() => {
    fetchFeed(true);
  }, [feedType, selectedTopics, selectedUniversity, quickFilter, sortBy]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchFeed(true);
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Infinite scroll setup
  useEffect(() => {
    if (!loadMoreTriggerRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchFeed(false);
        }
      },
      { threshold: 0.1 }
    );
    
    observerRef.current.observe(loadMoreTriggerRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, nextCursor]);

  const fetchTopics = async () => {
    try {
      const response: any = await api.get('/api/feed/investor/topics/');
      if (response) {
        setTopics(response.topics || response || []);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      setTopics([]);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response: any = await api.get('/api/universities/');
      if (response) {
        setUniversities(response || []);
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      setUniversities([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response: any = await api.get('/api/feed/investor/stats/');
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        total_posts: 0,
        total_projects: 0,
        active_users: 0,
        universities: 0
      });
    }
  };

  const fetchFeed = async (reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setNextCursor(null);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const params = new URLSearchParams({
        feed_type: feedType,
        sort: sortBy,
        limit: '12',
      });
      
      if (selectedTopics.length > 0) {
        params.append('topics', selectedTopics.join(','));
      }
      
      if (selectedUniversity && feedType === 'university') {
        params.append('university_id', selectedUniversity);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (quickFilter) {
        params.append('quick_filter', quickFilter);
      }
      
      if (nextCursor && !reset) {
        params.append('cursor', nextCursor);
      }
      
      const response: any = await api.get(`/api/feed/investor/?${params.toString()}`);
      
      if (response) {
        const results = response.results || [];
        
        if (reset) {
          setFeed(results);
        } else {
          setFeed(prev => [...prev, ...results]);
        }
        
        setNextCursor(response.next_cursor || null);
        setHasMore(response.has_more || false);
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      if (reset) {
        setFeed([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setQuickFilter(null);
    setSearchQuery('');
  };

  if (!user || user.user_role !== 'investor') {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg border-b" 
             style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/investors" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>EntreHive</span>
                  <span className="text-xl font-bold font-roca-two" style={{ color: 'var(--primary-orange)' }}>Investors</span>
                </div>
              </Link>

              {/* Center - Discover */}
              <div className="hidden md:block">
                <Link href="/investors" className="font-canva-sans font-semibold text-lg" style={{ color: 'var(--primary-orange)' }}>
                  Discover
                </Link>
              </div>

              {/* Right Side - Theme Toggle, Notifications, Profile */}
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Inbox */}
                <Link href="/inbox" 
                      className="relative p-2 rounded-lg transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Inbox className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <Link href="/investors/notifications" 
                      className="relative p-2 rounded-lg transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Bell className="w-5 h-5" />
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--accent-pine) 100%)' }}>
                      {profile?.profile_picture ? (
                        <img src={profile.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm font-roca-two">
                          {user.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 hidden lg:block" style={{ color: 'var(--text-secondary)' }} />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                          <div className="font-semibold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                            {profile?.full_name || user.username}
                          </div>
                          <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                            @{user.username}
                          </div>
                          <div className="mt-1 px-2 py-1 rounded text-xs font-semibold inline-block"
                               style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                            💼 Investor
                          </div>
                        </div>
                        <div className="py-2">
                          <Link href="/investors/profile" 
                                className="block px-4 py-2 text-sm font-canva-sans transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            View Profile
                          </Link>
                          <Link href="/settings" 
                                className="block px-4 py-2 text-sm font-canva-sans transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Settings
                          </Link>
                          <div className="border-t my-2" style={{ borderColor: 'var(--border)' }}></div>
                          <button 
                            onClick={() => {
                              localStorage.clear();
                              router.push('/login');
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-canva-sans transition-colors"
                            style={{ color: 'var(--secondary-red)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                  Investor Discovery
                </h1>
                <p className="text-lg font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  Find promising student ventures
                </p>
              </div>
              
              {/* Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold font-roca-two" style={{ color: 'var(--primary-orange)' }}>
                    {stats.total_projects}
                  </div>
                  <div className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-roca-two" style={{ color: 'var(--accent-pine)' }}>
                    {stats.raising_funding}
                  </div>
                  <div className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    Raising
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-roca-two" style={{ color: 'var(--accent-terracotta)' }}>
                    {stats.prototypes_ready}
                  </div>
                  <div className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Type Tabs */}
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setFeedType('public')}
                className={`px-6 py-2.5 rounded-lg font-semibold font-canva-sans transition-all duration-200 ${
                  feedType === 'public' ? 'text-white shadow-lg' : ''
                }`}
                style={feedType === 'public' 
                  ? { background: 'var(--primary-orange)' } 
                  : { background: 'var(--hover-bg)', color: 'var(--text-secondary)' }
                }>
                🌍 Public Feed
              </button>
              <button
                onClick={() => setFeedType('university')}
                className={`px-6 py-2.5 rounded-lg font-semibold font-canva-sans transition-all duration-200 ${
                  feedType === 'university' ? 'text-white shadow-lg' : ''
                }`}
                style={feedType === 'university'
                  ? { background: 'var(--accent-pine)' }
                  : { background: 'var(--hover-bg)', color: 'var(--text-secondary)' }
                }>
                🎓 Universities
              </button>
            </div>

            {/* Search and Filters Row */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search projects and posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border font-canva-sans focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* University Selector (only for university feed) */}
              {feedType === 'university' && (
                <div className="relative">
                  <button
                    onClick={() => setShowUniversityDropdown(!showUniversityDropdown)}
                    className="px-4 py-3 rounded-lg border font-canva-sans flex items-center space-x-2 hover:border-orange-300 transition-colors duration-200 whitespace-nowrap"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}>
                    <span className="text-sm">
                      {selectedUniversity 
                        ? universities.find(u => u.id === selectedUniversity)?.name || 'Select University'
                        : 'All Universities'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUniversityDropdown && (
                    <div className="absolute top-full mt-2 w-64 rounded-lg shadow-xl border overflow-hidden z-50"
                         style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <div className="max-h-64 overflow-y-auto">
                        <button
                          onClick={() => {
                            setSelectedUniversity(null);
                            setShowUniversityDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors duration-150"
                          style={{ background: !selectedUniversity ? 'var(--hover-bg)' : 'transparent', color: 'var(--text-primary)' }}>
                          <div className="font-canva-sans text-sm">All Universities</div>
                        </button>
                        {universities.map((uni) => (
                          <button
                            key={uni.id}
                            onClick={() => {
                              setSelectedUniversity(uni.id);
                              setShowUniversityDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors duration-150"
                            style={{ background: selectedUniversity === uni.id ? 'var(--hover-bg)' : 'transparent', color: 'var(--text-primary)' }}>
                            <div className="font-canva-sans text-sm">{uni.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 rounded-lg border font-canva-sans flex items-center space-x-2 hover:border-orange-300 transition-colors duration-200"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}>
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline">Filters</span>
                {(selectedTopics.length > 0 || quickFilter) && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'var(--primary-orange)' }}>
                    {selectedTopics.length + (quickFilter ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-lg border font-canva-sans focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}>
                <option value="best_match">Best Match</option>
                <option value="recent">Most Recent</option>
                <option value="saved">Most Saved</option>
              </select>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-4 overflow-hidden rounded-xl border p-4"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  {/* Quick Filters */}
                  <div>
                    <div className="text-xs font-semibold font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Quick Filters
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'funding', label: 'Raising Funding', icon: '💰' },
                        { id: 'prototype', label: 'Prototype Ready', icon: '🚀' },
                        { id: 'hiring', label: 'Hiring Now', icon: '👥' },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setQuickFilter(quickFilter === filter.id ? null : filter.id)}
                          className={`px-4 py-2 rounded-lg font-canva-sans text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                            quickFilter === filter.id ? 'ring-2' : ''
                          }`}
                          style={quickFilter === filter.id
                            ? { background: 'var(--primary-orange)', color: 'white', ringColor: 'var(--primary-orange)' }
                            : { background: 'var(--hover-bg)', color: 'var(--text-primary)' }
                          }>
                          <span>{filter.icon}</span>
                          <span>{filter.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <div className="text-xs font-semibold font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Topics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => toggleTopic(topic.id)}
                          className={`px-4 py-2 rounded-lg font-canva-sans text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                            selectedTopics.includes(topic.id) ? 'ring-2' : ''
                          }`}
                          style={selectedTopics.includes(topic.id)
                            ? { background: 'var(--accent-pine)', color: 'white', ringColor: 'var(--accent-pine)' }
                            : { background: 'var(--hover-bg)', color: 'var(--text-primary)' }
                          }>
                          <span>{topic.icon}</span>
                          <span>{topic.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Filters Bar */}
                  {(selectedTopics.length > 0 || quickFilter) && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg"
                         style={{ background: 'var(--active-bg)' }}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                          {selectedTopics.length + (quickFilter ? 1 : 0)} active filter{(selectedTopics.length + (quickFilter ? 1 : 0)) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <button
                        onClick={clearFilters}
                        className="text-sm font-semibold font-canva-sans flex items-center space-x-1 hover:underline"
                        style={{ color: 'var(--primary-orange)' }}>
                        <X className="w-4 h-4" />
                        <span>Clear All</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feed Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl p-6 animate-pulse" style={{ background: 'var(--surface)' }}>
                  <div className="h-6 w-3/4 rounded mb-4" style={{ background: 'var(--hover-bg)' }}></div>
                  <div className="h-4 w-full rounded mb-2" style={{ background: 'var(--hover-bg)' }}></div>
                  <div className="h-4 w-2/3 rounded" style={{ background: 'var(--hover-bg)' }}></div>
                </div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="text-center py-16 rounded-xl" style={{ background: 'var(--surface)' }}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--hover-bg)' }}>
                <Sparkles className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 className="text-2xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                No projects found
              </h3>
              <p className="text-lg font-canva-sans mb-6" style={{ color: 'var(--text-secondary)' }}>
                {selectedTopics.length > 0 || quickFilter || searchQuery
                  ? 'Try adjusting your filters or search query'
                  : 'Be the first to discover new ventures'}
              </p>
              {(selectedTopics.length > 0 || quickFilter || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-lg font-semibold font-canva-sans text-white transition-all duration-200 hover:scale-105"
                  style={{ background: 'var(--primary-orange)' }}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div>
                {feed.map((item) => (
                  item.item_type === 'project' ? (
                    <ProjectCard key={item.id} project={item as Project} />
                  ) : (
                    <PostCard key={item.id} post={item as Post} />
                  )
                ))}
              </div>

              {/* Load More Trigger */}
              <div ref={loadMoreTriggerRef} className="h-20 flex items-center justify-center">
                {loadingMore && (
                  <div className="flex items-center space-x-2" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary-orange)' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary-orange)', animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary-orange)', animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'mvp': return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'launched': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getNeedIcon = (need: string) => {
    switch (need) {
      case 'funding': return '💰';
      case 'dev': return '💻';
      case 'design': return '🎨';
      case 'marketing': return '📈';
      case 'research': return '🔬';
      case 'mentor': return '👨‍🏫';
      default: return '📌';
    }
  };

  return (
    <Link href={`/investors/projects/${project.id}`} className="block mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Rocket className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
              <span className={`px-2 py-1 rounded text-xs font-semibold font-canva-sans ${getStatusColor(project.status)}`}>
                {project.status.toUpperCase()}
              </span>
              {project.university && (
                <span className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  {project.university.name}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold font-roca-two mb-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>
              {project.title}
            </h3>
            <p className="text-sm font-canva-sans line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {project.summary}
            </p>
          </div>
        </div>

        {/* Tags */}
        {project.categories && project.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.categories.slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold font-canva-sans"
                style={{ background: 'var(--hover-bg)', color: 'var(--primary-orange)' }}>
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Needs */}
        {project.needs && project.needs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
              Currently seeking:
            </span>
            {project.needs.slice(0, 3).map((need, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded text-xs font-medium font-canva-sans"
                style={{ background: 'var(--neutral-light-orange)', color: 'var(--secondary-red)' }}>
                {getNeedIcon(need)} {need}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                {project.team_size || 1} {(project.team_size || 1) === 1 ? 'member' : 'members'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => e.preventDefault()}
              className="p-2 rounded-lg hover:bg-opacity-50 transition-colors duration-150" 
              style={{ background: 'var(--hover-bg)' }}>
              <Bookmark className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
            <div className="px-4 py-2 rounded-lg font-semibold font-canva-sans text-white transition-all duration-200"
                    style={{ background: 'var(--primary-orange)' }}>
              View Project
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Post Card Component
function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className="block mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:shadow-lg"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--hover-bg)' }}>
            <span className="font-bold font-roca-two" style={{ color: 'var(--primary-orange)' }}>
              {post.author.username[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold font-canva-sans" style={{ color: 'var(--text-primary)' }}>
              {post.author.username}
            </div>
            {post.project && (
              <div className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                Posted about <span style={{ color: 'var(--primary-orange)' }}>{post.project.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-sm font-canva-sans line-clamp-3 mb-3" style={{ color: 'var(--text-primary)' }}>
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center space-x-4 text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center space-x-1">
            <span>❤️</span>
            <span>{post.likes_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments_count || 0}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
