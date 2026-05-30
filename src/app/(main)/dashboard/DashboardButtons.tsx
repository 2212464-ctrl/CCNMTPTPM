"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deletePost, togglePublish } from "@/app/actions/posts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ButtonProps {
  postId: string;
}

export function PublishToggleButton({
  postId,
  isPublished,
}: ButtonProps & { isPublished: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await togglePublish(postId, !isPublished);
    setLoading(false);
  };

  return (
    <Button
      variant={isPublished ? "outline" : "secondary"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className="min-w-28 text-xs"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isPublished ? (
        "Chuyển về nháp"
      ) : (
        "Phát hành"
      )}
    </Button>
  );
}

export function DeletePostButton({ postId }: ButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deletePost(postId);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Xóa
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có chắc chắn muốn xóa bài viết này?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Bài viết và tất cả bình luận liên quan sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading} className="gap-1">
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              "Xóa vĩnh viễn"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
