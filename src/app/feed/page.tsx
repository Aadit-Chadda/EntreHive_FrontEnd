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

export default function Feed() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showFloatingComposer, setShowFloatingComposer] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Redirect investors to their dedicated feed
  useEffect(() => {
    if (user && user.user_role === 'investor') {
      router.push('/investors');
    }
  }, [user, router]);

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
          {/* Left Navigation - Sticky for Feed */}
          <div className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-shrink-0 sticky top-0 h-screen">
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)'}}>
              {/* Hexagon decorative background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="hexagon-pattern h-full w-full"></div>
              </div>
              
              {/* Floating hexagons */}
              <div className="absolute top-20 right-4 w-6 h-6 opacity-20 animate-hexagon-float" style={{backgroundColor: 'var(--primary-orange)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '0s'}}></div>
              <div className="absolute top-40 left-2 w-4 h-4 opacity-15 animate-hexagon-float" style={{backgroundColor: 'var(--accent-pine)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '2s'}}></div>
              <div className="absolute bottom-32 right-2 w-5 h-5 opacity-25 animate-hexagon-float" style={{backgroundColor: 'var(--accent-terracotta)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '4s'}}></div>
              <div className="absolute top-1/2 left-4 w-3 h-3 opacity-20 animate-hexagon-float" style={{backgroundColor: 'var(--secondary-taupe)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '1s'}}></div>
              <div className="absolute bottom-20 left-8 w-4 h-4 opacity-30 animate-hexagon-float" style={{backgroundColor: 'var(--accent-navy)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '3s'}}></div>
              
              {/* Logo - Fixed at top */}
              <div className="flex-shrink-0 px-6 py-4 relative z-10" style={{borderBottom: '1px solid var(--border)'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
                    <Image
                      src={resolvedTheme === 'dark' ? "/Logoblacktransparent.png" : "/LogoWhitetransparent.png"}
                      alt="EntreHive Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl font-roca-two" style={{color: 'var(--text-primary)'}}>EntreHive</span>
                    <span className="text-xs font-canva-sans" style={{color: 'var(--text-secondary)'}}>Student Network</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto scrollbar-hide">
                {[
                  { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/feed' },
                  { id: 'explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', href: '/explore' },
                  { id: 'projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/projects' },
                  { id: 'inbox', label: 'Inbox', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', href: '/inbox' },
                  { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-300 relative
                      ${item.id === 'home'
                        ? 'shadow-lg transform scale-105' 
                        : 'hover:scale-102'
                      }
                    `}
                    style={{
                      backgroundColor: item.id === 'home' ? 'var(--active-bg)' : 'transparent',
                      color: item.id === 'home' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      if (item.id !== 'home') {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.id !== 'home') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <svg
                      className={`mr-3 h-5 w-5 transition-all duration-300 group-hover:scale-110 ${item.id === 'home' ? 'animate-pulse' : ''}`}
                      style={{
                        color: item.id === 'home' ? 'var(--primary-orange)' : 'var(--text-muted)'
                      }}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={item.icon} />
                    </svg>
                    <span className="truncate">{item.label}</span>
                    {item.id === 'home' && (
                      <div className="absolute right-2 w-2 h-2 rounded-full animate-ping" style={{backgroundColor: 'var(--primary-orange)'}}></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* User Profile - Fixed at bottom */}
              <div className="flex-shrink-0 p-4 space-y-4 relative z-10" style={{borderTop: '1px solid var(--border)'}}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-canva-sans" style={{color: 'var(--text-secondary)'}}>Theme</span>
                  <ThemeToggle />
                </div>
                
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 cursor-pointer group hover:scale-105" 
                  style={{backgroundColor: 'var(--hover-bg)'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--active-bg)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg" style={{background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))'}}>
                    {profile?.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt={profile.full_name || profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm font-roca-two">
                        {profile?.first_name?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-canva-sans truncate" style={{color: 'var(--text-primary)'}}>
                      {profile?.full_name || profile?.first_name || user?.username || 'User'}
                    </p>
                    <p className="text-xs font-canva-sans truncate" style={{color: 'var(--text-secondary)'}}>
                      @{profile?.username || user?.username || 'username'}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" style={{color: 'var(--text-muted)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area with Better Spacing */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-h-screen pt-16 lg:pt-0 lg:mr-80"
          >
            {/* Main Feed with Improved Spacing */}
            <div className="flex-1 min-w-0 max-w-none px-4 lg:px-8 xl:px-12 py-6 lg:py-8">
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

        {/* Mobile Navigation */}
        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${showMobileNav ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full shadow-xl relative overflow-hidden" style={{backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)'}}>
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-4 relative z-10" style={{borderBottom: '1px solid var(--border)'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
                  <Image
                    src="/logo_w_name.png"
                    alt="EntreHive Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="font-bold text-lg font-roca-two" style={{color: 'var(--text-primary)'}}>EntreHive</span>
              </div>
              <button
                onClick={() => setShowMobileNav(false)}
                className="p-2 rounded-lg transition-colors"
                style={{color: 'var(--text-primary)'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10">
              {[
                { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/feed' },
                { id: 'explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', href: '/explore' },
                { id: 'projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/projects' },
                { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setShowMobileNav(false)}
                  className={`
                    group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200
                  `}
                  style={{
                    backgroundColor: item.id === 'home' ? 'var(--active-bg)' : 'transparent',
                    color: item.id === 'home' ? 'var(--primary-orange)' : 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    if (item.id !== 'home') {
                      e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.id !== 'home') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <svg
                    className={`mr-3 h-5 w-5`}
                    style={{
                      color: item.id === 'home' ? 'var(--primary-orange)' : 'var(--text-muted)'
                    }}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

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
