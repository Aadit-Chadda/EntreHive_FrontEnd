import React from 'react';

export function APIOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">API Overview</h1>
        <p className="text-lg text-secondary-charcoal">
          RESTful API with JWT authentication and comprehensive endpoints
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Base URL</h3>
        <code className="text-blue-800">http://127.0.0.1:8000</code>
        <p className="text-sm text-blue-700 mt-2">
          All API endpoints are prefixed with <code>/api/</code>
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">API Categories</h2>
        
        <div className="grid gap-4">
          {[
            {
              category: 'Authentication',
              prefix: '/api/auth/',
              endpoints: ['login/', 'logout/', 'registration/', 'token/refresh/', 'password/reset/', 'password/change/'],
              description: 'User authentication and account management'
            },
            {
              category: 'Accounts & Profiles',
              prefix: '/api/accounts/',
              endpoints: ['profile/', 'profile/me/', 'profiles/', 'profiles/<username>/', 'follow/<username>/', 'search/users/'],
              description: 'User profiles, follow system, and user search'
            },
            {
              category: 'Posts & Social',
              prefix: '/api/posts/',
              endpoints: ['', '<id>/', 'my_posts/', 'feed/', '<id>/like/', '<id>/comments/', '<id>/share/'],
              description: 'Social posts, comments, likes, and interactions'
            },
            {
              category: 'Projects',
              prefix: '/api/projects/',
              endpoints: ['', '<id>/', 'user/<id>/', '<id>/team/add/', '<id>/invitations/', 'search/'],
              description: 'Project management, teams, and collaboration'
            },
            {
              category: 'Feed System',
              prefix: '/api/timeline/',
              endpoints: ['home/', 'university/', 'public/', 'track_interaction/'],
              description: 'Personalized content curation and feeds'
            },
            {
              category: 'Notifications',
              prefix: '/api/notifications/',
              endpoints: ['', '<id>/', 'mark_read/', 'unread_count/'],
              description: 'Real-time notifications for user activities'
            },
            {
              category: 'Contact',
              prefix: '/api/contact/',
              endpoints: ['submit/'],
              description: 'Contact form submissions'
            },
            {
              category: 'Universities',
              prefix: '/api/universities/',
              endpoints: ['', 'search/'],
              description: 'University database and search'
            }
          ].map((api) => (
            <div key={api.category} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-orange transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-primary-black">{api.category}</h3>
                  <code className="text-xs text-primary-orange">{api.prefix}</code>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{api.description}</p>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Endpoints:</h4>
                <div className="flex flex-wrap gap-2">
                  {api.endpoints.map((endpoint) => (
                    <code key={endpoint} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {endpoint}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Authentication</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">JWT Bearer Token</h3>
            <p className="text-sm text-gray-700 mb-3">
              All authenticated endpoints require a JWT token in the Authorization header:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded p-3 font-mono text-sm">
              <code>Authorization: Bearer &lt;your_access_token&gt;</code>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Token Expiration</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Access Token: Expires after 1 hour</li>
              <li>• Refresh Token: Expires after 7 days</li>
              <li>• Use refresh token to get new access token</li>
              <li>• Automatic refresh handled by API client</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Response Format</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">Success Response</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm"><code>{`{
  "id": "uuid-or-number",
  "field1": "value1",
  "field2": "value2",
  "created_at": "2025-10-04T12:00:00Z",
  "updated_at": "2025-10-04T12:00:00Z"
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Paginated Response</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm"><code>{`{
  "count": 100,
  "next": "http://api.example.com/items/?page=2",
  "previous": null,
  "results": [
    { /* item 1 */ },
    { /* item 2 */ }
  ]
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Error Response</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm"><code>{`{
  "detail": "Error message",
  "field_name": [
    "Field-specific error message"
  ]
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">HTTP Status Codes</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { code: '200', name: 'OK', desc: 'Request successful' },
            { code: '201', name: 'Created', desc: 'Resource created successfully' },
            { code: '204', name: 'No Content', desc: 'Successful deletion' },
            { code: '400', name: 'Bad Request', desc: 'Invalid request data' },
            { code: '401', name: 'Unauthorized', desc: 'Authentication required' },
            { code: '403', name: 'Forbidden', desc: 'Permission denied' },
            { code: '404', name: 'Not Found', desc: 'Resource not found' },
            { code: '500', name: 'Server Error', desc: 'Internal server error' }
          ].map((status) => (
            <div key={status.code} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`font-bold ${
                  status.code.startsWith('2') ? 'text-green-600' :
                  status.code.startsWith('4') ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{status.code}</span>
                <span className="font-semibold text-gray-900">{status.name}</span>
              </div>
              <p className="text-xs text-gray-600">{status.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function APIDocs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Complete API Documentation</h1>
        <p className="text-lg text-secondary-charcoal">
          Detailed endpoint documentation with request/response examples
        </p>
      </div>

      {/* Authentication Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Authentication Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Login */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/auth/login/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Authenticate user and receive JWT tokens</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "email": "user@example.com",
  "password": "securePassword123!"
}`}</code></pre>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access_token_expiration": "2025-10-04T13:00:00Z",
  "refresh_token_expiration": "2025-10-11T12:00:00Z",
  "user": {
    "pk": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Registration */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/auth/registration/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Register a new user account</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "username": "johndoe",
  "email": "john@example.com",
  "password1": "securePassword123!",
  "password2": "securePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "user_role": "student",
  "bio": "Computer Science student",
  "location": "San Francisco, CA",
  "university": "Stanford University"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Token Refresh */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/auth/token/refresh/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get new access token using refresh token</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}`}</code></pre>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "access": "new-access-token...",
  "access_token_expiration": "2025-10-04T14:00:00Z"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Profile Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Get My Profile */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/accounts/profile/me/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get authenticated user's complete profile (requires authentication)</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Headers:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
                  <code>Authorization: Bearer &lt;access_token&gt;</code>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "user_role": "student",
  "profile_picture": "http://localhost:8000/media/...",
  "bio": "Computer Science student",
  "location": "San Francisco, CA",
  "university": "Stanford University",
  "followers_count": 150,
  "following_count": 200,
  "posts_count": 45,
  "projects_count": {
    "owned": 3,
    "member": 2,
    "total": 5
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Update Profile */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">PATCH</span>
              <code className="text-lg font-mono text-primary-black">/api/accounts/profile/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Update user profile information</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Updated bio text",
  "location": "New York, NY",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "website_url": "https://johndoe.com"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Follow User */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/accounts/follow/&lt;username&gt;/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Follow a user by username</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "message": "Successfully followed user",
  "following": true
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Posts Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Create Post */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/posts/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Create a new post with optional image and project tagging</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body (JSON):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "content": "Just launched my new AI project! 🚀",
  "visibility": "public",
  "tagged_project_ids": ["uuid-project-id"]
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">With Image (Form Data):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`FormData:
  content: "Check out this screenshot!"
  visibility: "public"
  image: [File object]
  tagged_project_ids: ["uuid-1", "uuid-2"]`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (201):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "id": "uuid",
  "author": {
    "id": 1,
    "username": "johndoe",
    "full_name": "John Doe",
    "profile_picture": "...",
    "user_role": "student"
  },
  "content": "Just launched my new AI project! 🚀",
  "image_url": null,
  "visibility": "public",
  "tagged_projects": [...],
  "is_edited": false,
  "likes_count": 0,
  "comments_count": 0,
  "is_liked": false,
  "can_edit": true,
  "can_delete": true,
  "created_at": "2025-10-04T12:00:00Z"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Get Posts Feed */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/posts/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get paginated list of posts with filtering options</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>page</code> - Page number</p>
                  <p>• <code>page_size</code> - Items per page (default: 20)</p>
                  <p>• <code>search</code> - Search in content</p>
                  <p>• <code>visibility</code> - Filter by visibility</p>
                  <p>• <code>ordering</code> - Sort order (-created_at, -likes_count)</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Example Request:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
                  <code>GET /api/posts/?page=1&page_size=10&ordering=-likes_count</code>
                </div>
              </div>
            </div>
          </div>

          {/* Like Post */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/posts/&lt;id&gt;/like/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Toggle like status on a post</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (Liked):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "message": "Post liked",
  "liked": true,
  "likes_count": 16
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Create Comment */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/posts/&lt;id&gt;/comments/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Add a comment or reply to a post</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "content": "Great work on this project!",
  "parent": null  // or comment UUID for replies
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Projects Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Create Project */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/projects/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Create a new project</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "title": "AI Assistant Bot",
  "project_type": "startup",
  "status": "mvp",
  "summary": "An AI-powered assistant for students",
  "needs": ["dev", "design", "funding"],
  "categories": ["AI", "EdTech"],
  "tags": ["machine-learning", "chatbot"],
  "visibility": "public",
  "banner_style": "gradient",
  "banner_gradient": "sunrise"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Get Projects */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/projects/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get paginated list of projects with filtering</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>search</code> - Search in title/summary</p>
                  <p>• <code>type</code> - Filter by project type</p>
                  <p>• <code>status</code> - Filter by status</p>
                  <p>• <code>visibility</code> - Filter by visibility</p>
                  <p>• <code>page</code> & <code>page_size</code> - Pagination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Team Member */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/projects/&lt;id&gt;/team/add/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Add a team member to project (owner only)</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "username": "janedoe"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Create Invitation */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/projects/&lt;id&gt;/invitations/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Send project invitation to user</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "invitee_username": "johndoe",
  "message": "Would love to have you on the team!"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Timeline Feed Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Home Feed */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/timeline/home/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get personalized home feed with follow priority and content balancing</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>page</code> - Page number (default: 1)</p>
                  <p>• <code>page_size</code> - Items per page (default: 15)</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "results": [
    {
      "content_type": "post",
      "content_id": "uuid",
      "score": 92.5,  // >90 = from followed user
      "content": { /* Full post data */ },
      "user_interactions": ["view"],
      "viewed": true,
      "clicked": false,
      "liked": false
    }
  ],
  "count": 150,
  "page": 1,
  "page_size": 15,
  "has_next": true,
  "has_previous": false
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* University Feed */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/timeline/university/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get content from your university only</p>
          </div>

          {/* Public Feed */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/timeline/public/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get global public content from all universities</p>
          </div>

          {/* Track Interaction */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/timeline/track_interaction/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Track user interactions with content</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "content_type": "post",  // or "project"
  "content_id": "uuid",
  "action": "view",  // view, click, like, share, comment
  "view_time": 15,  // seconds (optional)
  "feed_type": "home"  // context (optional)
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Notifications Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Get Notifications */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/notifications/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get user's notifications (paginated)</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>page</code> - Page number</p>
                  <p>• <code>page_size</code> - Items per page</p>
                  <p>• <code>read</code> - Filter by read status (true/false)</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "count": 25,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "notification_type": "like",
      "actor": {
        "id": 1,
        "username": "johndoe",
        "profile_picture": "..."
      },
      "target_type": "post",
      "target_id": "uuid",
      "message": "liked your post",
      "read": false,
      "created_at": "2025-10-04T12:00:00Z"
    }
  ]
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Mark as Read */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/notifications/&lt;id&gt;/mark_as_read/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Mark a notification as read</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "message": "Notification marked as read"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Mark All as Read */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/notifications/mark_all_as_read/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Mark all notifications as read</p>
          </div>

          {/* Unread Count */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/notifications/unread_count/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get count of unread notifications</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "unread_count": 5
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Suggestions */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/notifications/follow-suggestions/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get suggested users to follow</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "suggestions": [
    {
      "id": 1,
      "username": "janedoe",
      "full_name": "Jane Doe",
      "profile_picture": "...",
      "user_role": "student",
      "university_name": "Stanford"
    }
  ]
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Universities Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* List Universities */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/universities/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get list of universities</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>search</code> - Search by name</p>
                  <p>• <code>country</code> - Filter by country</p>
                  <p>• <code>page</code> & <code>page_size</code> - Pagination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verify Email Domain */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/universities/verify-email/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Verify if email domain belongs to a university</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "email": "student@stanford.edu"
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "verified": true,
  "university": {
    "id": "uuid",
    "name": "Stanford University",
    "short_name": "Stanford",
    "country": "United States"
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Search by Domain */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/universities/search-by-domain/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Search universities by email domain</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>domain</code> - Email domain to search for</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Configuration & Trending */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Feed Configuration & Trending
        </h2>
        
        <div className="space-y-6">
          {/* Get Feed Config */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/feed-config/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get user's feed configuration and algorithm weights</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "show_university_posts": true,
  "show_public_posts": true,
  "show_project_updates": true,
  "preferred_post_types": [],
  "recency_weight": 0.25,
  "relevance_weight": 0.25,
  "engagement_weight": 0.25,
  "university_weight": 0.25
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Update Feed Config */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">PATCH</span>
              <code className="text-lg font-mono text-primary-black">/api/feed-config/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Update feed configuration and algorithm weights</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "recency_weight": 0.3,
  "engagement_weight": 0.3,
  "university_weight": 0.2,
  "relevance_weight": 0.2
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          {/* Get Trending Topics */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/trending/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Get trending topics across platform</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>university</code> - Filter by university ID</p>
                  <p>• <code>limit</code> - Number of topics to return</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`[
  {
    "topic": "AI",
    "mention_count": 45,
    "universities": ["Stanford", "MIT"],
    "created_at": "2025-10-01T12:00:00Z",
    "updated_at": "2025-10-04T12:00:00Z"
  }
]`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Contact Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* Submit Contact Inquiry */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">POST</span>
              <code className="text-lg font-mono text-primary-black">/api/contact/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Submit a contact inquiry</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Partnership Inquiry",
  "message": "I would like to discuss...",
  "inquiry_type": "partnership"
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Inquiry Types:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>general</code> - General Inquiry</p>
                  <p>• <code>partnership</code> - Partnership Opportunity</p>
                  <p>• <code>university</code> - University Partnership</p>
                  <p>• <code>technical</code> - Technical Support</p>
                  <p>• <code>feedback</code> - Feedback & Suggestions</p>
                  <p>• <code>investor</code> - Investor Relations</p>
                  <p>• <code>press</code> - Press & Media</p>
                  <p>• <code>other</code> - Other</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (201):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "message": "Contact inquiry submitted successfully",
  "inquiry_id": "uuid"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Endpoints */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4 flex items-center mt-8">
          <span className="w-2 h-8 bg-primary-orange rounded mr-3"></span>
          Search Endpoints
        </h2>
        
        <div className="space-y-6">
          {/* User Search */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/accounts/search/users/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Search for users by name, username, or bio</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>q</code> - Search query (required)</p>
                  <p>• <code>page</code> & <code>page_size</code> - Pagination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Post Search */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/search/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Search for posts by content</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>q</code> - Search query</p>
                  <p>• <code>page</code> & <code>page_size</code> - Pagination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Search */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/projects/search/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Search for projects by title, summary, or tags</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>q</code> - Search query</p>
                  <p>• <code>type</code> - Filter by project type</p>
                  <p>• <code>status</code> - Filter by status</p>
                  <p>• <code>page</code> & <code>page_size</code> - Pagination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hashtag Search */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/hashtags/search/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Search for posts by hashtag</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>tag</code> - Hashtag to search for (without #)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Search */}
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">GET</span>
              <code className="text-lg font-mono text-primary-black">/api/accounts/search/</code>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Comprehensive search across users, posts, and projects</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                  <p>• <code>q</code> - Search query</p>
                  <p>• <code>type</code> - Content type filter (users/posts/projects)</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Success Response (200):</h4>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm overflow-x-auto">
                  <pre><code>{`{
  "users": [...],
  "posts": [...],
  "projects": [...]
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

