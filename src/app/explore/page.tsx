'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, Users, BookOpen, Hash, ArrowUp, Sparkles, MessageSquare, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '../components/LeftNavigation';
import RightSidebar from '../components/RightSidebar';
import { ThemeToggle, useTheme } from '../components/ThemeProvider';
import { api } from '@/lib/api';

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
  linkedin_url?: string;
  website_url?: string;
  github_url?: string;
}

interface Post {
  id: string;
  user: {
    username: string;
    full_name: string;
    profile_picture?: string;
  };
  author?: {
    username: string;
    full_name: string;
    profile_picture?: string;
    user_role: string;
    university_name: string;
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
  team_count: number;
  created_at: string;
  owner: {
    username: string;
    full_name: string;
    profile: {
      full_name: string;
      profile_picture?: string;
    };
  };
}

interface SearchResults {
  users: User[];
  posts: Post[];
  projects: Project[];
  hashtags: string[];
}

type SearchType = 'all' | 'users' | 'posts' | 'projects' | 'hashtags';

export default function ExplorePage() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    users: [],
    posts: [],
    projects: [],
    hashtags: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('recent');

  // Redirect investors to their dedicated dashboard
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push('/investors');
    }
  }, [user, router]);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ users: [], posts: [], projects: [], hashtags: [] });
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      // Use the comprehensive search API
      const searchData = await api.get(`/api/accounts/search/?q=${encodeURIComponent(query)}&type=${searchType}`) as { users?: User[], posts?: any[], projects?: any[], hashtags?: string[] };
      
      setSearchResults({
        users: searchData.users || [],
        posts: searchData.posts || [],
        projects: searchData.projects || [],
        hashtags: searchData.hashtags || []
      });
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to individual APIs if comprehensive search fails
      try {
        const usersData = await api.get(`/api/accounts/search/users/?q=${encodeURIComponent(query)}`) as { results?: User[] };
        setSearchResults({
          users: usersData.results || [],
          posts: [],
          projects: [],
          hashtags: []
        });
      } catch (e) {
        setSearchResults({ users: [], posts: [], projects: [], hashtags: [] });
      }
      setHasSearched(true);
    }
    setIsSearching(false);
  };

  const handleFollowToggle = async (username: string, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        await api.delete(`/api/accounts/unfollow/${username}/`);
      } else {
        await api.post(`/api/accounts/follow/${username}/`);
      }
      
      // Update the search results
      setSearchResults(prev => ({
        ...prev,
        users: prev.users.map(searchUser => 
          searchUser.username === username 
            ? { 
                ...searchUser, 
              is_following: !isCurrentlyFollowing,
                followers_count: searchUser.followers_count + (isCurrentlyFollowing ? -1 : 1)
            }
            : searchUser
        )
      }));
    } catch (error) {
      console.error('Follow/unfollow error:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <ProtectedRoute>
        <div className="min-h-screen transition-all duration-300 ease-in-out" style={{backgroundColor: 'var(--background)'}}>
          {/* Mobile Header */}
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-lg" 
            style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid var(--border)'}}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileNav(true)}
              className="p-2 rounded-lg transition-all duration-200"
              style={{color: 'var(--text-primary)'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-6 h-6" style={{color: 'var(--primary-orange)'}} />
              <span className="font-bold text-lg font-roca-two" style={{color: 'var(--text-primary)'}}>Explore</span>
            </motion.div>

            <div className="w-10"></div>
          </motion.div>

          {/* Main Layout */}
          <div className="flex min-h-screen">
            {/* Left Navigation */}
            <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />

            {/* Main Content Area - Instagram Style Explore */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80 flex"
            >
              {/* Main Explore Content */}
              <div className="flex-1 min-w-0 max-w-none px-4 lg:px-8 xl:px-12 py-6 lg:py-8">
                <div className="max-w-4xl mx-auto">
                  {/* Header with Search */}
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8 space-y-6"
                  >
                    {/* Title */}
                    <div className="text-center lg:text-left">
                      <h1 className="text-4xl font-bold font-roca-two mb-3 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        Explore EntreHive
                      </h1>
                      <p className="text-lg font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                        Discover amazing people, innovative projects, and inspiring content
                      </p>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6" style={{color: 'var(--text-muted)'}} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for users, projects, posts, or #hashtags..."
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl font-canva-sans text-lg transition-all duration-300 focus:ring-2 focus:ring-opacity-50 placeholder:text-gray-500 focus:ring-orange-500 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: 'var(--surface)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-xl transition-all duration-200"
                          style={{backgroundColor: 'var(--primary-orange)'}}
                        >
                          <Filter className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Search Type Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {[
                        { type: 'all', label: 'All', icon: Grid3X3 },
                        { type: 'users', label: 'Users', icon: Users },
                        { type: 'projects', label: 'Projects', icon: BookOpen },
                        { type: 'posts', label: 'Posts', icon: Search },
                        { type: 'hashtags', label: 'Hashtags', icon: Hash },
                      ].map(({ type, label, icon: Icon }) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSearchType(type as SearchType)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                            searchType === type ? 'shadow-lg' : ''
                          }`}
                          style={{
                            backgroundColor: searchType === type ? 'var(--primary-orange)' : 'var(--hover-bg)',
                            color: searchType === type ? 'white' : 'var(--text-secondary)'
                          }}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Content Area */}
                  <AnimatePresence mode="wait">
                    {isSearching ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 rounded-full border-4 border-transparent"
                            style={{ 
                              borderTopColor: 'var(--primary-orange)',
                              borderRightColor: 'var(--accent-terracotta)'
                            }}
                          />
                          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 opacity-20 animate-pulse"></div>
                        </div>
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 text-center"
                        >
                          <h3 className="text-xl font-semibold font-roca-two mb-2" style={{color: 'var(--text-primary)'}}>
                            Searching the Hive...
                          </h3>
                          <p className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                            Finding amazing content for you
                          </p>
                        </motion.div>
                      </motion.div>
                    ) : hasSearched ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="space-y-8">
                          {/* Filter Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-semibold font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                                Sort by:
                              </span>
                              <select 
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg text-sm border transition-all duration-200"
                                style={{
                                  backgroundColor: 'var(--surface)',
                                  borderColor: 'var(--border)',
                                  color: 'var(--text-primary)'
                                }}
                              >
                                <option value="recent">Most Recent</option>
                                <option value="popular">Most Popular</option>
                                <option value="relevant">Most Relevant</option>
                              </select>
                            </div>
                            
                            <div className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                              Found {searchResults.users.length + searchResults.posts.length + searchResults.projects.length} results
                            </div>
                          </div>

                          {/* Projects Section */}
                          {(searchType === 'all' || searchType === 'projects') && searchResults.projects.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold font-roca-two flex items-center gap-2" style={{color: 'var(--text-primary)'}}>
                                  <BookOpen className="w-5 h-5" />
                                  Projects ({searchResults.projects.length})
                                </h3>
                                {searchType === 'all' && searchResults.projects.length > 6 && (
                                  <button
                                    onClick={() => setSearchType('projects')}
                                    className="text-sm font-medium transition-colors"
                                    style={{color: 'var(--primary-orange)'}}
                                  >
                                    View All
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(searchType === 'all' ? searchResults.projects.slice(0, 6) : searchResults.projects).map((project, index) => (
                                  <Link href={`/projects/${project.id}`} key={project.id}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      whileHover={{ y: -5 }}
                                      className="rounded-2xl border transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
                                      style={{
                                        backgroundColor: 'var(--surface)',
                                        borderColor: 'var(--border)'
                                      }}
                                    >
                                    {/* Project Banner */}
                                    {project.banner_image ? (
                                      <div
                                        className="h-32 relative"
                                        style={{
                                          backgroundImage: `url(${project.banner_image})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center'
                                        }}
                                      >
                                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                        {project.project_type && (
                                          <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full text-white bg-black bg-opacity-50 capitalize">
                                              {project.project_type}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div
                                        className="h-32 relative flex items-center justify-center"
                                        style={{
                                          background: 'linear-gradient(135deg, var(--primary-orange), var(--accent-terracotta))'
                                        }}
                                      >
                                        <div className="text-white text-center px-4">
                                          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-80" />
                                          <p className="text-sm font-semibold opacity-90">{project.title}</p>
                                        </div>
                                        {project.project_type && (
                                          <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full text-white bg-black bg-opacity-30 capitalize">
                                              {project.project_type}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <div className="p-4">
                                      <h4 className="font-semibold text-lg font-roca-two mb-2 line-clamp-1" style={{color: 'var(--text-primary)'}}>
                                        {project.title}
                                      </h4>

                                      <p className="text-sm font-canva-sans mb-3 line-clamp-2" style={{color: 'var(--text-muted)'}}>
                                        {project.summary || 'No description available'}
                                      </p>

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                                               style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}>
                                            {project.owner?.profile?.profile_picture ? (
                                              <img
                                                src={project.owner.profile.profile_picture}
                                                alt={project.owner.profile.full_name || project.owner.username}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <span className="text-white font-semibold text-xs">
                                                {project.owner?.profile?.full_name?.[0] || project.owner?.username?.[0] || 'U'}
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-xs font-canva-sans" style={{color: 'var(--text-secondary)'}}>
                                            {project.owner?.profile?.full_name || project.owner?.username || 'Unknown'}
                                          </span>
                                        </div>

                                        <div className="text-xs font-canva-sans" style={{color: 'var(--text-muted)'}}>
                                          {project.team_count || 1} members
                                        </div>
                                      </div>
                                    </div>
                                    </motion.div>
                                  </Link>
                                ))}
          </div>
                            </motion.div>
                          )}

                          {/* Users Section */}
                          {(searchType === 'all' || searchType === 'users') && searchResults.users.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold font-roca-two flex items-center gap-2" style={{color: 'var(--text-primary)'}}>
                                  <Users className="w-5 h-5" />
                                  People ({searchResults.users.length})
                                </h3>
                                {searchType === 'all' && searchResults.users.length > 3 && (
                                  <button
                                    onClick={() => setSearchType('users')}
                                    className="text-sm font-medium transition-colors"
                                    style={{color: 'var(--primary-orange)'}}
                                  >
                                    View All
                                  </button>
                                )}
                </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(searchType === 'all' ? searchResults.users.slice(0, 3) : searchResults.users).map((searchUser, index) => (
                                  <motion.div
                      key={searchUser.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                                    <div className="text-center">
                                      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center overflow-hidden shadow-lg" 
                               style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}>
                            {searchUser.profile_picture ? (
                                          <img
                                            src={searchUser.profile_picture}
                                            alt={searchUser.full_name}
                                            className="w-full h-full object-cover"
                              />
                            ) : (
                                          <span className="text-white font-semibold text-2xl font-roca-two">
                                {searchUser.full_name?.[0]?.toUpperCase() || searchUser.username?.[0]?.toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>

                                      <h4 className="font-semibold text-lg font-roca-two mb-1" style={{color: 'var(--text-primary)'}}>
                                {searchUser.full_name || searchUser.username}
                                      </h4>
                                      <p className="text-sm font-canva-sans mb-2" style={{color: 'var(--text-secondary)'}}>
                                        @{searchUser.username}
                                      </p>
                                      
                              <span
                                        className="inline-block px-3 py-1 text-xs font-medium font-canva-sans rounded-full mb-3"
                                style={{
                                  backgroundColor: searchUser.user_role === 'student' ? 'var(--accent-pine)' : 
                                                   searchUser.user_role === 'professor' ? 'var(--accent-navy)' : 'var(--accent-terracotta)',
                                  color: 'white'
                                }}
                              >
                                {searchUser.user_role}
                              </span>
                                      
                            {searchUser.bio && (
                                        <p className="text-sm font-canva-sans mb-4 line-clamp-2" style={{color: 'var(--text-muted)'}}>
                                          {searchUser.bio}
                              </p>
                            )}
                                      
                                      <div className="flex justify-center gap-2">
                          {user && searchUser.username !== user.username && (
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                              onClick={() => handleFollowToggle(searchUser.username, searchUser.is_following)}
                                            className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
                              style={{
                                              backgroundColor: searchUser.is_following ? 'var(--hover-bg)' : 'var(--primary-orange)',
                                color: searchUser.is_following ? 'var(--text-primary)' : 'white',
                                              border: searchUser.is_following ? '1px solid var(--border)' : 'none'
                              }}
                            >
                              {searchUser.is_following ? 'Following' : 'Follow'}
                                          </motion.button>
                          )}

                                        <Link
                            href={`/profiles/${searchUser.username}`}
                                          className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
                            style={{
                              backgroundColor: 'var(--hover-bg)',
                              color: 'var(--text-primary)',
                                            border: '1px solid var(--border)'
                            }}
                          >
                                          View
                                        </Link>
                        </div>
                      </div>
                                  </motion.div>
                  ))}
                </div>
                            </motion.div>
                          )}

                          {/* Posts Section */}
                          {(searchType === 'all' || searchType === 'posts') && searchResults.posts.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold font-roca-two flex items-center gap-2" style={{color: 'var(--text-primary)'}}>
                                  <MessageSquare className="w-5 h-5" />
                                  Posts ({searchResults.posts.length})
                                </h3>
                                {searchType === 'all' && searchResults.posts.length > 9 && (
                                  <button
                                    onClick={() => setSearchType('posts')}
                                    className="text-sm font-medium transition-colors"
                                    style={{color: 'var(--primary-orange)'}}
                                  >
                                    View All
                                  </button>
              )}
            </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(searchType === 'all' ? searchResults.posts.slice(0, 9) : searchResults.posts).map((post, index) => {
                                  const truncateText = (text: string, maxLength: number) => {
                                    if (!text) return "No content available";
                                    const words = text.split(' ');
                                    if (words.length <= maxLength) return text;
                                    return words.slice(0, maxLength).join(' ') + '...';
                                  };

                                  return (
                                  <Link href={`/posts/${post.id}`} key={post.id}>
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.05 }}
                                      whileHover={{ y: -4, scale: 1.02 }}
                                      className="rounded-xl border transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
                                      style={{
                                        backgroundColor: 'var(--surface)',
                                        borderColor: 'var(--border)'
                                      }}
                                    >
                                      {post.image_url ? (
                                        <div className="relative">
                                          <img
                                            src={post.image_url}
                                            alt="Post content"
                                            className="w-full h-48 object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        </div>
                                      ) : null}

                                      <div className="p-4">
                                        {/* Author info */}
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                                               style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}>
                                            {(post.author?.profile_picture || post.user?.profile_picture) ? (
                                              <img
                                                src={post.author?.profile_picture || post.user?.profile_picture}
                                                alt={post.author?.full_name || post.user?.full_name}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <span className="text-white font-semibold text-xs">
                                                {(post.author?.full_name || post.user?.full_name)?.[0] || (post.author?.username || post.user?.username)?.[0] || 'U'}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold font-canva-sans truncate" style={{color: 'var(--text-primary)'}}>
                                              {post.author?.full_name || post.user?.full_name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs font-canva-sans truncate" style={{color: 'var(--text-secondary)'}}>
                                              @{post.author?.username || post.user?.username || 'unknown'}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Post content */}
                                        <p className="text-sm font-canva-sans mb-3 line-clamp-3" style={{color: 'var(--text-muted)'}}>
                                          {truncateText(post.content, 20)}
                                        </p>

                                        {/* Engagement stats */}
                                        <div className="flex items-center gap-4 text-sm" style={{color: 'var(--text-secondary)'}}>
                                          <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {post.likes_count}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            {post.comments_count}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}

                          {/* No Results */}
                          {searchResults.users.length === 0 && 
                           searchResults.posts.length === 0 && 
                           searchResults.projects.length === 0 && 
                           searchResults.hashtags.length === 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center py-16"
                            >
                              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--hover-bg)'}}>
                                <Search className="w-12 h-12" style={{color: 'var(--text-muted)'}} />
                              </div>
                              <h3 className="text-2xl font-bold font-roca-two mb-3" style={{color: 'var(--text-primary)'}}>
                                No Results Found
                </h3>
                              <p className="text-lg font-canva-sans mb-6" style={{color: 'var(--text-secondary)'}}>
                                No results found for &quot;{searchQuery}&quot;. Try different keywords or check your spelling.
                              </p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSearchQuery('');
                                  setHasSearched(false);
                                }}
                                className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200"
                                style={{backgroundColor: 'var(--primary-orange)'}}
                              >
                                Clear Search
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-400 shadow-2xl"
                        >
                          <Sparkles className="w-16 h-16 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold font-roca-two mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                          Start Exploring
                        </h2>
                        <p className="text-xl font-canva-sans max-w-2xl mx-auto" style={{color: 'var(--text-secondary)'}}>
                          Discover incredible entrepreneurs, groundbreaking projects, and inspiring stories. 
                          Use the search bar above to find exactly what you&apos;re looking for.
                        </p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
                        >
                          {[
                            { icon: Users, label: 'Amazing People', color: 'var(--accent-pine)' },
                            { icon: BookOpen, label: 'Cool Projects', color: 'var(--primary-orange)' },
                            { icon: Search, label: 'Inspiring Posts', color: 'var(--accent-terracotta)' },
                            { icon: Hash, label: 'Trending Topics', color: 'var(--accent-navy)' }
                          ].map(({ icon: Icon, label, color }, index) => (
                            <motion.div
                              key={label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="p-4 rounded-xl text-center transition-all duration-300 hover:scale-105"
                              style={{backgroundColor: 'var(--hover-bg)'}}
                            >
                              <Icon className="w-8 h-8 mx-auto mb-2" style={{color}} />
                              <p className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>{label}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Sidebar - Scrollable */}
              {/* Right Sidebar - Fixed on desktop */}
              <div className="hidden lg:block fixed right-0 top-0 h-screen" style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
                <RightSidebar />
              </div>
            </motion.div>
          </div>

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollToTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="fixed bottom-6 left-6 z-50 w-12 h-12 text-white rounded-full shadow-xl transition-all duration-200 backdrop-blur-sm"
                style={{backgroundColor: 'var(--accent-pine)'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-charcoal)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-pine)'}
              >
                <ArrowUp className="w-6 h-6 mx-auto" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile Navigation */}
          <div className={`
            lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
            ${showMobileNav ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex flex-col h-full shadow-xl relative overflow-hidden" style={{backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)'}}>
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-4 py-4 relative z-10" style={{borderBottom: '1px solid var(--border)'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
                    <Image
                      src="/Logoblacktransparent.png"
                      alt="EntreHive Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <span className="font-bold text-lg font-roca-two" style={{color: 'var(--text-primary)'}}>EntreHive</span>
                </div>
                <button
                  onClick={() => setShowMobileNav(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10">
                {[
                  { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/feed' },
                  { id: 'explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', href: '/explore' },
                  { id: 'projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/projects' },
                  { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setShowMobileNav(false)}
                    className={`
                      group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200
                    `}
                    style={{
                      backgroundColor: item.id === 'explore' ? 'var(--active-bg)' : 'transparent',
                      color: item.id === 'explore' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      if (item.id !== 'explore') {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.id !== 'explore') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <svg
                      className={`mr-3 h-5 w-5`}
                      style={{
                        color: item.id === 'explore' ? 'var(--primary-orange)' : 'var(--text-muted)'
                      }}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                      <path d={item.icon} />
              </svg>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Overlay for mobile panels */}
          <AnimatePresence>
            {showMobileNav && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 lg:hidden"
                style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                onClick={() => {
                  setShowMobileNav(false);
                }}
              />
            )}
          </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
