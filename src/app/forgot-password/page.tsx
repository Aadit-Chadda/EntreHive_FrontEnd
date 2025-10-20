'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthService } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { validateEmail } from '@/lib/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      await AuthService.requestPasswordReset({ email });
      setSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to send password reset email. Please try again.');
      console.error('Password reset request error:', err);
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
              Forgot your password?
            </h2>
            <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              {success 
                ? "Check your email for reset instructions" 
                : "No worries! Enter your email and we'll send you reset instructions"
              }
            </p>
            <p className="mt-4 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-semibold hover:scale-105 transition-all duration-200"
                style={{color: 'var(--primary-orange)'}}
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border-2 p-6 animate-fade-in-up text-center" style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10B981'
              }}>
                <div className="flex justify-center mb-4">
                  <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-canva-sans text-green-700 mb-2">
                  Check your email!
                </h3>
                <p className="text-sm font-canva-sans text-green-600 mb-4">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <p className="text-xs font-canva-sans text-green-600">
                  Didn't receive the email? Check your spam folder or try again with a different email address.
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="text-sm font-semibold font-canva-sans hover:scale-105 transition-all duration-200"
                  style={{color: 'var(--primary-orange)'}}
                >
                  Try a different email
                </button>
              </div>
            </div>
          ) : (
            /* Form */
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </span>
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>

              {/* Additional Help */}
              <div className="text-center">
                <p className="text-xs font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Need help? <Link href="/contact" className="font-semibold hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Contact support</Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

