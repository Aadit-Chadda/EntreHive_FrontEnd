'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthService, validatePassword } from '@/lib/auth';
import { ApiError } from '@/lib/api';

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const uidb64 = params?.uidb64 as string;
  const token = params?.token as string;

  useEffect(() => {
    if (!uidb64 || !token) {
      setError('Invalid password reset link. Please request a new one.');
    }
  }, [uidb64, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setFieldErrors({ password: passwordErrors[0] });
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      await AuthService.confirmPasswordReset({
        new_password1: formData.password,
        new_password2: formData.confirmPassword,
        uid: uidb64,
        token: token,
      });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=Password reset successful! Please log in with your new password.');
      }, 3000);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.details) {
        const newFieldErrors: Record<string, string> = {};
        Object.entries(apiError.details).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            newFieldErrors[field] = messages[0];
          }
        });
        setFieldErrors(newFieldErrors);
      }
      setError(apiError.message || 'Failed to reset password. The link may be invalid or expired.');
      console.error('Password reset error:', err);
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
              {success ? 'Password Reset Successful!' : 'Set New Password'}
            </h2>
            <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              {success 
                ? "Your password has been updated successfully" 
                : "Please enter your new password"
              }
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
                  All set!
                </h3>
                <p className="text-sm font-canva-sans text-green-600 mb-4">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
                <p className="text-xs font-canva-sans text-green-600">
                  Redirecting you to login...
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold font-canva-sans hover:scale-105 transition-all duration-200"
                  style={{color: 'var(--primary-orange)'}}
                >
                  Go to Login now
                </Link>
              </div>
            </div>
          ) : (
            /* Form */
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* New Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    New Password
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
                      autoComplete="new-password"
                      required
                      className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70 ${fieldErrors.password ? 'border-red-300' : ''}`}
                      style={{
                        borderColor: fieldErrors.password ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                        color: 'var(--secondary-charcoal)',
                        '--tw-ring-color': 'var(--primary-orange)'
                      }}
                      placeholder="Enter new password"
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
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.password}</p>
                  )}
                  <p className="mt-1 text-xs font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70 ${fieldErrors.confirmPassword ? 'border-red-300' : ''}`}
                      style={{
                        borderColor: fieldErrors.confirmPassword ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                        color: 'var(--secondary-charcoal)',
                        '--tw-ring-color': 'var(--primary-orange)'
                      }}
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.confirmPassword}</p>
                  )}
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
                  disabled={isLoading || !uidb64 || !token}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </span>
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>

              {/* Additional Help */}
              <div className="text-center">
                <p className="text-xs font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Link expired? <Link href="/forgot-password" className="font-semibold hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Request a new one</Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
            Remember your password?{' '}
            <Link href="/login" className="font-medium hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

