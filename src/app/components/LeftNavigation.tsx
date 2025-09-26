'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeProvider';

interface LeftNavigationProps {
  showMobileNav: boolean;
  setShowMobileNav: (show: boolean) => void;
}

export default function LeftNavigation({ showMobileNav, setShowMobileNav }: LeftNavigationProps) {
  const [activeItem, setActiveItem] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/feed' },
    { id: 'posts', label: 'Posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', href: '/posts' },
    { id: 'projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/projects' },
    { id: 'explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', href: '/explore' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
    { id: 'bookmarks', label: 'Bookmarks', icon: 'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z', href: '/bookmarks' },
    { id: 'settings', label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z', href: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-shrink-0">
        <div className="flex flex-col w-full relative overflow-hidden" style={{backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)'}}>
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
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 py-4 relative z-10" style={{borderBottom: '1px solid var(--border)'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
                <Image
                  src="/logo_w_name.png"
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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                className={`
                  group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200 relative
                  ${activeItem === item.id 
                    ? 'shadow-sm' 
                    : 'hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: activeItem === item.id ? 'var(--active-bg)' : 'transparent',
                  color: activeItem === item.id ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  '&:hover': {
                    backgroundColor: 'var(--hover-bg)'
                  }
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110`}
                  style={{
                    color: activeItem === item.id ? 'var(--primary-orange)' : 'var(--text-muted)'
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
                {activeItem === item.id && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full" style={{backgroundColor: 'var(--primary-orange)'}}></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & User Info */}
          <div className="flex-shrink-0 p-4 space-y-4" style={{borderTop: '1px solid var(--border)'}}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium font-canva-sans" style={{color: 'var(--text-secondary)'}}>Theme</span>
              <ThemeToggle />
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer" 
                 style={{backgroundColor: 'var(--hover-bg)'}}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--active-bg)'}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-pine))'}}>
                <span className="text-white font-semibold text-sm font-roca-two">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium font-canva-sans truncate" style={{color: 'var(--text-primary)'}}>John Doe</p>
                <p className="text-xs font-canva-sans truncate" style={{color: 'var(--text-secondary)'}}>@johndoe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${showMobileNav ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full shadow-xl relative overflow-hidden" style={{backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)'}}>
          {/* Mobile hexagon decorations */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="hexagon-pattern h-full w-full"></div>
          </div>
          
          {/* Mobile floating hexagons */}
          <div className="absolute top-16 right-3 w-4 h-4 opacity-20 animate-hexagon-float" style={{backgroundColor: 'var(--primary-orange)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '0s'}}></div>
          <div className="absolute top-32 left-2 w-3 h-3 opacity-15 animate-hexagon-float" style={{backgroundColor: 'var(--accent-pine)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-24 right-2 w-3 h-3 opacity-25 animate-hexagon-float" style={{backgroundColor: 'var(--accent-terracotta)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animationDelay: '3s'}}></div>
          {/* Header */}
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
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.id);
                  setShowMobileNav(false);
                }}
                className={`
                  group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200
                `}
                style={{
                  backgroundColor: activeItem === item.id ? 'var(--active-bg)' : 'transparent',
                  color: activeItem === item.id ? 'var(--primary-orange)' : 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <svg
                  className={`mr-3 h-5 w-5`}
                  style={{
                    color: activeItem === item.id ? 'var(--primary-orange)' : 'var(--text-muted)'
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

          {/* Theme Toggle */}
          <div className="p-4" style={{borderTop: '1px solid var(--border)'}}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium font-canva-sans" style={{color: 'var(--text-secondary)'}}>Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
