import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CommentSection } from "@/components/CommentSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getMockPosts, getMockComments } from "@/lib/mockData";
import type { PostWithAuthor, CommentWithAuthor } from "@/lib/types";

export const revalidate = 0;

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get current user if logged in
  let currentUser = null;
  try {
    const { data } = await supabase.auth.getUser();
    currentUser = data?.user;
  } catch (e) {
    // Ignore error in demo mode
  }

  let post: PostWithAuthor | null = null;
  let comments: CommentWithAuthor[] = [];
  let isDemoMode = false;

  try {
    // Fetch post from database
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:profiles(*)
      `)
      .eq("slug", slug)
      .single();

    if (postError || !postData) {
      throw postError || new Error("Post not found");
    }

    post = postData as PostWithAuthor;

    // Fetch comments
    const { data: commentsData } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:profiles(*)
      `)
      .eq("post_id", post.id)
      .order("created_at", { ascending: false });

    comments = (commentsData as CommentWithAuthor[] | null) || [];
  } catch (e) {
    // Fallback to mock post and comments if DB fetch fails
    isDemoMode = true;
    const mockPosts = getMockPosts();
    const foundMock = mockPosts.find((p) => p.slug === slug);
    
    if (foundMock) {
      post = foundMock;
      comments = getMockComments().filter((c) => c.post_id === post?.id);
    }
  }

  if (!post) {
    notFound();
  }

  // If the post is draft and the current user is not the author, return 404
  if (!post.published && currentUser?.id !== post.author_id && !isDemoMode) {
    notFound();
  }

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
    <article className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại trang chủ
        </Button>
      </Link>

      {/* Demo Notice */}
      {isDemoMode && (
        <div className="p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-xs">
          <strong>Thông báo Demo:</strong> Đây là bài viết giả định để minh họa giao diện. Bạn không thể gửi bình luận thật khi chưa kết nối cơ sở dữ liệu Supabase.
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        {!post.published && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            Bản nháp
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 pt-2">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(post.profiles?.full_name, post.profiles?.username || "?")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {post.profiles?.full_name || post.profiles?.username}
            </p>
            <p className="text-xs text-muted-foreground">
              Đăng ngày {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-border/50">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-muted-foreground font-medium border-l-4 border-primary pl-4 py-1 italic leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* Content */}
      <div className="py-4">
        <MarkdownRenderer content={post.content} />
      </div>

      <hr className="border-border/50" />

      {/* Comments Section */}
      <CommentSection
        postId={post.id}
        postSlug={post.slug}
        comments={comments}
        currentUserId={currentUser?.id}
        postAuthorId={post.author_id}
      />
    </article>
  );
}
