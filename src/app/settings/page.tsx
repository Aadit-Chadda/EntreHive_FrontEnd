'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/lib/auth';
import { ProfileUpdateData, UserRole } from '@/types';
import { ApiError } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileUpdateData>({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    user_role: profile?.user_role || 'student',
    bio: profile?.bio || '',
    location: profile?.location || '',
    university: profile?.university || '',
    university_name: profile?.university_name || '',
    major: profile?.major || '',
    graduation_year: profile?.graduation_year || undefined,
    department: profile?.department || '',
    research_interests: profile?.research_interests || '',
    investment_focus: profile?.investment_focus || '',
    company: profile?.company || '',
    linkedin_url: profile?.linkedin_url || '',
    website_url: profile?.website_url || '',
    github_url: profile?.github_url || '',
    is_profile_public: profile?.is_profile_public ?? true,
    show_email: profile?.show_email ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      await AuthService.uploadProfilePicture(file);
      await updateProfile({}); // Refresh profile data
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!profile?.profile_picture) return;

    setUploadingImage(true);
    setError('');

    try {
      await AuthService.deleteProfilePicture();
      await updateProfile({}); // Refresh profile data
      setSuccess('Profile picture deleted successfully!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete image');
    } finally {
      setUploadingImage(false);
    }
  };

  const getRoleSpecificFields = () => {
    if (!profile) return null;

    switch (formData.user_role) {
      case 'student':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                <input
                  type="number"
                  name="graduation_year"
                  value={formData.graduation_year || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  placeholder="e.g., 2025"
                  min="1950"
                  max="2030"
                />
              </div>
            </div>
          </>
        );
      case 'professor':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="e.g., Computer Science Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Research Interests</label>
              <textarea
                name="research_interests"
                value={formData.research_interests || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="Describe your research interests and areas of expertise..."
              />
            </div>
          </>
        );
      case 'investor':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company/Fund</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="e.g., Silicon Valley Ventures"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Focus</label>
              <textarea
                name="investment_focus"
                value={formData.investment_focus || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="Describe your investment focus, stage preferences, and target industries..."
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-1/3 rounded mb-4"></div>
            <div className="bg-gray-300 h-64 rounded"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <button
              onClick={() => {
                if (isEditing) {
                  setFormData({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    user_role: profile.user_role,
                    bio: profile.bio || '',
                    location: profile.location || '',
                    university: profile.university || '',
                    major: profile.major || '',
                    graduation_year: profile.graduation_year || undefined,
                    department: profile.department || '',
                    research_interests: profile.research_interests || '',
                    investment_focus: profile.investment_focus || '',
                    company: profile.company || '',
                    linkedin_url: profile.linkedin_url || '',
                    website_url: profile.website_url || '',
                    github_url: profile.github_url || '',
                    is_profile_public: profile.is_profile_public,
                    show_email: profile.show_email,
                  });
                }
                setIsEditing(!isEditing);
                setError('');
                setSuccess('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                    {profile.first_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Upload Photo
                </button>
                {profile.profile_picture && (
                  <button
                    onClick={handleDeleteImage}
                    disabled={uploadingImage}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                <input
                  type="text"
                  name="university"
                  value={profile?.university_name || 'No university set'}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  University changes require verification. Contact support if needed.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Role-Specific Fields */}
            {getRoleSpecificFields()}

            {/* Social Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_profile_public"
                    checked={formData.is_profile_public}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">Make my profile visible to other users</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="show_email"
                    checked={formData.show_email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">Show my email address to other users</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>

          {/* Profile Stats */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Username:</span> {profile.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {profile.email}
              </div>
              <div>
                <span className="font-medium">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
