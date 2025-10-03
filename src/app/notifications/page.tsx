'use client';

import { useState } from 'react';
import LeftNavigation from '../components/LeftNavigation';
import RightSidebar from '../components/RightSidebar';
import ProjectInvitations from '../components/ProjectInvitations';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NotificationsPage() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-200" style={{backgroundColor: 'var(--background)'}}>
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between transition-colors duration-200" 
               style={{
                 backgroundColor: 'var(--surface)', 
                 borderBottom: '1px solid var(--border)'
               }}>
            <button
              onClick={() => setShowMobileNav(true)}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{color: 'var(--text-primary)'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--primary-orange)'}}>
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-lg" style={{color: 'var(--text-primary)'}}>Notifications</span>
            </div>

            <div className="w-10"></div> {/* Spacer for balance */}
          </div>

          {/* Main Layout */}
          <div className="flex min-h-screen">
            {/* Left Navigation */}
            <LeftNavigation 
              showMobileNav={showMobileNav}
              setShowMobileNav={setShowMobileNav}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80 flex">
              <div className="flex-1 min-w-0 max-w-none">
                <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  {/* Header */}
                  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {/* Notifications Content */}
                    <div className="max-w-4xl mx-auto">
                      {/* Project Invitations Section */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <ProjectInvitations showUserInvitations={true} />
                      </div>

                      {/* Future notification types can be added here */}
                      {/* 
                      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Other Notifications</h3>
                        <p className="text-gray-500 dark:text-gray-400">More notification types coming soon...</p>
                      </div>
                      */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Explore Panel */}
              <div className={`
                hidden lg:block fixed right-0 top-0 h-screen
              `} style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
                <RightSidebar />
              </div>

            </div>
          </div>

          {/* Overlay for mobile panels */}
          {showMobileNav && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => {
                setShowMobileNav(false);
              }}
            />
          )}
        </div>
    </ProtectedRoute>
  );
}
