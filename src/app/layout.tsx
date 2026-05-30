import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "GamingBlog - Cộng đồng tin tức & cẩm nang game Esports",
    template: "%s | GamingBlog"
  },
  description: "Cổng thông tin điện tử cập nhật nhanh nhất tin tức, cẩm nang, cẩm nang leo rank League of Legends, Valorant và Teamfight Tactics (TFT).",
  keywords: ["Gaming Blog", "Riot Games", "League of Legends", "Valorant", "Teamfight Tactics", "TFT", "Esports", "Next.js", "Supabase"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} dark h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
