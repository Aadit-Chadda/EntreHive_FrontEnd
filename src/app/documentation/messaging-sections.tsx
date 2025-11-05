import React from 'react';
import { EnvelopeIcon, UserGroupIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export function MessagingOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Messaging System Overview</h1>
        <p className="text-lg text-secondary-charcoal">
          Role-based messaging system with three distinct communication channels
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Three-Tier Messaging Architecture</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Direct Messages</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              One-on-one conversations between users
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Student ↔ Student</li>
              <li>• Professor ↔ Professor</li>
              <li>• Investor ↔ Investor</li>
              <li>• Professor/Investor → Student</li>
            </ul>
          </div>

          <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <UserGroupIcon className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Group Conversations</h3>
            </div>
            <p className="text-sm text-green-800 mb-3">
              Project-based team messaging
            </p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Initiated by Professor/Investor</li>
              <li>• Includes all project team members</li>
              <li>• Auto-reload every 3 seconds</li>
              <li>• Read receipts tracking</li>
            </ul>
          </div>

          <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
            <div className="flex items-center gap-2 mb-3">
              <DocumentCheckIcon className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Project View Requests</h3>
            </div>
            <p className="text-sm text-purple-800 mb-3">
              Permission-based messaging initiation
            </p>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Student → Professor/Investor</li>
              <li>• Requires project context</li>
              <li>• Accept = Create conversation</li>
              <li>• Grant messaging permission</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Key Features</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
            <div>
              <h4 className="font-semibold text-primary-black">Role-Based Permissions</h4>
              <p className="text-sm text-gray-600">Automatic permission management based on user roles with validation at frontend and backend</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
            <div>
              <h4 className="font-semibold text-primary-black">Real-Time Updates</h4>
              <p className="text-sm text-gray-600">Polling-based message refresh (3s intervals) ensures conversations stay current without WebSocket complexity</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
            <div>
              <h4 className="font-semibold text-primary-black">Read Receipts</h4>
              <p className="text-sm text-gray-600">Track message read status with timestamps, shown in conversation details and inbox list</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-orange text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
            <div>
              <h4 className="font-semibold text-primary-black">Archive System</h4>
              <p className="text-sm text-gray-600">Independent archiving - each participant can archive conversations without affecting the other</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Technology Stack</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
          <pre className="text-sm"><code>{`Backend:
- Django REST Framework (API endpoints)
- PostgreSQL (message storage)
- UUID primary keys (security)
- ManyToMany relationships (group participants, read receipts)

Frontend:
- Next.js 15.5.3 (App Router)
- React 19 (TypeScript)
- TailwindCSS (styling)
- Polling interval (auto-refresh)
- localStorage (conversation state)

API Communication:
- JWT authentication (Bearer tokens)
- RESTful endpoints (/api/messaging/...)
- JSON request/response
- Role-based permission checks`}</code></pre>
        </div>
      </section>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Design Decision</h3>
        <p className="text-sm text-yellow-800">
          Students CANNOT directly message Professors or Investors. They must send a <strong>Project View Request</strong> first.
          This maintains academic boundaries and ensures all student-faculty interactions have project context.
        </p>
      </div>
    </div>
  );
}

export function ConversationSystem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Direct Conversation System</h1>
        <p className="text-lg text-secondary-charcoal">
          One-on-one messaging between two users with role-based access control
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Creating a Conversation</h2>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Navigate to Profile</h3>
              <p className="text-sm text-gray-600">User visits another user's profile page at <code>/profiles/[username]</code></p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Permission Check</h3>
              <p className="text-sm text-gray-600">Frontend validates if user can message target (same role or professor/investor → student)</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Message Modal Opens</h3>
              <p className="text-sm text-gray-600">User types initial message in modal</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">API Call</h3>
              <p className="text-sm text-gray-600">POST to <code>/api/messaging/conversations/create/</code></p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Backend Validation</h3>
              <p className="text-sm text-gray-600">Checks role-based permissions, validates recipient exists</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">6</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Database Operations</h3>
              <p className="text-sm text-gray-600">Creates Conversation model + initial Message model</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">7</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Navigate to Conversation</h3>
              <p className="text-sm text-gray-600">Frontend redirects to <code>/inbox/[conversationId]</code></p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Conversation Model Structure</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`interface Conversation {
  id: string;                    // UUID
  participant_1: User;           // Lower user ID (auto-sorted)
  participant_2: User;           // Higher user ID (auto-sorted)
  initiated_by: User;            // Who started the conversation
  related_project: Project | null; // Optional project context
  status: 'active' | 'archived';
  archived_by_p1: boolean;       // Participant 1's archive status
  archived_by_p2: boolean;       // Participant 2's archive status
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
  last_message_at: string | null; // ISO timestamp
}

// Unique constraint: [participant_1, participant_2]
// This prevents duplicate conversations`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Message Model Structure</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`interface Message {
  id: string;                    // UUID
  conversation: string;          // Conversation UUID
  sender: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture: string | null;
  };
  content: string;               // Message text (max 5000 chars)
  read: boolean;                 // Has recipient read it?
  read_at: string | null;        // When was it read?
  attachment: string | null;     // File attachment URL
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}

// Auto-updates conversation.last_message_at on save`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">API Endpoints</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-blue-600">POST /api/messaging/conversations/create/</code>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Create</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Request Body:</p>
              <code>{`{ recipient_id: number, message: string, project_id?: string }`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-green-600">GET /api/messaging/conversations/</code>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">List</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Query Params:</p>
              <code>{`?status=active | archived`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-green-600">GET /api/messaging/conversations/:id/</code>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Detail</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Returns:</p>
              <code>{`ConversationDetail with messages[] array`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-blue-600">POST /api/messaging/conversations/:id/messages/</code>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Send Message</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Request Body:</p>
              <code>{`{ content: string, attachment?: File }`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-yellow-600">POST /api/messaging/conversations/:id/archive/</code>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Archive</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-yellow-600">POST /api/messaging/conversations/:id/unarchive/</code>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Unarchive</span>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Participant Sorting</h3>
        <p className="text-sm text-blue-800">
          Conversations automatically sort participants by user ID (participant_1 always has lower ID).
          This ensures uniqueness and prevents duplicate conversations between the same two users.
        </p>
      </div>
    </div>
  );
}

export function GroupMessaging() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Group Messaging System</h1>
        <p className="text-lg text-secondary-charcoal">
          Project-based group conversations for team collaboration
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Creating a Group Conversation</h2>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Professor/Investor Views Project</h3>
              <p className="text-sm text-gray-600">Navigate to student project detail page via investor feed or discovery</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Click "Start Group Conversation"</h3>
              <p className="text-sm text-gray-600">Button appears on project page for professors/investors only</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Modal Opens for Initial Message</h3>
              <p className="text-sm text-gray-600">User types welcome message to project team</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">API Call</h3>
              <p className="text-sm text-gray-600">POST to <code>/api/messaging/group-conversations/create/</code></p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Backend Creates Group</h3>
              <p className="text-sm text-gray-600">Creates GroupConversation + adds creator + all project team members as participants</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">6</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Initial Message Sent</h3>
              <p className="text-sm text-gray-600">First GroupMessage created from professor/investor</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">7</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Navigate to Group Chat</h3>
              <p className="text-sm text-gray-600">All participants can access at <code>/inbox/group/[groupId]</code></p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">GroupConversation Model</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`interface GroupConversation {
  id: string;                    // UUID
  project: {
    id: string;
    title: string;
    description?: string;
  };
  created_by: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  participants: User[];          // ManyToMany - all team + creator
  participant_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

// Only ONE group conversation per project allowed`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">GroupMessage Model</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`interface GroupMessage {
  id: string;                    // UUID
  group_conversation: string;    // GroupConversation UUID
  sender: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  content: string;               // Message text (max 5000 chars)
  read_by: number[];             // Array of user IDs who read it
  attachment: string | null;     // File attachment URL
  created_at: string;
  updated_at: string;
}

// Auto-updates group_conversation.last_message_at on save`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Real-Time Updates</h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">⚡ Polling Mechanism</h3>
          <p className="text-sm text-yellow-800 mb-2">
            Group conversations use a 3-second polling interval to fetch new messages automatically.
          </p>
          <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
            <pre className="text-xs"><code>{`// In group/[id]/page.tsx
pollingIntervalRef.current = setInterval(() => {
  loadMessages(false); // No loading spinner during polling
}, 3000);

// Cleanup on unmount
return () => {
  if (pollingIntervalRef.current) {
    clearInterval(pollingIntervalRef.current);
  }
};`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Read Receipts</h2>

        <div className="space-y-3">
          <p className="text-gray-700">
            Group messages track which participants have read each message using a ManyToMany relationship.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-black mb-2">Display Logic:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Own messages show: "Read by X" (X = read_by.length - 1)</li>
              <li>• Other messages: No read indicator shown to sender</li>
              <li>• Messages auto-marked as read when conversation opened</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">API Endpoints</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-blue-600">POST /api/messaging/group-conversations/create/</code>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Create</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Request Body:</p>
              <code>{`{ project_id: string, initial_message: string }`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-green-600">GET /api/messaging/group-conversations/</code>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">List</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Returns:</p>
              <code>{`Array<GroupConversation> for current user`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-green-600">GET /api/messaging/group-conversations/:id/</code>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Detail</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Returns:</p>
              <code>{`GroupConversationDetail with participants`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-green-600">GET /api/messaging/group-conversations/:id/messages/</code>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Get Messages</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Returns:</p>
              <code>{`Array<GroupMessage> ordered by created_at`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-blue-600">POST /api/messaging/group-conversations/:id/messages/create/</code>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Send Message</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Request Body:</p>
              <code>{`{ content: string, attachment?: File }`}</code>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-green-900 mb-2">✨ Best Practice</h3>
        <p className="text-sm text-green-800">
          Group conversations are perfect for investor feedback sessions, professor mentoring,
          and team collaboration discussions. The project context is always maintained through the relationship.
        </p>
      </div>
    </div>
  );
}

export function ProjectViewRequests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Project View Requests</h1>
        <p className="text-lg text-secondary-charcoal">
          Permission-based messaging system for Student → Professor/Investor communication
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-purple-900 mb-2">🎯 Purpose</h3>
        <p className="text-sm text-purple-800">
          Students cannot directly message Professors or Investors. They must send a <strong>Project View Request</strong>
          which shares their project and requests permission to communicate. This maintains academic boundaries and
          ensures all interactions have project context.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Request Flow (Student Side)</h2>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Navigate to Project Page</h3>
              <p className="text-sm text-gray-600">Student goes to their own project detail page</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Click "Send Project Request"</h3>
              <p className="text-sm text-gray-600">Button opens SendProjectRequest modal component</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Search for Professor/Investor</h3>
              <p className="text-sm text-gray-600">Search component filters by role (only shows professors and investors)</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Write Message</h3>
              <p className="text-sm text-gray-600">Student explains why they want professor/investor to view their project (max 1000 chars)</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Submit Request</h3>
              <p className="text-sm text-gray-600">POST to <code>/api/messaging/project-requests/</code></p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">6</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Backend Validation</h3>
              <p className="text-sm text-gray-600">Checks: requester is student, recipient is prof/investor, student is project team member</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">7</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Request Created</h3>
              <p className="text-sm text-gray-600">ProjectViewRequest model saved with status="pending"</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">8</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Wait for Response</h3>
              <p className="text-sm text-gray-600">Student can view sent requests in inbox "Sent Requests" tab</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Response Flow (Professor/Investor Side)</h2>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Receive Notification</h3>
              <p className="text-sm text-gray-600">Professor/Investor sees notification badge in navbar</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Navigate to Inbox</h3>
              <p className="text-sm text-gray-600">Click inbox → "Requests" tab shows pending requests</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Review Request</h3>
              <p className="text-sm text-gray-600">See student name, project title, message, and timestamp</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Click "Accept" or "Decline"</h3>
              <p className="text-sm text-gray-600">Two action buttons for responding to request</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">API Call</h3>
              <p className="text-sm text-gray-600">POST to <code>/api/messaging/project-requests/:id/respond/</code></p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">6</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">If Accepted: Create Conversation</h3>
              <p className="text-sm text-gray-600">Backend creates new Conversation between student and professor/investor</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">7</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Initial Message Sent</h3>
              <p className="text-sm text-gray-600">System message: "I've accepted your request to view your project: [Title]. Feel free to share more details!"</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">8</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Grant MessagePermission</h3>
              <p className="text-sm text-gray-600">Creates MessagePermission record so student can now message this professor/investor</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">9</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Navigate to Conversation</h3>
              <p className="text-sm text-gray-600">Frontend redirects to <code>/inbox/[conversationId]</code></p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">ProjectViewRequest Model</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`interface ProjectViewRequest {
  id: string;                    // UUID
  project: {
    id: string;
    title: string;
  };
  requester: {                   // Student who sent request
    id: number;
    username: string;
    full_name?: string;
  };
  recipient: {                   // Professor/Investor who receives
    id: number;
    username: string;
  };
  message: string;               // Student's message (max 1000 chars)
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  conversation: Conversation | null;  // Created when accepted
  created_at: string;
  updated_at: string;
  responded_at: string | null;
}

// Unique constraint: [project, recipient]
// Prevents duplicate requests for same project to same person`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">API Endpoints</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-blue-600">POST /api/messaging/project-requests/</code>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Create</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Request Body:</p>
              <code>{`{ project_id: string, recipient_id: number, message: string }`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-green-600">GET /api/messaging/project-requests/</code>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">List</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Query Params:</p>
              <code>{`?filter=sent | received&status=pending | accepted | declined`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-blue-600">POST /api/messaging/project-requests/:id/respond/</code>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Accept/Decline</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Request Body:</p>
              <code>{`{ action: "accept" | "decline" }`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-semibold text-yellow-600">POST /api/messaging/project-requests/:id/cancel/</code>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Cancel</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="text-sm text-gray-600">Student can cancel their own pending request</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Status Transitions</h2>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-sm">pending</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded font-semibold text-sm">accepted</span>
              <span className="text-xs text-gray-600 ml-2">(Professor/Investor accepts)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-sm">pending</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded font-semibold text-sm">declined</span>
              <span className="text-xs text-gray-600 ml-2">(Professor/Investor declines)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-sm">pending</span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-semibold text-sm">cancelled</span>
              <span className="text-xs text-gray-600 ml-2">(Student cancels their own request)</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-4">
            ⚠️ Status transitions are final - accepted/declined/cancelled requests cannot be changed
          </p>
        </div>
      </section>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Why This System?</h3>
        <p className="text-sm text-blue-800">
          The Project View Request system maintains professionalism by ensuring all student-faculty communications
          are project-focused. Professors and investors can review the project context before deciding to engage,
          making interactions more meaningful and reducing unsolicited messages.
        </p>
      </div>
    </div>
  );
}

export function PermissionSystem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Permission System</h1>
        <p className="text-lg text-secondary-charcoal">
          Role-based access control for messaging with automatic permission management
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Permission Rules Matrix</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">From Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">To Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Can Direct Message?</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Permission Required?</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">How to Get Permission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-sm">Student</td>
                <td className="px-4 py-3 text-sm">Student</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">✅ Yes</span></td>
                <td className="px-4 py-3 text-sm">No (same role)</td>
                <td className="px-4 py-3 text-sm text-gray-500">Automatic</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-sm">Professor</td>
                <td className="px-4 py-3 text-sm">Professor</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">✅ Yes</span></td>
                <td className="px-4 py-3 text-sm">No (same role)</td>
                <td className="px-4 py-3 text-sm text-gray-500">Automatic</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-sm">Investor</td>
                <td className="px-4 py-3 text-sm">Investor</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">✅ Yes</span></td>
                <td className="px-4 py-3 text-sm">No (same role)</td>
                <td className="px-4 py-3 text-sm text-gray-500">Automatic</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-semibold">Professor</td>
                <td className="px-4 py-3 text-sm">Student</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">✅ Yes</span></td>
                <td className="px-4 py-3 text-sm">No (role-based)</td>
                <td className="px-4 py-3 text-sm text-gray-500">Automatic</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-semibold">Investor</td>
                <td className="px-4 py-3 text-sm">Student</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">✅ Yes</span></td>
                <td className="px-4 py-3 text-sm">No (role-based)</td>
                <td className="px-4 py-3 text-sm text-gray-500">Automatic</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-3 text-sm font-semibold">Student</td>
                <td className="px-4 py-3 text-sm font-semibold">Professor</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">❌ No</span></td>
                <td className="px-4 py-3 text-sm font-semibold">Yes</td>
                <td className="px-4 py-3 text-sm font-semibold text-purple-600">Project View Request</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-3 text-sm font-semibold">Student</td>
                <td className="px-4 py-3 text-sm font-semibold">Investor</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">❌ No</span></td>
                <td className="px-4 py-3 text-sm font-semibold">Yes</td>
                <td className="px-4 py-3 text-sm font-semibold text-purple-600">Project View Request</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">MessagePermission Model</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`interface MessagePermission {
  id: string;                    // UUID
  from_user: User;               // Who can send messages
  to_user: User;                 // Who can receive messages
  grant_type: 'role_based' | 'request_accepted' | 'replied';
  conversation: Conversation | null;
  created_at: string;
}

// Unique constraint: [from_user, to_user, conversation]

// Grant Types:
// - role_based: Professor/Investor can message students automatically
// - request_accepted: Student's ProjectViewRequest was accepted
// - replied: Auto-granted when recipient replies to a message`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Permission Validation Points</h2>

        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">1. Frontend Check (Profile Page)</h3>
            <p className="text-sm text-yellow-800 mb-2">
              Location: <code>profiles/[username]/page.tsx</code> line 150-155
            </p>
            <p className="text-sm text-yellow-800">
              Blocks students from clicking "Message" button on professor/investor profiles.
              Shows informative toast directing them to use Project View Requests.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-blue-900 mb-2">2. Serializer Validation (Backend)</h3>
            <p className="text-sm text-blue-800 mb-2">
              Location: <code>messaging/serializers.py</code> CreateConversationSerializer
            </p>
            <p className="text-sm text-blue-800">
              Validates permissions before creating conversation. Throws ValidationError if student
              lacks permission to message professor/investor.
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-purple-900 mb-2">3. Message Sending Check</h3>
            <p className="text-sm text-purple-800 mb-2">
              Location: <code>messaging/models.py</code> MessagePermission.can_message()
            </p>
            <p className="text-sm text-purple-800">
              Called before every message send. Checks if MessagePermission exists or if role-based
              permission applies.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">4. ProjectViewRequest Validation</h3>
            <p className="text-sm text-green-800 mb-2">
              Location: <code>messaging/models.py</code> ProjectViewRequest.clean()
            </p>
            <p className="text-sm text-green-800">
              Ensures requester is student, recipient is professor/investor, and requester is
              project team member.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Auto-Reply Permission</h2>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-primary-black mb-3">Automatic Permission Granting</h3>
          <p className="text-sm text-gray-700 mb-4">
            When a professor/investor messages a student first (using role-based permission), the student
            automatically gains permission to reply. This creates a natural conversation flow.
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
            <pre className="text-xs"><code>{`// In MessagePermission.can_message() - models.py lines 404-417
if conversation:
    received_message = Message.objects.filter(
        conversation=conversation,
        sender=to_user  // Professor/Investor
    ).exists()

    if received_message:
        // Auto-grant permission
        MessagePermission.objects.get_or_create(
            from_user=from_user,  // Student
            to_user=to_user,       // Professor/Investor
            conversation=conversation,
            defaults={'grant_type': 'replied'}
        )
        return True`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Permission Flow Diagram</h2>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-xs font-mono"><code>{`┌─────────────────────────────────────────────────────────────────┐
│                    PERMISSION CHECK FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User wants to message someone
        │
        ├──→ Same role? ──→ ✅ ALLOW (no permission needed)
        │
        ├──→ Prof/Investor → Student? ──→ ✅ ALLOW (role-based)
        │
        └──→ Student → Prof/Investor?
                │
                ├──→ Has MessagePermission? ──→ ✅ ALLOW
                │         │
                │         └──→ How granted?
                │                 ├──→ request_accepted (from ProjectViewRequest)
                │                 └──→ replied (auto-granted when prof messaged first)
                │
                └──→ No permission? ──→ ❌ BLOCK
                         │
                         └──→ Show: "Send Project View Request first"`}</code></pre>
        </div>
      </section>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-purple-900 mb-2">🔐 Security Note</h3>
        <p className="text-sm text-purple-800">
          All permission checks happen on BOTH frontend and backend. Frontend checks provide immediate
          user feedback, while backend checks ensure security cannot be bypassed by modifying client code.
        </p>
      </div>
    </div>
  );
}

export function MessagingTypes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Types & Interfaces</h1>
        <p className="text-lg text-secondary-charcoal">
          Complete TypeScript type definitions for the messaging system
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Core Messaging Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">Message Interface</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// Individual message in a conversation
export interface Message {
  id: string;                    // UUID
  conversation: string;          // Conversation UUID (foreign key)
  sender: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    full_name?: string;
    profile_picture: string | null;
  };
  content: string;               // Message text (max 5000 characters)
  read: boolean;                 // Has recipient read this message?
  read_at: string | null;        // ISO timestamp when read
  attachment: string | null;     // File attachment URL (optional)
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">Conversation Interface</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// Basic conversation list item
export interface Conversation {
  id: string;                    // UUID
  other_participant: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    full_name?: string;
    profile_picture: string | null;
    user_role: string;           // 'student' | 'professor' | 'investor'
  };
  related_project: {
    id: string;
    title: string;
  } | null;
  last_message: {
    content: string;
    sender_username: string;
    created_at: string;
  } | null;
  unread_count: number;          // Number of unread messages
  last_message_at: string;       // ISO timestamp
  created_at: string;            // ISO timestamp
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">ConversationDetail Interface</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// Detailed conversation with messages
export interface ConversationDetail {
  id: string;
  other_participant: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    full_name?: string;
    profile_picture: string | null;
    user_role: string;
  };
  related_project: {
    id: string;
    title: string;
  } | null;
  messages: Message[];           // Array of all messages
  can_send_message: boolean;     // Permission check result
  created_at: string;
  updated_at: string;
  last_message_at: string;
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Group Messaging Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">GroupMessage Interface</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// Individual message in group conversation
export interface GroupMessage {
  id: string;                    // UUID
  group_conversation: string;    // GroupConversation UUID
  sender: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  content: string;               // Message text (max 5000 characters)
  attachment?: string;           // File attachment URL (optional)
  read_by: number[];             // Array of user IDs who read it
  is_read_by_me?: boolean;       // Convenience field for current user
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">GroupConversation Interface</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// Group conversation list item
export interface GroupConversation {
  id: string;                    // UUID
  project: {
    id: string;
    title: string;
  };
  created_by: {
    id: number;
    username: string;
    full_name?: string;
  };
  participant_count: number;     // Total participants
  last_message: {
    id: string;
    content: string;
    sender: {
      id: number;
      username: string;
    };
    created_at: string;
  } | null;
  unread_count: number;          // Unread messages for current user
  last_message_at: string;       // ISO timestamp
  created_at: string;            // ISO timestamp
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">GroupConversationDetail Interface</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// Detailed group conversation with participants
export interface GroupConversationDetail {
  id: string;
  project: {
    id: string;
    title: string;
    description?: string;
  };
  created_by: {
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  participants: Array<{
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
    user_role?: string;           // 'student' | 'professor' | 'investor'
  }>;
  participant_count: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Request Types</h2>

        <div>
          <h3 className="text-lg font-semibold text-primary-black mb-2">ProjectViewRequest Interface</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm"><code>{`// Project view request from student to professor/investor
export interface ProjectViewRequest {
  id: string;                    // UUID
  project: {
    id: string;
    title: string;
    description?: string;
  };
  requester: {                   // Student who sent request
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  recipient: {                   // Professor/Investor who receives
    id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
  };
  message: string;               // Student's message (max 1000 chars)
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  conversation: {                // Created when accepted
    id: string;
  } | null;
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
  responded_at: string | null;   // ISO timestamp when responded
}`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">API Request/Response Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">CreateConversationData</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// POST /api/messaging/conversations/create/
export interface CreateConversationData {
  recipient_id: number;          // User ID to message
  message: string;               // Initial message
  project_id?: string;           // Optional project context
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">SendMessageData</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// POST /api/messaging/conversations/:id/messages/
export interface SendMessageData {
  content: string;               // Message text
  attachment?: File;             // Optional file
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">CreateGroupConversationData</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// POST /api/messaging/group-conversations/create/
export interface CreateGroupConversationData {
  project_id: string;            // Project UUID
  initial_message: string;       // Welcome message
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">CreateProjectViewRequestData</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// POST /api/messaging/project-requests/
export interface CreateProjectViewRequestData {
  project_id: string;            // Project UUID
  recipient_id: number;          // Professor/Investor user ID
  message: string;               // Request message (max 1000 chars)
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">RespondToRequestData</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// POST /api/messaging/project-requests/:id/respond/
export interface RespondToRequestData {
  action: 'accept' | 'decline';  // Response action
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">InboxStats</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`// GET /api/messaging/stats/
export interface InboxStats {
  unread_messages: number;       // Total unread messages
  pending_requests: number;      // Pending ProjectViewRequests
  active_conversations: number;  // Active conversations count
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Location</h3>
        <p className="text-sm text-blue-800">
          All messaging types are centralized in <code>/src/types/index.ts</code> for easy import and
          IDE autocompletion. Import them with: <code>import {"{ Message, Conversation }"} from '@/types';</code>
        </p>
      </div>
    </div>
  );
}

export function MessagingBestPractices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Best Practices & Guidelines</h1>
        <p className="text-lg text-secondary-charcoal">
          Implementation guidelines and common patterns for messaging features
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Frontend Implementation</h2>

        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ DO: Check Permissions Before UI Actions</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`// In profile page or similar
const handleStartChat = async () => {
  if (currentUser.role === 'student' &&
      (targetUser.role === 'professor' || targetUser.role === 'investor')) {
    showToast('Please send a project view request first', 'info');
    return; // Block action
  }
  setShowMessageModal(true);
};`}</code></pre>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ DO: Use Central Type Imports</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`// Import from central types file
import { Message, Conversation, GroupMessage } from '@/types';

// DON'T define types locally in components
// This ensures consistency across the app`}</code></pre>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ DO: Handle Loading States</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`// Separate initial load from polling
const loadMessages = async (showSpinner = true) => {
  if (showSpinner) setLoading(true);
  const data = await api.getMessages(conversationId);
  setMessages(data);
  if (showSpinner) setLoading(false);
};

// Initial load with spinner
loadMessages(true);

// Polling without spinner (prevents flicker)
setInterval(() => loadMessages(false), 3000);`}</code></pre>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-red-900 mb-2">❌ DON'T: Skip Permission Checks</h3>
            <p className="text-sm text-red-800 mb-2">
              Always validate permissions on frontend AND backend. Frontend provides UX, backend provides security.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-red-900 mb-2">❌ DON'T: Forget Cleanup on Unmount</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`// Always cleanup intervals
useEffect(() => {
  const interval = setInterval(() => {
    loadMessages(false);
  }, 3000);

  return () => clearInterval(interval); // IMPORTANT
}, []);`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Backend Implementation</h2>

        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ DO: Validate Permissions in Serializers</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`# In serializer validate() method
def validate(self, data):
    if not MessagePermission.can_message(
        self.context['request'].user,
        data['recipient']
    ):
        raise ValidationError("No permission to message this user")
    return data`}</code></pre>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ DO: Use Database Transactions</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`# When creating related objects
from django.db import transaction

with transaction.atomic():
    conversation = Conversation.objects.create(...)
    message = Message.objects.create(conversation=conversation, ...)
    # If anything fails, all changes rollback`}</code></pre>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ DO: Handle ManyToMany After Save</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 mt-2">
              <pre className="text-xs"><code>{`# ManyToMany relationships need saved instance
message = GroupMessage.objects.create(
    group_conversation=group,
    sender=user,
    content=content
)
# NOW add to ManyToMany
message.read_by.add(user)`}</code></pre>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-red-900 mb-2">❌ DON'T: Modify ManyToMany in save()</h3>
            <p className="text-sm text-red-800 mb-2">
              Never call .add() or .remove() on ManyToMany fields inside the model's save() method.
              The instance must be saved to database first.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-red-900 mb-2">❌ DON'T: Skip Unique Constraints</h3>
            <p className="text-sm text-red-800 mb-2">
              Use unique_together in Meta to prevent duplicates:
              <code>unique_together = [['participant_1', 'participant_2']]</code>
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Performance Considerations</h2>

        <div className="space-y-3">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Polling Interval: 3 Seconds</h4>
            <p className="text-sm text-yellow-800">
              Group conversations refresh every 3 seconds. This balances real-time feel with server load.
              Consider increasing interval if too many active users.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Pagination for Long Conversations</h4>
            <p className="text-sm text-yellow-800">
              Currently loads all messages at once. For conversations with 100+ messages, implement
              pagination or infinite scroll to improve load times.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Database Indexing</h4>
            <p className="text-sm text-yellow-800">
              Ensure indexes on: conversation.last_message_at, message.created_at, message.read,
              groupmessage.created_at for fast queries.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Common Patterns</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">Creating a Conversation</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-xs"><code>{`// Frontend
const handleSendMessage = async (recipientId: number, message: string) => {
  try {
    const conversation = await apiService.createConversation({
      recipient_id: recipientId,
      message: message,
      project_id: projectId // optional
    });
    router.push(\`/inbox/\${conversation.id}\`);
  } catch (error) {
    if (error.status === 400) {
      showToast('No permission to message this user', 'error');
    }
  }
};`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">Sending a Message in Existing Conversation</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-xs"><code>{`// Frontend
const handleSendMessage = async (content: string) => {
  setSending(true);
  try {
    await apiService.sendMessage(conversationId, { content });
    await loadConversation(); // Refresh to show new message
    setNewMessage('');
  } catch (error) {
    showToast('Failed to send message', 'error');
  } finally {
    setSending(false);
  }
};`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-black mb-2">Accepting Project View Request</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-xs"><code>{`// Frontend
const handleAccept = async (requestId: string) => {
  try {
    const response = await apiService.respondToProjectRequest(
      requestId,
      'accept'
    );
    // Navigate to new conversation
    router.push(\`/inbox/\${response.conversation_id}\`);
    showToast('Request accepted! Conversation started.', 'success');
  } catch (error) {
    showToast('Failed to accept request', 'error');
  }
};`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Error Handling</h2>

        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-black mb-2">HTTP 400 - Bad Request</h4>
            <p className="text-sm text-gray-600">Permission denied or validation failed. Check error.details for specifics.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-black mb-2">HTTP 403 - Forbidden</h4>
            <p className="text-sm text-gray-600">User is not participant in conversation. Shouldn't happen if permissions checked properly.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-black mb-2">HTTP 404 - Not Found</h4>
            <p className="text-sm text-gray-600">Conversation or message doesn't exist. May have been deleted.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-black mb-2">HTTP 401 - Unauthorized</h4>
            <p className="text-sm text-gray-600">JWT token expired or invalid. API client auto-refreshes, then redirects to login if refresh fails.</p>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📚 Additional Resources</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• API Endpoints: See "API Implementation" section</li>
          <li>• Type Definitions: See "Types & Interfaces" section</li>
          <li>• Permission Rules: See "Permission System" section</li>
          <li>• User Flows: See individual system sections</li>
        </ul>
      </div>
    </div>
  );
}
