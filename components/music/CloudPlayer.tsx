// =====================================================================
// 文件位置注释
// =====================================================================
// 主文件夹路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs
// 当前文件路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs\components\CloudPlayer.tsx
// 文件类型：React 客户端组件
// 功能描述：首页音乐播放器卡片组件，与音乐页面共享播放状态。
//          显示当前歌曲信息、播放控制按钮、进度条，
//          点击卡片跳转到音乐页面，播放不中断。
// =====================================================================

"use client";

import { useEffect, useState } from 'react';
import { useMusic } from './MusicProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// =====================================================================
// 时间格式化工具函数
// =====================================================================
// 将秒数转换为 mm:ss 格式
// 参数：time - 秒数
// 返回值：格式化后的时间字符串
// =====================================================================
const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "00:00";
  const m = Math.floor(time / 60).toString().padStart(2, '0');
  const s = Math.floor(time % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// =====================================================================
// CloudPlayer 组件 - 音乐播放器卡片
// =====================================================================
// 功能说明：
//   1. 显示当前播放歌曲的封面、标题、歌手
//   2. 播放/暂停、上一首、下一首控制按钮
//   3. 进度条显示和拖动控制
//   4. 当前歌词预览（打字机效果）
//   5. 点击卡片跳转到音乐页面
//   6. 播放状态与音乐页面完全同步（通过 MusicProvider）
//
// 设计思路：
//   - 与 ProfileCard 并排展示，形成首页顶部双栏布局
//   - 卡片整体可点击跳转音乐页，但控制按钮点击时阻止冒泡
//   - 封面图使用旋转动画，播放时旋转，暂停时停止
//   - 进度条使用自定义样式的 range input
//   - 所有状态来自 useMusic() Hook，实现跨页面同步
//
// 事件冒泡处理：
//   - 卡片外层 onClick 跳转到 /music
//   - 所有交互按钮（播放/暂停、切歌、进度条）都阻止事件冒泡
//     避免点击按钮时触发页面跳转
// =====================================================================
export default function CloudPlayer() {
  const {
    playlist,
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentLyric,
    isLoading,
    togglePlay,
    nextSong,
    prevSong,
    handleSeek,
  } = useMusic();

  const router = useRouter();
  const [displayedLyric, setDisplayedLyric] = useState("");

  // ===================================================================
  // 歌词打字机效果
  // ===================================================================
  // 当 currentLyric 变化时，用打字机效果逐字显示新歌词
  // 每 50ms 显示一个字符
  // 注意：这里的 setDisplayedLyric("") 是为了重置打字机状态，
  // 虽然 ESLint 会警告，但这是打字机效果的必要操作，
  // 因此使用 eslint-disable-next-line 忽略该行检查
  // ===================================================================
  useEffect(() => {
    let i = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedLyric("");
    const target = currentLyric || "";
    if (!target) return;

    const typingInterval = setInterval(() => {
      if (i <= target.length) {
        setDisplayedLyric(target.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentLyric]);

  // ===================================================================
  // 事件拦截函数（防止冒泡触发卡片跳转）
  // ===================================================================
  const safeTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  };

  const safePrevSong = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    prevSong();
  };

  const safeNextSong = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    nextSong();
  };

  const safeHandleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    handleSeek(e);
  };

  // ===================================================================
  // 加载状态
  // ===================================================================
  if (isLoading) {
    return (
      <div className="h-full w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col items-center justify-center transition-colors duration-700">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-slate-800 dark:text-white font-bold tracking-widest animate-pulse text-sm">
          CONNECTING...
        </span>
      </div>
    );
  }

  // ===================================================================
  // 无音乐可用状态
  // ===================================================================
  if (playlist.length === 0 || !currentSong) {
    return (
      <div className="h-full w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col items-center justify-center transition-all duration-700">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-inner opacity-50">
          <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <span className="text-slate-500 dark:text-slate-400 font-bold tracking-widest text-xs uppercase">
          No Music Available
        </span>
        <span className="text-[10px] text-slate-400 mt-1">请检查播放列表或网络连接</span>
      </div>
    );
  }

  // ===================================================================
  // 正常渲染
  // ===================================================================
  return (
    <>
      {/* 自定义样式：range input 滑块和波形动画 */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        @keyframes safeWave {
          0%, 100% { height: 4px; }
          50% { height: 28px; }
        }
        .safe-wave {
          animation: safeWave 1s ease-in-out infinite;
          transform-origin: bottom;
          will-change: height;
        }
      `}</style>

      {/*
        卡片外层：点击跳转到 /music
        所有内部交互按钮都使用 stopPropagation 阻止冒泡
      */}
      <div
        onClick={() => router.push('/music')}
        className="h-full w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col justify-between transition-all duration-700 hover:scale-[1.02] relative group overflow-hidden cursor-pointer"
      >
        {/* 背景装饰：渐变光晕，播放时更亮 */}
        <div className={`absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 blur-[50px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>

        {/* ================================================================= */}
        {/* 顶部：封面 + 歌曲信息                                                */}
        {/* ================================================================= */}
        <div className="flex items-center gap-5 relative z-10 mb-6 mt-2">
          {/*
            旋转封面：
            - 播放时持续旋转（6s 一圈）
            - 暂停时停止旋转
            - 中间有一个白色小圆点（唱片中心）
          */}
          <div
            className="w-20 h-20 rounded-full border-2 border-white/50 shadow-lg flex-shrink-0 overflow-hidden relative"
            style={{
              animation: `spin 6s linear infinite`,
              animationPlayState: isPlaying ? 'running' : 'paused',
              willChange: 'transform',
            }}
          >
            <Image
              src={currentSong.cover}
              alt="cover"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-300 shadow-inner"></div>
          </div>

          {/* 歌曲信息 */}
          <div className="flex-col overflow-hidden w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 tracking-widest uppercase bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-sm shadow-sm transition-colors duration-700">
                Cloud Music
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate drop-shadow-sm transition-colors duration-700">
              {currentSong.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate drop-shadow-sm transition-colors duration-700">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 中部：歌词预览                                                      */}
        {/* ================================================================= */}
        <div className="relative z-10 mb-2 h-6 overflow-hidden">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
            {displayedLyric}
          </p>
        </div>

        {/* ================================================================= */}
        {/* 底部：进度条 + 控制按钮                                             */}
        {/* ================================================================= */}
        <div className="relative z-10 mt-auto">
          {/* 进度条区域 */}
          <div
            className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold mb-3 transition-colors duration-700"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
          >
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={safeHandleSeek}
              className="flex-1 h-1.5 bg-white/40 dark:bg-slate-700/50 rounded-full appearance-none outline-none cursor-pointer shadow-inner"
              style={{
                background: `linear-gradient(to right, #818cf8 ${progress}%, rgba(148,163,184,0.4) ${progress}%)`,
              }}
            />
            <span className="w-10">{formatTime(duration)}</span>
          </div>

          {/* 控制按钮区域 */}
          <div className="flex items-center justify-center gap-6">
            {/* 上一首 */}
            <button
              onClick={safePrevSong}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors drop-shadow-sm relative z-20"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* 播放/暂停 */}
            <button
              onClick={safeTogglePlay}
              className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all border-2 border-white/50 dark:border-slate-600 relative z-20"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* 下一首 */}
            <button
              onClick={safeNextSong}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors drop-shadow-sm relative z-20"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}