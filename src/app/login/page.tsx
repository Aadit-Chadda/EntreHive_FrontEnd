'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Redirect is handled by the login function
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.details?.non_field_errors) {
        setError(apiError.details.non_field_errors[0]);
      } else if (apiError.details?.email) {
        setError(apiError.details.email[0]);
      } else if (apiError.details?.password) {
        setError(apiError.details.password[0]);
      } else {
        setError(apiError.message || 'Login failed. Please check your credentials.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 hexagon-pattern" style={{background: 'var(--background)'}}>
      {/* Hexagonal background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="hexagon absolute animate-hexagon-float"
            style={{
              top: `${5 + (i % 4) * 25}%`,
              left: `${5 + (i % 3) * 35}%`,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.05,
              transform: `scale(${0.6 + (i % 3) * 0.3})`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 p-8 animate-fade-in-up" style={{borderColor: 'var(--primary-orange)'}}>
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 border-2 hexagon" style={{
                backgroundColor: 'var(--primary-orange)',
                borderColor: 'var(--primary-orange)'
              }}>
                <img 
                  src="/logo_official.jpeg" 
                  alt="EntreHive Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
              Welcome back to the Hive!
            </h2>
            <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              Sign in to continue your entrepreneurial journey
            </p>
            <p className="mt-4 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold hover:scale-105 transition-all duration-200"
                style={{color: 'var(--primary-orange)'}}
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email-address" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70"
                    style={{
                      borderColor: 'var(--secondary-taupe)',
                      color: 'var(--secondary-charcoal)',
                      '--tw-ring-color': 'var(--primary-orange)'
                    }}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70"
                    style={{
                      borderColor: 'var(--secondary-taupe)',
                      color: 'var(--secondary-charcoal)',
                      '--tw-ring-color': 'var(--primary-orange)'
                    }}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded transition-colors duration-200"
                  style={{
                    accentColor: 'var(--primary-orange)',
                    borderColor: 'var(--secondary-taupe)'
                  }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold font-canva-sans hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border-2 p-4 animate-fade-in-up" style={{
                backgroundColor: 'rgba(231, 159, 116, 0.1)',
                borderColor: 'var(--secondary-red)'
              }}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-red)'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium font-canva-sans" style={{color: 'var(--secondary-red)'}}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-base font-medium font-canva-sans rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  '--tw-ring-color': 'var(--primary-orange)'
                }}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-white group-hover:opacity-80 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  )}
                </span>
                {isLoading ? 'Signing you in...' : 'Sign In'}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{borderColor: 'var(--secondary-taupe)'}} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white rounded-full font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border-2 rounded-xl shadow-sm bg-white/50 backdrop-blur-sm text-sm font-medium font-canva-sans hover:bg-white/70 hover:scale-105 transition-all duration-200 group"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  color: 'var(--secondary-charcoal)'
                }}
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border-2 rounded-xl shadow-sm bg-white/50 backdrop-blur-sm text-sm font-medium font-canva-sans hover:bg-white/70 hover:scale-105 transition-all duration-200 group"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  color: 'var(--secondary-charcoal)'
                }}
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub
              </button>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="font-medium hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
