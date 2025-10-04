'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* EntreHive Logo - Left Side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/Logoblacktransparent.png" 
                  alt="EntreHive Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold font-roca-two text-gray-800 group-hover:scale-105 transition-transform duration-300">EntreHive</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-gray-700 font-canva-sans px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 relative group"
                style={{'--hover-color': 'var(--primary-orange)'} as React.CSSProperties}
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" style={{backgroundColor: 'var(--primary-orange)'}}></span>
              </Link>
              <Link
                href="/about"
                className="text-gray-700 font-canva-sans px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" style={{backgroundColor: 'var(--primary-orange)'}}></span>
              </Link>
              <Link
                href="/services"
                className="text-gray-700 font-canva-sans px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" style={{backgroundColor: 'var(--primary-orange)'}}></span>
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 font-canva-sans px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 relative group"
              >
                Explore Projects
                <span className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" style={{backgroundColor: 'var(--primary-orange)'}}></span>
              </Link>
            </div>
          </div>

          {/* Auth Buttons - Right Side */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 font-canva-sans px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{'color': 'var(--secondary-charcoal)'}}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="relative text-white px-6 py-2.5 rounded-xl text-sm font-semibold font-canva-sans transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 transform group overflow-hidden"
                style={{'background': 'var(--primary-orange)'}}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{'background': 'var(--accent-terracotta)'}}></span>
                <span className="relative flex items-center space-x-1">
                  <span>Join Now</span>
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" style={{'background': 'var(--primary-orange)'}}></div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              href="/"
              className="text-gray-700 font-canva-sans block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 font-canva-sans block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-700 font-canva-sans block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 font-canva-sans block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Projects
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 font-canva-sans block px-3 py-2 rounded-md text-base font-medium"
                  style={{'color': 'var(--secondary-charcoal)'}}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="relative text-white block px-4 py-2.5 rounded-xl text-base font-semibold font-canva-sans transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform group overflow-hidden"
                  style={{'background': 'var(--primary-orange)'}}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{'background': 'var(--accent-terracotta)'}}></span>
                  <span className="relative flex items-center justify-center space-x-1">
                    <span>🐝</span>
                    <span>Join the Hive</span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" style={{'background': 'var(--primary-orange)'}}></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
