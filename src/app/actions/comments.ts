"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createComment(postId: string, postSlug: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để bình luận" };
  }

  const content = formData.get("content") as string;

  if (!content || content.trim().length === 0) {
    return { error: "Nội dung bình luận không được để trống" };
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content: content.trim(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/blog/${postSlug}`);
  return { error: null };
}

export async function deleteComment(commentId: string, postSlug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập" };
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/blog/${postSlug}`);
  return { error: null };
}
