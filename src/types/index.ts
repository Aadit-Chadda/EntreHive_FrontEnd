import { z } from "zod";

// Backend API types
export type UserRole = "student" | "professor" | "investor";

export interface AuthUser {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  access_token_expiration: string;
  refresh_token_expiration: string;
  user: AuthUser;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  user_role: UserRole;
  profile_picture?: string;
  bio?: string;
  location?: string;
  university?: string;
  university_name?: string;
  major?: string;
  graduation_year?: number;
  department?: string;
  research_interests?: string;
  investment_focus?: string;
  company?: string;
  linkedin_url?: string;
  website_url?: string;
  github_url?: string;
  banner_style: "gradient" | "image";
  banner_gradient: string;
  banner_image?: string | null;
  is_profile_public: boolean;
  show_email: boolean;
  role_specific_info: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  is_followed_by: boolean;
}

export interface RegistrationData {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_role: UserRole;
  bio?: string;
  location?: string;
  university_id?: string;
  verified_university?: boolean;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  user_role?: UserRole;
  bio?: string;
  location?: string;
  university?: string;
  university_name?: string;
  major?: string;
  graduation_year?: number;
  department?: string;
  research_interests?: string;
  investment_focus?: string;
  company?: string;
  linkedin_url?: string;
  website_url?: string;
  github_url?: string;
  banner_style?: "gradient" | "image";
  banner_gradient?: string;
  banner_image?: File | null | string | undefined;
  is_profile_public?: boolean;
  show_email?: boolean;
}

// Legacy types (keep for existing components)
export type Role = "student" | "professor" | "faculty" | "mentor" | "investor";

export type PostType = "help" | "idea" | "update" | "showcase" | "event" | "resource";

export type ProjectStatus = "concept" | "mvp" | "launched";

export type ProjectNeed = "design" | "dev" | "marketing" | "research" | "funding" | "mentor";

export type CTAType = "join_team" | "offer_help" | "apply" | "register" | "feedback";

// Zod schemas
export const ProjectType = z.enum(["startup", "side_project", "research", "hackathon", "course_project"]);

export const ProjectStatus = z.enum(["concept", "mvp", "launched"]);

export const Visibility = z.enum(["private", "university", "public"]);

export interface User {
  id: string;
  name: string;
  handle: string;
  role: Role;
  avatar: string;
  location?: string;
  university?: string;
  department?: string;
  education?: string;
  profilePicture?: string;
  links?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    website?: string;
    x?: string;
  };
  following: Set<string>;
  followers: number;
  skills: string[];
  interests: string[];
  bio?: string;
}

// Backend API Project types
export interface ProjectUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile?: {
    full_name: string;
    profile_picture: string | null;
    user_role: string;
    university: {
      id: string;
      name: string;
      short_name: string;
    } | null;
    bio: string | null;
  } | null;
}

export interface ProjectData {
  id: string;
  title: string;
  owner: ProjectUser;
  team_members: ProjectUser[];
  project_type: "startup" | "side_project" | "research" | "hackathon" | "course_project";
  status: "concept" | "mvp" | "launched";
  summary?: string;
  needs: ("design" | "dev" | "marketing" | "research" | "funding" | "mentor")[];
  categories: string[];
  tags: string[];
  preview_image?: string;
  banner_style: "gradient" | "image";
  banner_gradient: string;
  banner_image?: string | null;
  pitch_url?: string;
  repo_url?: string;
  visibility: "private" | "university" | "public";
  created_at: string;
  updated_at: string;
  team_count: number;
  is_team_member: boolean;
  can_edit: boolean;
}

export interface ProjectCreateData {
  title: string;
  project_type: "startup" | "side_project" | "research" | "hackathon" | "course_project";
  status?: "concept" | "mvp" | "launched";
  summary?: string;
  needs?: ("design" | "dev" | "marketing" | "research" | "funding" | "mentor")[];
  categories?: string[];
  tags?: string[];
  preview_image?: string;
  banner_style?: "gradient" | "image";
  banner_gradient?: string;
  banner_image?: File | null;
  pitch_url?: string;
  repo_url?: string;
  visibility?: "private" | "university" | "cross_university" | "public";
}

export interface ProjectUpdateData {
  title?: string;
  project_type?: "startup" | "side_project" | "research" | "hackathon" | "course_project";
  status?: "concept" | "mvp" | "launched";
  summary?: string;
  needs?: ("design" | "dev" | "marketing" | "research" | "funding" | "mentor")[];
  categories?: string[];
  tags?: string[];
  preview_image?: string;
  banner_style?: "gradient" | "image";
  banner_gradient?: string;
  banner_image?: File | null | string | undefined;
  pitch_url?: string;
  repo_url?: string;
  visibility?: "private" | "university" | "cross_university" | "public";
}

export interface ProjectInvitation {
  id: string;
  project: ProjectData;
  inviter: ProjectUser;
  invitee: ProjectUser;
  message?: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface ProjectInvitationCreate {
  invitee_username: string;
  message?: string;
}

export interface AddTeamMemberData {
  username: string;
}

// Enhanced Project schema with Zod validation (kept for compatibility)
export const Project = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string().min(3).max(140),
  type: ProjectType,
  status: ProjectStatus.default("concept"),
  summary: z.string().max(5000).optional(),
  needs: z.array(z.enum(["design","dev","marketing","research","funding","mentor"])).default([]),
  categories: z.array(z.string()).default([]), // e.g., ["AI","EdTech"]
  tags: z.array(z.string()).default([]),
  previewImage: z.string().url().optional(),
  bannerStyle: z.enum(["gradient", "image"]).default("gradient"),
  bannerGradient: z.string().default("sunrise"),
  bannerImage: z.string().url().nullable().optional(),
  pitchUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  visibility: Visibility.default("private"),
  createdAt: z.date(),
  updatedAt: z.date(),
  teamMembers: z.array(z.string()).default([]),
});
export type Project = z.infer<typeof Project>;

export interface Post {
  id: string;
  authorId: string;
  projectId?: string;
  type: PostType;
  title: string;
  body: string;
  media?: {
    image?: string;
    video?: string;
    link?: string;
  };
  tags: string[];
  categories: string[];
  likes: number;
  comments: number;
  saves: number;
  createdAt: string;
  cta?: CTAType;
  isLiked?: boolean;
  isSaved?: boolean;
  visibility: "university" | "public";
  commitment?: string;
  lookingFor?: string[];
  isVetted?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface ExploreItem {
  id: string;
  title: string;
  image?: string;
  tags: string[];
  projectId?: string;
  type: "post" | "project";
}

export interface FeedFilter {
  roles: Role[];
  categories: string[];
  tags: string[];
  postTypes: PostType[];
}

export interface NotificationItem {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "project_invite";
  userId: string;
  targetId: string;
  createdAt: string;
  read: boolean;
  content: string;
}

// New Posts API Types
export interface PostAuthor {
  id: number;
  username: string;
  full_name: string;
  profile_picture?: string;
  user_role: UserRole;
  university_name?: string;
  university_id?: string;
}

export interface PostProject {
  id: string;
  title: string;
  project_type: "startup" | "side_project" | "research" | "hackathon" | "course_project";
  status: "concept" | "mvp" | "launched";
}

export interface PostComment {
  id: string;
  author: PostAuthor;
  content: string;
  parent?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  replies?: PostComment[];
  replies_count?: number;
  can_edit: boolean;
  can_delete: boolean;
}

export interface PostData {
  id: string;
  author: PostAuthor;
  content: string;
  image_url?: string;
  visibility: "public" | "university" | "private";
  tagged_projects: PostProject[];
  is_edited: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  comments?: PostComment[];
  can_edit: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostCreateData {
  content: string;
  visibility?: "public" | "university" | "private";
  tagged_project_ids?: string[];
  image?: File;
}

export interface PostUpdateData {
  content?: string;
  visibility?: "public" | "university" | "private";
  tagged_project_ids?: string[];
}

export interface CommentCreateData {
  content: string;
  parent?: string;
}

export interface PostLike {
  id: string;
  user: PostAuthor;
  created_at: string;
}

export interface PostsResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PostData[];
}

// Enhanced Profile Types with Posts and Projects
export interface PostSummary {
  id: string;
  content: string;
  image_url?: string;
  visibility: "public" | "university" | "private";
  is_edited: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  project_type: "startup" | "side_project" | "research" | "hackathon" | "course_project";
  status: "concept" | "mvp" | "launched";
  visibility: "private" | "university" | "public";
  preview_image?: string;
  banner_style: "gradient" | "image";
  banner_gradient: string;
  banner_image?: string | null;
  created_at: string;
  team_count: number;
}

export interface ProjectsCount {
  owned: number;
  member: number;
  total: number;
}

export interface EnhancedUserProfile extends UserProfile {
  user_posts: PostSummary[];
  owned_projects: ProjectSummary[];
  member_projects: ProjectSummary[];
  posts_count: number;
  projects_count: ProjectsCount;
}

// Timeline Feed Types (New Scalable System)
export interface TimelineItem {
  content_type: 'post' | 'project';
  content_id: string;
  score: number;
  content: PostData | ProjectData;
  user_interactions: string[];
  viewed: boolean;
  clicked: boolean;
  liked: boolean;
}

export interface TimelineResponse {
  results: TimelineItem[];
  count: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  next: string | null;
  previous: string | null;
}

// Legacy Feed Types (for backward compatibility)
export interface FeedItem {
  id?: string; // Optional for backward compatibility
  content_type: 'post' | 'project';
  content_id: string;
  feed_type?: 'home' | 'university' | 'public' | 'trending'; // Optional
  score: number;
  viewed: boolean;
  clicked: boolean;
  liked?: boolean; // New field
  created_at?: string; // Optional
  content: PostData | ProjectData;
  user_interactions?: string[]; // New field
}

export interface FeedResponse {
  results: FeedItem[];
  count: number;
  page?: number;
  page_size?: number;
  has_next?: boolean;
  has_previous?: boolean;
  next: string | null;
  previous: string | null;
}

export interface FeedConfig {
  show_university_posts: boolean;
  show_public_posts: boolean;
  show_project_updates: boolean;
  preferred_post_types: string[];
  recency_weight: number;
  relevance_weight: number;
  engagement_weight: number;
  university_weight: number;
}

export interface TrendingTopic {
  topic: string;
  mention_count: number;
  universities: string[];
  created_at: string;
  updated_at: string;
}
