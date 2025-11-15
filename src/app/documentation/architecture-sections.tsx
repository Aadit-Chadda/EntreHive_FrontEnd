import React from 'react';

export function SystemArchitecture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">System Architecture</h1>
        <p className="text-lg text-secondary-charcoal">
          EntreHive architecture overview: Django REST backend + Next.js frontend
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">🏗️ Technology Stack</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">Backend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">▸</span>
                <span><strong>Django 5.1.6:</strong> Web framework</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">▸</span>
                <span><strong>Django REST Framework:</strong> API framework</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">▸</span>
                <span><strong>dj-rest-auth:</strong> Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">▸</span>
                <span><strong>PostgreSQL:</strong> Production database</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">▸</span>
                <span><strong>SQLite:</strong> Development database</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-3">Frontend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">▸</span>
                <span><strong>Next.js 15:</strong> React framework</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">▸</span>
                <span><strong>TypeScript:</strong> Type safety</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">▸</span>
                <span><strong>Tailwind CSS:</strong> Styling</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">▸</span>
                <span><strong>Framer Motion:</strong> Animations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">▸</span>
                <span><strong>Context API:</strong> State management</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">High-Level Architecture</h2>

        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="font-mono text-xs space-y-1">
            <div className="text-center font-bold text-primary-orange mb-4">EntreHive Architecture Diagram</div>

            <div className="grid grid-cols-3 gap-4">
              {/* Client Layer */}
              <div className="border-2 border-purple-400 bg-purple-50 rounded p-4">
                <div className="font-bold text-purple-900 mb-2 text-center">🌐 Client Layer</div>
                <div className="space-y-1 text-gray-700">
                  <div className="bg-white rounded p-2 text-center">Next.js App</div>
                  <div className="bg-white rounded p-2 text-center text-xs">React Components</div>
                  <div className="bg-white rounded p-2 text-center text-xs">Context (Auth, Theme)</div>
                  <div className="bg-white rounded p-2 text-center text-xs">API Client</div>
                </div>
              </div>

              {/* API Layer */}
              <div className="border-2 border-blue-400 bg-blue-50 rounded p-4">
                <div className="font-bold text-blue-900 mb-2 text-center">🔄 API Layer</div>
                <div className="space-y-1 text-gray-700">
                  <div className="bg-white rounded p-2 text-center">Django REST API</div>
                  <div className="bg-white rounded p-2 text-center text-xs">ViewSets</div>
                  <div className="bg-white rounded p-2 text-center text-xs">Serializers</div>
                  <div className="bg-white rounded p-2 text-center text-xs">Middleware</div>
                </div>
              </div>

              {/* Data Layer */}
              <div className="border-2 border-green-400 bg-green-50 rounded p-4">
                <div className="font-bold text-green-900 mb-2 text-center">💾 Data Layer</div>
                <div className="space-y-1 text-gray-700">
                  <div className="bg-white rounded p-2 text-center">PostgreSQL</div>
                  <div className="bg-white rounded p-2 text-center text-xs">Models</div>
                  <div className="bg-white rounded p-2 text-center text-xs">Migrations</div>
                  <div className="bg-white rounded p-2 text-center text-xs">QuerySets</div>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 mt-4 text-xs">
              ← httpOnly Cookies → ← JWT Tokens → ← ORM Queries →
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Request/Response Flow</h2>

        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-primary-black mb-4">Typical API Request Flow</h3>

            <div className="space-y-3">
              {[
                {
                  step: 1,
                  component: 'User Action',
                  action: 'User clicks "View Feed" button',
                  tech: 'React Event Handler'
                },
                {
                  step: 2,
                  component: 'API Client',
                  action: 'apiClient.get("/api/timeline/home/")',
                  tech: 'Fetch API with credentials: "include"'
                },
                {
                  step: 3,
                  component: 'Browser',
                  action: 'Automatically attaches httpOnly cookies',
                  tech: 'HTTP Headers: Cookie: access=xxx; refresh=xxx'
                },
                {
                  step: 4,
                  component: 'Django Middleware',
                  action: 'Verifies JWT access token from cookie',
                  tech: 'dj-rest-auth + JWT middleware'
                },
                {
                  step: 5,
                  component: 'View/ViewSet',
                  action: 'Processes request, queries database',
                  tech: 'Django ORM + Business Logic'
                },
                {
                  step: 6,
                  component: 'Serializer',
                  action: 'Converts model instances to JSON',
                  tech: 'DRF Serializers'
                },
                {
                  step: 7,
                  component: 'Response',
                  action: 'Returns JSON data to client',
                  tech: 'HTTP 200 + JSON payload'
                },
                {
                  step: 8,
                  component: 'React Component',
                  action: 'Updates UI with received data',
                  tech: 'setState/Context Update'
                }
              ].map((flow) => (
                <div key={flow.step} className="flex items-start space-x-3 bg-gray-50 rounded p-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {flow.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900">{flow.component}</span>
                      <code className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{flow.tech}</code>
                    </div>
                    <p className="text-xs text-gray-600">{flow.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Database Models</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                app: 'accounts',
                models: ['User (Django built-in)', 'UserProfile', 'University'],
                description: 'User authentication and profile management'
              },
              {
                app: 'posts',
                models: ['Post', 'Comment', 'Like', 'Hashtag'],
                description: 'Social posts and interactions'
              },
              {
                app: 'projects',
                models: ['Project', 'ProjectMember', 'ProjectCategory'],
                description: 'Project listings and collaborations'
              },
              {
                app: 'feed',
                models: ['ContentScore', 'TimelineFeedCache', 'UserInteraction', 'FeedConfiguration'],
                description: 'Feed ranking and personalization'
              },
              {
                app: 'notifications',
                models: ['Notification', 'NotificationPreference'],
                description: 'In-app notification system'
              },
              {
                app: 'messaging',
                models: ['DirectConversation', 'GroupConversation', 'Message'],
                description: 'Direct and group messaging'
              }
            ].map((app) => (
              <div key={app.app} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-orange mb-2">{app.app}/</h3>
                <p className="text-xs text-gray-600 mb-3">{app.description}</p>
                <div className="space-y-1">
                  {app.models.map((model) => (
                    <div key={model} className="flex items-center text-xs">
                      <span className="w-1.5 h-1.5 bg-primary-orange rounded-full mr-2"></span>
                      <code className="text-gray-700">{model}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Key Design Patterns</h2>

        <div className="space-y-4">
          {[
            {
              pattern: 'ViewSet Pattern',
              description: 'RESTful API endpoints using Django REST Framework ViewSets',
              benefits: ['Automatic CRUD operations', 'Consistent URL routing', 'Built-in pagination', 'Permission handling'],
              example: 'ProjectViewSet handles all /api/projects/ endpoints'
            },
            {
              pattern: 'Serializer Pattern',
              description: 'Data validation and transformation between models and JSON',
              benefits: ['Type safety', 'Nested serialization', 'Custom fields', 'Validation logic'],
              example: 'ProjectSerializer converts Project model to API response'
            },
            {
              pattern: 'Context Pattern',
              description: 'React Context API for global state management',
              benefits: ['Avoid prop drilling', 'Centralized state', 'Easy access anywhere', 'Type-safe with TypeScript'],
              example: 'AuthContext manages user authentication state'
            },
            {
              pattern: 'Repository Pattern',
              description: 'API client abstracts HTTP requests and response handling',
              benefits: ['Centralized API logic', 'Error handling', 'Token management', 'Type-safe responses'],
              example: 'apiClient.get<T>() with TypeScript generics'
            }
          ].map((pattern) => (
            <div key={pattern.pattern} className="border-2 border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-primary-black mb-2">{pattern.pattern}</h3>
              <p className="text-sm text-gray-700 mb-3">{pattern.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {pattern.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="text-green-600 mr-1.5">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Example:</h4>
                  <p className="text-xs text-gray-600 bg-gray-50 rounded p-2">{pattern.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Security Architecture</h2>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-red-900 mb-2">🔒 Multi-Layer Security Approach</h3>
            <p className="text-sm text-red-800">
              EntreHive implements defense-in-depth with multiple security layers to protect user data and prevent attacks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                layer: 'Authentication',
                measures: [
                  'httpOnly cookies prevent XSS token theft',
                  'JWT tokens with expiry (15 min access, 7 day refresh)',
                  'Server-side token validation',
                  'Secure password hashing (PBKDF2)',
                  'CORS configuration for allowed origins'
                ]
              },
              {
                layer: 'Authorization',
                measures: [
                  'Permission classes on all endpoints',
                  'Object-level permissions (IsOwnerOrReadOnly)',
                  'Role-based access control (entrepreneur/investor)',
                  'Private/University/Public visibility',
                  'Team membership validation'
                ]
              },
              {
                layer: 'Input Validation',
                measures: [
                  'DRF serializer validation',
                  'SQL injection prevention (ORM)',
                  'XSS prevention (React escaping)',
                  'CSRF protection (Django middleware)',
                  'Email/username format validation'
                ]
              },
              {
                layer: 'Data Protection',
                measures: [
                  'HTTPS-only in production',
                  'Secure cookie flags (httpOnly, SameSite)',
                  'Password strength requirements',
                  'Sensitive data encryption at rest',
                  'Database-level constraints'
                ]
              }
            ].map((layer) => (
              <div key={layer.layer} className="border-2 border-red-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-red-900 mb-3">{layer.layer}</h3>
                <ul className="space-y-1.5">
                  {layer.measures.map((measure, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start">
                      <span className="text-red-600 mr-1.5 flex-shrink-0">🔐</span>
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Performance Optimizations</h2>

        <div className="space-y-4">
          {[
            {
              category: 'Database',
              icon: '💾',
              optimizations: [
                { tech: 'Database Indexing', desc: 'Indexes on foreign keys, search fields, and filter columns' },
                { tech: 'select_related()', desc: 'Reduce N+1 queries with JOIN operations for ForeignKey' },
                { tech: 'prefetch_related()', desc: 'Optimize ManyToMany and reverse ForeignKey queries' },
                { tech: 'Query Optimization', desc: 'only() and defer() to fetch only required fields' }
              ]
            },
            {
              category: 'Caching',
              icon: '⚡',
              optimizations: [
                { tech: 'Feed Cache', desc: 'TimelineFeedCache stores content references for 1 hour' },
                { tech: 'Content Scores', desc: 'Pre-calculated scores reduce real-time computation' },
                { tech: 'Query Caching', desc: 'Database query results cached at ORM level' },
                { tech: 'Static Files', desc: 'Next.js static generation and CDN caching' }
              ]
            },
            {
              category: 'Frontend',
              icon: '🎨',
              optimizations: [
                { tech: 'Code Splitting', desc: 'Next.js automatic route-based code splitting' },
                { tech: 'Lazy Loading', desc: 'Images and components loaded on-demand' },
                { tech: 'Infinite Scroll', desc: 'Pagination to load content progressively' },
                { tech: 'Debouncing', desc: 'Search inputs debounced to reduce API calls' }
              ]
            }
          ].map((category) => (
            <div key={category.category} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-primary-black">{category.category} Optimizations</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {category.optimizations.map((opt, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-3">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{opt.tech}</div>
                    <p className="text-xs text-gray-600">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-5 rounded-r-lg mt-8">
        <h3 className="font-semibold text-primary-black mb-2">📚 Related Documentation</h3>
        <p className="text-sm text-gray-700 mb-3">
          For more specific architecture details, see:
        </p>
        <ul className="text-sm space-y-1">
          <li className="flex items-center">
            <span className="text-primary-orange mr-2">→</span>
            <span><strong>Authentication Flow:</strong> See "Authentication & Security" section</span>
          </li>
          <li className="flex items-center">
            <span className="text-primary-orange mr-2">→</span>
            <span><strong>Feed System:</strong> See "Admin - Feed System" section</span>
          </li>
          <li className="flex items-center">
            <span className="text-primary-orange mr-2">→</span>
            <span><strong>API Documentation:</strong> See "API Reference" section</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function AuthenticationSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Authentication & Security</h1>
        <p className="text-lg text-secondary-charcoal">
          httpOnly cookie-based JWT authentication with comprehensive security measures
        </p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold text-green-900 mb-3">🔐 Security-First Approach</h3>
        <p className="text-gray-800 mb-3">
          EntreHive uses <strong>httpOnly cookies</strong> instead of localStorage for JWT tokens,
          preventing XSS attacks and ensuring tokens cannot be accessed by malicious JavaScript.
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-bold text-green-600">✓ XSS Protection</div>
            <div className="text-xs text-gray-600 mt-1">Tokens inaccessible to JavaScript</div>
          </div>
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-bold text-green-600">✓ CSRF Protection</div>
            <div className="text-xs text-gray-600 mt-1">Django CSRF middleware enabled</div>
          </div>
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-bold text-green-600">✓ SameSite Cookies</div>
            <div className="text-xs text-gray-600 mt-1">Prevents cross-site attacks</div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Authentication Flow</h2>

        <div className="space-y-6">
          {/* Login Flow */}
          <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-900 mb-4">1. Login Flow</h3>

            <div className="space-y-3">
              {[
                {
                  step: 'A',
                  title: 'User Submits Credentials',
                  frontend: 'User enters email + password → Submit form',
                  backend: 'N/A',
                  result: 'Form data sent to API'
                },
                {
                  step: 'B',
                  title: 'API Validates Credentials',
                  frontend: 'apiClient.post("/api/auth/login/", { email, password })',
                  backend: 'dj-rest-auth validates user credentials against database',
                  result: 'User authenticated or error returned'
                },
                {
                  step: 'C',
                  title: 'Server Sets Cookies',
                  frontend: 'N/A - browser automatically receives cookies',
                  backend: 'Django sets httpOnly cookies: "access" (15 min) + "refresh" (7 days)',
                  result: 'Cookies stored in browser, inaccessible to JavaScript'
                },
                {
                  step: 'D',
                  title: 'Client Receives User Data',
                  frontend: 'AuthContext sets user state → Redirect to /feed',
                  backend: 'Returns user object (pk, username, email, role)',
                  result: 'User logged in, UI updated'
                }
              ].map((step) => (
                <div key={step.step} className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm">{step.title}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs ml-10">
                    <div>
                      <strong className="text-purple-700">Frontend:</strong>
                      <p className="text-gray-700 mt-1">{step.frontend}</p>
                    </div>
                    <div>
                      <strong className="text-blue-700">Backend:</strong>
                      <p className="text-gray-700 mt-1">{step.backend}</p>
                    </div>
                  </div>

                  <div className="mt-2 ml-10 text-xs">
                    <strong className="text-green-700">Result:</strong>
                    <span className="text-gray-700 ml-1">{step.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authenticated Request Flow */}
          <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
            <h3 className="text-lg font-bold text-green-900 mb-4">2. Authenticated Request Flow</h3>

            <div className="space-y-3">
              {[
                {
                  step: 'A',
                  title: 'User Requests Protected Data',
                  detail: 'User clicks on protected page (e.g., /feed, /projects)',
                  code: 'apiClient.get("/api/timeline/home/")'
                },
                {
                  step: 'B',
                  title: 'Browser Sends Cookies Automatically',
                  detail: 'Browser attaches httpOnly cookies to request headers',
                  code: 'Headers: { Cookie: "access=xxx; refresh=xxx" }'
                },
                {
                  step: 'C',
                  title: 'Django Middleware Validates Token',
                  detail: 'JWT middleware extracts & verifies access token from cookie',
                  code: 'If valid: request.user = User object, proceed'
                },
                {
                  step: 'D',
                  title: 'ViewSet Processes Request',
                  detail: 'View uses request.user for authorization and data filtering',
                  code: 'queryset.filter(author=request.user) # User-specific data'
                },
                {
                  step: 'E',
                  title: 'Response Returned',
                  detail: 'Serialized JSON data returned to client',
                  code: 'HTTP 200 OK + JSON payload'
                }
              ].map((step) => (
                <div key={step.step} className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-gray-700 mb-2">{step.detail}</p>
                      <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block">{step.code}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Refresh Flow */}
          <div className="border-2 border-yellow-300 rounded-lg p-6 bg-yellow-50">
            <h3 className="text-lg font-bold text-yellow-900 mb-4">3. Token Refresh Flow (Automatic)</h3>

            <div className="space-y-3">
              {[
                {
                  step: 'A',
                  title: 'Access Token Expires',
                  detail: 'Access token expires after 15 minutes of inactivity',
                  result: 'Next API request will fail with 401 Unauthorized'
                },
                {
                  step: 'B',
                  title: 'API Client Detects 401',
                  detail: 'handleResponse() detects 401 status code',
                  result: 'Automatic token refresh initiated'
                },
                {
                  step: 'C',
                  title: 'Refresh Token Request',
                  detail: 'POST /api/auth/token/refresh/ with refresh cookie',
                  result: 'Backend validates refresh token (7 day expiry)'
                },
                {
                  step: 'D',
                  title: 'New Access Token Issued',
                  detail: 'Server updates "access" cookie with new token',
                  result: 'New access token set in httpOnly cookie'
                },
                {
                  step: 'E',
                  title: 'Original Request Retried',
                  detail: 'API client automatically retries failed request',
                  result: 'Request succeeds with new token, user unaware'
                }
              ].map((step) => (
                <div key={step.step} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-gray-700 mb-1">{step.detail}</p>
                      <div className="text-xs">
                        <strong className="text-green-700">→</strong>
                        <span className="text-gray-700 ml-1">{step.result}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-yellow-300 rounded p-3 mt-4">
              <p className="text-xs text-yellow-900">
                <strong>✨ Seamless UX:</strong> Token refresh happens automatically in the background.
                Users stay logged in for up to 7 days without re-entering credentials, unless they explicitly logout.
              </p>
            </div>
          </div>

          {/* Logout Flow */}
          <div className="border-2 border-red-300 rounded-lg p-6 bg-red-50">
            <h3 className="text-lg font-bold text-red-900 mb-4">4. Logout Flow</h3>

            <div className="space-y-3">
              {[
                {
                  step: 'A',
                  title: 'User Clicks Logout',
                  action: 'User clicks logout button → AuthContext.logout() called'
                },
                {
                  step: 'B',
                  title: 'API Logout Request',
                  action: 'apiClient.post("/api/auth/logout/", {}) sends request'
                },
                {
                  step: 'C',
                  title: 'Server Clears Cookies',
                  action: 'Django sets access & refresh cookies to expired (Max-Age=0)'
                },
                {
                  step: 'D',
                  title: 'Client Clears State',
                  action: 'AuthContext sets user=null, profile=null'
                },
                {
                  step: 'E',
                  title: 'Redirect to Login',
                  action: 'Router pushes user to /login page'
                }
              ].map((step) => (
                <div key={step.step} className="bg-white rounded-lg p-3 border border-red-200 flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 text-xs mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-700">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Cookie Configuration</h2>

        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-primary-black mb-4">httpOnly Cookie Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                name: 'access',
                purpose: 'Short-lived authentication token',
                expiry: '15 minutes',
                settings: ['httpOnly: true', 'secure: true (prod)', 'sameSite: Lax', 'path: /']
              },
              {
                name: 'refresh',
                purpose: 'Long-lived token refresh capability',
                expiry: '7 days',
                settings: ['httpOnly: true', 'secure: true (prod)', 'sameSite: Lax', 'path: /api/auth/']
              }
            ].map((cookie) => (
              <div key={cookie.name} className="bg-white border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <code className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{cookie.name}</code>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{cookie.expiry}</span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{cookie.purpose}</p>

                <div>
                  <strong className="text-xs text-gray-700">Settings:</strong>
                  <div className="mt-2 space-y-1">
                    {cookie.settings.map((setting, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                        <code className="text-gray-600">{setting}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">🔒 Security Benefits:</h4>
            <ul className="space-y-1 text-xs text-yellow-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>httpOnly:</strong> Prevents JavaScript access (XSS protection)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>secure:</strong> Only sent over HTTPS in production</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>sameSite:</strong> Prevents CSRF attacks from external sites</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>path:</strong> Scoped to specific routes (refresh only on /api/auth/)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Route Protection</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Client-Side Protection */}
            <div className="border-2 border-purple-300 rounded-lg p-5 bg-purple-50">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Client-Side (React)</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-900">ProtectedRoute Component:</strong>
                  <p className="text-xs text-gray-700 mt-1 mb-2">
                    Wraps protected pages to enforce authentication
                  </p>
                  <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block">
                    {`<ProtectedRoute><FeedPage /></ProtectedRoute>`}
                  </code>
                </div>

                <div className="bg-white rounded p-3 border border-purple-200">
                  <strong className="text-xs text-purple-900">How it works:</strong>
                  <ul className="mt-2 space-y-1 text-xs text-gray-700">
                    <li>• Checks AuthContext.isAuthenticated</li>
                    <li>• Shows loading skeleton while checking</li>
                    <li>• Redirects to /login if not authenticated</li>
                    <li>• Renders children if authenticated</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Server-Side Protection */}
            <div className="border-2 border-blue-300 rounded-lg p-5 bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Server-Side (Django)</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-900">Permission Classes:</strong>
                  <p className="text-xs text-gray-700 mt-1 mb-2">
                    Every ViewSet enforces permissions
                  </p>
                  <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block">
                    permission_classes = [IsAuthenticated]
                  </code>
                </div>

                <div className="bg-white rounded p-3 border border-blue-200">
                  <strong className="text-xs text-blue-900">Available Permissions:</strong>
                  <ul className="mt-2 space-y-1 text-xs text-gray-700">
                    <li>• IsAuthenticated - Must be logged in</li>
                    <li>• IsOwnerOrReadOnly - Edit own content</li>
                    <li>• AllowAny - Public endpoints</li>
                    <li>• Custom permissions for roles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-green-300 rounded-lg p-5 bg-green-50">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Middleware Protection (Currently Disabled)</h3>
            <p className="text-sm text-gray-700 mb-3">
              Next.js middleware provides server-side route protection BEFORE pages render,
              preventing content flash and unauthorized access attempts.
            </p>

            <div className="bg-yellow-100 border border-yellow-400 rounded p-3 mb-3">
              <p className="text-xs text-yellow-900">
                <strong>⚠️ Status:</strong> Temporarily disabled for debugging. Will be re-enabled after login flow verification.
              </p>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <strong className="text-xs text-green-900">When Enabled:</strong>
              <ul className="mt-2 space-y-1 text-xs text-gray-700">
                <li>• Checks for "access" cookie before rendering</li>
                <li>• Redirects to /login with returnUrl parameter</li>
                <li>• Prevents unauthorized users from seeing protected HTML</li>
                <li>• Runs on server before client-side code executes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Security Best Practices</h2>

        <div className="space-y-3">
          {[
            {
              category: 'Password Security',
              icon: '🔑',
              practices: [
                'Minimum 8 characters required',
                'PBKDF2 hashing with SHA256',
                'Salt generated per password',
                'No password in plain text storage',
                'Password reset via email only'
              ]
            },
            {
              category: 'Session Management',
              icon: '⏱️',
              practices: [
                'Access tokens expire after 15 minutes',
                'Refresh tokens expire after 7 days',
                'Automatic token rotation on refresh',
                'Server-side token validation only',
                'Logout clears all cookies immediately'
              ]
            },
            {
              category: 'API Security',
              icon: '🛡️',
              practices: [
                'CORS restricted to allowed origins',
                'Rate limiting on authentication endpoints',
                'Input validation on all requests',
                'SQL injection prevention via ORM',
                'No sensitive data in URLs'
              ]
            },
            {
              category: 'Data Privacy',
              icon: '🔐',
              practices: [
                'Email addresses never exposed in URLs',
                'Private content filtered by permissions',
                'University data visible only to members',
                'Profile visibility controls respected',
                'GDPR-compliant data handling'
              ]
            }
          ].map((category) => (
            <div key={category.category} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="font-semibold text-primary-black">{category.category}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {category.practices.map((practice, idx) => (
                  <div key={idx} className="flex items-start text-xs text-gray-700">
                    <span className="text-green-600 mr-2 flex-shrink-0">✓</span>
                    <span>{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-5 rounded-r-lg mt-8">
        <h3 className="font-semibold text-primary-black mb-2">🔗 Implementation Files</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <strong className="text-gray-900">Backend:</strong>
            <ul className="mt-2 space-y-1 text-xs text-gray-700">
              <li>• entrehive_backend/settings.py (JWT config)</li>
              <li>• entrehive_backend/urls.py (auth endpoints)</li>
            </ul>
          </div>
          <div>
            <strong className="text-gray-900">Frontend:</strong>
            <ul className="mt-2 space-y-1 text-xs text-gray-700">
              <li>• contexts/AuthContext.tsx (auth logic)</li>
              <li>• lib/api.ts (API client)</li>
              <li>• middleware.ts (route protection)</li>
              <li>• components/ProtectedRoute.tsx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
