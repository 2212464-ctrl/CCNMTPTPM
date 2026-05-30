import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton, PublishToggleButton } from "./DashboardButtons";
import type { Post } from "@/lib/types";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch posts written by current user
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const myPosts = (posts as Post[] | null) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard của bạn</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tất cả các bài viết nháp và chính thức của bạn ở đây.
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
          Đã xảy ra lỗi khi tải bài viết: {error.message}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {myPosts.length > 0 ? (
          myPosts.map((post) => {
            const formattedDate = new Date(post.created_at).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <Card
                key={post.id}
                className="overflow-hidden border-border/50 hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  {/* Cover Image Thumbnail */}
                  {post.cover_image_url ? (
                    <div className="relative w-full md:w-28 aspect-[16/9] md:aspect-[4/3] rounded-lg overflow-hidden shrink-0 border border-border">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full md:w-28 aspect-[16/9] md:aspect-[4/3] rounded-lg overflow-hidden shrink-0 border border-border bg-muted/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-muted-foreground/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{formattedDate}</span>
                      {post.published ? (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20">
                          Đã phát hành
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          Bản nháp
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <h2 className="text-xl font-bold truncate">{post.title}</h2>
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0 md:ml-auto">
                    <PublishToggleButton postId={post.id} isPublished={post.published} />
                    <Link href={`/dashboard/edit/${post.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Sửa
                      </Button>
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          !error && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/10">
              <svg
                className="w-12 h-12 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-1">Bạn chưa viết bài nào</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Chia sẻ ý tưởng, câu chuyện hoặc kiến thức của bạn với mọi người ngay hôm nay.
              </p>
              <Link href="/dashboard/new">
                <Button>Bắt đầu viết bài</Button>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
