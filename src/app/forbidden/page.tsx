'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Forbidden() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 hexagon-pattern opacity-30"></div>
      
      {/* Floating Hexagons */}
      <div className="absolute top-20 right-10 w-16 h-16 opacity-20">
        <div className="hexagon animate-hexagon-float"></div>
      </div>
      <div className="absolute bottom-32 left-20 w-12 h-12 opacity-15">
        <div className="hexagon animate-bee-hover"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 opacity-10">
        <div className="hexagon animate-hexagon-float"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* 403 Display */}
          <div className="relative">
            <h1 
              className="text-9xl md:text-[12rem] font-bold font-roca-two tracking-tight"
              style={{ 
                background: 'linear-gradient(135deg, var(--secondary-red) 0%, var(--primary-orange) 50%, var(--accent-terracotta) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              403
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20" 
                 style={{ background: 'var(--secondary-red)' }}></div>
          </div>

          {/* Icon */}
          <div className="flex justify-center animate-fade-in-up stagger-1">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--secondary-red) 0%, var(--primary-orange) 100%)' }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4 animate-fade-in-up stagger-2">
            <h2 
              className="text-3xl md:text-4xl font-bold font-roca-two"
              style={{ color: 'var(--text-primary)' }}
            >
              Access Forbidden
            </h2>
            <p 
              className="text-lg md:text-xl font-canva-sans max-w-lg mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Sorry, you don&apos;t have permission to access this hive cell. This area might be restricted to certain members.
            </p>
          </div>

          {/* Info Box */}
          <div 
            className="max-w-md mx-auto p-6 rounded-xl border-l-4 animate-fade-in-up stagger-3"
            style={{ 
              background: 'var(--surface)',
              borderColor: 'var(--primary-orange)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 className="font-semibold font-roca-two mb-2" style={{ color: 'var(--text-primary)' }}>
              Why am I seeing this?
            </h3>
            <ul className="text-sm font-canva-sans space-y-2 text-left" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary-orange)' }}>•</span>
                <span>You may need to be logged in to view this content</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary-orange)' }}>•</span>
                <span>This resource might require special permissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--primary-orange)' }}>•</span>
                <span>Your account may not have access to this feature</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up stagger-4">
            <button
              onClick={() => router.back()}
              className="group relative px-8 py-3.5 rounded-lg font-semibold font-canva-sans text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>

            <Link
              href="/"
              className="group relative px-8 py-3.5 rounded-lg font-semibold font-canva-sans overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2"
              style={{ 
                color: 'var(--primary-orange)', 
                borderColor: 'var(--primary-orange)',
                background: 'transparent'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                   style={{ background: 'var(--hover-bg)' }}></div>
            </Link>

            <Link
              href="/login"
              className="group relative px-8 py-3.5 rounded-lg font-semibold font-canva-sans overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2"
              style={{ 
                color: 'var(--accent-pine)', 
                borderColor: 'var(--accent-pine)',
                background: 'transparent'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                   style={{ background: 'rgba(33, 79, 56, 0.1)' }}></div>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t animate-fade-in-up stagger-5" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold mb-4 font-canva-sans" style={{ color: 'var(--text-muted)' }}>
              Need Help?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link 
                href="/about" 
                className="group text-sm font-medium font-canva-sans flex items-center gap-1 transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--primary-orange)' }}
              >
                <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </Link>
              <Link 
                href="/signup" 
                className="group text-sm font-medium font-canva-sans flex items-center gap-1 transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--primary-orange)' }}
              >
                <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </Link>
              <a 
                href="mailto:support@entrehive.com" 
                className="group text-sm font-medium font-canva-sans flex items-center gap-1 transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--primary-orange)' }}
              >
                <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

