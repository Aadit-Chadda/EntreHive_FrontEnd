'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '../components/LeftNavigation';
import MainFeed from '../components/MainFeed';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg">EntreHive</span>
          </div>

          <button
            onClick={() => setShowFloatingComposer(true)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
              <MainFeed />
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
              className="hidden lg:block xl:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
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
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
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
