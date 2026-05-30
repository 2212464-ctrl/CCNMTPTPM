import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostWithAuthor } from "@/lib/types";

interface PostCardProps {
  post: PostWithAuthor;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getInitials = (name: string | null, username: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative overflow-hidden aspect-[16/9]">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {!post.cover_image_url && (
          <div className="relative overflow-hidden aspect-[16/9] gradient-bg flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}

        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              Blog
            </Badge>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <h2 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              {post.profiles?.avatar_url && (
                <AvatarImage src={post.profiles.avatar_url} alt={post.profiles.full_name || post.profiles.username} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                {getInitials(
                  post.profiles?.full_name,
                  post.profiles?.username || "?"
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {post.profiles?.full_name || post.profiles?.username}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
