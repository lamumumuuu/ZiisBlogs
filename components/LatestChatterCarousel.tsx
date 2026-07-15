// components/LatestChatterCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface Chatter {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  date?: string;
  formattedDate?: string;
}

export default function LatestChatterCarousel({ chatters }: { chatters: Chatter[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % chatters.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + chatters.length) % chatters.length);
  };

  // 自动轮播
  useEffect(() => {
    if (chatters.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [chatters.length]);

  if (!chatters.length) {
    return (
      <div className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex items-center justify-center min-h-[200px]">
        <span className="text-slate-400 dark:text-slate-500 text-sm">暂无说说</span>
      </div>
    );
  }

  const current = chatters[currentIndex];

  // ================================================================
  // 方案二：根据文字长度动态调整字号
  // ================================================================
  const getFontSize = (text: string) => {
    const length = text?.length || 0;
    if (length > 60) return 'text-xs';
    if (length > 35) return 'text-sm';
    return 'text-base';
  };

  return (
    <div className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-5 relative min-h-[200px] flex flex-col group transition-all duration-700 hover:shadow-2xl">
      
      {/* 标题 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-pink-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">最新说说</h3>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {currentIndex + 1} / {chatters.length}
        </span>
      </div>

      {/* 内容 */}
      <Link href={`/chatter/${current.slug}`} className="flex-1 flex flex-col justify-center">
        {/* ================================================================ */}
        {/* 方案二应用：根据文字长度动态调整字号 */}
        {/* ================================================================ */}
        <p
          className={`${getFontSize(
            current.description
          )} text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
        >
          {current.description || '暂无内容'}
        </p>
      </Link>

      {/* 底部：日期 */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          {current.formattedDate || current.date || '刚刚'}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prev}
            className="p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            disabled={chatters.length <= 1}
          >
            <ChevronLeft size={16} className="text-slate-400" />
          </button>
          <button
            onClick={next}
            className="p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            disabled={chatters.length <= 1}
          >
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}