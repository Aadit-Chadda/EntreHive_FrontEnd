'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages that should not show the top navigation and footer
  const isAppPage = pathname?.startsWith('/feed') || 
                   pathname?.startsWith('/posts') || 
                   pathname?.startsWith('/projects') ||
                   pathname?.startsWith('/explore') || 
                   pathname?.startsWith('/profile') ||
                   pathname?.startsWith('/bookmarks') ||
                   pathname?.startsWith('/settings') ||
                   pathname?.startsWith('/investors') ||
                   pathname?.startsWith('/notifications');

  if (isAppPage) {
    // App pages (feed, posts, etc.) - no top navigation or footer
    return <>{children}</>;
  }

  // Landing pages - show navigation and footer
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
