//components\LyricBar.tsx
// 功能描述：歌词显示栏组件，展示当前播放歌曲的歌词。
//          带有打字机效果、音频波形动画、光标闪烁效果。
//          与音乐播放器共享状态，跨页面同步。
// =====================================================================

"use client";

import { useEffect, useState } from 'react';
import { useMusic } from './MusicProvider';

// =====================================================================
// LyricBar 组件 - 歌词显示栏
// =====================================================================
// 功能说明：
//   1. 左侧显示音频波形动画（播放时跳动，暂停时静止）
//   2. 中间显示当前歌词（打字机效果 + 光标闪烁）
//   3. 右侧显示音乐图标装饰
//   4. 深色毛玻璃风格，与整体 UI 统一
//
// 设计思路：
//   - 长条形设计，横跨整行，位于个人卡片和音乐卡片下方
//   - 左侧波形动画使用 5 根柱子，不同延迟形成错落感
//   - 歌词使用打字机效果逐字显示，增加仪式感
//   - 末尾有闪烁光标，模拟终端/编辑器效果
//   - 没有歌曲时返回 null，不占用空间
//
// 波形动画实现：
//   - 使用 CSS @keyframes 定义高度变化动画
//   - 每根柱子有不同的 animation-delay，形成波浪效果
//   - 暂停时高度固定为 4px，不执行动画
// =====================================================================
export default function LyricBar() {
  const { isPlaying, currentLyric, currentSong } = useMusic();
  const [displayedLyric, setDisplayedLyric] = useState("");

  // ===================================================================
  // 歌词打字机效果
  // ===================================================================
  // 当 currentLyric 变化时，重新开始打字动画
  // 每 50ms 显示一个字符
  // 注意：这里的 setDisplayedLyric("") 是为了重置打字机状态，
  // 虽然 ESLint 会警告，但这是打字机效果的必要操作，
  // 因此使用 eslint-disable-next-line 忽略该行检查
  // ===================================================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedLyric("");
    let i = 0;
    const targetText = currentLyric || "";
    if (!targetText) return;

    const typingInterval = setInterval(() => {
      if (i <= targetText.length) {
        setDisplayedLyric(targetText.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentLyric]);

  // 没有歌曲时不显示
  if (!currentSong) return null;

  // ===================================================================
  // 波形柱子配置
  // ===================================================================
  // 5 根柱子，不同颜色和动画延迟
  // 形成从左到右的波浪效果
  // ===================================================================
  const waves = [
    { color: 'bg-indigo-400', delay: '0ms' },
    { color: 'bg-purple-400', delay: '200ms' },
    { color: 'bg-indigo-500', delay: '400ms' },
    { color: 'bg-purple-500', delay: '100ms' },
    { color: 'bg-indigo-300', delay: '300ms' },
  ];

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <>
      {/* 自定义动画样式 */}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor {
          animation: cursorBlink 0.8s step-end infinite;
        }
        @keyframes safeWave {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        .safe-wave-active {
          animation: safeWave 1s ease-in-out infinite;
        }
      `}</style>

      {/*
        歌词栏主体：
        - 深色毛玻璃背景（与卡片的浅色形成对比）
        - 圆角 3xl
        - 固定高度 h-20
        - 悬停时有阴影增强效果
      */}
      <div className="w-full rounded-3xl bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl p-5 flex items-center justify-between transition-all duration-700 hover:shadow-indigo-500/20 group h-20">

        {/* =============================================================== */}
        {/* 左侧：音频波形动画                                                */}
        {/* =============================================================== */}
        <div className="flex items-end justify-center gap-[4px] h-8 w-16">
          {waves.map((wave, index) => (
            <div
              key={index}
              className={`w-1.5 rounded-t-sm transition-all duration-500 ease-out ${
                isPlaying
                  ? `${wave.color} safe-wave-active`
                  : 'h-1 bg-slate-600 shadow-none'
              }`}
              style={{
                animationDelay: wave.delay,
                // 暂停时强制回到 4px 高度
                height: isPlaying ? undefined : '4px',
              }}
            ></div>
          ))}
        </div>

        {/* =============================================================== */}
        {/* 中部：歌词显示区                                                  */}
        {/* =============================================================== */}
        <div className="flex-1 px-8 flex justify-center items-center overflow-hidden">
          <p className="text-white text-lg font-bold tracking-widest truncate drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">
            {displayedLyric}
            {/* 闪烁光标 */}
            <span className="inline-block w-[3px] h-5 bg-indigo-400 align-middle ml-1 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-cursor"></span>
          </p>
        </div>

        {/* =============================================================== */}
        {/* 右侧：音乐图标装饰                                                */}
        {/* =============================================================== */}
        <div className="w-16 flex justify-end">
          <svg
            className={`w-6 h-6 text-indigo-400/50 transition-all duration-500 ${isPlaying ? 'animate-bounce' : 'opacity-30'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
      </div>
    </>
  );
}