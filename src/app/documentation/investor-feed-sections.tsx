import React from 'react';

export function InvestorFeedOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
          Investor Feed System Documentation
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Complete guide to the EntreHive investor discovery and feed system
        </p>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Overview</h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          The Investor Feed System is a specialized discovery interface designed exclusively for users with the <code className="px-2 py-1 rounded" style={{ background: 'var(--hover-bg)' }}>investor</code> role. 
          It provides a powerful, personalized view of projects and posts across the EntreHive platform, enabling investors to discover promising student ventures efficiently.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--primary-orange)' }}>🔑 Key Features</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• Interest-based personalization</li>
              <li>• University-specific filtering</li>
              <li>• Advanced topic discovery</li>
              <li>• Smart relevance scoring</li>
              <li>• Real-time project updates</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--accent-pine)' }}>🎯 Benefits</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• Discover relevant startups faster</li>
              <li>• Automatic interest matching</li>
              <li>• Filter by funding stage</li>
              <li>• Track trending topics</li>
              <li>• Access cross-university projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InterestManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
          Interest Management
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Personalize your feed with investment interests
        </p>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What are Investment Interests?</h3>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          Investment interests are topic categories that investors select to personalize their feed. When an investor has interests configured,
          the feed automatically filters and prioritizes projects matching those interests, creating a highly relevant discovery experience.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>Available Interest Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            { name: 'AI', icon: '🤖' },
            { name: 'Web Dev', icon: '💻' },
            { name: 'Fintech', icon: '💰' },
            { name: 'Robotics', icon: '🤖' },
            { name: 'Biotech', icon: '🧬' },
            { name: 'Climate', icon: '🌍' },
            { name: 'Hardware', icon: '⚙️' },
            { name: 'SaaS', icon: '☁️' },
            { name: 'EdTech', icon: '📚' },
            { name: 'HealthTech', icon: '🏥' },
            { name: 'Social Impact', icon: '💝' },
            { name: 'Gaming', icon: '🎮' },
          ].map((interest) => (
            <div key={interest.name} className="px-3 py-2 rounded-lg border flex items-center space-x-2" style={{ borderColor: 'var(--border)' }}>
              <span>{interest.icon}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{interest.name}</span>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>Setting Up Interests</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--primary-orange)' }}>During Signup</h4>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              When creating an investor account, you can select your interests in Step 2 of the signup process.
              This helps customize your feed from day one.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Choose "Investor" as your role in Step 1</li>
              <li>In Step 2, you'll see interest selection options</li>
              <li>Click on categories you're interested in (multi-select)</li>
              <li>Complete signup - your interests are saved automatically</li>
            </ol>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-pine)' }}>From Profile Page</h4>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              You can update your interests anytime from your investor profile page.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Navigate to your profile (top right menu → Profile)</li>
              <li>Find the "Investment Interests" section</li>
              <li>Click the "Edit" button</li>
              <li>Select/deselect interests as needed</li>
              <li>Click "Save Changes" to update your preferences</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#3B82F6' }}>💡 Pro Tip</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The more interests you select, the broader your feed will be. Select 2-5 interests for a focused, highly relevant feed,
          or choose more for a wider discovery experience.
        </p>
      </div>
    </div>
  );
}

export function FeedFeatures() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
          Feed Features & Functionality
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Powerful discovery tools and filtering options
        </p>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Feed Types</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-2 flex items-center" style={{ color: 'var(--primary-orange)' }}>
              <span className="mr-2">🌍</span> Public Feed (Default)
            </h4>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Shows all public projects and posts across all universities. This is the broadest discovery view.
            </p>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• Access to projects from any university</li>
              <li>• Filtered by your interests (if set)</li>
              <li>• Includes both projects and posts</li>
              <li>• Best for maximum discovery</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-2 flex items-center" style={{ color: 'var(--accent-pine)' }}>
              <span className="mr-2">🎓</span> University Feed
            </h4>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Filter projects by specific universities. Great for investors focused on particular institutions.
            </p>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• Select any university from the dropdown</li>
              <li>• See only projects from that university</li>
              <li>• Still respects your interest filters</li>
              <li>• Switch universities anytime</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Topic Filtering</h3>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          The horizontal topic pills allow you to filter projects by specific categories. This works alongside your saved interests.
        </p>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>How It Works</h4>
            <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <strong>No Topics Selected:</strong> Feed shows projects matching your saved interests (if you have any)
              </li>
              <li>
                <strong>Topics Selected:</strong> Feed shows only projects matching the selected topics (overrides saved interests)
              </li>
              <li>
                <strong>Multiple Topics:</strong> Projects matching ANY of the selected topics are shown (OR logic)
              </li>
              <li>
                <strong>Clear All:</strong> Click a selected topic again to deselect it
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Filters</h3>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          Three powerful quick filters help you find projects at specific stages:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--primary-orange)' }}>💰 Raising Funding</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Projects actively seeking funding. Perfect for finding investment opportunities.
            </p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-pine)' }}>🚀 Prototype Ready</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Projects with MVP or launched status. See functional products ready for market.
            </p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-terracotta)' }}>👥 Hiring Now</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Projects looking for developers, designers, or marketers. Great for portfolio expansion.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Search & Sort</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Search</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Type in the search bar to find projects by title, summary, tags, or post content. Search works alongside all other filters.
              Results update in real-time with a 300ms debounce for performance.
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Sorting Options</h4>
            <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <strong>Best Match:</strong> Ranks by relevance score (interest match + recency)
              </li>
              <li>
                <strong>Most Recent:</strong> Shows newest projects first
              </li>
              <li>
                <strong>Most Saved:</strong> Orders by popularity (coming soon)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechnicalImplementation() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
          Technical Implementation
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Architecture, APIs, and data flow
        </p>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Database Schema</h3>
        <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--hover-bg)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>UserProfile Model (Backend)</h4>
          <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`# New field added to UserProfile model
interests = models.JSONField(
    default=list,
    blank=True,
    help_text="Investor interests/categories (e.g., ['AI', 'Fintech', 'EdTech'])"
)`}
          </pre>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            The interests field is a JSON array storing the investor's selected interest categories.
            It's only used for investor accounts and remains empty for students and professors.
          </p>
        </div>

        <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>TypeScript Types (Frontend)</h4>
          <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`export interface UserProfile {
  // ... other fields
  interests?: string[];  // Investor interests array
}

export interface RegistrationData {
  // ... other fields
  interests?: string[];  // Optional during signup
}

export interface ProfileUpdateData {
  // ... other fields
  interests?: string[];  // Optional during profile update
}`}
          </pre>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>API Endpoints</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-mono text-sm mb-2 px-3 py-1 rounded inline-block" style={{ background: 'var(--primary-orange)', color: 'white' }}>
              GET /api/feed/investor/
            </h4>
            <p className="text-sm mt-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
              Main investor feed endpoint with comprehensive filtering.
            </p>
            <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
{`Query Parameters:
- feed_type: 'public' | 'university' (default: 'public')
- university_id: UUID (filter by university)
- topics: Comma-separated string (e.g., 'AI,Fintech')
- search: Search query string
- quick_filter: 'funding' | 'prototype' | 'hiring'
- sort: 'best_match' | 'recent' | 'saved'
- cursor: Pagination cursor
- limit: Results per page (default: 12, max: 50)

Response:
{
  results: [...projects and posts...],
  next_cursor: "2024-10-20T12:00:00Z",
  count: 12,
  has_more: true,
  using_interests: true,     // Indicates if user interests were used
  active_topics: ["AI", "EdTech"]  // Topics currently filtering
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-mono text-sm mb-2 px-3 py-1 rounded inline-block" style={{ background: 'var(--accent-pine)', color: 'white' }}>
              GET/PUT /api/feed/investor/interests/
            </h4>
            <p className="text-sm mt-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
              Get or update investor interests.
            </p>
            <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
{`GET Response:
{
  interests: ["AI", "Fintech", "EdTech"]
}

PUT Request:
{
  interests: ["AI", "Fintech", "EdTech"]
}

PUT Response:
{
  interests: ["AI", "Fintech", "EdTech"],
  message: "Interests updated successfully"
}`}
            </pre>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-mono text-sm mb-2 px-3 py-1 rounded inline-block" style={{ background: 'var(--accent-terracotta)', color: 'white' }}>
              GET /api/feed/investor/topics/
            </h4>
            <p className="text-sm mt-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
              Get available topic categories.
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-mono text-sm mb-2 px-3 py-1 rounded inline-block" style={{ background: '#6366f1', color: 'white' }}>
              GET /api/feed/investor/stats/
            </h4>
            <p className="text-sm mt-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
              Get platform statistics for investors.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Relevance Scoring Algorithm</h3>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          The feed uses a sophisticated scoring system to rank projects by relevance:
        </p>
        <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Interest Matching</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>
              If no topics are explicitly selected, the feed uses the investor's saved interests
            </li>
            <li>
              Projects are filtered to match ANY of the topics (OR logic)
            </li>
            <li>
              A match score is calculated based on how many interests overlap
            </li>
            <li>
              Projects with more matching interests rank higher
            </li>
            <li>
              Recency is used as a tiebreaker for equal match scores
            </li>
          </ol>
        </div>

        <div className="p-4 rounded-lg mt-4" style={{ background: 'var(--hover-bg)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Backend Implementation</h4>
          <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`# In investor_views.py

# If no topics specified, use investor's interests
user_interests = []
if not topics and hasattr(request.user, 'profile'):
    user_interests = request.user.profile.interests or []
    topics = user_interests

# Topic filtering using OR logic
if topics:
    topic_queries = [Q(categories__contains=topic) for topic in topics]
    project_query &= reduce(operator.or_, topic_queries)

# Calculate match score
if topics:
    match_cases = [
        When(categories__contains=topic, then=Value(1))
        for topic in topics
    ]
    projects = projects.annotate(
        match_score=Count(Case(*match_cases, default=Value(0)))
    )`}
          </pre>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Frontend State Management</h3>
        <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Key State Variables</h4>
          <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`// Main feed state
const [feedType, setFeedType] = useState<'public' | 'university'>('public');
const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [quickFilter, setQuickFilter] = useState<string | null>(null);
const [sortBy, setSortBy] = useState('best_match');

// Data state
const [feed, setFeed] = useState<FeedItem[]>([]);
const [hasMore, setHasMore] = useState(true);
const [nextCursor, setNextCursor] = useState<string | null>(null);

// Persistence
useEffect(() => {
  // Save filters to localStorage
  localStorage.setItem('investorFeedFilters', JSON.stringify({
    selectedTopics, selectedUniversity, searchQuery, quickFilter, sortBy
  }));
}, [selectedTopics, selectedUniversity, searchQuery, quickFilter, sortBy]);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function UserFlow() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
          User Flow & Best Practices
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Complete walkthrough and recommendations
        </p>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Complete User Journey</h3>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Account Creation',
              description: 'Investor creates an account, selects interests during signup (optional but recommended)',
              color: 'var(--primary-orange)'
            },
            {
              step: 2,
              title: 'First Login',
              description: 'Lands on investor feed, sees projects matching saved interests (or all projects if no interests set)',
              color: 'var(--accent-pine)'
            },
            {
              step: 3,
              title: 'Discovery',
              description: 'Uses topic pills, university filter, and quick filters to refine results',
              color: 'var(--accent-terracotta)'
            },
            {
              step: 4,
              title: 'Refinement',
              description: 'Updates interests from profile page to improve future recommendations',
              color: '#6366f1'
            },
            {
              step: 5,
              title: 'Ongoing Use',
              description: 'Feed automatically uses interests when no topics selected, providing personalized discovery',
              color: '#10B981'
            }
          ].map((item) => (
            <div key={item.step} className="flex items-start space-x-4 p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: item.color }}>
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981', border: '1px solid' }}>
            <h4 className="font-semibold mb-2 flex items-center" style={{ color: '#10B981' }}>
              <span className="mr-2">✅</span> Do
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• Set 2-5 core interests for focused discovery</li>
              <li>• Use quick filters to find specific opportunities</li>
              <li>• Try university filtering to explore specific schools</li>
              <li>• Update interests quarterly as focus shifts</li>
              <li>• Combine search with filters for precision</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', border: '1px solid' }}>
            <h4 className="font-semibold mb-2 flex items-center" style={{ color: '#EF4444' }}>
              <span className="mr-2">❌</span> Avoid
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• Selecting all 12 interests (defeats personalization)</li>
              <li>• Never updating interests after signup</li>
              <li>• Relying only on search (miss hidden gems)</li>
              <li>• Ignoring the stats at the top</li>
              <li>• Not exploring different universities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#3B82F6' }}>🎯 Pro Tips</h3>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>
            <strong>Combine Filters:</strong> Use interests + university filter + quick filter together for highly targeted results
          </li>
          <li>
            <strong>Try No Filters:</strong> Occasionally browse with no filters to discover projects outside your usual interests
          </li>
          <li>
            <strong>Save Searches:</strong> The system remembers your last filters, so you can pick up where you left off
          </li>
          <li>
            <strong>Check Stats:</strong> The stats at the top show how many projects are raising funding or have prototypes ready
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Testing() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
          Testing Guide
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          How to test the investor feed system
        </p>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Backend Setup</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>1. Run Migrations</h4>
            <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`cd entrehive_backend
source ../venv/bin/activate
python manage.py migrate`}
            </pre>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>2. Create Test Data</h4>
            <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`# Create an investor user
python manage.py shell

from django.contrib.auth.models import User
from accounts.models import UserProfile

# Create investor
user = User.objects.create_user('investor1', 'investor@example.com', 'password')
profile = user.profile
profile.user_role = 'investor'
profile.first_name = 'John'
profile.last_name = 'Investor'
profile.bio = 'Early stage investor'
profile.location = 'San Francisco, CA'
profile.interests = ['AI', 'Fintech', 'EdTech']
profile.save()`}
            </pre>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>3. Start Development Server</h4>
            <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`python manage.py runserver`}
            </pre>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Frontend Setup</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>1. Start Development Server</h4>
            <pre className="text-xs overflow-x-auto p-4 rounded" style={{ background: 'var(--background)', color: 'var(--text-secondary)' }}>
{`cd entrehive_frontend/entrehive
npm run dev`}
            </pre>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Test Scenarios</h3>
        <div className="space-y-3">
          {[
            {
              scenario: 'Signup with Interests',
              steps: ['Navigate to /signup', 'Select "Investor" role', 'Complete Step 1', 'In Step 2, select 2-3 interests', 'Complete signup', 'Verify interests saved in profile']
            },
            {
              scenario: 'Feed with Interests',
              steps: ['Login as investor with interests', 'Navigate to /investors', 'Verify feed shows projects matching interests', 'Check response includes using_interests: true']
            },
            {
              scenario: 'Topic Override',
              steps: ['On feed page, click different topics', 'Verify feed updates to match selected topics', 'Clear topics and verify feed returns to interests']
            },
            {
              scenario: 'Update Interests',
              steps: ['Navigate to investor profile', 'Click Edit on Investment Interests section', 'Add/remove interests', 'Save changes', 'Verify feed updates']
            },
            {
              scenario: 'University Filtering',
              steps: ['Select university from dropdown', 'Verify only projects from that university show', 'Test with different universities']
            },
            {
              scenario: 'Combined Filters',
              steps: ['Set interests', 'Select topics', 'Choose university', 'Apply quick filter', 'Add search query', 'Verify all filters work together']
            }
          ].map((test, index) => (
            <div key={index} className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--primary-orange)' }}>{test.scenario}</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {test.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-6" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: '#EAB308', border: '1px solid' }}>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#EAB308' }}>⚠️ Important Test Cases</h3>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>• Test with NO interests set (should show all projects)</li>
          <li>• Test with interests but NO matching projects (should show empty state)</li>
          <li>• Test pagination with many results</li>
          <li>• Test API rate limiting and error handling</li>
          <li>• Test on mobile devices for responsive design</li>
        </ul>
      </div>
    </div>
  );
}

