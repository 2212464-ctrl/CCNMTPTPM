export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  cover_image_url: string | null;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joined fields
  profiles?: Profile;
}

export interface PostWithAuthor extends Post {
  profiles: Profile;
}

export interface CommentWithAuthor extends Comment {
  profiles: Profile;
}
