'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService, validatePassword } from '@/lib/auth';
import { ProfileUpdateData, UserRole } from '@/types';
import { ApiError } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import LeftNavigation from '@/app/components/LeftNavigation';
import { Camera, X, Eye, EyeOff, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  // Scroll to security section if hash is present
  useEffect(() => {
    if (window.location.hash === '#security') {
      setTimeout(() => {
        const element = document.getElementById('security');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

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

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      await AuthService.uploadProfilePicture(file);
      await updateProfile({});
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
      await updateProfile({});
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
                <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Major</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                  style={{
                    borderColor: 'var(--secondary-taupe)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--secondary-charcoal)',
                    
                  }}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Graduation Year</label>
                <input
                  type="number"
                  name="graduation_year"
                  value={formData.graduation_year || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                  style={{
                    borderColor: 'var(--secondary-taupe)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--secondary-charcoal)',
                    
                  }}
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
              <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--secondary-charcoal)',
                  
                }}
                placeholder="e.g., Computer Science Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Research Interests</label>
              <textarea
                name="research_interests"
                value={formData.research_interests || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all resize-none"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--secondary-charcoal)',
                  
                }}
                placeholder="Describe your research interests..."
              />
            </div>
          </>
        );
      case 'investor':
        return (
          <>
            <div>
              <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Company/Fund</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--secondary-charcoal)',
                  
                }}
                placeholder="e.g., Silicon Valley Ventures"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Investment Focus</label>
              <textarea
                name="investment_focus"
                value={formData.investment_focus || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all resize-none"
                style={{
                  borderColor: 'var(--secondary-taupe)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--secondary-charcoal)',
                  
                }}
                placeholder="Describe your investment focus..."
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
        <div className="flex min-h-screen" style={{backgroundColor: 'var(--background)'}}>
          <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 rounded-full" style={{
              borderColor: 'var(--neutral-light-orange)',
              borderTopColor: 'var(--primary-orange)'
            }}></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen" style={{backgroundColor: 'var(--background)'}}>
        <LeftNavigation showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Settings Card */}
            <div className="rounded-2xl shadow-lg border-2 p-8 animate-fade-in-up" style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--primary-orange)'
            }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>
                  Profile Settings
                </h1>
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
                  className="px-6 py-2 rounded-xl font-medium font-canva-sans transition-all duration-200 hover:scale-105 shadow-md"
                  style={{
                    backgroundColor: isEditing ? 'var(--secondary-taupe)' : 'var(--primary-orange)',
                    color: 'white'
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6 mb-8 pb-8 border-b-2" style={{borderColor: 'var(--border)'}}>
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg" style={{borderColor: 'var(--primary-orange)'}}>
                    {profile.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{
                        backgroundColor: 'var(--neutral-light-orange)',
                        color: 'var(--primary-orange)'
                      }}>
                        {profile.first_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                      <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium font-canva-sans transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                      style={{backgroundColor: 'var(--primary-orange)', color: 'white'}}
                    >
                      <Camera className="w-4 h-4" />
                      <span>Upload Photo</span>
                    </button>
                    {profile.profile_picture && (
                      <button
                        onClick={handleDeleteImage}
                        disabled={uploadingImage}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium font-canva-sans transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                        style={{backgroundColor: 'var(--secondary-red)', color: 'white'}}
                      >
                        <X className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs font-canva-sans" style={{color: 'var(--text-muted)'}}>
                      Max 10MB • JPG, PNG, GIF
                    </p>
                  </div>
                )}
              </div>

              {/* Status Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-xl border-2 animate-fade-in-up" style={{
                  backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  borderColor: 'var(--secondary-red)'
                }}>
                  <p className="font-canva-sans font-medium" style={{color: 'var(--secondary-red)'}}>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 rounded-xl border-2 animate-fade-in-up" style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: '#10B981'
                }}>
                  <p className="font-canva-sans font-medium text-green-600">{success}</p>
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                      style={{
                        borderColor: 'var(--secondary-taupe)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--secondary-charcoal)',
                        
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                      style={{
                        borderColor: 'var(--secondary-taupe)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--secondary-charcoal)',
                        
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Role</label>
                    <select
                      name="user_role"
                      value={formData.user_role}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                      style={{
                        borderColor: 'var(--secondary-taupe)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--secondary-charcoal)',
                        
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="professor">Professor</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>University</label>
                    <input
                      type="text"
                      value={profile?.university_name || 'No university set'}
                      disabled
                      className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans cursor-not-allowed opacity-60"
                      style={{
                        borderColor: 'var(--secondary-taupe)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--secondary-charcoal)'
                      }}
                    />
                    <p className="text-xs font-canva-sans mt-1" style={{color: 'var(--text-muted)'}}>
                      University changes require verification
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                    style={{
                      borderColor: 'var(--secondary-taupe)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--secondary-charcoal)',
                      
                    }}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all resize-none"
                    style={{
                      borderColor: 'var(--secondary-taupe)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--secondary-charcoal)',
                      
                    }}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Role-Specific Fields */}
                {getRoleSpecificFields()}

                {/* Social Links */}
                <div className="border-t-2 pt-6" style={{borderColor: 'var(--border)'}}>
                  <h3 className="text-lg font-semibold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                        style={{
                          borderColor: 'var(--secondary-taupe)',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--secondary-charcoal)',
                          
                        }}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>Website</label>
                      <input
                        type="url"
                        name="website_url"
                        value={formData.website_url || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                        style={{
                          borderColor: 'var(--secondary-taupe)',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--secondary-charcoal)',
                          
                        }}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>GitHub</label>
                      <input
                        type="url"
                        name="github_url"
                        value={formData.github_url || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 disabled:opacity-60 transition-all"
                        style={{
                          borderColor: 'var(--secondary-taupe)',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--secondary-charcoal)',
                          
                        }}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="border-t-2 pt-6" style={{borderColor: 'var(--border)'}}>
                  <h3 className="text-lg font-semibold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>Privacy Settings</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_profile_public"
                        checked={formData.is_profile_public}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-5 h-5 rounded transition-colors disabled:opacity-50"
                        style={{
                          accentColor: 'var(--primary-orange)'
                        }}
                      />
                      <span className="text-sm font-canva-sans" style={{color: 'var(--secondary-charcoal)'}}>Make my profile visible to other users</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="show_email"
                        checked={formData.show_email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-5 h-5 rounded transition-colors disabled:opacity-50"
                        style={{
                          accentColor: 'var(--primary-orange)'
                        }}
                      />
                      <span className="text-sm font-canva-sans" style={{color: 'var(--secondary-charcoal)'}}>Show my email address to other users</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t-2" style={{borderColor: 'var(--border)'}}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="px-6 py-3 rounded-xl font-medium font-canva-sans transition-all hover:scale-105 shadow-md"
                      style={{
                        backgroundColor: 'var(--secondary-taupe)',
                        color: 'white'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 rounded-xl font-medium font-canva-sans transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                      style={{
                        backgroundColor: 'var(--primary-orange)',
                        color: 'white'
                      }}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>

              {/* Account Information */}
              <div className="mt-8 pt-6 border-t-2" style={{borderColor: 'var(--border)'}}>
                <h3 className="text-lg font-semibold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>
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

            {/* Security Settings - Change Password */}
            <div id="security">
              <ChangePasswordSection />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function ChangePasswordSection() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setFieldErrors({ newPassword: passwordErrors[0] });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      await AuthService.changePassword({
        old_password: formData.oldPassword,
        new_password1: formData.newPassword,
        new_password2: formData.confirmPassword,
      });
      setSuccess('Password changed successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
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
      setError(apiError.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl shadow-lg border-2 p-8 animate-fade-in-up" style={{
      backgroundColor: 'var(--surface)',
      borderColor: 'var(--primary-orange)'
    }}>
      <div className="mb-6 flex items-center space-x-3">
        <Lock className="w-6 h-6" style={{color: 'var(--primary-orange)'}} />
        <div>
          <h2 className="text-2xl font-extrabold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Security Settings</h2>
          <p className="text-sm font-canva-sans" style={{color: 'var(--text-secondary)'}}>Change your password to keep your account secure</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border-2 animate-fade-in-up" style={{
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderColor: 'var(--secondary-red)'
        }}>
          <p className="font-canva-sans font-medium" style={{color: 'var(--secondary-red)'}}>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 rounded-xl border-2 animate-fade-in-up" style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10B981'
        }}>
          <p className="font-canva-sans font-medium text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
            Current Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              name="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              required
              className={`block w-full px-4 py-3 pr-12 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.oldPassword || fieldErrors.old_password ? 'border-red-300' : ''
              }`}
              style={{
                borderColor: fieldErrors.oldPassword || fieldErrors.old_password ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                backgroundColor: 'var(--surface)',
                color: 'var(--secondary-charcoal)',
                
              }}
              placeholder="Enter your current password"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <EyeOff className="h-5 w-5" style={{color: 'var(--secondary-taupe)'}} />
              ) : (
                <Eye className="h-5 w-5" style={{color: 'var(--secondary-taupe)'}} />
              )}
            </button>
          </div>
          {(fieldErrors.oldPassword || fieldErrors.old_password) && (
            <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.oldPassword || fieldErrors.old_password}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              required
              className={`block w-full px-4 py-3 pr-12 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.newPassword || fieldErrors.new_password1 ? 'border-red-300' : ''
              }`}
              style={{
                borderColor: fieldErrors.newPassword || fieldErrors.new_password1 ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                backgroundColor: 'var(--surface)',
                color: 'var(--secondary-charcoal)',
                
              }}
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" style={{color: 'var(--secondary-taupe)'}} />
              ) : (
                <Eye className="h-5 w-5" style={{color: 'var(--secondary-taupe)'}} />
              )}
            </button>
          </div>
          {(fieldErrors.newPassword || fieldErrors.new_password1) && (
            <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.newPassword || fieldErrors.new_password1}</p>
          )}
          <p className="mt-1 text-xs font-canva-sans" style={{color: 'var(--text-muted)'}}>Must be at least 8 characters with uppercase, lowercase, and number</p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              className={`block w-full px-4 py-3 pr-12 border-2 rounded-xl font-canva-sans focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.confirmPassword || fieldErrors.new_password2 ? 'border-red-300' : ''
              }`}
              style={{
                borderColor: fieldErrors.confirmPassword || fieldErrors.new_password2 ? 'var(--secondary-red)' : 'var(--secondary-taupe)',
                backgroundColor: 'var(--surface)',
                color: 'var(--secondary-charcoal)',
                
              }}
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" style={{color: 'var(--secondary-taupe)'}} />
              ) : (
                <Eye className="h-5 w-5" style={{color: 'var(--secondary-taupe)'}} />
              )}
            </button>
          </div>
          {(fieldErrors.confirmPassword || fieldErrors.new_password2) && (
            <p className="mt-1 text-sm font-canva-sans" style={{color: 'var(--secondary-red)'}}>{fieldErrors.confirmPassword || fieldErrors.new_password2}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-medium font-canva-sans transition-all hover:scale-105 disabled:opacity-50 shadow-md"
            style={{
              backgroundColor: 'var(--primary-orange)',
              color: 'white'
            }}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
