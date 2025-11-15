import React from 'react';

export function ManagementCommands() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Management Commands</h1>
        <p className="text-lg text-secondary-charcoal">
          Django management commands for feed maintenance, content scoring, and data generation
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-orange/10 to-accent-pine/10 border-l-4 border-primary-orange p-6 rounded-r-lg">
        <h3 className="text-xl font-bold text-primary-black mb-3">📌 Quick Reference</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">⚙️</span>
            <div>
              <strong>refresh_feeds</strong><br/>
              <span className="text-xs text-gray-600">Clear caches & update scores</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">🔄</span>
            <div>
              <strong>update_content_scores</strong><br/>
              <span className="text-xs text-gray-600">Background scoring</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-orange font-bold text-lg">🎲</span>
            <div>
              <strong>generate_feed_content</strong><br/>
              <span className="text-xs text-gray-600">Test data generation</span>
            </div>
          </div>
        </div>
      </div>

      {/* refresh_feeds Command */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">refresh_feeds</h2>

        <div className="border-2 border-primary-orange rounded-lg p-6 mb-4">
          <div className="flex items-start space-x-3 mb-4">
            <span className="text-3xl">⚙️</span>
            <div>
              <h3 className="text-xl font-bold text-primary-black">Feed Cache Refresh & Score Update</h3>
              <p className="text-sm text-gray-600 mt-1">
                Clears feed caches and updates content scores to improve feed freshness and ranking accuracy
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-400 mb-2">Basic Usage:</div>
            <code className="text-sm text-green-400">python manage.py refresh_feeds</code>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary-black mb-2">Command Flags & Variations:</h4>

              <div className="space-y-3">
                {[
                  {
                    flag: '--clear-cache',
                    usage: 'python manage.py refresh_feeds --clear-cache',
                    description: 'Only clear feed caches without updating content scores',
                    when: 'When you need to force feed regeneration without recalculating scores',
                    impact: 'Fast operation (~2-5 seconds). Removes cached content references, next request regenerates feed.'
                  },
                  {
                    flag: '--update-scores',
                    usage: 'python manage.py refresh_feeds --update-scores',
                    description: 'Only update content scores without clearing caches',
                    when: 'When content engagement has changed but caches are still valid',
                    impact: 'Moderate operation (~30-60 seconds). Recalculates all content scores based on current engagement.'
                  },
                  {
                    flag: '--user USERNAME',
                    usage: 'python manage.py refresh_feeds --user johndoe',
                    description: 'Clear cache and update scores for a specific user only',
                    when: 'Debugging user-specific feed issues or testing changes for one user',
                    impact: 'Very fast (~1 second). Only affects specified user\'s feed cache.'
                  },
                  {
                    flag: 'No flags',
                    usage: 'python manage.py refresh_feeds',
                    description: 'Perform both cache clearing AND score updates (default behavior)',
                    when: 'Recommended for scheduled maintenance or after major content changes',
                    impact: 'Full refresh (~1-2 minutes). Comprehensive feed system maintenance.'
                  }
                ].map((flag, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start space-x-3 mb-2">
                      <code className="text-sm font-bold text-primary-orange bg-white px-2 py-1 rounded border border-primary-orange">
                        {flag.flag}
                      </code>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-1">{flag.description}</p>
                      </div>
                    </div>

                    <div className="bg-gray-900 text-gray-100 rounded p-2 mb-2 overflow-x-auto">
                      <code className="text-xs text-green-400">{flag.usage}</code>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <strong className="text-gray-700">When to use:</strong>
                        <p className="text-gray-600 mt-1">{flag.when}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Impact:</strong>
                        <p className="text-gray-600 mt-1">{flag.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-2">💡 What It Does Behind the Scenes:</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  <span><strong>Cache Clearing:</strong> Deletes TimelineFeedCache records for all users (or specified user)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  <span><strong>Score Updates:</strong> Recalculates ContentScore for all posts and projects based on current engagement metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  <span><strong>Feed Regeneration:</strong> Next user request will generate fresh feed with updated scores</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">4.</span>
                  <span><strong>Progress Tracking:</strong> Displays progress messages showing number of caches cleared and scores updated</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900 mb-2">⏰ Recommended Cron Schedule:</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-3 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-yellow-900">Full Refresh (with scores)</strong>
                    <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">0 2 * * *</code>
                  </div>
                  <p className="text-xs text-yellow-800">
                    Run daily at 2:00 AM to clear all caches and update all scores during low-traffic hours
                  </p>
                </div>

                <div className="bg-white rounded p-3 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-yellow-900">Cache-only Clear</strong>
                    <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">0 */6 * * *</code>
                  </div>
                  <p className="text-xs text-yellow-800">
                    Run every 6 hours with --clear-cache for frequent feed freshness without score recalculation
                  </p>
                </div>

                <div className="bg-gray-900 text-gray-100 rounded p-3 mt-3">
                  <div className="text-xs text-gray-400 mb-1">Example crontab entry:</div>
                  <code className="text-xs text-green-400">
                    0 2 * * * cd /path/to/entrehive_backend && python manage.py refresh_feeds
                  </code>
                </div>
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-900 mb-2">✅ Importance & Use Cases:</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Content Freshness:</strong> Ensures users see the latest content by removing stale caches
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Ranking Accuracy:</strong> Updates scores to reflect current engagement (likes, comments)
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Algorithm Changes:</strong> Apply changes to feed ranking algorithm by forcing recalculation
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Bug Fixes:</strong> Clear corrupted or incorrect cache data after bug fixes
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>User Complaints:</strong> Resolve "stale feed" issues by refreshing specific user's cache
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* update_content_scores Command */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">update_content_scores</h2>

        <div className="border-2 border-blue-500 rounded-lg p-6 mb-4">
          <div className="flex items-start space-x-3 mb-4">
            <span className="text-3xl">🔄</span>
            <div>
              <h3 className="text-xl font-bold text-primary-black">Background Content Scoring</h3>
              <p className="text-sm text-gray-600 mt-1">
                Updates content scores based on engagement metrics without clearing caches. Ideal for continuous score maintenance.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-400 mb-2">Basic Usage:</div>
            <code className="text-sm text-green-400">python manage.py update_content_scores</code>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary-black mb-2">Command Flags & Variations:</h4>

              <div className="space-y-3">
                {[
                  {
                    flag: '--days N',
                    usage: 'python manage.py update_content_scores --days 7',
                    description: 'Update scores for content created within the last N days (default: 7)',
                    when: 'Focus on recent content where engagement is most active',
                    impact: 'Faster execution. Only processes content from specified timeframe.',
                    default: '7 days'
                  },
                  {
                    flag: '--batch-size N',
                    usage: 'python manage.py update_content_scores --batch-size 50',
                    description: 'Process content in batches of N items (default: 100)',
                    when: 'Adjust for server resources - smaller batches use less memory',
                    impact: 'Affects memory usage and processing speed. Smaller = slower but safer.',
                    default: '100 items'
                  },
                  {
                    flag: '--days 30 --batch-size 200',
                    usage: 'python manage.py update_content_scores --days 30 --batch-size 200',
                    description: 'Combine flags to update last 30 days in large batches',
                    when: 'Monthly comprehensive update with sufficient server resources',
                    impact: 'Longer operation but covers more content. Requires adequate memory.',
                    default: 'Custom'
                  }
                ].map((flag, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start space-x-3 mb-2">
                      <code className="text-sm font-bold text-blue-600 bg-white px-2 py-1 rounded border border-blue-500">
                        {flag.flag}
                      </code>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-1">{flag.description}</p>
                      </div>
                    </div>

                    <div className="bg-gray-900 text-gray-100 rounded p-2 mb-2 overflow-x-auto">
                      <code className="text-xs text-green-400">{flag.usage}</code>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <strong className="text-gray-700">When to use:</strong>
                        <p className="text-gray-600 mt-1">{flag.when}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Impact:</strong>
                        <p className="text-gray-600 mt-1">{flag.impact}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Default:</strong>
                        <p className="text-gray-600 mt-1">{flag.default}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-2">💡 What It Does Behind the Scenes:</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  <span><strong>Content Query:</strong> Fetches posts and projects created within specified timeframe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  <span><strong>Batch Processing:</strong> Processes content in configurable batch sizes to manage memory</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  <span><strong>Score Calculation:</strong> For each content item, calculates recency, engagement, and trending scores</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">4.</span>
                  <span><strong>Database Update:</strong> Updates or creates ContentScore records with new scores and expiry times</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">5.</span>
                  <span><strong>Progress Display:</strong> Shows batch progress and total updated count</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900 mb-2">⏰ Recommended Cron Schedule:</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white rounded p-3 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-yellow-900">Recent Content (7 days)</strong>
                    <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">0 */4 * * *</code>
                  </div>
                  <p className="text-xs text-yellow-800">
                    Run every 4 hours to keep recent content scores fresh as engagement changes
                  </p>
                </div>

                <div className="bg-white rounded p-3 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-yellow-900">Extended Content (30 days)</strong>
                    <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">0 3 * * 0</code>
                  </div>
                  <p className="text-xs text-yellow-800">
                    Run weekly on Sundays at 3:00 AM with --days 30 for comprehensive monthly content update
                  </p>
                </div>

                <div className="bg-gray-900 text-gray-100 rounded p-3 mt-3">
                  <div className="text-xs text-gray-400 mb-1">Example crontab entries:</div>
                  <div className="space-y-1">
                    <code className="text-xs text-green-400 block">
                      # Recent content every 4 hours
                    </code>
                    <code className="text-xs text-green-400 block">
                      0 */4 * * * cd /path/to/entrehive_backend && python manage.py update_content_scores
                    </code>
                    <code className="text-xs text-green-400 block mt-2">
                      # Monthly content weekly
                    </code>
                    <code className="text-xs text-green-400 block">
                      0 3 * * 0 cd /path/to/entrehive_backend && python manage.py update_content_scores --days 30
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-900 mb-2">✅ Importance & Use Cases:</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Continuous Scoring:</strong> Keeps content scores up-to-date as posts gain likes and comments
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Trending Detection:</strong> Identifies content that's gaining rapid engagement for better ranking
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Recency Decay:</strong> Applies time-based decay to older content scores automatically
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Feed Quality:</strong> Maintains high-quality feed recommendations based on current data
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Performance:</strong> Pre-calculated scores improve feed generation speed vs real-time scoring
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-semibold text-purple-900 mb-2">🔍 Difference from refresh_feeds:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-purple-900">update_content_scores</strong>
                  <ul className="mt-2 space-y-1 text-purple-800">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>ONLY updates scores</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Does NOT clear caches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Can run frequently (every 4 hours)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Focuses on recent content</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <strong className="text-purple-900">refresh_feeds</strong>
                  <ul className="mt-2 space-y-1 text-purple-800">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Clears feed caches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>CAN update scores (optional)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Should run less frequently (daily)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Forces feed regeneration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* generate_feed_content Command */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">generate_feed_content</h2>

        <div className="border-2 border-green-600 rounded-lg p-6 mb-4">
          <div className="flex items-start space-x-3 mb-4">
            <span className="text-3xl">🎲</span>
            <div>
              <h3 className="text-xl font-bold text-primary-black">Test Data Generation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Generates realistic test data (users, posts, projects) for development and testing environments
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION</h4>
            <p className="text-sm text-red-800">
              This command creates fake data and should ONLY be run in development or staging environments.
              Running in production will create invalid content and users.
            </p>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-400 mb-2">Basic Usage:</div>
            <code className="text-sm text-green-400">python manage.py generate_feed_content</code>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary-black mb-2">Command Flags & Variations:</h4>

              <div className="space-y-3">
                {[
                  {
                    flag: '--posts N',
                    usage: 'python manage.py generate_feed_content --posts 100',
                    description: 'Generate N posts with random content (default: 200)',
                    when: 'Testing feed with specific number of posts',
                    impact: 'Creates posts with likes, comments, and varied visibility settings',
                    default: '200 posts'
                  },
                  {
                    flag: '--projects N',
                    usage: 'python manage.py generate_feed_content --projects 50',
                    description: 'Generate N projects with random attributes (default: 100)',
                    when: 'Testing project feed and discovery features',
                    impact: 'Creates projects with team members, needs, and categories',
                    default: '100 projects'
                  },
                  {
                    flag: '--users N',
                    usage: 'python manage.py generate_feed_content --users 25',
                    description: 'Generate N fake users first (default: 50)',
                    when: 'Need more users as content authors',
                    impact: 'Creates users with profiles, universities, and follow relationships',
                    default: '50 users'
                  },
                  {
                    flag: '--posts 500 --projects 200 --users 100',
                    usage: 'python manage.py generate_feed_content --posts 500 --projects 200 --users 100',
                    description: 'Combine all flags for large-scale test dataset',
                    when: 'Load testing or comprehensive feed algorithm testing',
                    impact: 'Creates substantial test dataset. May take several minutes to complete.',
                    default: 'Custom'
                  }
                ].map((flag, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start space-x-3 mb-2">
                      <code className="text-sm font-bold text-green-700 bg-white px-2 py-1 rounded border border-green-600">
                        {flag.flag}
                      </code>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-1">{flag.description}</p>
                      </div>
                    </div>

                    <div className="bg-gray-900 text-gray-100 rounded p-2 mb-2 overflow-x-auto">
                      <code className="text-xs text-green-400">{flag.usage}</code>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <strong className="text-gray-700">When to use:</strong>
                        <p className="text-gray-600 mt-1">{flag.when}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Impact:</strong>
                        <p className="text-gray-600 mt-1">{flag.impact}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Default:</strong>
                        <p className="text-gray-600 mt-1">{flag.default}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-2">💡 What It Generates:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-900">Users</strong>
                  <ul className="mt-2 space-y-1 text-xs text-blue-800">
                    <li>• Unique usernames</li>
                    <li>• Email addresses</li>
                    <li>• Profile information</li>
                    <li>• Random universities</li>
                    <li>• Follow relationships</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-900">Posts</strong>
                  <ul className="mt-2 space-y-1 text-xs text-blue-800">
                    <li>• Random content text</li>
                    <li>• Like counts (0-50)</li>
                    <li>• Comments (0-20)</li>
                    <li>• Varied visibility</li>
                    <li>• Hashtags & mentions</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-900">Projects</strong>
                  <ul className="mt-2 space-y-1 text-xs text-blue-800">
                    <li>• Project titles & summaries</li>
                    <li>• Random types & statuses</li>
                    <li>• Team members</li>
                    <li>• Needs & categories</li>
                    <li>• Visibility settings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-900 mb-2">✅ Importance & Use Cases:</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Development Testing:</strong> Populate local database with realistic data for UI/UX testing
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Feed Algorithm Testing:</strong> Test feed ranking and content balancing with various data volumes
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Performance Testing:</strong> Stress test feed generation with large content volumes
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Demo Preparation:</strong> Create impressive demo environment with realistic-looking content
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">•</span>
                  <div>
                    <strong>Feature Development:</strong> Test new features with diverse content types and edge cases
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900 mb-2">📋 Best Practices:</h4>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <div>
                    <strong>Start Fresh:</strong> Run on a clean database or after flushing data for consistent results
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <div>
                    <strong>Generate Users First:</strong> Users are created first, then content is assigned to them
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <div>
                    <strong>Adjust for Testing:</strong> Use smaller numbers (--posts 50) for quick testing, larger for load testing
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <div>
                    <strong>Run Scoring After:</strong> Follow up with update_content_scores to calculate scores for generated content
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <div>
                    <strong>Never in Production:</strong> This is for development/staging only. Generated data is not real.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Complete Setup Example:</h4>
              <div className="space-y-1 text-xs">
                <code className="text-green-400 block"># 1. Generate test data</code>
                <code className="text-white block">python manage.py generate_feed_content --posts 300 --projects 150 --users 75</code>

                <code className="text-green-400 block mt-3"># 2. Update content scores for generated data</code>
                <code className="text-white block">python manage.py update_content_scores --days 30</code>

                <code className="text-green-400 block mt-3"># 3. (Optional) Clear and refresh feeds</code>
                <code className="text-white block">python manage.py refresh_feeds</code>

                <code className="text-green-400 block mt-3"># 4. Start development server</code>
                <code className="text-white block">python manage.py runserver</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Comparison */}
      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Commands Comparison</h2>

        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary-orange text-white">
              <tr>
                <th className="p-3 text-left">Command</th>
                <th className="p-3 text-left">Purpose</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Environment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 font-mono text-xs font-bold">refresh_feeds</td>
                <td className="p-3">Clear caches & update scores</td>
                <td className="p-3">Daily (2:00 AM)</td>
                <td className="p-3">Production, Staging</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-mono text-xs font-bold">update_content_scores</td>
                <td className="p-3">Update scores only (no cache clear)</td>
                <td className="p-3">Every 4 hours</td>
                <td className="p-3">Production, Staging</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-mono text-xs font-bold">generate_feed_content</td>
                <td className="p-3">Generate test data for development</td>
                <td className="p-3">As needed</td>
                <td className="p-3 text-red-600 font-bold">Development ONLY</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-primary-orange/10 border-l-4 border-primary-orange p-5 rounded-r-lg mt-8">
        <h3 className="font-semibold text-primary-black mb-2">💻 Running Commands</h3>
        <p className="text-sm text-gray-700 mb-3">
          All management commands should be run from the backend directory:
        </p>
        <code className="text-sm bg-gray-900 text-green-400 px-3 py-2 rounded block">
          cd entrehive_backend && python manage.py [command] [flags]
        </code>
      </div>
    </div>
  );
}
