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
    <div className="h-screen overflow-y-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 hexagon-pattern" style={{background: '#F5F5F5'}}>
      {/* Hexagonal background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 p-8 animate-fade-in-up" style={{borderColor: '#F3AC3B'}}>
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-32 w-32 flex items-center justify-center mb-6">
              <div className="w-32 h-32 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img
                  src="/Logoblacktransparent.png"
                  alt="EntreHive Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold font-roca-two mb-2" style={{color: '#36454F'}}>
              Welcome back to the Hive!
            </h2>
            <p className="font-canva-sans" style={{color: '#8a6b53'}}>
              Sign in to continue your entrepreneurial journey
            </p>
            <p className="mt-4 text-sm font-canva-sans" style={{color: '#8a6b53'}}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold hover:scale-105 transition-all duration-200"
                style={{color: '#F3AC3B'}}
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
                <label htmlFor="email-address" className="block text-sm font-medium font-canva-sans mb-2" style={{color: '#36454F'}}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#8a6b53'}}>
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
                      borderColor: '#8a6b53',
                      color: '#36454F',

                    }}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium font-canva-sans mb-2" style={{color: '#36454F'}}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#8a6b53'}}>
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
                      borderColor: '#8a6b53',
                      color: '#36454F',

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
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#8a6b53'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#8a6b53'}}>
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
                    accentColor: '#F3AC3B',
                    borderColor: '#8a6b53'
                  }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-canva-sans" style={{color: '#8a6b53'}}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-semibold font-canva-sans hover:scale-105 transition-all duration-200" style={{color: '#F3AC3B'}}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border-2 p-4 animate-fade-in-up" style={{
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderColor: '#E74C3C'
              }}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#E74C3C'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium font-canva-sans" style={{color: '#E74C3C'}}>{error}</p>
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
                  backgroundColor: '#F3AC3B',

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
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm font-canva-sans" style={{color: '#8a6b53'}}>
            By signing in, you agree to our{' '}
            <a href="/terms" className="font-medium hover:scale-105 transition-all duration-200" style={{color: '#F3AC3B'}}>Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="font-medium hover:scale-105 transition-all duration-200" style={{color: '#F3AC3B'}}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
