'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, University, Globe, TrendingUp, Briefcase } from 'lucide-react';
import CuratedFeed from './CuratedFeed';
import { useAuth } from '@/contexts/AuthContext';

type FeedType = 'home' | 'university' | 'public' | 'projects';

interface FeedTab {
  id: FeedType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// Base feed tabs available to all users
const baseFeedTabs: FeedTab[] = [
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

// Projects tab only visible to investors and professors
const projectsTab: FeedTab = {
  id: 'projects',
  label: 'Projects',
  icon: <Briefcase className="w-4 h-4" />,
  description: 'Discover investment opportunities and student projects'
};

// Investor-specific tabs (no University - investors aren't tied to a university)
const investorTabs: FeedTab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="w-4 h-4" />,
    description: 'Curated feed with posts and projects based on your interests'
  },
  {
    id: 'public',
    label: 'Global',
    icon: <Globe className="w-4 h-4" />,
    description: 'Public posts and projects from all universities'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Briefcase className="w-4 h-4" />,
    description: 'Discover investment opportunities'
  }
];

export default function FeedTabs() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedType>('home');

  // Investors can only discover - they cannot post or create projects
  const isInvestor = user?.user_role === 'investor';
  const isProfessor = user?.user_role === 'professor';

  // Build tabs based on user role
  // - Investors: Home, Global, Projects (no University - they're not tied to universities)
  // - Professors: All base tabs + Projects
  // - Others: Base tabs only (Home, University, Global)
  const feedTabs = isInvestor
    ? investorTabs
    : (isProfessor ? [...baseFeedTabs, projectsTab] : baseFeedTabs);

  return (
    <div className="space-y-6">
      {/* Investor Header - Only for investors */}
      {isInvestor && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 py-2"
        >
          <div
            className="p-2.5 rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)' }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
            EntreHive <span style={{ color: 'var(--primary-orange)' }}>Investor</span>
          </h1>
        </motion.div>
      )}

      {/* Tab Navigation with Enhanced Design */}
      <motion.div
        id="feed-tabs"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: isInvestor ? 0.1 : 0 }}
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
          showComposer={activeTab === 'home' && !isInvestor}
          showCreateProjectCard={activeTab === 'home' && !isInvestor}
        />
      </motion.div>
    </div>
  );
}
