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
    { id: 'inbox', label: 'Inbox', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', href: '/inbox' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
  ];

  // Admin-only navigation items
  const isAdmin = profile?.is_staff || profile?.is_superuser;
  const adminItems = isAdmin ? [
    { id: 'documentation', label: 'Documentation', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', href: '/documentation' },
    { id: 'admin', label: 'Admin Panel', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', href: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin`, external: true },
  ] : [];

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
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{backgroundColor: 'var(--primary-orange)'}}>
                <Image
                  src="/Logoblacktransparent.png"
                  alt="EntreHive Logo"
                  width={64}
                  height={64}
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
                id={
                  item.id === 'projects' ? 'projects-nav' :
                  item.id === 'profile' ? 'profile-nav' :
                  item.id === 'explore' ? 'explore-nav' :
                  item.id === 'inbox' ? 'inbox-nav' :
                  undefined
                }
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

            {/* Admin Section */}
            {(profile?.is_staff || profile?.is_superuser) && (
              <>
                <div className="border-t my-4" style={{borderColor: 'var(--border)'}}></div>

                {/* Staff/Admin Badge */}
                <div className="mx-4 mb-3 px-3 py-2 rounded-lg flex items-center space-x-2 shadow-sm" style={{
                  background: profile?.is_superuser
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : 'linear-gradient(135deg, #004E89 0%, #1A659E 100%)',
                }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-bold text-white font-canva-sans tracking-wide">
                    {profile?.is_superuser ? 'ADMIN' : 'STAFF'}
                  </span>
                </div>

                {adminItems.length > 0 && (
                  <>
                    {adminItems.map((item) => (
                      item.external ? (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-300 relative hover:scale-102"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <svg
                            className="mr-3 h-5 w-5 transition-all duration-300 group-hover:scale-110"
                            style={{color: 'var(--text-muted)'}}
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
                          <svg className="ml-auto h-4 w-4" style={{color: 'var(--text-muted)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
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
                      )
                    ))}
                  </>
                )}
              </>
            )}
          </nav>

          {/* Theme Toggle & User Info */}
          <div className="flex-shrink-0 p-4 space-y-4 relative z-10" style={{borderTop: '1px solid var(--border)'}}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium font-canva-sans" style={{color: 'var(--text-secondary)'}}>Theme</span>
              <ThemeToggle />
            </div>

            <Link
              id="profile-menu"
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
                  src="/Logoblacktransparent.png"
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

            {/* Admin Section */}
            {(profile?.is_staff || profile?.is_superuser) && (
              <>
                <div className="border-t my-4" style={{borderColor: 'var(--border)'}}></div>

                {/* Staff/Admin Badge */}
                <div className="mx-4 mb-3 px-3 py-2 rounded-lg flex items-center space-x-2 shadow-sm" style={{
                  background: profile?.is_superuser
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : 'linear-gradient(135deg, #004E89 0%, #1A659E 100%)',
                }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-bold text-white font-canva-sans tracking-wide">
                    {profile?.is_superuser ? 'ADMIN' : 'STAFF'}
                  </span>
                </div>

                {adminItems.length > 0 && (
                  <>
                    <div className="px-4 py-2">
                      <span className="text-xs font-semibold font-canva-sans" style={{color: 'var(--text-muted)'}}>
                        ADMIN TOOLS
                      </span>
                    </div>
                    {adminItems.map((item) => (
                      item.external ? (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowMobileNav(false)}
                          className="group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <svg
                            className="mr-3 h-5 w-5"
                            style={{color: 'var(--text-muted)'}}
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
                          <svg className="ml-auto h-4 w-4" style={{color: 'var(--text-muted)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => {
                            setActiveItem(item.id);
                            setShowMobileNav(false);
                          }}
                          className="group flex items-center px-4 py-3 rounded-xl text-sm font-medium font-canva-sans transition-all duration-200"
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
                            className="mr-3 h-5 w-5"
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
                      )
                    ))}
                  </>
                )}
              </>
            )}
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
