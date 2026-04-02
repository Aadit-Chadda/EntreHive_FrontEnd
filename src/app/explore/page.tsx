'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Grid3X3, Users, BookOpen, Hash, ArrowUp, Sparkles,
  MessageSquare, Heart, TrendingUp, X, ChevronRight, Compass
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '../components/LeftNavigation';
import RightSidebar from '../components/RightSidebar';
import { useTheme } from '../components/ThemeProvider';
import { api, feedApi } from '@/lib/api';
import { HashtagContent } from '../components/PostCardNew';
import { ExplorePageSkeleton } from '../components/LoadingSkeletons';

/* ─── Types ────────────────────────────────────────────────────────────── */

interface User {
  id: string;
  username: string;
  full_name: string;
  user_role: string;
  profile_picture?: string;
  bio?: string;
  location?: string;
  university_name?: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

interface Post {
  id: string;
  user: { username: string; full_name: string; profile_picture?: string };
  author?: {
    username: string; full_name: string; profile_picture?: string;
    user_role: string; university_name: string;
  };
  content: string;
  images?: string[];
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

interface Project {
  id: string;
  title: string;
  summary?: string;
  banner_image?: string;
  banner_gradient?: string;
  project_type: string;
  status: string;
  categories?: string[];
  tags?: string[];
  team_count: number;
  created_at: string;
  owner: {
    username: string;
    full_name: string;
    profile: { full_name: string; profile_picture?: string };
  };
}

interface FeedItem {
  content_type: 'post' | 'project';
  content_id: string;
  score: number;
  content: any;
  user_interactions: string[];
  viewed: boolean;
  clicked: boolean;
  liked: boolean;
}

interface TrendingTopic {
  topic: string;
  mention_count: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SearchResults {
  users: User[];
  posts: Post[];
  projects: Project[];
  hashtags: string[];
}

type SearchType = 'all' | 'users' | 'posts' | 'projects' | 'hashtags';

/* ─── Card Components ──────────────────────────────────────────────────── */

function ExplorePostCard({ post }: { post: any }) {
  const author = post.author || post.user || {};
  return (
    <Link href={`/posts/${post.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {post.image_url ? (
          <div className="relative h-44 overflow-hidden">
            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div
            className="h-32 flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}
          >
            <HashtagContent
              text={post.content?.slice(0, 100) || ''}
              className="text-white/90 text-sm font-canva-sans text-center line-clamp-3"
            />
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}
            >
              {author.profile_picture ? (
                <img src={author.profile_picture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-xs">
                  {(author.full_name || author.username || 'U')[0]}
                </span>
              )}
            </div>
            <span className="text-xs font-canva-sans truncate" style={{ color: 'var(--text-secondary)' }}>
              {author.full_name || author.username || 'Unknown'}
            </span>
          </div>
          <HashtagContent
            text={post.content || ''}
            className="text-sm font-canva-sans line-clamp-2 flex-1"
            style={{ color: 'var(--text-muted)' }}
          />
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{post.likes_count || 0}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{post.comments_count || 0}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ExploreProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {project.banner_image ? (
          <div className="h-36 relative overflow-hidden">
            <img src={project.banner_image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            {project.project_type && (
              <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full text-white bg-black/50 capitalize">
                {project.project_type?.replace('_', ' ')}
              </span>
            )}
          </div>
        ) : (
          <div
            className="h-36 relative flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--primary-orange), var(--accent-terracotta))' }}
          >
            <BookOpen className="w-10 h-10 text-white/60" />
            {project.project_type && (
              <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full text-white bg-black/30 capitalize">
                {project.project_type?.replace('_', ' ')}
              </span>
            )}
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col">
          <h4 className="font-semibold text-base font-roca-two mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
            {project.title}
          </h4>
          <p className="text-sm font-canva-sans mb-3 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)' }}>
            {project.summary || 'No description available'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}
              >
                {project.owner?.profile?.profile_picture ? (
                  <img src={project.owner.profile.profile_picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-xs">
                    {(project.owner?.profile?.full_name || project.owner?.username || 'U')[0]}
                  </span>
                )}
              </div>
              <span className="text-xs font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                {project.owner?.profile?.full_name || project.owner?.username || 'Unknown'}
              </span>
            </div>
            <span className="text-xs font-canva-sans" style={{ color: 'var(--text-muted)' }}>
              {project.team_count || 1} members
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────── */

function ExplorePageContent() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const feedEndRef = useRef<HTMLDivElement>(null);

  // UI state
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Discover mode state
  const [exploreFeed, setExploreFeed] = useState<FeedItem[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [explorePage, setExplorePage] = useState(1);
  const [exploreHasMore, setExploreHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Search mode state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchResults, setSearchResults] = useState<SearchResults>({ users: [], posts: [], projects: [], hashtags: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const isSearchMode = searchQuery.trim().length > 0;

  // ── Read ?q= from URL (e.g. from hashtag clicks) ──
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      setSearchType('posts');
    }
  }, [searchParams]);

  // ── Drag-to-scroll hook ──
  const useDragScroll = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const hasDragged = useRef(false);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
      if (!ref.current) return;
      isDragging.current = true;
      hasDragged.current = false;
      startX.current = e.pageX - ref.current.offsetLeft;
      scrollLeft.current = ref.current.scrollLeft;
      ref.current.style.cursor = 'grabbing';
      ref.current.style.userSelect = 'none';
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
      if (!isDragging.current || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      if (Math.abs(walk) > 3) hasDragged.current = true;
      ref.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    const onMouseUp = useCallback(() => {
      isDragging.current = false;
      if (ref.current) {
        ref.current.style.cursor = 'grab';
        ref.current.style.userSelect = '';
      }
    }, []);

    const onMouseLeave = useCallback(() => {
      isDragging.current = false;
      if (ref.current) {
        ref.current.style.cursor = 'grab';
        ref.current.style.userSelect = '';
      }
    }, []);

    return { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, hasDragged };
  };

  const usersDragScroll = useDragScroll();

  // ── Scroll to top ──
  useEffect(() => {
    const handleScroll = () => setShowScrollToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Load explore feed on mount ──
  useEffect(() => {
    const loadExplore = async () => {
      try {
        const data = await feedApi.getExploreFeed({ page: 1, page_size: 20 });
        setExploreFeed(data.feed.results || []);
        setExploreHasMore(data.feed.has_next);
        if (data.trending_topics) setTrendingTopics(data.trending_topics);
        if (data.categories) setCategories(data.categories);
        if (data.suggested_users) setSuggestedUsers(data.suggested_users as any);
      } catch (err) {
        console.error('Failed to load explore feed:', err);
      } finally {
        setExploreLoading(false);
      }
    };
    loadExplore();
  }, []);

  // ── Infinite scroll ──
  useEffect(() => {
    if (isSearchMode || !exploreHasMore || loadingMore) return;
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        loadMoreFeed();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchMode, exploreHasMore, loadingMore, explorePage]);

  const loadMoreFeed = useCallback(async () => {
    if (loadingMore || !exploreHasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = explorePage + 1;
      const data = await feedApi.getPublicFeed({ page: nextPage, page_size: 20 });
      setExploreFeed(prev => {
        const existingKeys = new Set(prev.map(i => `${i.content_type}-${i.content_id}`));
        const unique = (data.results || []).filter((i: FeedItem) => !existingKeys.has(`${i.content_type}-${i.content_id}`));
        return [...prev, ...unique];
      });
      setExploreHasMore(data.has_next);
      setExplorePage(nextPage);
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [explorePage, exploreHasMore, loadingMore]);

  // ── Search (debounced) ──
  const handleSearch = useCallback(async (query: string, type: SearchType, cat: string | null) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await api.get(
        `/api/accounts/search/?q=${encodeURIComponent(query)}&type=${type}${cat ? `&category=${encodeURIComponent(cat)}` : ''}`
      ) as any;
      setSearchResults({
        users: data.users || [],
        posts: data.posts || [],
        projects: data.projects || [],
        hashtags: data.hashtags || [],
      });
      setHasSearched(true);
    } catch {
      setSearchResults({ users: [], posts: [], projects: [], hashtags: [] });
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], posts: [], projects: [], hashtags: [] });
      setHasSearched(false);
      return;
    }
    const tid = setTimeout(() => handleSearch(searchQuery, searchType, activeCategory), 300);
    return () => clearTimeout(tid);
  }, [searchQuery, searchType, activeCategory, handleSearch]);

  // ── Follow toggle ──
  const handleFollowToggle = async (username: string, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        await api.delete(`/api/accounts/unfollow/${username}/`);
      } else {
        await api.post(`/api/accounts/follow/${username}/`);
      }
      // Update suggested users
      setSuggestedUsers(prev =>
        prev.map(u =>
          u.username === username
            ? { ...u, is_following: !isCurrentlyFollowing, followers_count: u.followers_count + (isCurrentlyFollowing ? -1 : 1) }
            : u
        )
      );
      // Update search results too
      setSearchResults(prev => ({
        ...prev,
        users: prev.users.map(u =>
          u.username === username
            ? { ...u, is_following: !isCurrentlyFollowing, followers_count: u.followers_count + (isCurrentlyFollowing ? -1 : 1) }
            : u
        ),
      }));
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  // ── Category filter for discover mode ──
  const filteredFeed = activeCategory
    ? exploreFeed.filter(item => {
        if (item.content_type === 'project') {
          const cats = item.content?.categories;
          return Array.isArray(cats) && cats.some((c: string) => c.toLowerCase().includes(activeCategory.toLowerCase()));
        }
        return true; // show all posts when filtering by category
      })
    : exploreFeed;

  const totalSearchResults = searchResults.users.length + searchResults.posts.length + searchResults.projects.length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-all duration-300 ease-in-out" style={{ backgroundColor: 'var(--background)' }}>
        {/* Mobile Header */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-lg"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid var(--border)' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6" style={{ color: 'var(--primary-orange)' }} />
            <span className="font-bold text-lg font-roca-two" style={{ color: 'var(--text-primary)' }}>Explore</span>
          </div>
          <div className="w-10" />
        </motion.div>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-w-0 min-h-screen pt-16 lg:pt-0 lg:mr-72 xl:mr-80 flex overflow-hidden"
          >
            <div className="flex-1 min-w-0 max-w-none px-4 lg:px-8 xl:px-12 py-6 lg:py-8">
              <div className="max-w-5xl mx-auto">

                {/* ── Search Bar ─────────────────────────────────────── */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users, projects, tags, categories..."
                      className="block w-full pl-12 pr-12 py-3.5 rounded-2xl font-canva-sans text-base transition-all duration-300 focus:ring-2 focus:ring-opacity-50 focus:ring-orange-500 shadow-md hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--surface)',
                        border: '2px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => { setSearchQuery(''); setHasSearched(false); }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      </button>
                    )}
                  </div>

                  {/* Search type tabs — only in search mode */}
                  {isSearchMode && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {([
                        { type: 'all', label: 'All', icon: Grid3X3 },
                        { type: 'users', label: 'Users', icon: Users },
                        { type: 'projects', label: 'Projects', icon: BookOpen },
                        { type: 'posts', label: 'Posts', icon: MessageSquare },
                        { type: 'hashtags', label: 'Hashtags', icon: Hash },
                      ] as const).map(({ type, label, icon: Icon }) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSearchType(type)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${searchType === type ? 'shadow-md' : ''}`}
                          style={{
                            backgroundColor: searchType === type ? 'var(--primary-orange)' : 'var(--hover-bg)',
                            color: searchType === type ? 'white' : 'var(--text-secondary)',
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* ── Content Area ───────────────────────────────────── */}
                <AnimatePresence mode="wait">
                  {isSearchMode ? (
                    /* ═══ SEARCH MODE ═══ */
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-20">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="w-12 h-12 rounded-full border-4 border-transparent"
                            style={{ borderTopColor: 'var(--primary-orange)', borderRightColor: 'var(--accent-terracotta)' }}
                          />
                          <p className="mt-4 text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Searching...</p>
                        </div>
                      ) : hasSearched ? (
                        <div className="space-y-8">
                          <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                            Found {totalSearchResults} results for &quot;{searchQuery}&quot;
                          </div>

                          {/* Projects results */}
                          {(searchType === 'all' || searchType === 'projects') && searchResults.projects.length > 0 && (
                            <section>
                              <h3 className="text-lg font-semibold font-roca-two flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)' }}>
                                <BookOpen className="w-5 h-5" /> Projects ({searchResults.projects.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.projects.map((project) => (
                                  <ExploreProjectCard key={project.id} project={project} />
                                ))}
                              </div>
                            </section>
                          )}

                          {/* Users results */}
                          {(searchType === 'all' || searchType === 'users') && searchResults.users.length > 0 && (
                            <section>
                              <h3 className="text-lg font-semibold font-roca-two flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)' }}>
                                <Users className="w-5 h-5" /> People ({searchResults.users.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.users.map((searchUser) => (
                                  <motion.div
                                    key={searchUser.id}
                                    whileHover={{ y: -3 }}
                                    className="p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                  >
                                    <div className="text-center">
                                      <div
                                        className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center overflow-hidden shadow-md"
                                        style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}
                                      >
                                        {searchUser.profile_picture ? (
                                          <img src={searchUser.profile_picture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-white font-semibold text-xl font-roca-two">
                                            {(searchUser.full_name || searchUser.username || 'U')[0].toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="font-semibold text-base font-roca-two mb-0.5" style={{ color: 'var(--text-primary)' }}>
                                        {searchUser.full_name || searchUser.username}
                                      </h4>
                                      <p className="text-xs font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        @{searchUser.username}
                                      </p>
                                      <span
                                        className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-3 capitalize"
                                        style={{
                                          backgroundColor:
                                            searchUser.user_role === 'student' ? 'var(--accent-pine)' :
                                            searchUser.user_role === 'professor' ? 'var(--accent-navy)' :
                                            'var(--accent-terracotta)',
                                          color: 'white',
                                        }}
                                      >
                                        {searchUser.user_role}
                                      </span>
                                      {searchUser.bio && (
                                        <p className="text-xs font-canva-sans mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                                          {searchUser.bio}
                                        </p>
                                      )}
                                      <div className="flex justify-center gap-2">
                                        {user && searchUser.username !== user.username && (
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => { e.preventDefault(); handleFollowToggle(searchUser.username, searchUser.is_following); }}
                                            className="px-4 py-1.5 rounded-lg font-medium text-sm transition-all"
                                            style={{
                                              backgroundColor: searchUser.is_following ? 'var(--hover-bg)' : 'var(--primary-orange)',
                                              color: searchUser.is_following ? 'var(--text-primary)' : 'white',
                                              border: searchUser.is_following ? '1px solid var(--border)' : 'none',
                                            }}
                                          >
                                            {searchUser.is_following ? 'Following' : 'Follow'}
                                          </motion.button>
                                        )}
                                        <Link
                                          href={`/profiles/${searchUser.username}`}
                                          className="px-4 py-1.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
                                          style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                        >
                                          View
                                        </Link>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </section>
                          )}

                          {/* Posts results */}
                          {(searchType === 'all' || searchType === 'posts') && searchResults.posts.length > 0 && (
                            <section>
                              <h3 className="text-lg font-semibold font-roca-two flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)' }}>
                                <MessageSquare className="w-5 h-5" /> Posts ({searchResults.posts.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.posts.map((post) => (
                                  <ExplorePostCard key={post.id} post={post} />
                                ))}
                              </div>
                            </section>
                          )}

                          {/* Hashtags results */}
                          {(searchType === 'all' || searchType === 'hashtags') && searchResults.hashtags.length > 0 && (
                            <section>
                              <h3 className="text-lg font-semibold font-roca-two flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)' }}>
                                <Hash className="w-5 h-5" /> Hashtags ({searchResults.hashtags.length})
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {searchResults.hashtags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => setSearchQuery(`#${tag}`)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                                    style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--primary-orange)' }}
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </section>
                          )}

                          {/* No results */}
                          {totalSearchResults === 0 && searchResults.hashtags.length === 0 && (
                            <div className="text-center py-16">
                              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
                                <Search className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                              </div>
                              <h3 className="text-xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                                No Results Found
                              </h3>
                              <p className="text-base font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                                Try different keywords or check your spelling.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </motion.div>
                  ) : (
                    /* ═══ DISCOVER MODE ═══ */
                    <motion.div
                      key="discover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {exploreLoading ? (
                        <ExplorePageSkeleton />
                      ) : (
                        <div className="space-y-6">

                          {/* Trending Topics */}
                          {trendingTopics.length > 0 && (
                            <section>
                              <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary-orange)' }} />
                                <h3 className="text-sm font-semibold font-roca-two" style={{ color: 'var(--text-secondary)' }}>Trending</h3>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {trendingTopics.map((t) => (
                                  <button
                                    key={t.topic}
                                    onClick={() => setSearchQuery(`#${t.topic}`)}
                                    className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium font-canva-sans transition-all hover:scale-105 hover:shadow-md"
                                    style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--primary-orange)' }}
                                  >
                                    #{t.topic}
                                  </button>
                                ))}
                              </div>
                            </section>
                          )}

                          {/* Category Filter Pills */}
                          {categories.length > 0 && (
                            <section>
                              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                  onClick={() => setActiveCategory(null)}
                                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium font-canva-sans transition-all ${!activeCategory ? 'shadow-md' : ''}`}
                                  style={{
                                    backgroundColor: !activeCategory ? 'var(--primary-orange)' : 'var(--hover-bg)',
                                    color: !activeCategory ? 'white' : 'var(--text-secondary)',
                                  }}
                                >
                                  All
                                </button>
                                {categories.map((cat) => (
                                  <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium font-canva-sans transition-all ${activeCategory === cat.name ? 'shadow-md' : ''}`}
                                    style={{
                                      backgroundColor: activeCategory === cat.name ? 'var(--primary-orange)' : 'var(--hover-bg)',
                                      color: activeCategory === cat.name ? 'white' : 'var(--text-secondary)',
                                    }}
                                  >
                                    {cat.name}
                                  </button>
                                ))}
                              </div>
                            </section>
                          )}

                          {/* Suggested Users Carousel — drag to scroll */}
                          {suggestedUsers.length > 0 && (
                            <section>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold font-roca-two flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                  <Users className="w-4 h-4" /> Suggested for you
                                </h3>
                              </div>
                              <div
                                ref={usersDragScroll.ref}
                                onMouseDown={usersDragScroll.onMouseDown}
                                onMouseMove={usersDragScroll.onMouseMove}
                                onMouseUp={usersDragScroll.onMouseUp}
                                onMouseLeave={usersDragScroll.onMouseLeave}
                                className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                                style={{ cursor: 'grab' }}
                              >
                                {suggestedUsers.map((su) => (
                                  <div
                                    key={su.id}
                                    onClick={() => {
                                      if (!usersDragScroll.hasDragged.current) {
                                        router.push(`/profiles/${su.username}`);
                                      }
                                    }}
                                    className="shrink-0 w-28 sm:w-32 rounded-2xl border p-3 text-center transition-all hover:shadow-lg cursor-pointer select-none"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                  >
                                    <div
                                      className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center overflow-hidden"
                                      style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}
                                    >
                                      {su.profile_picture ? (
                                        <img src={su.profile_picture} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                      ) : (
                                        <span className="text-white font-semibold text-lg font-roca-two">
                                          {(su.full_name || su.username || 'U')[0].toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs font-semibold font-canva-sans truncate" style={{ color: 'var(--text-primary)' }}>
                                      {su.full_name || su.username}
                                    </p>
                                    <p className="text-xs font-canva-sans truncate mb-2 capitalize" style={{ color: 'var(--text-muted)' }}>
                                      {su.user_role}
                                    </p>
                                    {user && su.username !== user.username && (
                                      <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => { e.stopPropagation(); handleFollowToggle(su.username, su.is_following); }}
                                        className="w-full py-1 rounded-lg text-xs font-medium transition-all"
                                        style={{
                                          backgroundColor: su.is_following ? 'var(--hover-bg)' : 'var(--primary-orange)',
                                          color: su.is_following ? 'var(--text-primary)' : 'white',
                                          border: su.is_following ? '1px solid var(--border)' : 'none',
                                        }}
                                      >
                                        {su.is_following ? 'Following' : 'Follow'}
                                      </motion.button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </section>
                          )}

                          {/* ── Discover Grid ───────────────────────────── */}
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-orange)' }} />
                              <h3 className="text-sm font-semibold font-roca-two" style={{ color: 'var(--text-secondary)' }}>
                                {activeCategory ? `${activeCategory} projects & posts` : 'Discover'}
                              </h3>
                            </div>

                            {filteredFeed.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredFeed.map((item, index) => (
                                  <motion.div
                                    key={`${item.content_type}-${item.content_id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                                  >
                                    {item.content_type === 'post' ? (
                                      <ExplorePostCard post={item.content} />
                                    ) : (
                                      <ExploreProjectCard project={item.content} />
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <Compass className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                                <p className="text-base font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                                  {activeCategory ? `No content found for "${activeCategory}"` : 'Nothing to explore yet. Check back soon!'}
                                </p>
                                {activeCategory && (
                                  <button
                                    onClick={() => setActiveCategory(null)}
                                    className="mt-3 px-4 py-2 rounded-xl text-sm font-medium text-white"
                                    style={{ backgroundColor: 'var(--primary-orange)' }}
                                  >
                                    Clear filter
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Loading more indicator */}
                            {loadingMore && (
                              <div className="flex justify-center py-8">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                  className="w-8 h-8 rounded-full border-3 border-transparent"
                                  style={{ borderTopColor: 'var(--primary-orange)', borderWidth: 3 }}
                                />
                              </div>
                            )}

                            {!exploreHasMore && filteredFeed.length > 0 && (
                              <p className="text-center text-sm font-canva-sans py-8" style={{ color: 'var(--text-muted)' }}>
                                You&apos;ve seen it all!
                              </p>
                            )}
                          </section>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block fixed right-0 top-0 h-screen" style={{ backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>
              <RightSidebar />
            </div>
          </motion.div>
        </div>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 lg:left-[17rem] xl:left-[19rem] z-50 w-12 h-12 text-white rounded-full shadow-xl"
              style={{ backgroundColor: 'var(--accent-pine)' }}
            >
              <ArrowUp className="w-6 h-6 mx-auto" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setShowMobileNav(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExplorePageContent />
    </Suspense>
  );
}
