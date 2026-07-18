// app/layout.tsx
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
import Sakura from "../components/Sakura";
import Navbar from "../components/Navbar";
import { MusicProvider } from "../components/music/MusicProvider";
import { ToastProvider } from "../components/ToastProvider";
import ClickEffect from "../components/ClickEffect";
import DanmakuBackground from "../components/DanmakuBackground";
import FloatingPlayer from "../components/music/FloatingPlayer";
import SakanaWidget from '../components/SakanaWidget';



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

        {/* 第1层：图片轮播（最底层） */}
        <BackgroundSlider />

        {/* 第2层：弹幕背景（在遮罩下方，不会覆盖卡片） */}
        {/* 在桌面端显示，手机端隐藏*/}
        <div className="hidden md:block">
          <DanmakuBackground />
        </div>

        {/* 第3层：半透明白色遮罩 */}
        {/* 改 backdrop-blur-sm → backdrop-blur-md */}
        <div className="fixed inset-0 -z-10 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md" />

        {/* 第4层：动态渐变叠加层 */}
        {/* 改 mix-blend-overlay → mix-blend-color，改 opacity-60 → opacity-60 dark:opacity-20 */}
        <div
          className="fixed inset-0 -z-10 opacity-60 dark:opacity-20 mix-blend-color transition-opacity duration-1000"
          style={{
            background: `linear-gradient(-45deg, ${siteConfig.themeColors.join(", ")})`,
            backgroundSize: "400% 400%",
            animation: "gradientMove 15s ease infinite",
          }}
        />

        {/* 第5层：模糊光晕 */}
        {/* 改 w-[60%] h-[60%] → w-[40%] h-[40%] */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 dark:bg-indigo-900/20 blur-[100px] rounded-full z-[-7] md:mix-blend-overlay" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/30 dark:bg-purple-900/30 blur-[100px] rounded-full z-[-7] md:mix-blend-overlay" />

        {/* 第6层：樱花特效 */}
        <Sakura />

        {/* ========== 点击特效 ========== */}
        <ClickEffect />

        {/* ========== 内容层 ========== */}
        <MusicProvider>
          <ToastProvider>
            <div className="relative z-10 flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 pt-16">
                {children}
              </main>
            </div>
            {/* 音乐框 */}
            <FloatingPlayer />
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
        <SakanaWidget />
      </body>
    </html>
  );
}