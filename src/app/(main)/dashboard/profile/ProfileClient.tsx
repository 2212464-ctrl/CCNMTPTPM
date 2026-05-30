"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updatePassword, uploadAvatar } from "@/app/actions/profile";
import type { Profile } from "@/lib/types";

interface ProfileClientProps {
  profile: Profile | null;
  email: string | undefined;
}

export default function ProfileClient({ profile, email }: ProfileClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [avatarUploading, setAvatarUploading] = useState(false);

  const getInitials = (name: string | null, uname: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return uname.substring(0, 2).toUpperCase();
  };

  // Profile update submit handler
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    const formData = new FormData(e.currentTarget);
    formData.append("avatarUrl", avatarUrl);

    const result = await updateProfile(formData);

    if (result?.error) {
      setProfileError(result.error);
    } else {
      setProfileSuccess("Cập nhật thông tin cá nhân thành công!");
      router.refresh();
    }
    setProfileLoading(false);
  };

  // Password update submit handler
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result?.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess("Đổi mật khẩu thành công!");
      // Reset password inputs
      const form = e.target as HTMLFormElement;
      form.reset();
    }
    setPasswordLoading(false);
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setProfileError(null);
    setProfileSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAvatar(formData);

    if (result.error) {
      setProfileError(result.error);
    } else if (result.url) {
      setAvatarUrl(result.url);
      
      // Save to database immediately for direct feedback
      const dbFormData = new FormData();
      dbFormData.append("fullName", fullName);
      dbFormData.append("username", username);
      dbFormData.append("avatarUrl", result.url);

      const dbResult = await updateProfile(dbFormData);
      if (dbResult?.error) {
        setProfileError(dbResult.error);
      } else {
        setProfileSuccess("Đã cập nhật ảnh đại diện thành công!");
        router.refresh();
      }
    }
    setAvatarUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tài khoản & Thiết lập</h1>
          <p className="text-muted-foreground mt-1">Cập nhật hồ sơ cá nhân và quản lý mật khẩu của bạn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden text-center p-6">
            <CardContent className="p-0 flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  {avatarUrl && (
                    <AvatarImage src={avatarUrl} alt={fullName || username} />
                  )}
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {getInitials(fullName, username)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload Hover State */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  {avatarUploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-semibold">Đổi ảnh</span>
                    </>
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={avatarUploading}
              />

              <div className="space-y-1">
                <h3 className="text-xl font-bold truncate max-w-full px-2">{fullName || "Người dùng"}</h3>
                <p className="text-sm text-muted-foreground">@{username}</p>
                {email && <p className="text-xs text-muted-foreground/80 font-mono mt-1">{email}</p>}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 border-border"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
              >
                {avatarUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Đang tải ảnh...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Tải lên ảnh mới
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Configuration forms */}
        <div className="md:col-span-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-1">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList variant="line" className="w-full border-b border-border/50 px-6 py-2 bg-transparent justify-start gap-4">
                <TabsTrigger value="profile" className="px-4 py-2 font-semibold">
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger value="password" className="px-4 py-2 font-semibold">
                  Đổi mật khẩu
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6 focus-visible:outline-none">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold">
                      Họ và tên
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ..."
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-semibold">
                      Tên đăng nhập (Username)
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập viết liền không dấu..."
                      required
                    />
                    <p className="text-xs text-muted-foreground">Tên đăng nhập này sẽ xuất hiện trên đường dẫn của bài viết và các bình luận.</p>
                  </div>

                  {/* Email (Read only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">
                      Địa chỉ Email (Không thể thay đổi)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email || ""}
                      disabled
                      className="bg-muted/40 cursor-not-allowed border-dashed"
                    />
                  </div>

                  {profileError && (
                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                      Lỗi: {profileError}
                    </div>
                  )}

                  {profileSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      {profileSuccess}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={profileLoading} className="px-6">
                      {profileLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Đang lưu...
                        </>
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="password" className="p-6 focus-visible:outline-none">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-semibold">
                      Mật khẩu mới
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                      Xác nhận mật khẩu mới
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới..."
                      required
                    />
                  </div>

                  {passwordError && (
                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                      Lỗi: {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={passwordLoading} className="px-6">
                      {passwordLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Đang đổi mật khẩu...
                        </>
                      ) : (
                        "Đổi mật khẩu"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
