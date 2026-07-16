// components/DanmakuBackground.tsx
// =====================================================================
// 修改内容：弹幕位置固定在上半部分（5%-50%），透明度固定为 25%，
//          最大字号调小至 12-20px，z-index 提高至 30 避免被毛玻璃遮挡
// =====================================================================

"use client";

import { useState } from 'react';
import { siteConfig } from '../siteConfig';

interface DanmakuItem {
  id: number;
  text: string;
  top: string;
  duration: number;
  delay: number;
  opacity: number;
  fontSize: number;
}

export default function DanmakuBackground() {
  const [danmakus] = useState<DanmakuItem[]>(() => {
    const texts = siteConfig.danmakuList || [
      '在干嘛呢？',
      '有笨蛋嘛？',
      '前方高能反应！',
      'Bug 跑起来了吗？',
      '呜呜呜呜呜',
      '熬夜修仙中......',
      'BUG 修复进度 99%',
      '今天背单词了吗？',
      'AI大人再让我跑一下吧！QAQ',
      '写算法中',
      '睡大觉中',
      '到底在干嘛？',
    ];

    const count = 20 + Math.floor(Math.random() * 10);
    const items: DanmakuItem[] = [];

    for (let i = 0; i < count; i++) {
      const text = texts[Math.floor(Math.random() * texts.length)];
      items.push({
        id: i,
        text,
        top: `${Math.random() * 45 + 5}%`, // 5%-50% 上半部分
        duration: 8 + Math.random() * 12,
        delay: Math.random() * -30,
        opacity: 0.25, // 固定透明度 25%
        fontSize: 12 + Math.floor(Math.random() * 8), // 12-20px
      });
    }

    return items;
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[30] select-none">
      <style>{`
        @keyframes danmakuScroll {
          0% { transform: translateX(100vw); opacity: 0; }
          2% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-200%); opacity: 0; }
        }
      `}</style>

      {danmakus.map((item) => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold tracking-wider"
          style={{
            top: item.top,
            fontSize: `${item.fontSize}px`,
            color: 'rgba(255, 255, 255, 0.8)',
            textShadow: '0 0 10px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.1)',
            opacity: item.opacity,
            animation: `danmakuScroll ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}