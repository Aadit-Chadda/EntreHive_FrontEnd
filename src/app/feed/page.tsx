'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '../components/LeftNavigation';
import FeedTabs from '../components/FeedTabs';
import RightSidebar from '../components/RightSidebar';
import FloatingComposer from '../components/FloatingComposer';
import { ThemeToggle, useTheme } from '../components/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useTour, shouldShowTour } from '@/contexts/TourContext';

export default function Feed() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { startFeedTour } = useTour();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showFloatingComposer, setShowFloatingComposer] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Redirect investors to their dedicated feed
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push('/investors');
    }
  }, [user, router]);

  // Auto-trigger tour for first-time users
  useEffect(() => {
    if (user && profile && shouldShowTour('feed')) {
      // Small delay to let the page render completely
      const timer = setTimeout(() => {
        startFeedTour();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, profile, startFeedTour]);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-all duration-300 ease-in-out" style={{backgroundColor: 'var(--background)'}}>
        {/* Mobile Header */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-lg" 
          style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid var(--border)'}}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileNav(true)}
            className="p-2 rounded-lg transition-all duration-200"
            style={{color: 'var(--text-primary)'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
              <Image
                src="/Logoblacktransparent.png"
                alt="EntreHive Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="font-bold text-lg font-roca-two" style={{color: 'var(--text-primary)'}}>EntreHive</span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFloatingComposer(true)}
            className="p-2 text-white rounded-lg transition-all duration-200 shadow-md"
            style={{backgroundColor: 'var(--primary-orange)'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-orange)'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          {/* Left Navigation */}
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />

          {/* Main Content Area with Better Spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80"
          >
            {/* Main Feed with Improved Spacing */}
            <div id="feed-section" className="flex-1 min-w-0 max-w-none px-4 lg:px-8 xl:px-12 py-6 lg:py-8">
              <div className="max-w-2xl mx-auto">
                <FeedTabs />
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar - Fixed on desktop */}
          <div className="hidden lg:block fixed right-0 top-0 h-screen" style={{backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)'}}>
            <RightSidebar />
          </div>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 z-50 w-12 h-12 text-white rounded-full shadow-xl transition-all duration-200 backdrop-blur-sm"
              style={{backgroundColor: 'var(--accent-pine)'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-charcoal)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-pine)'}
            >
              <ArrowUp className="w-6 h-6 mx-auto" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Composer Modal */}
        <FloatingComposer 
          isOpen={showFloatingComposer}
          onClose={() => setShowFloatingComposer(false)}
        />

        {/* Overlay for mobile panels */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
              onClick={() => {
                setShowMobileNav(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
