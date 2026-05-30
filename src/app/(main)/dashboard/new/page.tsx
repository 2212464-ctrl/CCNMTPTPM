"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { createPost } from "@/app/actions/posts";

export default function NewPostPage() {
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("coverImageUrl", coverImageUrl);
    formData.append("published", published.toString());

    const result = await createPost(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Tạo bài viết mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold">
            Tiêu đề bài viết
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Nhập tiêu đề ấn tượng cho bài viết..."
            required
            className="text-lg font-medium h-12"
          />
        </div>

        {/* Cover Image */}
        <ImageUpload onUpload={(url) => setCoverImageUrl(url)} />

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt" className="text-sm font-semibold">
            Mô tả ngắn (Tóm tắt)
          </Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="Tóm tắt ngắn gọn nội dung bài viết để thu hút người đọc..."
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-semibold">
            Nội dung bài viết (Hỗ trợ Markdown)
          </Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Viết nội dung bài viết ở đây... Bạn có thể sử dụng các cú pháp Markdown cơ bản như # Tiêu đề, **Chữ đậm**, [Liên kết](url)..."
            required
            rows={12}
            className="font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Publish switch */}
        <div className="flex items-center space-x-2 p-4 rounded-xl border border-border bg-muted/20">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <div className="space-y-0.5">
            <Label htmlFor="published" className="font-semibold cursor-pointer">
              Phát hành ngay lập tức
            </Label>
            <p className="text-xs text-muted-foreground">
              Nếu bật, bài viết sẽ được hiển thị công khai trên trang chủ. Nếu tắt, bài viết sẽ được lưu dưới dạng Bản nháp.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
            Lỗi: {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/dashboard">
            <Button variant="outline" type="button" disabled={loading}>
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="px-6">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              "Lưu bài viết"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
