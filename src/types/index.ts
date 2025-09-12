export type Role = "student" | "professor" | "faculty" | "mentor" | "investor";

export type PostType = "help" | "idea" | "update" | "showcase" | "event" | "resource";

export type ProjectStatus = "concept" | "mvp" | "launched";

export type ProjectNeed = "design" | "dev" | "marketing" | "research" | "funding" | "mentor";

export type CTAType = "join_team" | "offer_help" | "apply" | "register" | "feedback";

export interface User {
  id: string;
  name: string;
  handle: string;
  role: Role;
  avatar: string;
  department?: string;
  education?: string;
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

export interface Project {
  id: string;
  title: string;
  ownerId: string;
  status: ProjectStatus;
  needs: ProjectNeed[];
  categories: string[];
  createdAt: string;
  previewImage?: string;
  pitchUrl?: string;
  repoUrl?: string;
  description?: string;
  teamMembers: string[];
}

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
