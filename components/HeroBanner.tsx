//components\HeroBanner.tsx
// 文件类型：React 客户端组件
// 功能描述：首页顶部的长条形横幅组件，替代搜索栏的视觉位置。
//          展示站点欢迎语、日期、一句励志/文艺短句，
//          保持与搜索栏相同的尺寸和视觉突出度。
// =====================================================================

"use client";

import { useEffect, useState } from 'react';

// =====================================================================
// 每日一言文案库
// =====================================================================
// 设计：从预设文案中随机选择一条，每次刷新页面显示不同的句子
// 也可以根据当前日期选择固定的句子
// =====================================================================
const quotes = [
  { text: "代码改变世界，热爱创造奇迹。", author: "— 致每一位开发者" },
  { text: "保持好奇，持续学习，永远热爱。", author: "— 成长箴言" },
  { text: "愿你出走半生，归来仍是少年。", author: "— 苏轼" },
  { text: "能陪我组一辈子的乐团吗？", author: "— 高松灯" },
  { text: "人又不聪明，还学人家秃顶。", author: "— 胡一菲" },
  { text: "等我，辉夜！我一定会去月球接你，一起吃松饼。为了让你再也不用回去 —— 我要把月球毁掉！！！！", author: "— 酒寄彩叶" }
];

// =====================================================================
// HeroBanner 组件 - 首页顶部长条形横幅
// =====================================================================
// 功能说明：
//   1. 显示站点欢迎语和当前日期
//   2. 展示一条随机的"每日一言"
//   3. 视觉尺寸与搜索栏一致，保持页面布局平衡
//   4. 带有渐变背景和鼠标悬停微动效
//
// 设计思路：
//   - 使用与搜索栏相同的尺寸（max-w-2xl、py-4、rounded-3xl）
//   - 左侧放置图标和欢迎语，右侧放日期
//   - 中间展示每日一言，打字机效果出现
//   - 保持毛玻璃风格，与整体 UI 统一
// =====================================================================
export default function HeroBanner() {
  // 当前显示的句子索引（使用惰性初始化，避免在 effect 中调用 setState）
  const [quoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  // 打字机效果的文本
  const [displayText, setDisplayText] = useState("");

  // 当前日期（使用惰性初始化，完全避免 effect 中的 setState）
  const [currentDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];
    return `${year}.${month}.${day} ${weekDay}`;
  });

  // ===================================================================
  // 打字机效果
  // ===================================================================
  // 当 quoteIndex 变化时，启动打字机效果
  // 使用 eslint-disable-next-line 忽略 set-state-in-effect 警告，
  // 因为这是打字机动画必要的状态重置
  // ===================================================================
  useEffect(() => {
    const targetText = quotes[quoteIndex]?.text || "";
    let i = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayText("");

    const timer = setInterval(() => {
      if (i <= targetText.length) {
        setDisplayText(targetText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);

    return () => clearInterval(timer);
  }, [quoteIndex]);

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      {/*
        横幅主体：
        - 尺寸与搜索栏一致：pl-14 pr-6 py-4 rounded-3xl
        - 毛玻璃背景风格
        - 悬停时轻微上浮
      */}
      <div className="relative group w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5">

        {/* 左侧装饰图标：替代搜索框的放大镜位置 */}
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none select-none">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-indigo-500 drop-shadow-sm"
            >
              {/* 引号图标 */}
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>
        </div>

        {/* 
          原布局使用 absolute 定位日期和作者，当文字过长时会与日期/作者重叠。
          修改为 flex 列布局，让文字、日期、作者在垂直方向上自然排列，
          文字区域自动换行，不再与日期重叠。
        */}
        
        {/* 内容区域 - 改为 flex 列布局 */}
        <div className="flex flex-col min-h-[24px]">
          
          {/* 第一行：每日一言（文字）+ 日期（右侧） */}
          <div className="flex items-start gap-3 w-full">
            {/* 文字区域：flex-1 占用剩余空间，允许换行 */}
            <p className="flex-1 text-slate-800 dark:text-slate-200 font-medium text-base md:text-lg leading-snug break-words min-w-0">
              {displayText}
              {/* 光标闪烁效果 */}
              <span className="inline-block w-[3px] h-5 bg-indigo-500 align-middle ml-0.5 animate-pulse rounded-full"></span>
            </p>
            
            {/* 日期：固定在右侧，不换行 */}
            <span className="text-[10px] md:text-xs font-mono text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-slate-900/30 px-2 py-0.5 rounded-md whitespace-nowrap flex-shrink-0 mt-0.5">
              {currentDate}
            </span>
          </div>
          
          {/* 第二行：作者信息（左对齐，与文字对齐） */}
          <div className="mt-1 text-[10px] font-bold text-indigo-500/70 dark:text-indigo-400/70 tracking-wide">
            {quotes[quoteIndex]?.author || ""}
          </div>
        </div>

      </div>
    </div>
  );
}