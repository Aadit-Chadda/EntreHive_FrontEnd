import { DriveStep } from 'driver.js';

// Feed page tour - comprehensive onboarding for first-time users
export const feedTourSteps: DriveStep[] = [
  {
    element: '#feed-section',
    popover: {
      title: 'Welcome to Your Feed',
      description: 'This is your main hub where you can see posts from other entrepreneurs, share updates, and stay connected with the community.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '#feed-tabs',
    popover: {
      title: 'Different Feed Views',
      description: 'Switch between For You (personalized content), Following (posts from people you follow), and Trending (popular posts in the community).',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#explore-nav',
    popover: {
      title: 'Explore the Hive',
      description: 'Discover new projects, posts, and connect with other users in the EntreHive community.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#projects-nav',
    popover: {
      title: 'Your Projects',
      description: "Create and manage your projects here. Share your work, find collaborators, and showcase what you're building.",
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#inbox-nav',
    popover: {
      title: 'Your Inbox',
      description: 'Message other students, professors, and investors directly. Once you start a conversation, all your messages will appear here.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#profile-menu',
    popover: {
      title: 'Profile & Settings',
      description: 'Access your profile, edit your information, change settings, and manage your account preferences.',
      side: 'left',
      align: 'start',
    },
  },
];

// Projects page tour - focused on project features
export const projectsTourSteps: DriveStep[] = [
  {
    element: '#projects-section',
    popover: {
      title: 'Your Projects',
      description: 'This is where you create, manage, and showcase your projects. Share your work with the community and find collaborators.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#create-project-btn',
    popover: {
      title: 'Create a New Project',
      description: 'Click here to start a new project. Add details, upload images, and share what you\'re building.',
      side: 'left',
      align: 'start',
    },
  },
];

// Profile page tour - focused on profile features
export const profileTourSteps: DriveStep[] = [
  {
    element: '#profile-header',
    popover: {
      title: 'Your Profile',
      description: 'This is your personal space on EntreHive. Showcase your bio, achievements, and connect with others.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#edit-profile-btn',
    popover: {
      title: 'Edit Your Profile',
      description: 'Update your information, add a profile picture, and customize how others see you.',
      side: 'left',
      align: 'start',
    },
  },
];

// Project details page tour - focused on project management features
export const projectDetailsTourSteps: DriveStep[] = [
  {
    element: '#project-header',
    popover: {
      title: 'Your Project Details',
      description: 'This is your project showcase. Share updates, manage your team, and connect with potential collaborators.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#edit-project-btn',
    popover: {
      title: 'Edit Your Project',
      description: 'Update your project details, add new features, upload images, and keep your project information current.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '#delete-project-btn',
    popover: {
      title: 'Delete Project',
      description: 'Remove your project permanently. Warning: This action is irreversible and will delete all project data including posts and team members.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '#team-members-section',
    popover: {
      title: 'Manage Team Members',
      description: 'Add collaborators to your project, assign roles, and work together. Team members can edit project details and post updates.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#invite-section',
    popover: {
      title: 'Invite Professors & Investors',
      description: 'Send invitations to professors and investors to view your project. Once they accept, you can message them directly in your inbox to discuss opportunities.',
      side: 'top',
      align: 'start',
    },
  },
];

// Legacy export for backward compatibility
export const tourSteps = feedTourSteps;
