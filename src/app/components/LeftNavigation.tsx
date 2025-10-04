'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle, useTheme } from './ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';

interface LeftNavigationProps {
  showMobileNav: boolean;
  setShowMobileNav: (show: boolean) => void;
}

export default function LeftNavigation({ showMobileNav, setShowMobileNav }: LeftNavigationProps) {
  const [activeItem, setActiveItem] = useState('home');
  const { user, profile } = useAuth();
  const { resolvedTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/feed' },
    { id: 'explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', href: '/explore' },
    { id: 'projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/projects' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen">
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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                className={`
                  group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-300 relative
                  ${activeItem === item.id 
                    ? 'shadow-lg transform scale-105' 
                    : 'hover:scale-102'
                  }
                `}
                style={{
                  backgroundColor: activeItem === item.id ? 'var(--active-bg)' : 'transparent',
                  color: activeItem === item.id ? 'var(--primary-orange)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-all duration-300 group-hover:scale-110 ${activeItem === item.id ? 'animate-pulse' : ''}`}
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
                  <div className="absolute right-2 w-2 h-2 rounded-full animate-ping" style={{backgroundColor: 'var(--primary-orange)'}}></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & User Info */}
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
                  src={resolvedTheme === 'dark' ? "/Logoblacktransparent.png" : "/LogoWhitetransparent.png"}
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
