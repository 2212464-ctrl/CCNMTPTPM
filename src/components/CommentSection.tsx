"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment, deleteComment } from "@/app/actions/comments";
import type { CommentWithAuthor } from "@/lib/types";

interface CommentSectionProps {
  postId: string;
  postSlug: string;
  comments: CommentWithAuthor[];
  currentUserId?: string;
  postAuthorId: string;
}

export function CommentSection({
  postId,
  postSlug,
  comments,
  currentUserId,
  postAuthorId,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("content", content);

    const result = await createComment(postId, postSlug, formData);

    if (result.error) {
      setError(result.error);
    } else {
      setContent("");
    }

    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    await deleteComment(commentId, postSlug);
    setDeletingId(null);
  };

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
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        Bình luận ({comments.length})
      </h3>

      {/* Comment form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={3}
            className="resize-none"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !content.trim()} size="sm">
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi bình luận"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">
            Vui lòng{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              đăng nhập
            </a>{" "}
            để bình luận.
          </p>
        </div>
      )}

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="w-8 h-8 shrink-0">
              {comment.profiles?.avatar_url && (
                <AvatarImage src={comment.profiles.avatar_url} alt={comment.profiles.full_name || comment.profiles.username} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                {getInitials(
                  comment.profiles?.full_name,
                  comment.profiles?.username || "?"
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {comment.profiles?.full_name || comment.profiles?.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
            {currentUserId &&
              (currentUserId === comment.author_id ||
                currentUserId === postAuthorId) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                >
                  {deletingId === comment.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </Button>
              )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên! 💬
          </p>
        )}
      </div>
    </div>
  );
}
