'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '../components/LeftNavigation';
import FeedTabs from '../components/FeedTabs';
import RightExplore from '../components/RightExplore';
import FloatingComposer from '../components/FloatingComposer';
import { ThemeProvider } from '../components/ThemeProvider';

export default function Feed() {
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showFloatingComposer, setShowFloatingComposer] = useState(false);

  return (
    <ProtectedRoute>
      <ThemeProvider>
      <div className="min-h-screen transition-colors duration-200" style={{backgroundColor: 'var(--background)'}}>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between" style={{backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)'}}>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg transition-colors"
            style={{color: 'var(--text-primary)'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
              <Image
                src="/logo_w_name.png"
                alt="EntreHive Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="font-bold text-lg font-roca-two" style={{color: 'var(--text-primary)'}}>EntreHive</span>
          </div>

          <button
            onClick={() => setShowFloatingComposer(true)}
            className="p-2 text-white rounded-lg transition-colors"
            style={{backgroundColor: 'var(--primary-orange)'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-terracotta)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-orange)'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          {/* Left Navigation */}
          <LeftNavigation 
            showMobileNav={showMobileNav}
            setShowMobileNav={setShowMobileNav}
          />

          {/* Main Content Area - Takes remaining space */}
          <div className="flex-1 min-h-screen pt-16 lg:pt-0 flex">
            {/* Main Feed - Takes maximum available space */}
            <div className="flex-1 min-w-0 max-w-none">
              <FeedTabs />
            </div>

            {/* Right Explore Panel */}
            <div className={`
              fixed lg:static inset-y-0 right-0 z-40 w-80 lg:w-80 xl:w-80 transform transition-transform duration-300 ease-in-out
              lg:transform-none xl:block lg:flex-shrink-0
              ${showRightPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              hidden lg:block
            `}>
              <RightExplore 
                showRightPanel={showRightPanel}
                setShowRightPanel={setShowRightPanel}
              />
            </div>

            {/* Toggle button for right panel on lg screens */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="hidden lg:block xl:hidden fixed bottom-6 right-6 z-50 w-12 h-12 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              style={{backgroundColor: 'var(--primary-orange)'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-terracotta)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-orange)'}
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Floating Composer Modal */}
        <FloatingComposer 
          isOpen={showFloatingComposer}
          onClose={() => setShowFloatingComposer(false)}
        />

        {/* Overlay for mobile panels */}
        {(showMobileNav || showRightPanel) && (
          <div 
            className="fixed inset-0 z-30 lg:hidden"
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            onClick={() => {
              setShowMobileNav(false);
              setShowRightPanel(false);
            }}
          />
        )}
      </div>
    </ThemeProvider>
    </ProtectedRoute>
  );
}
