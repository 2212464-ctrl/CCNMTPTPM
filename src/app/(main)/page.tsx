import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/PostCard";
import { getMockPosts } from "@/lib/mockData";
import type { PostWithAuthor } from "@/lib/types";

// Force dynamic rendering to fetch fresh data on reload
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  let posts: PostWithAuthor[] = [];
  let isDemoMode = false;
  let errorMsg = null;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:profiles(*)
      `)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    
    posts = (data as PostWithAuthor[]) || [];
  } catch (e: any) {
    // Fallback to mock data if connection fails or is dummy
    isDemoMode = true;
    posts = getMockPosts();
    errorMsg = e.message || "Connection failed";
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden hero-gradient border border-border/50 py-16 px-6 sm:px-12 text-center space-y-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight animate-fade-in">
          Chào mừng đến với <span className="gradient-text">GamingBlog</span>
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground sm:text-lg animate-fade-in">
          Cổng thông tin chuyên biệt cập nhật tin tức esports, cẩm nang leo rank và phân tích meta các tựa game đình đám của Riot Games: League of Legends, Valorant và Đấu Trường Chân Lý (TFT).
        </p>
      </section>

      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Chế độ Demo (Mock Database) đang hoạt động
          </div>
          <p className="text-xs opacity-90 leading-relaxed">
            Hệ thống phát hiện thấy bạn chưa cấu hình thông tin Supabase API thật (lỗi kết nối hoặc đang dùng key mặc định).
            Để ứng dụng của bạn kết nối với Database thật của Supabase, hãy cập nhật thông tin trong file <code>.env.local</code> ở gốc dự án và chạy script SQL thiết lập bảng dữ liệu theo hướng dẫn trong file <strong>walkthrough.md</strong>.
          </p>
        </div>
      )}

      {/* Blog Feed */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-1">Chưa có bài viết nào</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Hiện tại chưa có bài viết nào được đăng tải. Hãy đăng nhập và chia sẻ bài viết đầu tiên nhé!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
