// components/AboutClient.tsx
'use client';

import { Mail, MessageCircle } from 'lucide-react';
import Image from 'next/image';
// 移除 siteConfig 导入（通过 props 接收数据）
import Comments from './Comments'; // 如果评论组件路径不同，请调整

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);

interface AboutClientProps {
  contentHtml: string;
  coverImage: string;
  author: string;
  avatarUrl: string;
  social: {
    github: string;
    email: string;
    qq: string;
  };
}

export default function AboutClient({ contentHtml, coverImage, author, avatarUrl, social }: AboutClientProps) {
  const socialLinks = [
    { href: social.github, icon: <GithubIcon size={20} />, name: 'GitHub' },
    { href: `mailto:${social.email}`, icon: <Mail size={20} />, name: 'Email' },
    { href: `tencent://message/?uin=${social.qq}`, icon: <MessageCircle size={20} />, name: 'QQ' },
  ].filter((item) => item.href);

  return (
    <main className="w-[95%] md:w-[90%] max-w-4xl mx-auto mt-24 md:mt-28 relative z-10">
      {/* ===== 卡片容器 ===== */}
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700 relative">

        {/* ===== 封面图（Banner） ===== */}
        <div
          className="w-full h-32 md:h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          {/* 渐变遮罩（让文字更清晰） */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
          
          {/* 装饰光晕 */}
          <div className="absolute top-4 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
        </div>

        {/* ===== 内容区域 ===== */}
        <div className="px-5 sm:px-8 md:px-12 pb-8 relative">

          {/* ===== 头像 + 标题 + 研究动态按钮（同一行） ===== */}
          <div className="flex items-end justify-between -mt-10 md:-mt-12 relative z-20">
            {/* 左侧：头像（下沉到封面底部） */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-white">
                <Image
                  src={avatarUrl}
                  alt={author}
                  width={100}
                  height={100}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 中间：标题（作者名） */}
            <div className="flex-1 px-4 text-center md:text-left">
              <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-700">
                Hello World, I&apos;m {author}
              </h1>
            </div>

            {/* 右侧：研究动态按钮（占位） */}
            <div className="flex-shrink-0">
              <button
                onClick={() => console.log('研究动态功能开发中...')}
                className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-300 shadow-sm"
              >
                研究动态 →
              </button>
            </div>
          </div>

          {/* ===== 社交链接 ===== */}
          <div className="mt-4 flex justify-center md:justify-start gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 backdrop-blur-md border border-white/30 hover:scale-110 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                {item.icon}
              </a>
            ))}
          </div>

          {/* ===== 分割线 ===== */}
          <div className="w-full h-px bg-slate-300/50 dark:bg-slate-700 mt-6 mb-6" />

          {/* ===== Markdown 内容（Prose 样式） ===== */}
          <article
            className="prose prose-sm md:prose-lg max-w-none dark:prose-invert
              prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-p:text-slate-700 dark:prose-p:text-slate-300
              prose-a:text-indigo-600 dark:prose-a:text-indigo-400
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-code:text-indigo-600 dark:prose-code:text-indigo-400
              prose-pre:bg-slate-800 prose-pre:rounded-2xl
              prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-950/20
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-hr:border-slate-300/50 dark:prose-hr:border-slate-700/50
              prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-indigo-500
            "
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* ===== 评论组件 ===== */}
          <div className="mt-12">
            <Comments />
          </div>
        </div>
      </div>
    </main>
  );
}