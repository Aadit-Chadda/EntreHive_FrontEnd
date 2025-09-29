'use client';

import CuratedFeed from './CuratedFeed';

interface MainFeedProps {
  feedType?: 'home' | 'public' | 'university' | 'my_posts';
  showComposer?: boolean;
}

export default function MainFeed({ 
  feedType = 'home', 
  showComposer = true 
}: MainFeedProps) {
  // For my_posts, use the old posts API to maintain compatibility
  if (feedType === 'my_posts') {
    // Import the old MainFeed component logic here or create a separate component
    return <div>My Posts view - to be implemented with old logic</div>;
  }

  // For home, university, and public feeds, use the new CuratedFeed
  const curatedFeedType = feedType === 'home' ? 'home' : 
                         feedType === 'public' ? 'public' : 
                         'university';

  return (
    <CuratedFeed 
      feedType={curatedFeedType}
      showComposer={showComposer}
    />
  );
}
