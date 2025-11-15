'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Bell, ChevronDown, MapPin, Briefcase, Target, ExternalLink, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeToggle } from '../../components/ThemeProvider';
import VerificationWarningBanner from '../../components/VerificationWarningBanner';
import { apiClient, ApiError } from '@/lib/api';

export default function InvestorProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [savingInterests, setSavingInterests] = useState(false);

  const handleResendVerification = async () => {
    setIsResendingVerification(true);

    try {
      // Use apiClient which automatically sends httpOnly cookies
      await apiClient.post<{ message: string }>('/api/accounts/resend-verification/', {});
      alert('Verification email sent! Please check your inbox.');
      await refreshProfile(); // Refresh to update verification_sent_at
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.details?.error || 'An error occurred while sending verification email');
      console.error('Resend verification error:', err);
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Initialize interests from profile
  useEffect(() => {
    if (profile?.interests) {
      setSelectedInterests(profile.interests);
    }
  }, [profile]);

  // Check if user is investor
  useEffect(() => {
    if (user && user.user_role && user.user_role !== 'investor') {
      router.push('/forbidden');
    }
  }, [user, router]);

  const availableInterests = [
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
  ];

  const handleSaveInterests = async () => {
    setSavingInterests(true);
    try {
      // Use apiClient which automatically sends httpOnly cookies
      await apiClient.put('/api/feed/investor/interests/', { interests: selectedInterests });
      await refreshProfile();
      setEditingInterests(false);
      alert('Interests updated successfully!');
    } catch (error) {
      console.error('Error updating interests:', error);
      alert('Failed to update interests');
    } finally {
      setSavingInterests(false);
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  if (!user || user.user_role !== 'investor' || !profile) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg border-b" 
             style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/investors" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>EntreHive</span>
                  <span className="text-xl font-bold font-roca-two" style={{ color: 'var(--primary-orange)' }}>Investors</span>
                </div>
              </Link>

              {/* Center - Discover */}
              <div className="hidden md:block">
                <Link href="/investors" className="font-canva-sans font-semibold text-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                  Discover
                </Link>
              </div>

              {/* Right Side - Theme Toggle, Notifications, Profile */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link href="/investors/notifications" 
                      className="relative p-2 rounded-lg transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Bell className="w-5 h-5" />
                </Link>
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-orange-500"
                     style={{ background: 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--accent-pine) 100%)' }}>
                  {profile.profile_picture ? (
                    <img src={profile.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm font-roca-two">
                      {user.username[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Email Verification Warning */}
          {profile && profile.should_show_verification_warning && (
            <VerificationWarningBanner
              daysUntilDisabled={profile.days_until_disabled}
              onResendEmail={handleResendVerification}
              isResending={isResendingVerification}
            />
          )}

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border mb-6"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {/* Banner */}
            <div className="h-48 relative"
                 style={{ 
                   background: profile.banner_style === 'image' && profile.banner_image
                     ? `url(${profile.banner_image})`
                     : 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 50%, var(--accent-pine) 100%)'
                 }}>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-6">
                <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden"
                     style={{ background: 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--accent-pine) 100%)', borderColor: 'var(--surface)' }}>
                  {profile.profile_picture ? (
                    <img src={profile.profile_picture} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-5xl font-roca-two">
                      {user.username[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end pt-4">
                <Link href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold font-canva-sans border transition-all duration-200 hover:scale-105"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--hover-bg)' }}>
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>

              {/* Name and Role */}
              <div className="mt-4">
                <h1 className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--text-primary)' }}>
                  {profile.full_name || user.username}
                </h1>
                <p className="text-lg font-canva-sans mb-2" style={{ color: 'var(--text-secondary)' }}>
                  @{user.username}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                     style={{ background: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                  💼 Investor
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-base font-canva-sans leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {profile.bio}
                </p>
              )}

              {/* Details Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    <span className="font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                      {profile.location}
                    </span>
                  </div>
                )}
                
                {profile.company && (
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    <span className="font-canva-sans" style={{ color: 'var(--text-primary)' }}>
                      {profile.company}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profile.linkedin_url || profile.website_url) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center space-x-2 px-4 py-2 rounded-lg font-canva-sans transition-all duration-200 hover:scale-105"
                       style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                      <ExternalLink className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center space-x-2 px-4 py-2 rounded-lg font-canva-sans transition-all duration-200 hover:scale-105"
                       style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                      <ExternalLink className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Investment Focus */}
          {profile.investment_focus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 border mb-6"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6" style={{ color: 'var(--primary-orange)' }} />
                <h2 className="text-2xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                  Investment Focus
                </h2>
              </div>
              <p className="text-base font-canva-sans leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {profile.investment_focus}
              </p>
            </motion.div>
          )}

          {/* Investment Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 border mb-6"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6" style={{ color: 'var(--accent-pine)' }} />
                <h2 className="text-2xl font-bold font-roca-two" style={{ color: 'var(--text-primary)' }}>
                  Investment Interests
                </h2>
              </div>
              <button
                onClick={() => setEditingInterests(!editingInterests)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold font-canva-sans border transition-all duration-200 hover:scale-105"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--hover-bg)' }}>
                <Edit className="w-4 h-4" />
                <span>{editingInterests ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {!editingInterests ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest: string) => {
                    const interestData = availableInterests.find(i => i.id === interest);
                    return (
                      <div
                        key={interest}
                        className="px-4 py-2 rounded-lg border-2 font-medium text-sm flex items-center space-x-2"
                        style={{ borderColor: 'var(--accent-pine)', background: 'rgba(111, 136, 122, 0.1)', color: 'var(--text-primary)' }}>
                        <span>{interestData?.icon || '🎯'}</span>
                        <span>{interest}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-base font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                    No interests selected. Click Edit to add your investment interests.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                        selectedInterests.includes(interest.id)
                          ? 'text-white'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        borderColor: selectedInterests.includes(interest.id) ? 'var(--accent-pine)' : 'var(--border)',
                        background: selectedInterests.includes(interest.id) ? 'var(--accent-pine)' : 'var(--hover-bg)',
                        color: selectedInterests.includes(interest.id) ? 'white' : 'var(--text-primary)'
                      }}>
                      <span>{interest.icon}</span>
                      <span>{interest.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedInterests(profile?.interests || []);
                      setEditingInterests(false);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold font-canva-sans transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInterests}
                    disabled={savingInterests}
                    className="px-6 py-2 rounded-lg font-semibold font-canva-sans text-white transition-all duration-200 hover:scale-105"
                    style={{ background: savingInterests ? 'var(--border)' : 'var(--accent-pine)' }}>
                    {savingInterests ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                <p className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                  Your interests help us show you relevant projects in your feed
                </p>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-6 text-center border"
                 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--primary-orange)' }}>
                {profile.following_count}
              </div>
              <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                Following
              </div>
            </div>
            
            <div className="rounded-xl p-6 text-center border"
                 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--accent-pine)' }}>
                {profile.followers_count}
              </div>
              <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                Followers
              </div>
            </div>
            
            <div className="rounded-xl p-6 text-center border col-span-2 md:col-span-1"
                 style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="text-3xl font-bold font-roca-two mb-1" style={{ color: 'var(--accent-terracotta)' }}>
                0
              </div>
              <div className="text-sm font-canva-sans" style={{ color: 'var(--text-secondary)' }}>
                Saved Projects
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

