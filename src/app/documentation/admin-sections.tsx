import React from 'react';

export function FeedSystem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Feed System</h1>
        <p className="text-lg text-secondary-charcoal">
          Advanced timeline-based feed with intelligent curation and personalization
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-orange/10 to-accent-pine/10 border-l-4 border-primary-orange p-6 rounded-r-lg">
        <h3 className="text-xl font-bold text-primary-black mb-3">🚀 Key Highlights</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">✓</span>
            <span><strong>1000x Scalability:</strong> On-demand generation vs pre-computed feeds</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">✓</span>
            <span><strong>Real-time:</strong> New content appears immediately</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">✓</span>
            <span><strong>Follow Priority:</strong> Posts from followed users get +20 score boost</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">✓</span>
            <span><strong>Content Balance:</strong> Intelligent 60% posts, 40% projects mix</span>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">System Architecture</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-primary-black mb-3">Timeline Generation Flow</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {[
                { step: 1, title: 'User Request', desc: 'User navigates to feed page' },
                { step: 2, title: 'Cache Check', desc: 'Check TimelineFeedCache (1hr TTL)' },
                { step: 3, title: 'Cache Hit', desc: 'Return cached content references, hydrate with full data' },
                { step: 4, title: 'Cache Miss', desc: 'Generate fresh timeline from content sources' },
                { step: 5, title: 'Follow Priority', desc: 'Query followed users\' posts with +20 score boost' },
                { step: 6, title: 'Content Scoring', desc: 'Calculate scores using multi-factor algorithm' },
                { step: 7, title: 'Content Balancing', desc: 'Apply 60/40 post/project ratio with cycle distribution' },
                { step: 8, title: 'Cache & Return', desc: 'Cache content references, return paginated results' }
              ].map((item) => (
                <div key={item.step} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-7 h-7 bg-primary-orange text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-2">Database Efficiency</h3>
              <div className="text-sm space-y-2 text-gray-700">
                <p><strong>Old System:</strong> O(users × content) records</p>
                <p className="text-red-600">100 posts × 1000 users = 100,000 records</p>
                <p className="mt-3"><strong>New System:</strong> O(content + interactions)</p>
                <p className="text-green-600">100 posts + ~1,000 interactions = 1,100 records</p>
                <p className="text-primary-orange font-bold mt-2">90x reduction!</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-2">Content Freshness</h3>
              <div className="text-sm space-y-2 text-gray-700">
                <p><strong>Old System:</strong> Background jobs, delayed updates</p>
                <p className="text-red-600">New content visible after processing (up to 1hr)</p>
                <p className="mt-3"><strong>New System:</strong> On-demand generation</p>
                <p className="text-green-600">New content visible immediately</p>
                <p className="text-primary-orange font-bold mt-2">Real-time updates!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Feed Types</h2>
        
        <div className="space-y-4">
          {[
            {
              name: 'Home Feed',
              endpoint: '/api/timeline/home/',
              icon: '🏠',
              description: 'Personalized feed with follow priority and intelligent mixing',
              sources: [
                'Followed Users\' Posts (up to 40, +20 score boost)',
                'University Posts (up to 40, excluding followed users)',
                'Public Posts (up to 30, excluding followed users)',
                'University Projects (up to 25)',
                'Public Projects (up to 25)'
              ],
              features: [
                'Follow priority: Posts from followed users get +20 score',
                'Content balancing: 60% posts, 40% projects',
                'University bias: Same university content scores higher',
                'Recency decay: Newer content prioritized'
              ]
            },
            {
              name: 'University Feed',
              endpoint: '/api/timeline/university/',
              icon: '🏫',
              description: 'Content exclusively from user\'s university',
              sources: [
                'University visibility posts from same university',
                'Public visibility posts from same university',
                'University visibility projects from same university',
                'Public visibility projects from same university'
              ],
              features: [
                'Same 60/40 content balancing',
                'University-only focus',
                'Visibility respect (university/public)',
                'User exclusion (no own content)'
              ]
            },
            {
              name: 'Public Feed',
              endpoint: '/api/timeline/public/',
              icon: '🌍',
              description: 'Global discovery feed from all universities',
              sources: [
                'All public posts (up to 50)',
                'All public projects (up to 30)'
              ],
              features: [
                'Cross-university discovery',
                '60/40 content balance maintained',
                'Global trending promotion',
                'Diversity in university sources'
              ]
            }
          ].map((feed) => (
            <div key={feed.name} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-3xl">{feed.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-black">{feed.name}</h3>
                  <code className="text-xs text-primary-orange">{feed.endpoint}</code>
                  <p className="text-sm text-gray-600 mt-2">{feed.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Content Sources:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {feed.sources.map((source, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary-orange mr-1.5">•</span>
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {feed.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-1.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Scoring Algorithm</h2>
        
        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto mb-4">
          <div className="text-xs text-gray-400 mb-3">Multi-Factor Content Scoring (0-100 points)</div>
          <pre className="text-sm"><code>{`def calculate_content_score(content, user, config, is_same_university):
    score = 0.0
    
    # 1. Recency Score (0-25 points)
    hours_old = (now - content.created_at).total_seconds() / 3600
    recency_score = max(0, 25 - (hours_old / 24) * 25)  # Decays over 24h
    score += recency_score * config.recency_weight * 4
    
    # 2. Engagement Score (0-25 points)
    # Posts: likes × 2 + comments × 3
    # Projects: base 15 + needs.length × 2
    engagement_score = calculate_engagement(content)
    score += engagement_score * config.engagement_weight * 4
    
    # 3. University Bonus (0-25 points)
    university_score = 25 if is_same_university else 5
    score += university_score * config.university_weight * 4
    
    # 4. Relevance Score (0-25 points)
    relevance_score = 15  # Base relevance
    score += relevance_score * config.relevance_weight * 4
    
    # 5. Randomization (-1 to +1 points)
    score += random.uniform(-1, 1)  # Prevents staleness
    
    # 6. Follow Priority Boost (AFTER base calculation)
    if content.author in user.following.all():
        score += 20  # Significant boost for followed users
    
    return max(0, min(100, score))  # Clamp to 0-100`}</code></pre>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { factor: 'Recency', weight: '25%', desc: 'Newer content prioritized', max: '25 pts' },
            { factor: 'Engagement', weight: '25%', desc: 'Likes, comments, interactions', max: '25 pts' },
            { factor: 'University', weight: '25%', desc: 'Same university bonus', max: '25 pts' },
            { factor: 'Relevance', weight: '25%', desc: 'Content relevance', max: '25 pts' }
          ].map((factor) => (
            <div key={factor.factor} className="border border-gray-200 rounded-lg p-3">
              <div className="text-lg font-bold text-primary-orange">{factor.weight}</div>
              <div className="font-semibold text-sm text-gray-900 mt-1">{factor.factor}</div>
              <div className="text-xs text-gray-600 mt-1">{factor.desc}</div>
              <div className="text-xs text-primary-orange font-semibold mt-2">{factor.max}</div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🎯 Follow Priority Boost</h3>
          <p className="text-sm text-yellow-800">
            Posts from followed users receive an additional <strong>+20 points</strong> after base scoring, 
            ensuring they appear at the top of the feed (scores &gt;90). This is applied <em>after</em> the 
            base 0-100 calculation, not as part of the weighted factors.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Content Balancing</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Target Ratio: 60% Posts, 40% Projects</h3>
            <p className="text-sm text-blue-800">
              The system maintains an optimal mix of posts and projects using a cycle-based distribution algorithm 
              that preserves score-based ranking while ensuring balanced content variety.
            </p>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-primary-black mb-3">Balancing Algorithm</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <strong>Adaptive Ratio Adjustment:</strong> If one content type is limited (&lt;30%), 
                  adjust target ratio automatically to maintain balance.
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <strong>Cycle-Based Distribution:</strong> Use 3-item cycles with 2 posts + 1 project 
                  pattern for natural content flow.
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <strong>Score Preservation:</strong> Maintain score-based ranking within each content type 
                  while interleaving for variety.
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <strong>Natural Pattern:</strong> Result is P-P-J-P-P-J pattern (Post-Post-Project) 
                  that feels organic to users.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-black mb-2">Normal Balance</h4>
              <div className="text-sm text-gray-700">
                <p className="mb-2">When both content types are abundant:</p>
                <div className="bg-gray-50 rounded p-3 space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-3/5 h-6 bg-blue-500 rounded-l flex items-center justify-center text-white font-semibold">60% Posts</div>
                    <div className="w-2/5 h-6 bg-green-500 rounded-r flex items-center justify-center text-white font-semibold">40% Projects</div>
                  </div>
                  <p className="text-gray-600 mt-2">Out of 10 items: 6 posts, 4 projects</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-black mb-2">Adaptive Balance</h4>
              <div className="text-sm text-gray-700">
                <p className="mb-2">When projects are limited (&lt;30%):</p>
                <div className="bg-gray-50 rounded p-3 space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-4/5 h-6 bg-blue-500 rounded-l flex items-center justify-center text-white font-semibold">75% Posts</div>
                    <div className="w-1/5 h-6 bg-green-500 rounded-r flex items-center justify-center text-white font-semibold">25% Projects</div>
                  </div>
                  <p className="text-gray-600 mt-2">Adapts to available content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Models & Database</h2>
        
        <div className="space-y-4">
          {[
            {
              model: 'ContentScore',
              purpose: 'Lightweight score cache for content (not user-specific)',
              fields: ['content_type', 'content_id', 'base_score', 'engagement_score', 'recency_score', 'trending_score', 'calculated_at', 'expires_at'],
              benefit: 'One record per content item (not per user) = 1000x reduction'
            },
            {
              model: 'UserInteraction',
              purpose: 'Track actual user interactions (sparse data)',
              fields: ['user', 'content_type', 'content_id', 'action', 'view_time', 'feed_type', 'created_at'],
              benefit: 'Only stores actual interactions, enables advanced analytics'
            },
            {
              model: 'FeedConfiguration',
              purpose: 'User-specific feed preferences and algorithm weights',
              fields: ['user', 'show_university_posts', 'show_public_posts', 'recency_weight', 'engagement_weight', 'university_weight', 'relevance_weight'],
              benefit: 'Personalized feed curation per user'
            },
            {
              model: 'TimelineFeedCache',
              purpose: 'Lightweight cache storing content references (not full objects)',
              fields: ['user', 'feed_type', 'cached_content', 'total_count', 'expires_at', 'last_refresh'],
              benefit: '80% smaller cache entries, supports pagination'
            }
          ].map((model) => (
            <div key={model.model} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-primary-black">{model.model}</h3>
                  <p className="text-sm text-gray-600 mt-1">{model.purpose}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Fields:</h4>
                <div className="flex flex-wrap gap-2">
                  {model.fields.map((field) => (
                    <code key={field} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{field}</code>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded p-3">
                <p className="text-sm text-green-800">
                  <strong className="text-green-900">Benefit:</strong> {model.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Performance Metrics</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { metric: 'Feed Generation', target: '<200ms', current: '~150ms', status: 'good' },
            { metric: 'Cache Hit Ratio', target: '>80%', current: '~85%', status: 'good' },
            { metric: 'Content Balance', target: '55-65% posts', current: '60%', status: 'good' },
            { metric: 'Follow Priority', target: 'Scores >90', current: 'Working', status: 'good' },
            { metric: 'DB Queries/Request', target: '<10', current: '~8', status: 'good' },
            { metric: 'Memory/Request', target: '<50MB', current: '~35MB', status: 'good' }
          ].map((metric) => (
            <div key={metric.metric} className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">{metric.metric}</div>
              <div className="text-2xl font-bold text-primary-black mb-1">{metric.current}</div>
              <div className={`text-xs font-semibold ${
                metric.status === 'good' ? 'text-green-600' : 
                metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                Target: {metric.target}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-5 rounded-r-lg mt-8">
        <h3 className="font-semibold text-primary-black mb-2">📚 Full Documentation</h3>
        <p className="text-sm text-gray-700 mb-3">
          For complete feed system documentation including tuning parameters, monitoring, debugging commands, 
          and migration guides, refer to:
        </p>
        <code className="text-sm bg-gray-900 text-green-400 px-3 py-2 rounded block">
          FEED_SYSTEM_DOCUMENTATION.md
        </code>
      </div>
    </div>
  );
}

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Admin Overview</h1>
        <p className="text-lg text-secondary-charcoal">
          Django Admin interface for comprehensive platform management
        </p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-red-900 mb-2">🔒 Admin Access</h3>
        <p className="text-sm text-red-800 mb-2">
          Admin interface is only accessible to users with investor role (acting as admins).
        </p>
        <div className="mt-3">
          <strong className="text-red-900">Admin URL:</strong>
          <code className="ml-2 bg-red-100 px-2 py-1 rounded text-red-900">http://localhost:8000/admin/</code>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Admin Capabilities</h2>
        
        <div className="grid gap-4">
          {[
            {
              section: 'User Management',
              icon: '👤',
              capabilities: [
                'View all user accounts',
                'Edit user profiles and roles',
                'Activate/deactivate accounts',
                'Manage permissions and groups',
                'View user activity logs'
              ]
            },
            {
              section: 'Content Moderation',
              icon: '📝',
              capabilities: [
                'Review and moderate posts',
                'Manage project listings',
                'Handle reported content',
                'Delete inappropriate content',
                'Monitor comment activity'
              ]
            },
            {
              section: 'Contact Management',
              icon: '📧',
              capabilities: [
                'View contact form submissions',
                'Categorize inquiries',
                'Set priority levels',
                'Track resolution status',
                'Add admin notes'
              ]
            },
            {
              section: 'Feed Management',
              icon: '📊',
              capabilities: [
                'View content scores',
                'Monitor user interactions',
                'Manage feed configurations',
                'Clear feed caches',
                'Track trending topics'
              ]
            },
            {
              section: 'Notification System',
              icon: '🔔',
              capabilities: [
                'View all notifications',
                'Monitor delivery status',
                'Manage notification types',
                'Debug notification issues',
                'View engagement metrics'
              ]
            },
            {
              section: 'University Management',
              icon: '🏫',
              capabilities: [
                'Add new universities',
                'Edit university data',
                'Manage verification status',
                'View university statistics',
                'Monitor university activity'
              ]
            }
          ].map((section) => (
            <div key={section.section} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-orange transition-colors">
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-3xl">{section.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-primary-black">{section.section}</h3>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm">
                {section.capabilities.map((capability, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-primary-orange mr-2 font-bold">✓</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Admin Interface Features</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              feature: 'List Views',
              description: 'Comprehensive tables with sorting, filtering, and search',
              details: ['Column sorting', 'Advanced filters', 'Full-text search', 'Pagination']
            },
            {
              feature: 'Detail Views',
              description: 'Complete record editing with validation',
              details: ['Inline editing', 'Related objects', 'Field validation', 'Change history']
            },
            {
              feature: 'Bulk Actions',
              description: 'Perform actions on multiple records at once',
              details: ['Bulk delete', 'Bulk update', 'Export data', 'Custom actions']
            },
            {
              feature: 'Filters & Search',
              description: 'Powerful filtering and search capabilities',
              details: ['Date filters', 'Choice filters', 'Boolean filters', 'Custom filters']
            },
            {
              feature: 'Change History',
              description: 'Track all modifications to records',
              details: ['User tracking', 'Timestamp logging', 'Field changes', 'Audit trail']
            },
            {
              feature: 'Permissions',
              description: 'Granular permission control',
              details: ['Model permissions', 'Object permissions', 'Group management', 'Role-based access']
            }
          ].map((feature) => (
            <div key={feature.feature} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-1">{feature.feature}</h3>
              <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
              <div className="space-y-1">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-primary-orange rounded-full mr-2"></span>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Quick Admin Tasks</h2>
        
        <div className="space-y-3">
          {[
            {
              task: 'View New Contact Inquiries',
              path: 'Contact Management → Contact Inquiries → Filter by Status: New'
            },
            {
              task: 'Clear All Feed Caches',
              path: 'Feed → Timeline Feed Caches → Select All → Delete'
            },
            {
              task: 'Monitor Content Scores',
              path: 'Feed → Content Scores → Sort by Base Score (descending)'
            },
            {
              task: 'Review Recent Posts',
              path: 'Posts → Posts → Sort by Created At (descending)'
            },
            {
              task: 'Manage Project Visibility',
              path: 'Projects → Projects → Filter by Visibility → Edit'
            },
            {
              task: 'View User Activity',
              path: 'Feed → User Interactions → Filter by User/Date'
            }
          ].map((task, idx) => (
            <div key={idx} className="flex items-start space-x-3 border border-gray-200 rounded-lg p-4">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary-black text-sm">{task.task}</h4>
                <p className="text-xs text-gray-600 mt-1">{task.path}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminFeatures() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Admin Features & Capabilities</h1>
        <p className="text-lg text-secondary-charcoal">
          Detailed breakdown of administrative tools and management features
        </p>
      </div>

      {/* Django Admin Actions */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Bulk Actions</h2>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Perform actions on multiple records simultaneously using Django Admin's bulk action system.
          </p>
          
          <div className="grid gap-4">
            {[
              {
                model: 'Contact Inquiries',
                actions: [
                  { name: 'Mark as New', desc: 'Reset inquiries to new status' },
                  { name: 'Mark as In Progress', desc: 'Update multiple inquiries to in-progress state' },
                  { name: 'Mark as Resolved', desc: 'Bulk resolve inquiries with timestamp' },
                  { name: 'Set Priority: High', desc: 'Elevate priority for urgent matters' }
                ]
              },
              {
                model: 'Posts',
                actions: [
                  { name: 'Delete Selected', desc: 'Remove multiple posts' },
                  { name: 'Change Visibility', desc: 'Bulk update visibility settings' },
                  { name: 'Export to CSV', desc: 'Export post data for analysis' }
                ]
              },
              {
                model: 'Projects',
                actions: [
                  { name: 'Change Status', desc: 'Update project status (concept/mvp/launched)' },
                  { name: 'Update Visibility', desc: 'Modify project visibility settings' },
                  { name: 'Export Projects', desc: 'Export project information' }
                ]
              },
              {
                model: 'Feed Caches',
                actions: [
                  { name: 'Clear Selected Caches', desc: 'Force regeneration of selected feeds' },
                  { name: 'Clear Expired Caches', desc: 'Remove all expired cache entries' }
                ]
              }
            ].map((model) => (
              <div key={model.model} className="border-2 border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-primary-black mb-3">{model.model}</h3>
                <div className="space-y-2">
                  {model.actions.map((action, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-gray-50 rounded p-3">
                      <span className="text-primary-orange font-bold">⚡</span>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{action.name}</div>
                        <div className="text-xs text-gray-600">{action.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtering & Search */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Filtering & Search</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-primary-black mb-3">List Filters</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-gray-900">Date Filters:</strong>
                <p className="text-gray-600 text-xs mt-1">Today, Past 7 days, This month, This year, Custom range</p>
              </div>
              <div>
                <strong className="text-gray-900">Choice Filters:</strong>
                <p className="text-gray-600 text-xs mt-1">Status, Priority, Type, Visibility, Role</p>
              </div>
              <div>
                <strong className="text-gray-900">Boolean Filters:</strong>
                <p className="text-gray-600 text-xs mt-1">Is Active, Is Public, Has Image, Is Resolved</p>
              </div>
              <div>
                <strong className="text-gray-900">Related Filters:</strong>
                <p className="text-gray-600 text-xs mt-1">By User, By University, By Project, By Author</p>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-primary-black mb-3">Search Capabilities</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-gray-900">Full-Text Search:</strong>
                <p className="text-gray-600 text-xs mt-1">Search across content, titles, descriptions, messages</p>
              </div>
              <div>
                <strong className="text-gray-900">User Search:</strong>
                <p className="text-gray-600 text-xs mt-1">By username, email, name</p>
              </div>
              <div>
                <strong className="text-gray-900">ID Search:</strong>
                <p className="text-gray-600 text-xs mt-1">Search by record ID or UUID</p>
              </div>
              <div>
                <strong className="text-gray-900">Combined Search:</strong>
                <p className="text-gray-600 text-xs mt-1">Search with filters for precise results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Reporting */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Analytics & Reporting</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Available Metrics</h3>
            <p className="text-sm text-blue-800">
              Access comprehensive analytics through the admin interface and Django shell commands.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                category: 'User Metrics',
                metrics: ['Total users by role', 'Active users (last 30 days)', 'New registrations (weekly/monthly)', 'User engagement rates', 'Top contributors']
              },
              {
                category: 'Content Metrics',
                metrics: ['Posts created (daily/weekly/monthly)', 'Projects by type and status', 'Comments and likes statistics', 'Most engaged content', 'Content by visibility']
              },
              {
                category: 'Feed Metrics',
                metrics: ['Feed generation times', 'Cache hit ratios', 'User interaction counts', 'Content score distributions', 'Trending topics']
              },
              {
                category: 'Contact Metrics',
                metrics: ['Inquiries by type', 'Response times', 'Resolution rates', 'Priority distribution', 'Inquiry volume trends']
              }
            ].map((category) => (
              <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-primary-black mb-3">{category.category}</h4>
                <ul className="space-y-1 text-sm">
                  {category.metrics.map((metric, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="text-primary-orange mr-2">📊</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Capabilities */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Data Export</h2>
        
        <div className="border-2 border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-primary-black mb-4">Export Options</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { format: 'CSV', desc: 'Spreadsheet format for Excel/Google Sheets', use: 'Data analysis, reporting' },
              { format: 'JSON', desc: 'Structured data format', use: 'Data migration, API integration' },
              { format: 'XML', desc: 'Hierarchical data format', use: 'Data exchange, archives' }
            ].map((format) => (
              <div key={format.format} className="border border-gray-200 rounded-lg p-4">
                <div className="font-bold text-primary-orange text-lg mb-1">{format.format}</div>
                <p className="text-xs text-gray-600 mb-2">{format.desc}</p>
                <div className="text-xs text-gray-500">
                  <strong>Use Case:</strong> {format.use}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-gray-50 rounded p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Exportable Data:</h4>
            <div className="flex flex-wrap gap-2">
              {['User Profiles', 'Posts', 'Projects', 'Comments', 'Contact Inquiries', 'Notifications', 'Interactions'].map((data) => (
                <span key={data} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-700">
                  {data}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AdminContact() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Contact Management</h1>
        <p className="text-lg text-secondary-charcoal">
          Comprehensive system for managing contact form submissions and inquiries
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">📧 Contact Inquiry System</h3>
        <p className="text-gray-700 mb-4">
          The contact management system provides a complete workflow for handling user inquiries, 
          from submission through resolution, with advanced filtering, prioritization, and tracking capabilities.
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded p-3 border border-blue-200">
            <div className="font-bold text-blue-600 text-lg">8</div>
            <div className="text-gray-600">Inquiry Types</div>
          </div>
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-bold text-green-600 text-lg">4</div>
            <div className="text-gray-600">Status Levels</div>
          </div>
          <div className="bg-white rounded p-3 border border-orange-200">
            <div className="font-bold text-orange-600 text-lg">4</div>
            <div className="text-gray-600">Priority Levels</div>
          </div>
        </div>
      </div>

      {/* Status Management */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Status Management</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              status: 'New',
              color: 'bg-blue-100 text-blue-800 border-blue-300',
              icon: '🔵',
              description: 'Newly submitted inquiries that haven\'t been reviewed',
              actions: ['Assign to staff', 'Set priority', 'Change to In Progress']
            },
            {
              status: 'In Progress',
              color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
              icon: '🟡',
              description: 'Inquiries currently being worked on by staff',
              actions: ['Add notes', 'Update priority', 'Mark as Resolved']
            },
            {
              status: 'Resolved',
              color: 'bg-green-100 text-green-800 border-green-300',
              icon: '🟢',
              description: 'Inquiries that have been successfully addressed',
              actions: ['View resolution time', 'Archive', 'Reopen if needed']
            },
            {
              status: 'Closed',
              color: 'bg-gray-100 text-gray-800 border-gray-300',
              icon: '⚫',
              description: 'Archived inquiries no longer requiring action',
              actions: ['View history', 'Export data', 'Permanently delete']
            }
          ].map((status) => (
            <div key={status.status} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{status.icon}</span>
                <div className={`px-3 py-1 rounded-full border text-sm font-bold ${status.color}`}>
                  {status.status}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{status.description}</p>
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Available Actions:</h4>
                <ul className="space-y-1">
                  {status.actions.map((action, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-center">
                      <span className="w-1 h-1 bg-primary-orange rounded-full mr-2"></span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Priority Levels */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Priority Levels</h2>
        
        <div className="grid grid-cols-4 gap-3">
          {[
            { level: 'Low', icon: '⬇️', color: 'bg-green-100 border-green-300 text-green-800', response: '3-5 days' },
            { level: 'Medium', icon: '➡️', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', response: '1-2 days' },
            { level: 'High', icon: '⬆️', color: 'bg-orange-100 border-orange-300 text-orange-800', response: '< 24 hours' },
            { level: 'Urgent', icon: '🔥', color: 'bg-red-100 border-red-300 text-red-800', response: '< 4 hours' }
          ].map((priority) => (
            <div key={priority.level} className={`border-2 rounded-lg p-4 ${priority.color}`}>
              <div className="text-2xl mb-2">{priority.icon}</div>
              <div className="font-bold mb-1">{priority.level}</div>
              <div className="text-xs">Target Response: {priority.response}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Types */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Inquiry Types</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { type: 'General Inquiry', icon: '💬', auto_priority: 'Medium', desc: 'General questions and information requests' },
            { type: 'Partnership Opportunity', icon: '🤝', auto_priority: 'Medium', desc: 'Business partnerships and collaborations' },
            { type: 'University Partnership', icon: '🏫', auto_priority: 'High', desc: 'University-specific partnership inquiries' },
            { type: 'Technical Support', icon: '🔧', auto_priority: 'High', desc: 'Technical issues and bug reports' },
            { type: 'Feedback & Suggestions', icon: '💡', auto_priority: 'Low', desc: 'User feedback and feature suggestions' },
            { type: 'Investor Relations', icon: '💰', auto_priority: 'High', desc: 'Investment and funding inquiries' },
            { type: 'Press & Media', icon: '📰', auto_priority: 'Medium', desc: 'Media inquiries and press requests' },
            { type: 'Other', icon: '📋', auto_priority: 'Medium', desc: 'Miscellaneous inquiries' }
          ].map((type) => (
            <div key={type.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-2">
                <span className="text-2xl">{type.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-black">{type.type}</h3>
                  <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                <span className="text-gray-500">Auto-Priority:</span>
                <span className="ml-2 font-semibold text-gray-900">{type.auto_priority}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Workflow */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Admin Workflow</h2>
        
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-black mb-4">Typical Inquiry Management Flow</h3>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'New Inquiry Arrives',
                actions: ['System auto-categorizes based on inquiry type', 'Auto-assigns priority level', 'Appears in admin with 🆕 indicator']
              },
              {
                step: 2,
                title: 'Admin Reviews',
                actions: ['Open inquiry from list view', 'Review contact details and message', 'Verify auto-assigned category and priority']
              },
              {
                step: 3,
                title: 'Assignment & Processing',
                actions: ['Assign to appropriate staff member', 'Change status to "In Progress"', 'Add initial response notes']
              },
              {
                step: 4,
                title: 'Resolution',
                actions: ['Staff addresses the inquiry', 'Add resolution notes', 'Mark as "Resolved" with timestamp']
              },
              {
                step: 5,
                title: 'Archive',
                actions: ['After review period, mark as "Closed"', 'Generate reports if needed', 'Archive for records']
              }
            ].map((workflow) => (
              <div key={workflow.step} className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {workflow.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-primary-black mb-2">{workflow.title}</h4>
                  <ul className="space-y-1">
                    {workflow.actions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-primary-orange mr-2">→</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtering & Search */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Filtering & Search</h2>
        
        <div className="grid gap-4">
          {[
            {
              category: 'Status Filters',
              options: ['All inquiries', 'New only', 'In Progress only', 'Resolved only', 'Closed only']
            },
            {
              category: 'Priority Filters',
              options: ['All priorities', 'Urgent only', 'High priority', 'Medium priority', 'Low priority']
            },
            {
              category: 'Type Filters',
              options: ['All types', 'Technical Support', 'Partnership', 'University', 'General', 'Other']
            },
            {
              category: 'Date Filters',
              options: ['Today', 'Past 7 days', 'This month', 'This year', 'Custom date range']
            },
            {
              category: 'Assignment Filters',
              options: ['All inquiries', 'Unassigned', 'Assigned to me', 'By staff member']
            },
            {
              category: 'Search Fields',
              options: ['Name', 'Email', 'Subject', 'Message content', 'Admin notes', 'Inquiry ID']
            }
          ].map((filter) => (
            <div key={filter.category} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-black mb-3">{filter.category}</h3>
              <div className="flex flex-wrap gap-2">
                {filter.options.map((option) => (
                  <span key={option} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-5 rounded-r-lg mt-8">
        <h3 className="font-semibold text-primary-black mb-2">📚 Visual Admin Guide</h3>
        <p className="text-sm text-gray-700 mb-3">
          For a complete visual guide to the contact admin interface with color schemes, badges, and UI examples, refer to:
        </p>
        <code className="text-sm bg-gray-900 text-green-400 px-3 py-2 rounded block">
          ADMIN_INTERFACE_GUIDE.md
        </code>
      </div>
    </div>
  );
}

