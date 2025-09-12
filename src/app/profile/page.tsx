'use client';

import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import ProjectCard from '../components/ProjectCard';
import { User, Post, Project } from '@/types';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - replace with actual user context/API
  const [user, setUser] = useState<User>({
    id: 'current-user',
    name: 'John Doe',
    handle: 'johndoe',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    location: 'San Francisco, CA',
    university: 'Stanford University',
    department: 'Computer Science',
    education: 'B.S. Computer Science, 2025',
    profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    links: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
      x: 'https://x.com/johndoe',
    },
    following: new Set(['user1', 'user2', 'user3']),
    followers: 234,
    skills: ['React', 'TypeScript', 'Python', 'Machine Learning', 'UI/UX Design'],
    interests: ['AI', 'Startups', 'EdTech', 'Social Impact'],
    bio: 'Computer Science student passionate about building products that make a difference. Currently working on AI-powered educational tools and exploring the intersection of technology and social impact.',
  });

  // Mock posts - replace with actual API
  const [userPosts, setUserPosts] = useState<Post[]>([
    {
      id: '1',
      authorId: 'current-user',
      type: 'showcase',
      title: 'Just launched my new AI study assistant!',
      body: 'After months of development, I\'m excited to share my AI-powered study assistant. It uses personalized learning algorithms to help students study more effectively. Would love your feedback!',
      media: {
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'
      },
      tags: ['AI', 'EdTech', 'Launch'],
      categories: ['Technology', 'Education'],
      likes: 42,
      comments: 8,
      saves: 15,
      createdAt: '2024-01-15T10:30:00Z',
      isLiked: false,
      isSaved: false,
      visibility: 'university',
      projectId: '1'
    },
    {
      id: '2',
      authorId: 'current-user',
      type: 'help',
      title: 'Looking for a marketing co-founder',
      body: 'Building a sustainable fashion marketplace and need someone with marketing expertise to join the team. Great opportunity for someone passionate about sustainability!',
      tags: ['co-founder', 'marketing', 'sustainability'],
      categories: ['Business', 'Sustainability'],
      likes: 18,
      comments: 12,
      saves: 6,
      createdAt: '2024-01-10T14:20:00Z',
      isLiked: false,
      isSaved: false,
      visibility: 'cross_university',
      projectId: '3'
    }
  ]);

  // Mock projects - replace with actual API
  const [userProjects, setUserProjects] = useState<(Project & { owner: { name: string; handle: string; avatar: string } })[]>([
    {
      id: '1',
      ownerId: 'current-user',
      title: 'AI-Powered Study Assistant',
      type: 'startup',
      status: 'mvp',
      summary: 'An intelligent study companion that helps students learn more effectively using personalized AI recommendations and spaced repetition algorithms.',
      needs: ['funding', 'marketing', 'dev'],
      categories: ['AI', 'EdTech'],
      tags: ['machine-learning', 'education', 'productivity'],
      previewImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
      pitchUrl: 'https://youtube.com/watch?v=example',
      repoUrl: 'https://github.com/johndoe/study-assistant',
      visibility: 'university',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      teamMembers: ['user2', 'user3'],
      owner: {
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      }
    },
    {
      id: '3',
      ownerId: 'current-user',
      title: 'Sustainable Fashion Marketplace',
      type: 'startup',
      status: 'concept',
      summary: 'A peer-to-peer marketplace for students to buy, sell, and trade sustainable clothing. Promoting circular fashion economy on campus.',
      needs: ['mentor', 'funding', 'marketing'],
      categories: ['Fashion', 'Sustainability', 'E-commerce'],
      tags: ['sustainability', 'fashion', 'marketplace', 'circular-economy'],
      previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      visibility: 'cross_university',
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-05'),
      teamMembers: ['user4'],
      owner: {
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      }
    }
  ]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save user data to API
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              {/* Name and Handle */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">@{user.handle}</p>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{user.bio}</p>
              )}

              {/* Education & Location */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {user.university && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                    </svg>
                    <span>{user.university}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{user.location}</span>
                  </div>
                )}
                {user.education && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span>{user.education}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{user.following.size}</span>
                  <span className="text-gray-600 dark:text-gray-400">Following</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{user.followers}</span>
                  <span className="text-gray-600 dark:text-gray-400">Followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{userProjects.length}</span>
                  <span className="text-gray-600 dark:text-gray-400">Projects</span>
                </div>
              </div>

              {/* Links */}
              {user.links && Object.values(user.links).some(link => link) && (
                <div className="flex flex-wrap gap-3">
                  {user.links.website && (
                    <a
                      href={user.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Website</span>
                    </a>
                  )}
                  {user.links.github && (
                    <a
                      href={user.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.links.linkedin && (
                    <a
                      href={user.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              )}

              {/* Skills & Interests */}
              <div className="space-y-3">
                {user.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.interests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Posts ({userPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Projects ({userProjects.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map(post => (
                    <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <PostCard
                        post={{
                          ...post,
                          author: {
                            name: user.name,
                            username: user.handle,
                            avatar: user.avatar,
                          },
                          timestamp: new Date(post.createdAt),
                          isFollowing: false
                        }}
                        onLike={(postId) => console.log('Liked post:', postId)}
                        onFollow={(postId) => console.log('Followed user from post:', postId)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Start sharing your thoughts and ideas with the community.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                {userProjects.length > 0 ? (
                  userProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onLike={(projectId) => console.log('Liked project:', projectId)}
                      onSave={(projectId) => console.log('Saved project:', projectId)}
                      onJoinTeam={(projectId) => console.log('Join team:', projectId)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Create your first project to showcase your work.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
