'use client';

import { motion } from 'framer-motion';

/* ─── Base Primitives ─────────────────────────────────────────────────── */

function ShimmerBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`} style={{ backgroundColor: 'var(--hover-bg)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

function ShimmerLine({ className = '', width = 'w-full' }: { className?: string; width?: string }) {
  return <ShimmerBlock className={`h-3 rounded-md ${width} ${className}`} />;
}

function ShimmerCircle({ size = 'w-10 h-10' }: { size?: string }) {
  return <ShimmerBlock className={`rounded-full ${size}`} />;
}

function StaggerItem({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Post Card Skeleton (reused in multiple page skeletons) ──────────── */

function PostCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      {/* Header: avatar + name + timestamp */}
      <div className="flex items-center gap-3 mb-4">
        <ShimmerCircle size="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <ShimmerLine width="w-32" />
          <ShimmerLine width="w-20" className="h-2" />
        </div>
        <ShimmerBlock className="w-8 h-3 rounded-md" />
      </div>
      {/* Content lines */}
      <div className="space-y-2.5 mb-4">
        <ShimmerLine width="w-full" className="h-4" />
        <ShimmerLine width="w-5/6" className="h-4" />
        <ShimmerLine width="w-2/3" className="h-4" />
      </div>
      {/* Action buttons */}
      <div className="flex items-center gap-6 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <ShimmerBlock className="w-14 h-6 rounded-full" />
        <ShimmerBlock className="w-14 h-6 rounded-full" />
        <ShimmerBlock className="w-14 h-6 rounded-full" />
      </div>
    </div>
  );
}

/* ─── Project Card Skeleton (reused) ──────────────────────────────────── */

function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      {/* Banner */}
      <ShimmerBlock className="h-36 rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <ShimmerLine width="w-3/4" className="h-5" />
        <ShimmerLine width="w-full" className="h-3" />
        <ShimmerLine width="w-5/6" className="h-3" />
        {/* Tags */}
        <div className="flex gap-2 pt-1">
          <ShimmerBlock className="w-16 h-5 rounded-full" />
          <ShimmerBlock className="w-20 h-5 rounded-full" />
          <ShimmerBlock className="w-14 h-5 rounded-full" />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <ShimmerCircle size="w-6 h-6" />
            <ShimmerLine width="w-20" className="h-2.5" />
          </div>
          <ShimmerLine width="w-16" className="h-2.5" />
        </div>
      </div>
    </div>
  );
}

/* ─── Explore Card Skeleton ───────────────────────────────────────────── */

function ExploreCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <ShimmerBlock className="h-32 rounded-none" />
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <ShimmerCircle size="w-7 h-7" />
          <ShimmerLine width="w-24" className="h-3" />
        </div>
        <ShimmerLine width="w-full" className="h-3" />
        <ShimmerLine width="w-3/4" className="h-3" />
        <div className="flex items-center gap-3 pt-1">
          <ShimmerBlock className="w-10 h-4 rounded-full" />
          <ShimmerBlock className="w-10 h-4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* ─── Exported Page-Level Skeletons ───────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════ */

/* ─── 1. Feed / Home Page ─────────────────────────────────────────────── */

export function FeedSkeleton({ showComposer = false }: { showComposer?: boolean }) {
  return (
    <div className="space-y-6">
      {/* Tab bar skeleton */}
      <StaggerItem index={0}>
        <div className="rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-lg" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex gap-1 sm:gap-2">
            {[0, 1, 2].map((i) => (
              <ShimmerBlock key={i} className="flex-1 h-9 sm:h-12 rounded-xl sm:rounded-2xl" />
            ))}
          </div>
          <div className="px-3 sm:px-6 py-2 sm:py-3 mt-2">
            <ShimmerLine width="w-48 mx-auto" className="h-2.5" />
          </div>
        </div>
      </StaggerItem>

      {/* Composer skeleton */}
      {showComposer && (
        <StaggerItem index={1}>
          <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <ShimmerCircle size="w-10 h-10" />
              <ShimmerBlock className="flex-1 h-10 rounded-xl" />
            </div>
          </div>
        </StaggerItem>
      )}

      {/* Post card skeletons */}
      {[0, 1, 2].map((i) => (
        <StaggerItem key={i} index={i + (showComposer ? 2 : 1)}>
          <PostCardSkeleton />
        </StaggerItem>
      ))}
    </div>
  );
}

/* ─── 2. Explore Page ─────────────────────────────────────────────────── */

export function ExplorePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <StaggerItem index={0}>
        <ShimmerBlock className="h-14 rounded-2xl" />
      </StaggerItem>

      {/* Category pills */}
      <StaggerItem index={1}>
        <div className="flex gap-2 overflow-hidden">
          {['w-14', 'w-20', 'w-24', 'w-16', 'w-20', 'w-14', 'w-18'].map((w, i) => (
            <ShimmerBlock key={i} className={`shrink-0 h-8 rounded-full ${w}`} />
          ))}
        </div>
      </StaggerItem>

      {/* Suggested users */}
      <StaggerItem index={2}>
        <div className="space-y-3">
          <ShimmerLine width="w-32" className="h-3" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-28 sm:w-32 rounded-2xl p-3 text-center" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <ShimmerCircle size="w-14 h-14 mx-auto mb-2" />
                <ShimmerLine width="w-16 mx-auto" className="h-2.5 mb-1" />
                <ShimmerLine width="w-12 mx-auto" className="h-2 mb-2" />
                <ShimmerBlock className="w-full h-6 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Discover grid */}
      <StaggerItem index={3}>
        <div className="space-y-4">
          <ShimmerLine width="w-24" className="h-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              >
                <ExploreCardSkeleton />
              </motion.div>
            ))}
          </div>
        </div>
      </StaggerItem>
    </div>
  );
}

/* ─── 3. Projects Page ────────────────────────────────────────────────── */

export function ProjectsGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search & filter bar */}
      <StaggerItem index={0}>
        <div className="rounded-xl p-4 lg:p-6 shadow-sm" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:gap-4">
            <ShimmerBlock className="flex-1 h-10 rounded-lg" />
            <div className="flex flex-col sm:flex-row gap-3">
              <ShimmerBlock className="w-full sm:w-36 h-10 rounded-lg" />
              <ShimmerBlock className="w-full sm:w-36 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StaggerItem key={i} index={i + 1}>
            <ProjectCardSkeleton />
          </StaggerItem>
        ))}
      </div>
    </div>
  );
}

/* ─── 4. Profile Page (Own) ───────────────────────────────────────────── */

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-6">
      <StaggerItem index={0}>
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          {/* Banner */}
          <ShimmerBlock className="h-32 sm:h-48 rounded-none" />
          {/* Profile info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-12 sm:-mt-16 mb-4 flex items-end justify-between">
              <ShimmerCircle size="w-24 h-24 sm:w-32 sm:h-32 border-4" />
              <ShimmerBlock className="w-28 h-9 rounded-lg" />
            </div>
            {/* Name + role */}
            <div className="space-y-2 mb-4">
              <ShimmerLine width="w-48" className="h-6" />
              <div className="flex items-center gap-2">
                <ShimmerBlock className="w-16 h-5 rounded-full" />
                <ShimmerLine width="w-24" className="h-3" />
              </div>
            </div>
            {/* Bio */}
            <div className="space-y-2 mb-4">
              <ShimmerLine width="w-full" />
              <ShimmerLine width="w-3/4" />
            </div>
            {/* Stats */}
            <div className="flex gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <ShimmerBlock className="w-8 h-5 rounded-md" />
                  <ShimmerLine width="w-16" className="h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Tabs */}
      <StaggerItem index={1}>
        <div className="flex gap-2">
          <ShimmerBlock className="w-24 h-10 rounded-xl" />
          <ShimmerBlock className="w-24 h-10 rounded-xl" />
        </div>
      </StaggerItem>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <StaggerItem key={i} index={i + 2}>
            <PostCardSkeleton />
          </StaggerItem>
        ))}
      </div>
    </div>
  );
}

/* ─── 5. Public Profile (Other User) ──────────────────────────────────── */

export function PublicProfileSkeleton() {
  return (
    <div className="space-y-6">
      <StaggerItem index={0}>
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          {/* Banner */}
          <ShimmerBlock className="h-32 sm:h-48 rounded-none" />
          {/* Profile info */}
          <div className="px-6 pb-6">
            {/* Avatar + action buttons row */}
            <div className="-mt-12 sm:-mt-16 mb-4 flex items-end justify-between">
              <ShimmerCircle size="w-24 h-24 sm:w-32 sm:h-32 border-4" />
              <div className="flex gap-2">
                <ShimmerBlock className="w-24 h-9 rounded-lg" />
                <ShimmerBlock className="w-24 h-9 rounded-lg" />
              </div>
            </div>
            {/* Name + role */}
            <div className="space-y-2 mb-4">
              <ShimmerLine width="w-44" className="h-6" />
              <div className="flex items-center gap-2">
                <ShimmerLine width="w-28" className="h-3" />
                <ShimmerBlock className="w-16 h-5 rounded-full" />
              </div>
            </div>
            {/* Bio */}
            <div className="space-y-2 mb-4">
              <ShimmerLine width="w-full" />
              <ShimmerLine width="w-4/5" />
              <ShimmerLine width="w-2/3" />
            </div>
            {/* Stats */}
            <div className="flex gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <ShimmerBlock className="w-8 h-5 rounded-md" />
                  <ShimmerLine width="w-16" className="h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Tabs */}
      <StaggerItem index={1}>
        <div className="flex gap-2">
          <ShimmerBlock className="w-24 h-10 rounded-xl" />
          <ShimmerBlock className="w-24 h-10 rounded-xl" />
        </div>
      </StaggerItem>

      {/* Content */}
      {[0, 1, 2].map((i) => (
        <StaggerItem key={i} index={i + 2}>
          <PostCardSkeleton />
        </StaggerItem>
      ))}
    </div>
  );
}

/* ─── 6. Post Detail Page ─────────────────────────────────────────────── */

export function PostDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Post card */}
      <StaggerItem index={0}>
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <ShimmerCircle size="w-12 h-12" />
            <div className="flex-1 space-y-2">
              <ShimmerLine width="w-36" className="h-4" />
              <div className="flex items-center gap-2">
                <ShimmerLine width="w-24" className="h-2.5" />
                <ShimmerBlock className="w-14 h-4 rounded-full" />
                <ShimmerLine width="w-16" className="h-2.5" />
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="space-y-2.5 mb-5">
            <ShimmerLine width="w-full" className="h-4" />
            <ShimmerLine width="w-full" className="h-4" />
            <ShimmerLine width="w-4/5" className="h-4" />
            <ShimmerLine width="w-1/2" className="h-4" />
          </div>
          {/* Image placeholder */}
          <ShimmerBlock className="h-48 sm:h-64 rounded-xl mb-4" />
          {/* Actions */}
          <div className="flex items-center gap-6 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <ShimmerBlock className="w-14 h-6 rounded-full" />
            <ShimmerBlock className="w-14 h-6 rounded-full" />
            <ShimmerBlock className="w-14 h-6 rounded-full" />
          </div>
        </div>
      </StaggerItem>

      {/* Comments section */}
      <StaggerItem index={1}>
        <div className="space-y-4">
          <ShimmerLine width="w-36" className="h-5" />
          {/* Comment input */}
          <ShimmerBlock className="h-24 rounded-xl" />
          {/* Comment skeletons */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="flex gap-3 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <ShimmerCircle size="w-8 h-8" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <ShimmerLine width="w-24" className="h-3" />
                  <ShimmerLine width="w-12" className="h-2" />
                </div>
                <ShimmerLine width="w-full" className="h-3" />
                <ShimmerLine width="w-3/5" className="h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </StaggerItem>
    </div>
  );
}

/* ─── 7. Inbox Page ───────────────────────────────────────────────────── */

export function InboxSkeleton() {
  return (
    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="p-4"
        >
          <div className="flex items-start gap-4">
            <ShimmerCircle size="w-12 h-12" />
            <div className="flex-1 space-y-2.5">
              <div className="flex justify-between items-center">
                <ShimmerLine width="w-32" className="h-4" />
                <ShimmerLine width="w-14" className="h-2.5" />
              </div>
              <ShimmerLine width="w-20" className="h-2.5" />
              <ShimmerLine width="w-full" className="h-3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
