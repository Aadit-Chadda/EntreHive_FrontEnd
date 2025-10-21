'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface User {
  id: number;
  username: string;
  profile: {
    first_name: string;
    last_name: string;
    user_role: string;
    profile_picture: string | null;
  };
}

interface SendProjectRequestProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SendProjectRequest({
  projectId,
  projectTitle,
  onClose,
  onSuccess,
}: SendProjectRequestProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      setSearching(true);
      const results = await apiService.searchUsers({
        q: searchQuery,
        role: 'professor,investor',
      });
      setSearchResults(results.results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !message.trim()) return;

    try {
      setLoading(true);
      await apiService.createProjectViewRequest({
        project_id: projectId,
        recipient_id: selectedUser.id,
        message: message.trim(),
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error sending request:', error);
      alert(error.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Send Project View Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Project: <span className="font-medium">{projectTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Search for recipient */}
          {!selectedUser ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search for Professor or Investor
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or username..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              {searching && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Searching...
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {user.profile.profile_picture ? (
                        <img
                          src={user.profile.profile_picture}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {getInitials(user.profile.first_name, user.profile.last_name)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.profile.first_name} {user.profile.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{user.username} • {user.profile.user_role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No professors or investors found
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sending to:
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {selectedUser.profile.profile_picture ? (
                    <img
                      src={selectedUser.profile.profile_picture}
                      alt={selectedUser.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {getInitials(selectedUser.profile.first_name, selectedUser.profile.last_name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedUser.profile.first_name} {selectedUser.profile.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @{selectedUser.username} • {selectedUser.profile.user_role}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          {selectedUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them why you'd like them to view your project..."
                rows={5}
                required
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                {message.length}/1000
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedUser || !message.trim() || loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

