"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn chưa đăng nhập" };
  }

  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  if (!username) {
    return { error: "Tên đăng nhập không được để trống" };
  }

  // Check if username is already taken by someone else
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();

  if (existingUser) {
    return { error: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      username: username,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn chưa đăng nhập" };
  }

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: "Mật khẩu mới phải có ít nhất 6 ký tự" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Mật khẩu xác nhận không khớp" };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn chưa đăng nhập", url: null };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "Không tìm thấy file", url: null };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(fileName, file);

  if (error) {
    return { error: error.message, url: null };
  }

  const { data: urlData } = supabase.storage
    .from("blog-images")
    .getPublicUrl(fileName);

  return { error: null, url: urlData.publicUrl };
}
