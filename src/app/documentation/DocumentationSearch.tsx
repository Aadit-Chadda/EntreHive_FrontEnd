'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchResult {
  category: string;
  section: string;
  preview: string;
  sectionId: string;
}

interface DocumentationSearchProps {
  onResultClick: (sectionId: string) => void;
}

const DocumentationSearch: React.FC<DocumentationSearchProps> = ({ onResultClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search index - all searchable content
  const searchIndex: SearchResult[] = [
    // Frontend sections
    { category: 'Frontend', section: 'Frontend Overview', preview: 'Next.js 15 application with TypeScript, Tailwind CSS, and modern React patterns', sectionId: 'frontend-overview' },
    { category: 'Frontend', section: 'Components', preview: 'Navigation, cards, forms, modals, and reusable UI components', sectionId: 'components' },
    { category: 'Frontend', section: 'Contexts', preview: 'Authentication context, theme context, and global state management', sectionId: 'contexts' },
    { category: 'Frontend', section: 'API Integration', preview: 'API client, fetch utilities, and backend communication', sectionId: 'api-integration' },

    // Backend sections
    { category: 'Backend', section: 'Backend Overview', preview: 'Django REST Framework API with authentication and permissions', sectionId: 'backend-overview' },
    { category: 'Backend', section: 'Models', preview: 'Database models for users, posts, projects, feed, and messaging', sectionId: 'models' },
    { category: 'Backend', section: 'API Endpoints', preview: 'Complete REST API documentation with request/response examples', sectionId: 'api-endpoints' },

    // Architecture sections
    { category: 'Architecture', section: 'System Architecture', preview: 'Django backend + Next.js frontend architecture overview', sectionId: 'system-architecture' },
    { category: 'Architecture', section: 'Authentication & Security', preview: 'httpOnly cookie-based JWT authentication with security measures', sectionId: 'authentication-security' },

    // Admin sections
    { category: 'Admin', section: 'Admin Overview', preview: 'Django Admin interface for platform management', sectionId: 'admin-overview' },
    { category: 'Admin', section: 'Feed System', preview: 'Timeline-based feed with intelligent curation and personalization', sectionId: 'feed-system' },
    { category: 'Admin', section: 'Project Approval', preview: 'Moderator-controlled project approval workflow with visibility controls', sectionId: 'project-approval' },
    { category: 'Admin', section: 'Admin Features', preview: 'Bulk actions, filtering, search, and admin capabilities', sectionId: 'admin-features' },
    { category: 'Admin', section: 'Contact Management', preview: 'Comprehensive system for managing contact form submissions', sectionId: 'admin-contact' },

    // Management Commands
    { category: 'Management Commands', section: 'refresh_feeds', preview: 'Clear caches and update content scores for fresh feeds', sectionId: 'management-commands' },
    { category: 'Management Commands', section: 'update_content_scores', preview: 'Background content scoring for feed ranking', sectionId: 'management-commands' },
    { category: 'Management Commands', section: 'generate_feed_content', preview: 'Test data generation for development', sectionId: 'management-commands' },

    // Email System
    { category: 'Email System', section: 'Email Overview', preview: 'Comprehensive email system with templates and automation', sectionId: 'email-overview' },
    { category: 'Email System', section: 'Email Templates', preview: 'Welcome emails, notifications, and verification emails', sectionId: 'email-templates' },

    // Messaging System
    { category: 'Messaging', section: 'Messaging Overview', preview: 'Direct and group messaging system with real-time features', sectionId: 'messaging-overview' },
    { category: 'Messaging', section: 'Direct Messaging', preview: 'One-on-one conversations between users', sectionId: 'direct-messaging' },
    { category: 'Messaging', section: 'Group Messaging', preview: 'Project-based group conversations', sectionId: 'group-messaging' },

    // Investor Feed
    { category: 'Investor Features', section: 'Investor Feed', preview: 'Curated feed for investors to discover projects', sectionId: 'investor-feed' },
  ];

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }

      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = searchIndex.filter(item =>
      item.section.toLowerCase().includes(query) ||
      item.preview.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results

    setSearchResults(results);
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      handleResultClick(searchResults[selectedIndex]);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultClick(result.sectionId);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all hover:border-primary-orange"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)'
        }}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search documentation...</span>
        <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border"
          style={{
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)'
          }}
        >
          <span className="mr-1">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            ref={searchContainerRef}
            className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            {/* Search Input */}
            <div className="flex items-center space-x-3 p-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Search className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for commands, features, or topics..."
                className="flex-1 text-base outline-none"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)'
                }}
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded hover:bg-opacity-10"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length === 0 && searchQuery.length > 0 && (
                <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                  <p className="text-xs mt-2">Try searching for "authentication", "commands", "feed", or "admin"</p>
                </div>
              )}

              {searchResults.length === 0 && searchQuery.length === 0 && (
                <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                  <p className="text-sm mb-4">Quick access</p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    {['Authentication', 'Management Commands', 'Feed System', 'Project Approval'].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSearchQuery(topic)}
                        className="px-3 py-2 rounded text-xs transition-colors"
                        style={{
                          backgroundColor: 'var(--hover-bg)',
                          color: 'var(--text-primary)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.map((result, index) => (
                <button
                  key={`${result.sectionId}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-4 border-b transition-colors"
                  style={{
                    backgroundColor: index === selectedIndex ? 'var(--hover-bg)' : 'transparent',
                    borderColor: 'var(--border)'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {result.section}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{
                      backgroundColor: 'var(--primary-orange)',
                      color: 'white'
                    }}>
                      {result.category}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {result.preview}
                  </p>
                </button>
              ))}
            </div>

            {/* Footer */}
            {searchResults.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t text-xs"
                style={{
                  backgroundColor: 'var(--hover-bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)'
                }}
              >
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>↑↓</kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>↵</kbd>
                    <span>Select</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)' }}>esc</kbd>
                    <span>Close</span>
                  </span>
                </div>
                <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentationSearch;
