// app/page.tsx
// 功能描述：首页页面组件，整合 HeroBanner、ProfileCard、CloudPlayer、
//          LyricBar、LatestChatterCarousel 等组件。
// =====================================================================

import HeroBanner from '../components/HeroBanner';
import ProfileCard from '../components/ProfileCard';
import CloudPlayer from '../components/CloudPlayer';
import LyricBar from '../components/LyricBar';
import LatestChatterCarousel from '../components/LatestChatterCarousel';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// =====================================================================
// 类型定义
// =====================================================================
interface Chatter {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  date?: string;
  formattedDate?: string;
}

// =====================================================================
// 工具函数：格式化日期
// =====================================================================
function formatUpdateTime(dateString: string) {
  if (!dateString || dateString === '1970-01-01') return '刚刚更新';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } catch {
    return dateString;
  }
}

// =====================================================================
// Home 组件 - 首页
// =====================================================================
export default function Home() {
  // ===================================================================
  // 读取说说数据（chatters）
  // ===================================================================
  const chattersDirectory = path.join(process.cwd(), 'chatters');
  // ✅ 修复：将 any[] 替换为 Chatter[]
  let top5Chatters: Chatter[] = [];

  try {
    if (fs.existsSync(chattersDirectory)) {
      const chatterFiles = fs.readdirSync(chattersDirectory).filter((f) => f.endsWith('.md'));
      top5Chatters = chatterFiles
        .map((fileName) => {
          const fullPath = path.join(chattersDirectory, fileName);
          const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
          const rawDate = data.date || '1970-01-01';
          return {
            slug: fileName.replace(/\.md$/, ''),
            title: data.title || '碎片记录',
            description: data.description || content.substring(0, 60),
            cover:
              data.cover ||
              'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
            date: rawDate,
            formattedDate: formatUpdateTime(rawDate),
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateB !== dateA) return dateB - dateA;
          return b.slug.localeCompare(a.slug);
        })
        .slice(0, 5);
    }
  } catch (e) {
    console.error('读取说说数据失败:', e);
  }

  // 如果没有数据，使用占位数据
  if (top5Chatters.length === 0) {
    top5Chatters = [
      {
        slug: 'placeholder',
        title: '暂无说说',
        description: '在 chatters 目录下创建 .md 文件来添加说说',
        cover: '',
        date: '',
        formattedDate: '刚刚',
      },
    ];
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-24 sm:mt-28 px-4 sm:px-6 lg:px-10 relative z-10">

      {/* ================================================================= */}
      {/* 顶部：HeroBanner（搜索栏替代品）                                    */}
      {/* ================================================================= */}
      <HeroBanner />

      {/* ================================================================= */}
      {/* 主内容区                                                           */}
      {/* ================================================================= */}
      <main className="flex flex-col gap-6 w-full mt-6">

        {/* --------------------------------------------------------------- */}
        {/* 第一行：个人资料卡片 + 音乐播放器（双栏布局）                     */}
        {/* --------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

          {/* 个人资料卡片 - 左侧，占 7 列 */}
          <div className="col-span-1 lg:col-span-7 flex flex-col">
            <ProfileCard />
          </div>

          {/* 音乐播放器卡片 - 右侧，占 5 列 */}
          <div className="col-span-1 lg:col-span-5 flex flex-col">
            <CloudPlayer />
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* 歌词显示栏 - 横跨整行                                             */}
        {/* --------------------------------------------------------------- */}
        <div className="w-full mt-[-10px]">
          <LyricBar />
        </div>

        {/* --------------------------------------------------------------- */}
        {/* 说说轮播 - 横跨整行                                              */}
        {/* --------------------------------------------------------------- */}
        <div className="w-full mt-2">
          <LatestChatterCarousel chatters={top5Chatters} />
        </div>

      </main>
    </div>
  );
}