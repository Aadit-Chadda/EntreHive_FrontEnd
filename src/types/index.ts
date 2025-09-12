import { z } from "zod";

export type Role = "student" | "professor" | "faculty" | "mentor" | "investor";

export type PostType = "help" | "idea" | "update" | "showcase" | "event" | "resource";

export type ProjectStatus = "concept" | "mvp" | "launched";

export type ProjectNeed = "design" | "dev" | "marketing" | "research" | "funding" | "mentor";

export type CTAType = "join_team" | "offer_help" | "apply" | "register" | "feedback";

// Zod schemas
export const ProjectType = z.enum(["startup", "side_project", "research", "hackathon", "course_project"]);

export const ProjectStatus = z.enum(["concept", "mvp", "launched"]);

export const Visibility = z.enum(["university", "cross_university", "public"]);

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

// Enhanced Project schema with Zod validation
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
  pitchUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  visibility: Visibility.default("university"),
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
  visibility: "university" | "cross_university";
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
