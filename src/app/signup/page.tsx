'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService, validatePassword, validateEmail, validateUsername } from '@/lib/auth';
import { UserRole, RegistrationData } from '@/types';
import { ApiError, apiClient } from '@/lib/api';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userRole: 'student' as UserRole,
    bio: '',
    location: '',
    university: '',
    interests: [] as string[],
  });
  const [universityVerification, setUniversityVerification] = useState<{
    verified: boolean;
    university: {
      id: string;
      name: string;
      short_name: string;
      city: string;
      country: string;
    } | null;
    checking: boolean;
    error: string;
    message: string;
  }>({
    verified: false,
    university: null,
    checking: false,
    error: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Re-verify university when role changes and email exists
    if (name === 'userRole' && formData.email && validateEmail(formData.email)) {
      verifyUniversityDomain(formData.email);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;
    
    setUsernameChecking(true);
    try {
      const result = await AuthService.checkUsername(username);
      if (!result.available) {
        setFieldErrors(prev => ({ ...prev, username: 'Username is already taken' }));
      }
    } catch (error) {
      console.error('Username check failed:', error);
    } finally {
      setUsernameChecking(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    if (!validateEmail(email)) return;
    
    setEmailChecking(true);
    try {
      const result = await AuthService.checkEmail(email);
      if (!result.available) {
        setFieldErrors(prev => ({ ...prev, email: 'Email is already registered' }));
      } else {
        // If email is available, also verify university domain
        await verifyUniversityDomain(email);
      }
    } catch (error) {
      console.error('Email check failed:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  const verifyUniversityDomain = async (email: string) => {
    if (!validateEmail(email)) return;
    
    setUniversityVerification(prev => ({ ...prev, checking: true, error: '', message: '' }));
    
    try {
      const data = await apiClient.post('/api/universities/verify-email/', {
        email: email,
        user_role: formData.userRole
      }) as { verified: boolean; university?: { id: string; name: string; short_name: string; city: string; country: string }; message: string };
      setUniversityVerification({
        verified: data.verified,
        university: data.university || null,
        checking: false,
        error: '',
        message: data.message
      });
      
      // Clear any previous email errors if verification succeeds
      if (data.verified) {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      console.error('University verification failed:', error);
      const apiError = error as ApiError;
      
      setUniversityVerification({
        verified: false,
        university: null,
        checking: false,
        error: formData.userRole !== 'investor' 
          ? (apiError.message || 'Sorry, you are not eligible at the moment! This application is available only to students from partner universities.')
          : '',
        message: ''
      });
      
      // Set email error for non-investors only
      if (formData.userRole !== 'investor') {
        setFieldErrors(prev => ({ 
          ...prev, 
          email: apiError.message || 'University verification failed' 
        }));
      }
    }
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Username validation
    const usernameErrors = validateUsername(formData.username);
    if (usernameErrors.length > 0) {
      errors.username = usernameErrors[0];
    }
    
    // Email validation
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0];
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        setError('Please fix the errors above');
        return;
      }
      
      // Check university verification for students and professors
      if (formData.userRole !== 'investor' && !universityVerification.verified) {
        setError('Please use your institutional email address to verify your university affiliation');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    // Final validation
    if (!validateStep1()) {
      setError('Please fix the errors above');
      setIsLoading(false);
      return;
    }

    try {
      const registrationData: RegistrationData = {
        username: formData.username,
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_role: formData.userRole,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        university_id: universityVerification.university?.id || undefined,
        verified_university: universityVerification.verified,
        interests: formData.interests.length > 0 ? formData.interests : undefined,
      };

      await AuthService.register(registrationData);
      
      // Show success message and redirect to login
      setError('');
      router.push('/login?message=Registration successful! Please log in to continue.');
      
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Registration error:', apiError);
      
      // Handle field-specific errors
      if (apiError.details) {
        const newFieldErrors: Record<string, string> = {};
        Object.entries(apiError.details).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            newFieldErrors[field] = messages[0];
          }
        });
        setFieldErrors(newFieldErrors);
      }
      
      // Set general error message
      setError(apiError.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 hexagon-pattern" style={{background: 'var(--background)'}}>
      {/* Hexagonal background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="hexagon absolute animate-hexagon-float"
            style={{
              top: `${3 + (i % 5) * 20}%`,
              left: `${2 + (i % 4) * 25}%`,
              animationDelay: `${i * 0.6}s`,
              opacity: 0.04,
              transform: `scale(${0.5 + (i % 4) * 0.3})`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-lg w-full space-y-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium font-canva-sans" style={{color: 'var(--secondary-charcoal)'}}>Step {step} of 2</span>
            <span className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>{step === 1 ? 'Account Info' : 'Profile Setup'}</span>
          </div>
          <div className="w-full rounded-full h-2" style={{backgroundColor: 'var(--neutral-off-white)'}}>
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(step / 2) * 100}%`,
                backgroundColor: 'var(--primary-orange)'
              }}
            ></div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 p-8 animate-fade-in-up" style={{borderColor: 'var(--primary-orange)'}}>
          {/* Header */}
          <div className="text-center mb-8">
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
              {step === 1 ? 'Join the Hive' : 'Complete Your Profile'}
            </h2>
            <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              {step === 1 
                ? 'Start your entrepreneurial journey with fellow students' 
                : 'Complete your profile to join the community'
              }
            </p>
            <p className="mt-4 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold hover:scale-105 transition-all duration-200"
                style={{color: 'var(--primary-orange)'}}
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                {/* User Role Field - moved to step 1 */}
                <div className="group">
                  <label htmlFor="userRole" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Your Role *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <select
                      id="userRole"
                      name="userRole"
                      required
                      className="block w-full pl-10 pr-3 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70"
                      style={{
                        borderColor: 'var(--secondary-taupe)',
                        color: 'var(--secondary-charcoal)',
                        
                      }}
                      value={formData.userRole}
                      onChange={handleChange}
                    >
                      <option value="student">🎓 Student</option>
                      <option value="professor">👨‍🏫 Professor</option>
                      <option value="investor">💼 Investor</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    This determines what features and content you&apos;ll see
                  </p>
                </div>

                {/* Username Field */}
                <div className="group">
                  <label htmlFor="username" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Username *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70 ${fieldErrors.username ? 'border-red-300' : ''}`}
                      style={{
                        borderColor: fieldErrors.username ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                        color: 'var(--secondary-charcoal)',
                        
                      }}
                      placeholder="johndoe123"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={(e) => checkUsernameAvailability(e.target.value)}
                    />
                    {usernameChecking && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {fieldErrors.username && (
                    <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.username}</p>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="firstName" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      First Name *
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={`block w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70 ${fieldErrors.firstName ? '' : ''}`}
                        style={{
                          borderColor: fieldErrors.firstName ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                          color: 'var(--secondary-charcoal)',
                          
                        }}
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.firstName}</p>
                      )}
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="lastName" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Last Name *
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className={`block w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70`}
                        style={{
                          borderColor: fieldErrors.lastName ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                          color: 'var(--secondary-charcoal)',
                          
                        }}
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {fieldErrors.lastName && (
                        <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Email Address *
                    {formData.userRole !== 'investor' && (
                      <span className="text-xs ml-2" style={{color: 'var(--secondary-taupe)'}}>
                        (Use your institutional email)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'var(--secondary-taupe)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm font-canva-sans placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 hover:bg-white/70 ${
                        fieldErrors.email 
                          ? 'border-red-300' 
                          : universityVerification.verified 
                            ? 'border-green-300' 
                            : ''
                      }`}
                      style={{
                        borderColor: fieldErrors.email 
                          ? 'var(--secondary-red)' 
                          : universityVerification.verified 
                            ? '#10B981' 
                            : 'var(--secondary-taupe)',
                        color: 'var(--secondary-charcoal)',
                        
                      }}
                      placeholder={formData.userRole === 'investor' ? "your.email@company.com" : "john.doe@university.edu"}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={(e) => checkEmailAvailability(e.target.value)}
                    />
                    {(emailChecking || universityVerification.checking) && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    {universityVerification.verified && !universityVerification.checking && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  
                  {universityVerification.verified && formData.userRole === 'investor' && (
                    <div className="mt-2 p-3 rounded-lg border" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6'}}>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-blue-700">
                          Investor account - University verification not required
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.email}</p>
                  )}
                  
                  {universityVerification.error && !fieldErrors.email && formData.userRole !== 'investor' && (
                    <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{universityVerification.error}</p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-gray-900 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/70 ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
                  </div>

                  <div className="group">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-gray-900 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/70 ${fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                {/* University Information Display */}
                {formData.userRole !== 'investor' && universityVerification.verified && universityVerification.university && (
                  <div className="group">
                    <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Verified University
                    </label>
                    <div className="p-4 rounded-lg border-2" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981'}}>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-lg font-semibold font-canva-sans text-green-700">
                            {universityVerification.university.name}
                          </p>
                          <p className="text-sm font-canva-sans text-green-600">
                            {universityVerification.university.city}, {universityVerification.university.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.userRole === 'investor' && (
                  <div className="group">
                    <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Account Type
                    </label>
                    <div className="p-4 rounded-lg border-2" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6'}}>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-lg font-semibold font-canva-sans text-blue-700">
                            💼 Investor Account
                          </p>
                          <p className="text-sm font-canva-sans text-blue-600">
                            No university affiliation required
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Field */}
                <div className="group">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/70"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Investor Interests (only for investors) */}
                {formData.userRole === 'investor' && (
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Investment Interests (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'AI', label: 'AI', icon: '🤖' },
                        { id: 'Web Dev', label: 'Web Dev', icon: '💻' },
                        { id: 'Fintech', label: 'Fintech', icon: '💰' },
                        { id: 'Robotics', label: 'Robotics', icon: '🤖' },
                        { id: 'Biotech', label: 'Biotech', icon: '🧬' },
                        { id: 'Climate', label: 'Climate', icon: '🌍' },
                        { id: 'Hardware', label: 'Hardware', icon: '⚙️' },
                        { id: 'SaaS', label: 'SaaS', icon: '☁️' },
                        { id: 'EdTech', label: 'EdTech', icon: '📚' },
                        { id: 'HealthTech', label: 'HealthTech', icon: '🏥' },
                        { id: 'Social Impact', label: 'Social Impact', icon: '💝' },
                        { id: 'Gaming', label: 'Gaming', icon: '🎮' },
                      ].map((interest) => (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              interests: prev.interests.includes(interest.id)
                                ? prev.interests.filter(i => i !== interest.id)
                                : [...prev.interests, interest.id]
                            }));
                          }}
                          className={`px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                            formData.interests.includes(interest.id)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white/50 text-gray-700 hover:bg-white/70'
                          }`}
                        >
                          <span>{interest.icon}</span>
                          <span>{interest.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Your interests help us show you relevant projects in your feed
                    </p>
                  </div>
                )}

                {/* Bio Field */}
                <div className="group">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/About You
                  </label>
                  <div className="relative">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/70 resize-none"
                      placeholder="Tell us about yourself, your interests, skills, or what you're passionate about...

Examples: 
• Student: Computer Science major interested in AI and startup development
• Professor: AI researcher focused on machine learning applications in healthcare
• Investor: Early-stage investor focused on edtech and fintech startups"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">This will be displayed on your public profile</p>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agree-terms"
                      name="agree-terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agree-terms" className="text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border-2 p-4 animate-fade-in-up mt-6" style={{
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

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              {step === 2 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-4 border-2 rounded-xl shadow-sm bg-white/50 backdrop-blur-sm text-base font-medium font-canva-sans hover:bg-white/70 hover:scale-105 transition-all duration-200"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  color: 'var(--secondary-charcoal)'
                }}
              >
                Back
              </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 group relative flex justify-center py-3 px-4 border-2 border-transparent text-base font-medium font-canva-sans rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  
                }}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-white group-hover:text-blue-200 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={step === 1 ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                    </svg>
                  )}
                </span>
                {isLoading ? 'Creating account...' : step === 1 ? 'Continue' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
            By creating an account, you agree to our{' '}
            <a href="/terms" className="font-medium hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="font-medium hover:scale-105 transition-all duration-200" style={{color: 'var(--primary-orange)'}}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
