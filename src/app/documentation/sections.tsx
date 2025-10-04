import React from 'react';
import { CodeBracketIcon, ServerIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export function FrontendAuth() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Authentication System</h1>
        <p className="text-lg text-secondary-charcoal">
          JWT-based authentication with refresh tokens and protected routes
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Authentication Flow</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">User Login</h3>
              <p className="text-sm text-gray-600">User submits email and password to <code>/api/auth/login/</code></p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Token Generation</h3>
              <p className="text-sm text-gray-600">Backend validates credentials and returns access + refresh tokens</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Token Storage</h3>
              <p className="text-sm text-gray-600">Tokens stored in localStorage (access) and httpOnly cookie (refresh)</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Profile Fetch</h3>
              <p className="text-sm text-gray-600">Fetch user profile data and store in AuthContext</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Role-Based Redirect</h3>
              <p className="text-sm text-gray-600">Investors → /investors dashboard, Others → /feed</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">AuthContext Implementation</h2>
        
        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: AuthUser | null;           // Basic user info
  profile: EnhancedUserProfile | null; // Full profile with posts/projects
  isLoading: boolean;               // Loading state
  isAuthenticated: boolean;         // Auth status
  login: (email, password) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data) => Promise<UserProfile>;
}

// Usage in components
const { user, profile, isAuthenticated } = useAuth();`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Protected Routes</h2>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            All authenticated pages use the ProtectedRoute wrapper or useEffect checks to ensure user is logged in.
          </p>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm"><code>{`// Pattern 1: useEffect check
useEffect(() => {
  if (!isLoading && !user) {
    router.push('/login');
  }
}, [user, isLoading, router]);

// Pattern 2: Admin-only access
useEffect(() => {
  if (!isLoading) {
    if (!user) {
      router.push('/login');
    } else if (user.user_role !== 'investor') {
      router.push('/forbidden'); // 403 page
    }
  }
}, [user, isLoading, router]);`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Token Refresh Strategy</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Automatic Token Refresh</h3>
          <p className="text-sm text-blue-800">
            When API returns 401 Unauthorized, the API client automatically attempts to refresh the access token using the refresh token.
            If refresh fails, user is logged out and redirected to login page.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">User Roles</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              role: 'Student',
              value: 'student',
              access: 'Feed, Projects, Profile, Settings',
              features: 'Create posts, join projects, follow users'
            },
            {
              role: 'Professor',
              value: 'professor',
              access: 'Feed, Projects, Profile, Settings',
              features: 'Create posts, create projects, mentor students'
            },
            {
              role: 'Investor (Admin)',
              value: 'investor',
              access: 'All pages + Admin Dashboard + Documentation',
              features: 'Full platform access, admin tools, analytics'
            }
          ].map((role) => (
            <div key={role.value} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-2">{role.role}</h3>
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-gray-500">Value:</span>
                  <code className="ml-1 text-primary-orange">{role.value}</code>
                </div>
                <div>
                  <span className="text-gray-500">Access:</span>
                  <p className="text-gray-700 mt-1">{role.access}</p>
                </div>
                <div>
                  <span className="text-gray-500">Features:</span>
                  <p className="text-gray-700 mt-1">{role.features}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function FrontendTypes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">TypeScript Types</h1>
        <p className="text-lg text-secondary-charcoal">
          Type definitions for type-safe development (src/types/index.ts)
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Core Types</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <div className="text-xs text-gray-400 mb-2">User & Auth Types</div>
            <pre className="text-sm"><code>{`export type UserRole = "student" | "professor" | "investor";

export interface AuthUser {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_role?: UserRole;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  user_role: UserRole;
  profile_picture?: string;
  bio?: string;
  location?: string;
  university?: string;
  // ... role-specific fields
  followers_count: number;
  following_count: number;
  is_following: boolean;
}`}</code></pre>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <div className="text-xs text-gray-400 mb-2">Post Types</div>
            <pre className="text-sm"><code>{`export interface PostData {
  id: string;
  author: PostAuthor;
  content: string;
  image_url?: string;
  visibility: "public" | "university" | "private";
  tagged_projects: PostProject[];
  is_edited: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  comments?: PostComment[];
  can_edit: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostCreateData {
  content: string;
  visibility?: "public" | "university" | "private";
  tagged_project_ids?: string[];
  image?: File;
}`}</code></pre>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <div className="text-xs text-gray-400 mb-2">Project Types</div>
            <pre className="text-sm"><code>{`export interface ProjectData {
  id: string;
  title: string;
  owner: ProjectUser;
  team_members: ProjectUser[];
  project_type: "startup" | "side_project" | "research" 
                | "hackathon" | "course_project";
  status: "concept" | "mvp" | "launched";
  summary?: string;
  needs: ("design" | "dev" | "marketing" | "research" 
         | "funding" | "mentor")[];
  categories: string[];
  tags: string[];
  visibility: "private" | "university" | "public";
  banner_style: "gradient" | "image";
  banner_gradient: string;
  banner_image?: string | null;
  created_at: string;
  team_count: number;
  is_team_member: boolean;
  can_edit: boolean;
}`}</code></pre>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <div className="text-xs text-gray-400 mb-2">Feed Types</div>
            <pre className="text-sm"><code>{`export interface TimelineItem {
  content_type: 'post' | 'project';
  content_id: string;
  score: number;
  content: PostData | ProjectData;
  user_interactions: string[];
  viewed: boolean;
  clicked: boolean;
  liked: boolean;
}

export interface TimelineResponse {
  results: TimelineItem[];
  count: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  next: string | null;
  previous: string | null;
}`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Validation with Zod</h2>
        
        <div className="space-y-3">
          <p className="text-gray-700">
            Some types use Zod schemas for runtime validation, especially for forms and API responses.
          </p>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm"><code>{`import { z } from "zod";

export const ProjectType = z.enum([
  "startup", 
  "side_project", 
  "research", 
  "hackathon", 
  "course_project"
]);

export const Visibility = z.enum([
  "private", 
  "university", 
  "public"
]);`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Type Usage Best Practices</h2>
        
        <div className="grid gap-4">
          {[
            {
              title: 'Always Import Types',
              desc: 'Import types from @/types for consistency',
              example: `import { UserProfile, PostData } from '@/types';`
            },
            {
              title: 'Use Proper Interfaces',
              desc: 'Use specific interfaces for API responses',
              example: `const [posts, setPosts] = useState<PostData[]>([]);`
            },
            {
              title: 'Optional Props',
              desc: 'Mark optional fields with ? for flexibility',
              example: `image_url?: string;`
            },
            {
              title: 'Union Types',
              desc: 'Use union types for enums and variants',
              example: `visibility: "public" | "university" | "private";`
            }
          ].map((practice) => (
            <div key={practice.title} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-1">{practice.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{practice.desc}</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 block">{practice.example}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function BackendStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Backend Structure</h1>
        <p className="text-lg text-secondary-charcoal">
          Django REST Framework backend with modular app architecture
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Project Structure</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800">{`entrehive_backend/
├── entrehive_backend/       # Main project configuration
│   ├── settings.py         # Django settings
│   ├── urls.py            # Root URL configuration
│   └── wsgi.py            # WSGI application
├── accounts/              # User accounts & profiles
│   ├── models.py         # UserProfile model
│   ├── serializers.py    # Profile serializers
│   ├── views.py          # Profile views & endpoints
│   └── urls.py           # Profile URL routing
├── posts/                # Posts & social features
│   ├── models.py         # Post, Comment, Like models
│   ├── serializers.py    # Post serializers
│   ├── views.py          # Post CRUD & interactions
│   └── urls.py           # Post endpoints
├── projects/             # Project management
│   ├── models.py         # Project, TeamMember models
│   ├── serializers.py    # Project serializers
│   ├── views.py          # Project CRUD & team mgmt
│   └── urls.py           # Project endpoints
├── feed/                 # Timeline feed system
│   ├── models.py         # ContentScore, UserInteraction
│   ├── views.py          # Feed generation & curation
│   ├── urls.py           # Feed endpoints
│   └── management/       # Management commands
├── notifications/        # Notification system
│   ├── models.py         # Notification model
│   ├── views.py          # Notification endpoints
│   └── urls.py           # Notification routing
├── contact/             # Contact form handling
│   ├── models.py        # ContactInquiry model
│   ├── views.py         # Contact submission
│   └── urls.py          # Contact endpoints
├── universities/        # University management
│   ├── models.py        # University model
│   ├── views.py         # University endpoints
│   └── urls.py          # University routing
├── media/               # User-uploaded files
│   ├── profile_pictures/
│   ├── profile_banners/
│   ├── project_banners/
│   └── post_images/
├── db.sqlite3          # SQLite database (dev)
├── manage.py           # Django management CLI
└── requirements.txt    # Python dependencies`}</pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Django Apps Overview</h2>
        
        <div className="space-y-4">
          {[
            {
              app: 'accounts',
              purpose: 'User management, profiles, authentication, and follow system',
              models: ['User (Django built-in)', 'UserProfile', 'Follow'],
              key_features: [
                'JWT authentication',
                'Role-based profiles (student/professor/investor)',
                'Profile customization (bio, links, banner)',
                'Follow/unfollow functionality',
                'Public profile browsing'
              ]
            },
            {
              app: 'posts',
              purpose: 'Social posts, comments, likes, and interactions',
              models: ['Post', 'Comment', 'Like'],
              key_features: [
                'Create/edit/delete posts',
                'Image uploads',
                'Nested comments (replies)',
                'Like/unlike posts',
                'Visibility controls (public/university/private)',
                'Project tagging'
              ]
            },
            {
              app: 'projects',
              purpose: 'Project management, teams, and collaboration',
              models: ['Project', 'ProjectInvitation'],
              key_features: [
                'Project CRUD operations',
                'Team member management',
                'Project invitations',
                'Project types (startup/research/hackathon/etc.)',
                'Status tracking (concept/mvp/launched)',
                'Skills needed tracking'
              ]
            },
            {
              app: 'feed',
              purpose: 'Intelligent content curation and timeline generation',
              models: ['ContentScore', 'UserInteraction', 'FeedConfiguration', 'TimelineFeedCache', 'TrendingTopic'],
              key_features: [
                'On-demand feed generation',
                'Multi-factor scoring algorithm',
                'Follow priority boost (+20 score)',
                'Content balancing (60% posts, 40% projects)',
                'Personalized feeds (home/university/public)',
                'Interaction tracking'
              ]
            },
            {
              app: 'notifications',
              purpose: 'Real-time notifications for user activities',
              models: ['Notification'],
              key_features: [
                'Like notifications',
                'Comment notifications',
                'Follow notifications',
                'Project invite notifications',
                'Mark as read functionality'
              ]
            },
            {
              app: 'contact',
              purpose: 'Contact form submissions and inquiry management',
              models: ['ContactInquiry'],
              key_features: [
                'Contact form submissions',
                'Inquiry categorization',
                'Priority management',
                'Status tracking',
                'Admin management interface'
              ]
            },
            {
              app: 'universities',
              purpose: 'University database and verification',
              models: ['University'],
              key_features: [
                'University database',
                'University search',
                'Verification system',
                'University-specific content filtering'
              ]
            }
          ].map((app) => (
            <div key={app.app} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-primary-black">{app.app}</h3>
                  <p className="text-sm text-gray-600 mt-1">{app.purpose}</p>
                </div>
                <ServerIcon className="h-6 w-6 text-primary-orange flex-shrink-0" />
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Models:</h4>
                <div className="flex flex-wrap gap-2">
                  {app.models.map((model) => (
                    <code key={model} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {model}
                    </code>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {app.key_features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-orange mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Database Schema Highlights</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Key Relationships</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• User (1) ↔ (1) UserProfile - One-to-one profile extension</li>
              <li>• User (1) ↔ (*) Post - One user, many posts</li>
              <li>• User (1) ↔ (*) Project (owner) - One user owns many projects</li>
              <li>• Project (*) ↔ (*) User (team_members) - Many-to-many for teams</li>
              <li>• Post (1) ↔ (*) Comment - One post, many comments</li>
              <li>• User (*) ↔ (*) User (following) - Many-to-many for follows</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Performance Optimizations</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Database indexes on foreign keys and search fields</li>
              <li>• Select_related() and prefetch_related() for query optimization</li>
              <li>• Pagination on all list endpoints</li>
              <li>• Cached counts (likes_count, comments_count) to avoid joins</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export function BackendTechStack() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Backend Tech Stack</h1>
        <p className="text-lg text-secondary-charcoal">
          Modern Python stack with Django REST Framework
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Core Technologies</h2>
        
        <div className="grid gap-6">
          {[
            {
              name: 'Django 5.1',
              category: 'Web Framework',
              purpose: 'High-level Python web framework for rapid development',
              features: [
                'ORM for database operations',
                'Admin interface',
                'Authentication system',
                'URL routing',
                'Template engine'
              ],
              version: '5.1.x'
            },
            {
              name: 'Django REST Framework',
              category: 'API Framework',
              purpose: 'Powerful toolkit for building Web APIs',
              features: [
                'Serializers for data validation',
                'ViewSets for CRUD operations',
                'Browsable API interface',
                'Authentication classes',
                'Pagination support'
              ],
              version: '3.14.x'
            },
            {
              name: 'dj-rest-auth',
              category: 'Authentication',
              purpose: 'Drop-in API endpoints for auth operations',
              features: [
                'Registration endpoint',
                'Login/logout endpoints',
                'Password reset',
                'JWT token support',
                'Social authentication ready'
              ],
              version: '5.0.x'
            },
            {
              name: 'djangorestframework-simplejwt',
              category: 'JWT Tokens',
              purpose: 'JSON Web Token authentication for DRF',
              features: [
                'Access and refresh tokens',
                'Token blacklisting',
                'Custom token claims',
                'Sliding tokens',
                'Token refresh rotation'
              ],
              version: '5.3.x'
            },
            {
              name: 'Pillow',
              category: 'Image Processing',
              purpose: 'Python imaging library for image uploads',
              features: [
                'Image validation',
                'Thumbnail generation',
                'Format conversion',
                'Image optimization',
                'EXIF data handling'
              ],
              version: '10.x'
            },
            {
              name: 'django-cors-headers',
              category: 'CORS',
              purpose: 'Handle Cross-Origin Resource Sharing',
              features: [
                'Allow frontend requests',
                'Configurable origins',
                'Credential support',
                'Custom headers',
                'Method restrictions'
              ],
              version: '4.3.x'
            },
            {
              name: 'python-dotenv',
              category: 'Configuration',
              purpose: 'Environment variable management',
              features: [
                'Load .env files',
                'Development/production configs',
                'Secret management',
                'Easy configuration',
                'Version control friendly'
              ],
              version: '1.0.x'
            }
          ].map((tech) => (
            <div key={tech.name} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-orange transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-bold text-primary-black">{tech.name}</h3>
                    <span className="text-xs px-2 py-1 bg-primary-orange text-white rounded">
                      v{tech.version}
                    </span>
                  </div>
                  <p className="text-xs text-primary-orange font-semibold mb-2">{tech.category}</p>
                  <p className="text-sm text-gray-600">{tech.purpose}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tech.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-start">
                      <span className="text-primary-orange mr-1.5">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Database</h2>
        
        <div className="border-2 border-gray-200 rounded-lg p-5">
          <div className="flex items-center space-x-3 mb-3">
            <ServerIcon className="h-8 w-8 text-primary-orange" />
            <div>
              <h3 className="text-lg font-bold text-primary-black">SQLite3</h3>
              <p className="text-xs text-gray-500">Development Database</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Currently using SQLite3 for development. For production, easily migrate to PostgreSQL or MySQL.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> For production deployment, consider PostgreSQL for better performance and scalability.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Development Tools</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              tool: 'Django Admin',
              purpose: 'Built-in admin interface for data management',
              url: '/admin/'
            },
            {
              tool: 'DRF Browsable API',
              purpose: 'Interactive API documentation and testing',
              url: '/api/'
            },
            {
              tool: 'Django Shell',
              purpose: 'Interactive Python shell with Django context',
              command: 'python manage.py shell'
            },
            {
              tool: 'Management Commands',
              purpose: 'Custom CLI commands for tasks',
              command: 'python manage.py <command>'
            }
          ].map((item) => (
            <div key={item.tool} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-1">{item.tool}</h3>
              <p className="text-xs text-gray-600 mb-2">{item.purpose}</p>
              {'url' in item && (
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-primary-orange block">
                  {item.url}
                </code>
              )}
              {'command' in item && (
                <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block">
                  $ {item.command}
                </code>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Deployment Considerations</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Environment Variables</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• SECRET_KEY - Django secret key</p>
              <p>• DEBUG - Debug mode (False in production)</p>
              <p>• DATABASE_URL - Database connection string</p>
              <p>• ALLOWED_HOSTS - Allowed domain names</p>
              <p>• CORS_ALLOWED_ORIGINS - Frontend URLs</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Static & Media Files</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Use whitenoise for static files</p>
              <p>• Use S3/Cloud Storage for media files in production</p>
              <p>• Configure STATIC_ROOT and MEDIA_ROOT</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Additional sections will continue in the next export...

