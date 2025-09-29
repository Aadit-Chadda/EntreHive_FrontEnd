'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, University, Globe, TrendingUp } from 'lucide-react';
import CuratedFeed from './CuratedFeed';

type FeedType = 'home' | 'university' | 'public';

interface FeedTab {
  id: FeedType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const feedTabs: FeedTab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="w-4 h-4" />,
    description: 'Personalized feed with content tailored for you'
  },
  {
    id: 'university',
    label: 'University',
    icon: <University className="w-4 h-4" />,
    description: 'Posts and projects from your university'
  },
  {
    id: 'public',
    label: 'Global',
    icon: <Globe className="w-4 h-4" />,
    description: 'Public posts and projects from all universities'
  }
];

export default function FeedTabs() {
  const [activeTab, setActiveTab] = useState<FeedType>('home');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
        <div className="flex space-x-1">
          {feedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--primary-orange)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Description */}
        <div className="px-4 py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {feedTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Feed Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <CuratedFeed 
          feedType={activeTab}
          showComposer={activeTab === 'home'}
        />
      </motion.div>
    </div>
  );
}
