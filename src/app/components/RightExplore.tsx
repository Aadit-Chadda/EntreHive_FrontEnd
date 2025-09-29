'use client';

import { useState } from 'react';

interface RightExploreProps {
  showRightPanel: boolean;
  setShowRightPanel: (show: boolean) => void;
}

export default function RightExplore({ showRightPanel, setShowRightPanel }: RightExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const recentPosts = [
    {
      id: '1',
      author: 'startup_sarah',
      content: 'Just closed our seed round! 🎉',
      timestamp: '2h',
    },
    {
      id: '2',
      author: 'tech_mike',
      content: 'Building the future of AR/VR...',
      timestamp: '4h',
    },
    {
      id: '3',
      author: 'climate_emma',
      content: 'Sustainability in tech is crucial',
      timestamp: '6h',
    },
  ];

  const peopleToFollow = [
    {
      id: '1',
      name: 'Lisa Zhang',
      username: 'lisazhang',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      bio: 'AI researcher & startup founder',
      isFollowing: false,
    },
    {
      id: '2',
      name: 'Ryan Kumar',
      username: 'ryankumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      bio: 'FinTech enthusiast',
      isFollowing: false,
    },
    {
      id: '3',
      name: 'Maya Okoye',
      username: 'mayaokoye',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      bio: 'Climate tech advocate',
      isFollowing: false,
    },
  ];

  const categories = [
    { id: 'ai', name: 'AI', color: 'rgba(231, 159, 116, 0.2)', textColor: 'var(--accent-terracotta)' },
    { id: 'design', name: 'Design', color: 'rgba(33, 79, 56, 0.2)', textColor: 'var(--accent-pine)' },
    { id: 'research', name: 'Research', color: 'rgba(243, 172, 59, 0.2)', textColor: 'var(--primary-orange)' },
    { id: 'startups', name: 'Startups', color: 'rgba(138, 107, 83, 0.2)', textColor: 'var(--secondary-taupe)' },
    { id: 'fintech', name: 'FinTech', color: 'rgba(119, 11, 11, 0.2)', textColor: 'var(--secondary-red)' },
    { id: 'climate', name: 'Climate', color: 'rgba(0, 0, 128, 0.2)', textColor: 'var(--accent-navy)' },
  ];

  return (
    <div className="h-full flex flex-col" style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 lg:hidden" style={{backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)'}}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold font-roca-two" style={{color: 'var(--text-primary)'}}>Explore</h2>
          <button
            onClick={() => setShowRightPanel(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search EntreHive"
            className="block w-full pl-10 pr-3 py-2 rounded-lg text-sm font-canva-sans focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              backgroundColor: 'var(--hover-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              '::placeholder': { color: 'var(--text-muted)' }
            }}
            onFocus={(e) => {
              e.target.style.ring = '2px solid var(--primary-orange)';
              e.target.style.borderColor = 'var(--primary-orange)';
            }}
            onBlur={(e) => {
              e.target.style.ring = 'none';
              e.target.style.borderColor = 'var(--border)';
            }}
          />
        </div>

        {/* Browse Categories */}
        <div>
          <h3 className="text-lg font-semibold font-roca-two mb-4" style={{color: 'var(--text-primary)'}}>Browse Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium font-canva-sans transition-all duration-300 hover:scale-105 hover:shadow-md transform ${
                  selectedCategory === category.id ? 'scale-105 shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: category.color,
                  color: category.textColor,
                  border: selectedCategory === category.id ? '2px solid var(--primary-orange)' : 'none',
                  animationDelay: `${index * 100}ms`
                }}
              >
                #{category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-lg font-semibold font-roca-two mb-4" style={{color: 'var(--text-primary)'}}>Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-102 hover:shadow-md group"
                style={{backgroundColor: 'var(--hover-bg)'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--active-bg)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm font-canva-sans group-hover:text-orange-500 transition-colors" style={{color: 'var(--text-primary)'}}>@{post.author}</span>
                  <span className="text-xs font-canva-sans px-2 py-1 rounded-full" style={{color: 'var(--text-secondary)', backgroundColor: 'var(--border)'}}>{post.timestamp}</span>
                </div>
                <p className="text-sm font-canva-sans line-clamp-2 leading-relaxed" style={{color: 'var(--text-muted)'}}>{post.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* People to Follow */}
        <div>
          <h3 className="text-lg font-semibold font-roca-two mb-4" style={{color: 'var(--text-primary)'}}>People to Follow</h3>
          <div className="space-y-4">
            {peopleToFollow.map((person, index) => (
              <div 
                key={person.id} 
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 group hover:scale-102 hover:shadow-md"
                style={{backgroundColor: 'transparent'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover shadow-md transition-all duration-300 group-hover:shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" style={{backgroundColor: 'var(--accent-pine)'}}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm font-canva-sans truncate group-hover:text-orange-500 transition-colors" style={{color: 'var(--text-primary)'}}>{person.name}</p>
                    <p className="text-xs font-canva-sans truncate" style={{color: 'var(--text-secondary)'}}>@{person.username}</p>
                    <p className="text-xs font-canva-sans truncate mt-1" style={{color: 'var(--text-muted)'}}>{person.bio}</p>
                  </div>
                </div>
                <button 
                  className="px-4 py-2 text-white text-xs font-semibold font-canva-sans rounded-full transition-all duration-300 flex-shrink-0 hover:scale-105 hover:shadow-md"
                  style={{backgroundColor: 'var(--primary-orange)'}}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--accent-terracotta)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--primary-orange)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-6 border-t" style={{borderColor: 'var(--border)'}}>
          <div className="flex flex-wrap gap-4 text-xs font-canva-sans mb-3">
            {['About', 'Terms', 'Privacy', 'Help'].map((link) => (
              <a 
                key={link}
                href="#" 
                className="transition-all duration-300 hover:scale-105 hover:font-medium" 
                style={{color: 'var(--text-secondary)'}} 
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--primary-orange)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs font-canva-sans text-center py-2" style={{color: 'var(--text-muted)'}}>© 2024 EntreHive</p>
        </div>
      </div>
    </div>
  );
}
