'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ConditionalLayout from '../components/ConditionalLayout';
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

interface SearchResult {
  results: User[];
  count: number;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const data: SearchResult = await api.get(`/api/accounts/search/users/?q=${encodeURIComponent(query)}`);
      setSearchResults(data.results || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
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
      setSearchResults(prev => prev.map(user => 
        user.username === username 
          ? { 
              ...user, 
              is_following: !isCurrentlyFollowing,
              followers_count: user.followers_count + (isCurrentlyFollowing ? -1 : 1)
            }
          : user
      ));
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
    <ConditionalLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
            Explore
          </h1>
          <p className="text-lg font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
            Discover users, projects, and posts in the EntreHive community
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5"
                style={{ color: 'var(--text-muted)' }}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for users, projects, posts, or hashtags..."
              className="block w-full pl-10 pr-3 py-4 rounded-xl font-canva-sans text-lg transition-all duration-200 focus:ring-2 focus:ring-opacity-50 placeholder:text-gray-500 focus:ring-orange-500"
              style={{
                backgroundColor: 'var(--surface)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-orange)' }}></div>
            <span className="ml-3 font-canva-sans" style={{ color: 'var(--text-secondary)' }}>Searching...</span>
          </div>
        )}

        {hasSearched && !isSearching && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold font-roca-two mb-4" style={{ color: 'var(--text-primary)' }}>
                Users ({searchResults.length})
              </h2>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-16 w-16 mb-4"
                    style={{ color: 'var(--text-muted)' }}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    No users found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map((searchUser) => (
                    <div
                      key={searchUser.id}
                      className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Profile Picture */}
                          <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" 
                               style={{ background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))' }}>
                            {searchUser.profile_picture ? (
                              <div 
                                className="w-full h-full object-cover bg-cover bg-center"
                                style={{ backgroundImage: `url(${searchUser.profile_picture})` }}
                                aria-label={searchUser.full_name}
                              />
                            ) : (
                              <span className="text-white font-semibold text-xl font-roca-two">
                                {searchUser.full_name?.[0]?.toUpperCase() || searchUser.username?.[0]?.toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg font-roca-two truncate" style={{ color: 'var(--text-primary)' }}>
                                {searchUser.full_name || searchUser.username}
                              </h3>
                              <span
                                className="px-2 py-1 text-xs font-medium font-canva-sans rounded-full"
                                style={{
                                  backgroundColor: searchUser.user_role === 'student' ? 'var(--accent-pine)' : 
                                                   searchUser.user_role === 'professor' ? 'var(--accent-navy)' : 'var(--accent-terracotta)',
                                  color: 'white'
                                }}
                              >
                                {searchUser.user_role}
                              </span>
                            </div>
                            <p className="text-sm font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                              @{searchUser.username}
                            </p>
                            {searchUser.bio && (
                              <p className="text-sm font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                                {searchUser.bio.length > 150 ? `${searchUser.bio.substring(0, 150)}...` : searchUser.bio}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
                              {searchUser.location && (
                                <span>📍 {searchUser.location}</span>
                              )}
                              {searchUser.university_name && (
                                <span>🎓 {searchUser.university_name}</span>
                              )}
                              <span>{searchUser.followers_count} followers</span>
                              <span>{searchUser.following_count} following</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          {/* Social Links */}
                          <div className="flex space-x-2">
                            {searchUser.linkedin_url && (
                              <a
                                href={searchUser.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg transition-colors"
                                style={{ backgroundColor: 'var(--hover-bg)' }}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </a>
                            )}
                            {searchUser.github_url && (
                              <a
                                href={searchUser.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg transition-colors"
                                style={{ backgroundColor: 'var(--hover-bg)' }}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </a>
                            )}
                            {searchUser.website_url && (
                              <a
                                href={searchUser.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg transition-colors"
                                style={{ backgroundColor: 'var(--hover-bg)' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>

                          {/* Follow Button */}
                          {user && searchUser.username !== user.username && (
                            <button
                              onClick={() => handleFollowToggle(searchUser.username, searchUser.is_following)}
                              className="px-4 py-2 rounded-lg font-medium font-canva-sans transition-all duration-200 hover:shadow-md"
                              style={{
                                backgroundColor: searchUser.is_following ? 'var(--surface)' : 'var(--primary-orange)',
                                color: searchUser.is_following ? 'var(--text-primary)' : 'white',
                                border: searchUser.is_following ? '2px solid var(--border)' : 'none'
                              }}
                            >
                              {searchUser.is_following ? 'Following' : 'Follow'}
                            </button>
                          )}

                          {/* View Profile Button */}
                          <a
                            href={`/profiles/${searchUser.username}`}
                            className="px-4 py-2 rounded-lg font-medium font-canva-sans transition-all duration-200 hover:shadow-md"
                            style={{
                              backgroundColor: 'var(--hover-bg)',
                              color: 'var(--text-primary)',
                              border: '2px solid var(--border)'
                            }}
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Future sections for projects, posts, hashtags */}
            <div className="mt-12 space-y-8">
              <div className="text-center py-8 px-4 rounded-xl" style={{ backgroundColor: 'var(--hover-bg)' }}>
                <h3 className="text-lg font-semibold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
                  Coming Soon
                </h3>
                <p className="font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  Search for projects, posts, and hashtags will be available soon!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Default state when no search */}
        {!hasSearched && !isSearching && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary-orange)' }}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-roca-two mb-3" style={{ color: 'var(--text-primary)' }}>
              Start Exploring
            </h2>
            <p className="text-lg font-canva-sans max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Use the search bar above to discover amazing people, innovative projects, and inspiring content in the EntreHive community.
            </p>
          </div>
        )}
      </div>
    </ConditionalLayout>
  );
}
