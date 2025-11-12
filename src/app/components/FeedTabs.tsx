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
    <div className="space-y-8">
      {/* Tab Navigation with Enhanced Design */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl shadow-lg border backdrop-blur-sm p-2" 
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Tab Buttons */}
        <div className="flex space-x-2 relative">
          {feedTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-medium font-canva-sans transition-all duration-300 group
                ${activeTab === tab.id 
                  ? 'text-white shadow-lg' 
                  : 'hover:scale-105'
                }
              `}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--primary-orange)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0px)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <motion.div
                animate={{ rotate: activeTab === tab.id ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {tab.icon}
              </motion.div>
              <span className="group-hover:font-semibold transition-all duration-200">{tab.label}</span>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)',
                    zIndex: -1
                  }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Tab Description with Animation */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-3 mt-2"
        >
          <p className="text-xs font-canva-sans text-center leading-relaxed" style={{color: 'var(--text-muted)'}}>
            {feedTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </motion.div>
      </motion.div>

      {/* Feed Content with Staggered Animation */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <CuratedFeed
          feedType={activeTab}
          showComposer={activeTab === 'home'}
          showCreateProjectCard={activeTab === 'home'}
        />
      </motion.div>
    </div>
  );
}
