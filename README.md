# EntreHive Frontend

> A Next.js-powered social platform connecting students, professors, and investors in the entrepreneurial ecosystem.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://entrehive.ca)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🌐 Links

- **Live Site**: [https://entrehive.ca](https://entrehive.ca)
- **Backend Repository**: [EntreHive Backend](https://github.com/Aadit-Chadda/EntreHive_backend)
- **Frontend Repository**: [EntreHive Frontend](https://github.com/Aadit-Chadda/EntreHive_frontend)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Contributing](#contributing)

## 🎯 Overview

EntreHive is a comprehensive social networking platform designed to bridge the gap between students, professors, and investors in the entrepreneurial ecosystem. The frontend is built with Next.js 15 using the App Router, featuring a modern, responsive UI with dark mode support.

## ✨ Features

### 🔐 Authentication & User Management
- Email/password authentication with JWT
- Email verification system
- Password reset functionality
- Role-based access (Student, Professor, Investor)
- Profile customization with profile pictures and bios

### 📱 Social Feed
- Curated feed algorithm with engagement scoring
- Create, edit, and delete posts
- Rich text content with image uploads
- Hashtag support
- Real-time like and comment system
- Post sharing functionality
- Visibility controls (public/university-only)

### 💼 Project Management
- Create and showcase entrepreneurial projects
- Project types: Startup, Research, Social Impact, Tech Innovation
- Team management and invitations
- Project discovery and search
- Rich project profiles with banners and images
- Status tracking (Planning, Active, Completed, On Hold)

### 💬 Messaging System
- **Direct Messaging**: 1-on-1 conversations
- **Group Conversations**: Team-based project messaging
- **Project View Requests**: Permission-based access for professors/investors
- Real-time message updates
- Unread message indicators
- Conversation search and filtering

### 🔔 Notifications
- Real-time notification system
- Multiple notification types:
  - Likes and comments
  - New followers
  - Project invitations
  - Message notifications
  - Project view requests
- Mark as read/unread
- Notification preferences

### 🔍 Search & Discovery
- Global search across users, posts, and projects
- Advanced filtering options
- Hashtag search
- User discovery with follow suggestions
- Project categorization and tagging

### 🎨 UI/UX Features
- Modern, responsive design
- Dark/Light mode toggle
- Smooth animations with Framer Motion
- Mobile-first approach
- Infinite scroll on feeds
- Toast notifications
- Loading states and skeletons
- Error handling and retry mechanisms

## 🛠 Tech Stack

### Core Framework
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### Styling & UI
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Heroicons** - Icon library
- **Lucide React** - Additional icon set

### State Management & Utilities
- **React Context API** - Global state management
- **Zod** - Schema validation
- **clsx** - Conditional className utility

### Development Tools
- **Turbopack** - Fast bundler (Next.js 15 default)
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API running (see [Backend Repository](https://github.com/Aadit-Chadda/EntreHive_backend))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aadit-Chadda/EntreHive_frontend.git
   cd EntreHive_frontend/entrehive
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
entrehive/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── feed/                   # Main social feed
│   │   ├── posts/                  # Post detail pages
│   │   ├── projects/               # Project pages
│   │   │   ├── [id]/              # Project detail
│   │   │   └── create/            # Create project
│   │   ├── inbox/                  # Messaging system
│   │   │   ├── direct/            # Direct messages
│   │   │   ├── group/             # Group conversations
│   │   │   └── requests/          # Project view requests
│   │   ├── profile/                # User profile
│   │   │   └── [username]/        # Public profile view
│   │   ├── explore/                # Search and discovery
│   │   ├── notifications/          # Notifications page
│   │   ├── settings/               # User settings
│   │   ├── documentation/          # Platform documentation
│   │   ├── components/             # Shared components
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostCardNew.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── CuratedFeed.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ...
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home/landing page
│   │   └── globals.css             # Global styles
│   ├── components/                 # Reusable components
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── contexts/                   # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── lib/                        # Utility functions
│   │   └── api.ts                 # API client
│   ├── types/                      # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                      # Helper functions
├── public/                         # Static assets
│   ├── Logoblacktransparent.png
│   ├── LogoWhitetransparent.png
│   └── ...
├── .env.local                      # Environment variables (create this)
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Package Management
npm install          # Install dependencies
npm update           # Update dependencies
```

### Code Style

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Add proper type definitions
- Write clear comments for complex logic

### Testing

- Test all user flows before submitting
- Verify responsive design on multiple screen sizes
- Check dark/light mode compatibility
- Ensure API integration works correctly

**Questions or Issues?** Please open an issue in the [GitHub repository](https://github.com/Aadit-Chadda/EntreHive_frontend/issues).

**Backend Repository**: [EntreHive Backend](https://github.com/Aadit-Chadda/EntreHive_backend)
