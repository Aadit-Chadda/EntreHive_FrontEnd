'use client';

import PostComposerNew from './PostComposerNew';

interface FloatingComposerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingComposer({ isOpen, onClose }: FloatingComposerProps) {
  const handlePostCreated = () => {
    onClose();
    // You could add a callback to refresh the feed here if needed
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <PostComposerNew 
            onPostCreated={handlePostCreated}
            placeholder="What's happening in your projects?"
            autoFocus={true}
            compact={false}
          />
        </div>
      </div>
    </div>
  );
}