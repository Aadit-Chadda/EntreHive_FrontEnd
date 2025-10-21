'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  ServerIcon, 
  CogIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  CommandLineIcon,
  CubeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { 
  FrontendAuth, 
  FrontendTypes, 
  BackendStructure, 
  BackendTechStack 
} from './sections';
import { 
  APIOverview, 
  APIDocs 
} from './api-sections';
import { 
  FeedSystem, 
  AdminOverview, 
  AdminFeatures, 
  AdminContact 
} from './admin-sections';
import {
  EmailSystem,
  EmailVerification,
  EmailTemplates,
  EmailConfiguration
} from './email-sections';
import {
  InvestorFeedOverview,
  InterestManagement,
  FeedFeatures,
  TechnicalImplementation,
  UserFlow,
  Testing
} from './investor-feed-sections';

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections: {
    id: string;
    title: string;
  }[];
}

export default function DocumentationPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('frontend-overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['dev']));

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (
        user.user_role !== 'investor' && 
        !profile?.is_staff && 
        !profile?.is_superuser
      ) {
        // Only investors (admins), staff, or superusers can access
        router.push('/forbidden');
      }
    }
  }, [user, profile, isLoading, router]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const sections: Section[] = [
    {
      id: 'dev',
      title: 'Development',
      icon: CodeBracketIcon,
      subsections: [
        { id: 'frontend-overview', title: 'Frontend Overview' },
        { id: 'frontend-components', title: 'Components' },
        { id: 'frontend-auth', title: 'Authentication' },
        { id: 'frontend-types', title: 'TypeScript Types' },
        { id: 'backend-structure', title: 'Backend Structure' },
        { id: 'backend-tech-stack', title: 'Tech Stack' },
        { id: 'api-overview', title: 'API Overview' },
        { id: 'api-docs', title: 'API Documentation' },
        { id: 'feed-system', title: 'Feed System' },
      ]
    },
    {
      id: 'email',
      title: 'Email System',
      icon: EnvelopeIcon,
      subsections: [
        { id: 'email-system', title: 'Email Overview' },
        { id: 'email-verification', title: 'Email Verification' },
        { id: 'email-templates', title: 'Template Details' },
        { id: 'email-configuration', title: 'Configuration & Setup' },
      ]
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: ShieldCheckIcon,
      subsections: [
        { id: 'admin-overview', title: 'Admin Overview' },
        { id: 'admin-features', title: 'Features & Capabilities' },
        { id: 'admin-contact', title: 'Contact Management' },
      ]
    },
    {
      id: 'investor-feed',
      title: 'Investor Feed',
      icon: CubeIcon,
      subsections: [
        { id: 'investor-feed-overview', title: 'Overview' },
        { id: 'interest-management', title: 'Interest Management' },
        { id: 'feed-features', title: 'Feed Features' },
        { id: 'technical-implementation', title: 'Technical Details' },
        { id: 'user-flow', title: 'User Flow & Best Practices' },
        { id: 'testing', title: 'Testing Guide' },
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-off-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto mb-4"></div>
          <p className="text-secondary-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.user_role !== 'investor' && !profile?.is_staff && !profile?.is_superuser)) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      {/* Header */}
      <div className="sticky top-0 z-50 shadow-sm" style={{backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg transition-colors"
                style={{color: 'var(--text-secondary)'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeftIcon className="h-5 w-5" style={{color: 'var(--text-secondary)'}} />
              </button>
              <div className="flex items-center space-x-3">
                <BookOpenIcon className="h-8 w-8 text-primary-orange" />
                <div>
                  <h1 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>
                    EntreHive Documentation
                  </h1>
                  <p className="text-sm text-secondary-charcoal">
                    Comprehensive technical documentation for developers and administrators
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <ShieldCheckIcon className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-600">
                {profile?.is_superuser ? 'Superuser' : profile?.is_staff ? 'Staff' : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-secondary-charcoal hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <section.icon className="h-5 w-5" />
                      <span>{section.title}</span>
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  
                  {expandedSections.has(section.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setActiveSection(subsection.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeSection === subsection.id
                              ? 'text-white font-medium'
                              : ''
                          }`}
                          style={activeSection === subsection.id ? { backgroundColor: 'var(--primary-orange)' } : { color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => {
                            if (activeSection !== subsection.id) {
                              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activeSection !== subsection.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <div className="rounded-xl shadow-sm p-8" style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}>
              <DocumentationContent section={activeSection} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function DocumentationContent({ section }: { section: string }) {
  const renderContent = () => {
    switch (section) {
      case 'frontend-overview':
        return <FrontendOverview />;
      case 'frontend-components':
        return <FrontendComponents />;
      case 'frontend-auth':
        return <FrontendAuth />;
      case 'frontend-types':
        return <FrontendTypes />;
      case 'backend-structure':
        return <BackendStructure />;
      case 'backend-tech-stack':
        return <BackendTechStack />;
      case 'api-overview':
        return <APIOverview />;
      case 'api-docs':
        return <APIDocs />;
      case 'feed-system':
        return <FeedSystem />;
      case 'email-system':
        return <EmailSystem />;
      case 'email-verification':
        return <EmailVerification />;
      case 'email-templates':
        return <EmailTemplates />;
      case 'email-configuration':
        return <EmailConfiguration />;
      case 'admin-overview':
        return <AdminOverview />;
      case 'admin-features':
        return <AdminFeatures />;
      case 'admin-contact':
        return <AdminContact />;
      case 'investor-feed-overview':
        return <InvestorFeedOverview />;
      case 'interest-management':
        return <InterestManagement />;
      case 'feed-features':
        return <FeedFeatures />;
      case 'technical-implementation':
        return <TechnicalImplementation />;
      case 'user-flow':
        return <UserFlow />;
      case 'testing':
        return <Testing />;
      default:
        return <FrontendOverview />;
    }
  };

  return <div className="documentation-content max-w-none">{renderContent()}</div>;
}

// Component sections
function FrontendOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Frontend Overview</h1>
        <p className="text-lg text-secondary-charcoal">
          Next.js 15 application with TypeScript, Tailwind CSS, and modern React patterns
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start">
          <CubeIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Framework</h3>
            <p className="text-blue-800 text-sm">
              Built with Next.js 15 (App Router), React 19, and TypeScript for type safety
            </p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Project Structure</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800">{`entrehive_frontend/entrehive/src/
├── app/                      # Next.js App Router pages
│   ├── components/          # Page-level components
│   │   ├── Navigation.tsx   # Main navigation bar
│   │   ├── LeftNavigation.tsx
│   │   ├── RightSidebar.tsx
│   │   ├── PostCardNew.tsx  # Post display component
│   │   ├── ProjectCard.tsx  # Project display
│   │   ├── FeedTabs.tsx     # Feed navigation
│   │   └── CuratedFeed.tsx  # Main feed component
│   ├── feed/               # Feed pages
│   ├── profile/            # Profile pages
│   ├── projects/           # Project pages
│   ├── posts/              # Post detail pages
│   ├── settings/           # Settings pages
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   └── ProtectedRoute.tsx # Auth protection
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state
├── lib/                   # Utilities & API
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
    └── index.ts          # Type definitions`}</pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Key Technologies</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Next.js 15', desc: 'React framework with App Router' },
            { name: 'React 19', desc: 'UI library with latest features' },
            { name: 'TypeScript', desc: 'Type-safe JavaScript' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
            { name: 'Heroicons', desc: 'Beautiful SVG icons' },
            { name: 'Zod', desc: 'Schema validation' },
          ].map((tech) => (
            <div key={tech.name} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-1">{tech.name}</h3>
              <p className="text-sm text-gray-600">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Design System</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">Brand Colors</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#F3AC3B] border"></div>
                <div className="text-sm">
                  <div className="font-medium">Primary Orange</div>
                  <div className="text-gray-500">#F3AC3B</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#000000] border"></div>
                <div className="text-sm">
                  <div className="font-medium">Primary Black</div>
                  <div className="text-gray-500">#000000</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#36454F] border"></div>
                <div className="text-sm">
                  <div className="font-medium">Charcoal</div>
                  <div className="text-gray-500">#36454F</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#214F38] border"></div>
                <div className="text-sm">
                  <div className="font-medium">Accent Pine</div>
                  <div className="text-gray-500">#214F38</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#E79F74] border"></div>
                <div className="text-sm">
                  <div className="font-medium">Terracotta</div>
                  <div className="text-gray-500">#E79F74</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#F5F5F5] border"></div>
                <div className="text-sm">
                  <div className="font-medium">Off White</div>
                  <div className="text-gray-500">#F5F5F5</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Typography</h3>
            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600">Font Family: Inter (default system font stack)</p>
              <p className="text-xs text-gray-600">Headings: font-bold, tracking-tight</p>
              <p className="text-xs text-gray-600">Body: font-normal, leading-relaxed</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Routing Strategy</h2>
        
        <div className="space-y-3">
          <div className="border-l-4 border-primary-orange pl-4">
            <h3 className="font-semibold">App Router (Next.js 15)</h3>
            <p className="text-sm text-gray-600 mt-1">
              File-system based routing with server and client components
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <div><code className="text-primary-orange">/feed</code> → Main feed page</div>
            <div><code className="text-primary-orange">/profile</code> → User profile</div>
            <div><code className="text-primary-orange">/projects</code> → Projects listing</div>
            <div><code className="text-primary-orange">/projects/[id]</code> → Project detail</div>
            <div><code className="text-primary-orange">/posts/[id]</code> → Post detail</div>
            <div><code className="text-primary-orange">/settings</code> → User settings</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FrontendComponents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Components</h1>
        <p className="text-lg text-secondary-charcoal">
          Reusable React components and their purposes
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Core Components</h2>
        
        <div className="space-y-6">
          {[
            {
              name: 'Navigation',
              file: 'app/components/Navigation.tsx',
              purpose: 'Top navigation bar with search, notifications, and user menu',
              features: ['Responsive design', 'Real-time notifications', 'Search functionality', 'User dropdown menu']
            },
            {
              name: 'LeftNavigation',
              file: 'app/components/LeftNavigation.tsx',
              purpose: 'Left sidebar navigation for main app sections',
              features: ['Feed navigation', 'Projects link', 'Profile link', 'Settings link']
            },
            {
              name: 'RightSidebar',
              file: 'app/components/RightSidebar.tsx',
              purpose: 'Right sidebar showing trending topics and suggestions',
              features: ['Trending topics', 'Suggested users', 'Quick actions']
            },
            {
              name: 'PostCardNew',
              file: 'app/components/PostCardNew.tsx',
              purpose: 'Display individual posts in the feed',
              features: ['Like/comment actions', 'Project tagging', 'Image display', 'Edit/delete options']
            },
            {
              name: 'ProjectCard',
              file: 'app/components/ProjectCard.tsx',
              purpose: 'Display project cards in feed and listings',
              features: ['Project status', 'Team members', 'Join requests', 'Quick view']
            },
            {
              name: 'CuratedFeed',
              file: 'app/components/CuratedFeed.tsx',
              purpose: 'Main feed component with infinite scroll',
              features: ['Infinite scroll', 'Mixed content (posts + projects)', 'Loading states', 'Interaction tracking']
            },
            {
              name: 'FeedTabs',
              file: 'app/components/FeedTabs.tsx',
              purpose: 'Tab navigation for different feed types',
              features: ['Home/University/Global tabs', 'Active state', 'Smooth transitions']
            },
            {
              name: 'PostComposerNew',
              file: 'app/components/PostComposerNew.tsx',
              purpose: 'Create new posts with rich features',
              features: ['Text editor', 'Image upload', 'Project tagging', 'Visibility settings']
            },
            {
              name: 'ProjectCreateForm',
              file: 'app/components/ProjectCreateForm.tsx',
              purpose: 'Multi-step project creation form',
              features: ['Form validation', 'Image upload', 'Team management', 'Visibility settings']
            }
          ].map((component) => (
            <div key={component.name} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-primary-black">{component.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{component.file}</p>
                </div>
                <CodeBracketIcon className="h-5 w-5 text-primary-orange flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{component.purpose}</p>
              <div className="flex flex-wrap gap-2">
                {component.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Utility Components</h2>
        
        <div className="grid gap-4">
          {[
            {
              name: 'ProtectedRoute',
              purpose: 'Higher-order component for route protection',
              usage: 'Wraps pages that require authentication'
            },
            {
              name: 'ThemeProvider',
              purpose: 'Manages dark/light theme state',
              usage: 'Wraps entire application'
            },
            {
              name: 'InfiniteScroll',
              purpose: 'Intersection Observer wrapper for infinite scrolling',
              usage: 'Used in feed components'
            },
            {
              name: 'LazyLoad',
              purpose: 'Lazy loading images and heavy components',
              usage: 'Improves performance'
            }
          ].map((component) => (
            <div key={component.name} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-1">{component.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{component.purpose}</p>
              <p className="text-xs text-gray-500 italic">{component.usage}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Component Patterns</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Server vs Client Components</h3>
            <div className="text-sm space-y-2 text-gray-700">
              <p>• <strong>Server Components:</strong> Used for static content, layouts, and data fetching</p>
              <p>• <strong>Client Components:</strong> Used for interactive features, state management, and user events</p>
              <p>• All components with 'use client' directive are client components</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">State Management</h3>
            <div className="text-sm space-y-2 text-gray-700">
              <p>• <strong>React Context:</strong> Used for global state (auth, theme)</p>
              <p>• <strong>useState:</strong> Component-level state</p>
              <p>• <strong>useEffect:</strong> Side effects and data fetching</p>
              <p>• <strong>Custom Hooks:</strong> Reusable stateful logic</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Data Fetching Strategy</h3>
            <div className="text-sm space-y-2 text-gray-700">
              <p>• <strong>API Client:</strong> Centralized API calls through lib/api.ts</p>
              <p>• <strong>Error Handling:</strong> Try-catch with user-friendly error messages</p>
              <p>• <strong>Loading States:</strong> Skeleton screens and spinners</p>
              <p>• <strong>Optimistic Updates:</strong> Immediate UI feedback</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Continue with other component functions in the next artifact...

