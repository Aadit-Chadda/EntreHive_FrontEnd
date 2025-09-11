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
    { id: 'ai', name: 'AI', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { id: 'design', name: 'Design', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
    { id: 'research', name: 'Research', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'startups', name: 'Startups', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { id: 'fintech', name: 'FinTech', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { id: 'climate', name: 'Climate', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  ];

  return (
    <div className="h-screen bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Explore</h2>
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

      <div className="p-4 space-y-6">
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Browse Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Browse Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'ring-2 ring-blue-500 ' + category.color
                    : category.color
                }`}
              >
                #{category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Posts</h3>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">@{post.author}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* People to Follow */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">People to Follow</h3>
          <div className="space-y-3">
            {peopleToFollow.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{person.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{person.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{person.bio}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-full hover:bg-blue-600 transition-colors flex-shrink-0">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Help</a>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">© 2024 EntreHive</p>
        </div>
      </div>
    </div>
  );
}
