// =====================================================================
// 文件位置注释
// =====================================================================
// 主文件夹路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs
// 当前文件路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs\components\DanmakuBackground.tsx
// 文件类型：React 客户端组件
// 功能描述：背景弹幕特效，在页面顶部区域滚动显示趣味文字。
//          限制在 30vh 高度内，z-index 为 0（在内容层下方）。
// =====================================================================

"use client";

import { useState } from 'react';
import { siteConfig } from '../siteConfig';

// =====================================================================
// 弹幕数据结构
// =====================================================================
interface DanmakuItem {
  id: number;
  text: string;
  top: number;      // 容器内的百分比位置
  duration: number; // 滚动动画时长
  delay: number;    // 动画延迟
}

// =====================================================================
// 弹幕背景组件
// =====================================================================
// 设计思路：
//   1. 容器限制在 top-28 到 h-[30vh] 区域内，避免覆盖卡片
//   2. z-0 确保在内容层下方，只作为背景装饰
//   3. 低透明度（浅色 30% / 深色 10%），不干扰阅读
// =====================================================================
export default function DanmakuBackground() {
  // 生成弹幕数据
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

    const count = 15;
    const items: DanmakuItem[] = [];

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        text: texts[Math.floor(Math.random() * texts.length)],
        top: Math.random() * 80 + 10, // 10%-90%，避免文字被切掉
        duration: Math.random() * 20 + 25, // 25-45秒滚动一圈
        delay: Math.random() * 20, // 随机延迟，错开出现
      });
    }

    return items;
  });

  return (
    // 弹幕容器：限制在顶部 30vh 区域，z-0 在内容层下方
    <div className="fixed top-28 h-[30vh] left-0 right-0 overflow-hidden pointer-events-none z-0">
      {/* 滚动动画关键帧 */}
      <style>{`
        @keyframes float-left {
          0% { right: -100%; transform: translateX(100%); }
          100% { right: 100%; transform: translateX(-100%); }
        }
      `}</style>

      {/* 弹幕列表 */}
      {danmakus.map((item) => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap text-white/30 dark:text-white/10 font-bold text-lg tracking-wider select-none"
          style={{
            top: `${item.top}%`,
            right: '-100%',
            animation: `float-left ${item.duration}s linear ${item.delay}s infinite`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}