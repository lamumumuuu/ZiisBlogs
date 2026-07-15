// =====================================================================
// 文件位置注释
// =====================================================================
// 主文件夹路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs
// 当前文件路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs\app\layout.tsx
// 文件类型：Next.js App Router 根布局组件
// 功能描述：应用根布局，包裹所有页面。包含背景层、导航栏、
//          全局 Provider（MusicProvider、ToastProvider）等。
//          所有页面共享此布局结构。
// =====================================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { siteConfig } from "../siteConfig";
import BackgroundSlider from "../components/BackgroundSlider";
import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import { MusicProvider } from "../components/MusicProvider";
import { ToastProvider } from "../components/ToastProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-1000">

        {/* ========== 第1层：渐变背景 或 图片轮播 ========== */}
        {siteConfig.useGradient ? (
          // ----- 流动渐变 -----
          <div
            className="fixed inset-0 -z-10"
            style={{
              background: `linear-gradient(-45deg, ${siteConfig.themeColors.join(", ")})`,
              backgroundSize: "400% 400%",
              animation: "gradientMove 15s ease infinite",
            }}
          />
        ) : (
          // ----- 图片轮播 -----
          <BackgroundSlider />
        )}

        {/* ========== 第2层：模糊光晕（两个超大彩色圆） ========== */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/30 dark:bg-indigo-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        {/* ========== 第3层：半透明白色遮罩（让文字更清晰） ========== */}
        <div className="fixed inset-0 -z-10 bg-white/30 dark:bg-slate-900/40 backdrop-blur-sm" />

        {/* ========== 第4层：漂浮粒子特效 ========== */}
        <BackgroundEffects />

        {/* ========== 内容层 ========== */}
        <MusicProvider>
          <ToastProvider>
            <div className="relative z-10 flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 pt-16">
                {children}
              </main>
            </div>
          </ToastProvider>
        </MusicProvider>

        {/* ========== 注入动画关键帧 ========== */}
        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

      </body>
    </html>
  );
}