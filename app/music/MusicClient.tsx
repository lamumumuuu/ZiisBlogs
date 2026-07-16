// app/music/MusicClient.tsx
// =====================================================================
// 功能描述：音乐页面 - 客户端组件
//          布局参考 nothing-new.icu/music
//          方形封面、背景融合、无评论
// =====================================================================

"use client";

import { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  RefreshCcw,
  Disc3,
  Volume2,
  VolumeX,
  Search,
  X,
} from 'lucide-react';
import { useMusic } from '../../components/music/MusicProvider';

// =====================================================================
// 类型定义
// =====================================================================
interface LyricLine {
  time: number;
  text: string;
}

// =====================================================================
// MusicClient 组件
// =====================================================================
export default function MusicClient() {
  // ===================================================================
  // 从全局音乐上下文获取状态和方法
  // ===================================================================
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
    playSong,
    playMode,
    togglePlayMode,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useMusic();

  // ===================================================================
  // 组件内部状态
  // ===================================================================
  const lyricContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'playlist'>('lyrics');
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ===================================================================
  // 歌词数据
  // ===================================================================
  const parsedLyrics = useMemo((): LyricLine[] => {
    if (!currentSong) return [];
    if (Array.isArray(currentSong.lyrics) && currentSong.lyrics.length > 0) {
      return currentSong.lyrics as LyricLine[];
    }
    return [];
  }, [currentSong]);

  // ===================================================================
  // 计算当前播放进度对应的歌词索引
  // ===================================================================
  const activeLyricIndex = useMemo(() => {
    if (!parsedLyrics.length) return -1;
    let idx = parsedLyrics.findIndex((l) => l.time > currentTime) - 1;
    if (idx === -2) idx = parsedLyrics.length - 1;
    return Math.max(0, idx);
  }, [currentTime, parsedLyrics]);

  // ===================================================================
  // 歌词自动滚动到当前播放行
  // ===================================================================
  useEffect(() => {
    if (
      activeLyricRef.current &&
      lyricContainerRef.current &&
      activeTab === 'lyrics'
    ) {
      const container = lyricContainerRef.current;
      const activeItem = activeLyricRef.current;
      const scrollTarget =
        activeItem.offsetTop - container.offsetHeight / 2 + activeItem.offsetHeight / 2;
      container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  }, [activeLyricIndex, activeTab]);

  // ===================================================================
  // 工具函数：时间格式化
  // ===================================================================
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ===================================================================
  // 播放模式图标映射
  // ===================================================================
  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'loop':
        return <Repeat size={18} className="text-slate-500 hover:text-indigo-500 md:w-5 md:h-5" />;
      case 'single':
        return <RefreshCcw size={18} className="text-indigo-500 md:w-5 md:h-5" />;
      case 'random':
        return <Shuffle size={18} className="text-slate-500 hover:text-indigo-500 md:w-5 md:h-5" />;
      default:
        return <Repeat size={18} className="text-slate-500 md:w-5 md:h-5" />;
    }
  };

  // ===================================================================
  // 歌单搜索过滤
  // ===================================================================
  const filteredPlaylist = useMemo(() => {
    if (!searchQuery.trim()) return playlist;
    const lowerQuery = searchQuery.toLowerCase();
    return playlist.filter((song) => {
      const title = (song.title || '').toLowerCase();
      const artist = (song.artist || '').toLowerCase();
      return title.includes(lowerQuery) || artist.includes(lowerQuery);
    });
  }, [playlist, searchQuery]);

  // ===================================================================
  // 加载状态
  // ===================================================================
  if (isLoading || !currentSong) {
    return (
      <div className="min-h-screen relative pb-32 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center animate-pulse gap-4">
          <Disc3 size={48} className="text-indigo-500 animate-spin" />
          <span className="font-black text-slate-500 tracking-widest text-sm">正在加载音乐...</span>
        </div>
      </div>
    );
  }

  const songCover = currentSong.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop';

  // ===================================================================
  // 主渲染
  // ===================================================================
  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="min-h-screen relative pb-10 flex flex-col">
      {/* ================================================================
          背景层：使用当前歌曲封面，若隐若现
          透明度调高至 30-40%，让背景既能看到封面又不会喧宾夺主
      ================================================================ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-[-10%] bg-cover bg-center transition-all duration-1000 blur-[60px] opacity-40 dark:opacity-30 saturate-150"
          style={{ backgroundImage: `url(${songCover})` }}
        />
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm" />
      </div>

      {/* ================================================================
          主容器
      ================================================================ */}
      <div className="w-full max-w-6xl mx-auto mt-24 md:mt-28 px-4 sm:px-6 md:px-10 relative z-10">
        {/* 标题区 */}
        <div className="animate-fade-in-up mb-6 md:mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest mb-1 md:mb-2 transition-colors duration-700">
            音乐
          </h1>
          <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-medium tracking-wider transition-colors duration-700">
            {isPlaying ? '正在播放' : '已暂停'}
          </p>
        </div>

        {/* ==============================================================
            主布局：左侧播放器（更宽） + 右侧面板
        ============================================================== */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 w-full md:items-stretch md:min-h-[500px]">

          {/* ============================================================
              左侧：播放器（占 7 列，更宽）
          ============================================================ */}
          <div className="md:col-span-7 flex flex-col bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-[32px] shadow-2xl p-6 md:p-10 relative overflow-hidden transition-all duration-500 shrink-0">

            {/* 封面 + 歌曲信息（横向布局） */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
              {/* ===== 方形封面（无圆角，无旋转） ===== */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex-shrink-0 overflow-hidden shadow-2xl rounded-2xl bg-slate-200 dark:bg-slate-700">
                <img
                  src={songCover}
                  alt="cover"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* 歌曲信息 */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white truncate drop-shadow-sm tracking-tight">
                  {currentSong.title}
                </h1>
                <h2 className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 truncate mt-1 md:mt-2 tracking-widest">
                  {currentSong.artist}
                </h2>

                {/* 播放模式标签 */}
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 dark:bg-slate-700/30 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {getPlayModeIcon()}
                  <span>{playMode === 'loop' ? '列表循环' : playMode === 'single' ? '单曲循环' : '随机播放'}</span>
                </div>

                {/* 歌曲序号 */}
                <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {playlist.findIndex(s => s.id === currentSong.id) + 1} / {playlist.length}
                </div>
              </div>
            </div>

            {/* 进度条 + 控制 */}
            <div className="w-full mt-6 md:mt-8 relative z-20">
              {/* 进度条 */}
              <div className="w-full flex flex-col gap-1.5 mb-4 px-1 md:px-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress || 0}
                  onChange={handleSeek}
                  className="w-full h-1.5 md:h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 ${progress}%, rgba(148, 163, 184, 0.3) ${progress}%)`,
                  }}
                />
                <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="w-full flex items-center justify-center gap-4 md:gap-6 px-1 md:px-2">
                <button
                  onClick={togglePlayMode}
                  className="p-2 transition-transform hover:scale-110"
                  title={playMode === 'loop' ? '列表循环' : playMode === 'single' ? '单曲循环' : '随机播放'}
                >
                  {getPlayModeIcon()}
                </button>

                <button
                  onClick={prevSong}
                  className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-transform hover:scale-110"
                >
                  <SkipBack size={24} className="md:w-7 md:h-7" fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-indigo-500 text-white rounded-full hover:scale-105 shadow-xl shadow-indigo-500/40 transition-all"
                >
                  {isPlaying ? (
                    <Pause size={28} className="md:w-8 md:h-8" fill="currentColor" />
                  ) : (
                    <Play size={28} className="md:w-8 md:h-8 ml-1" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={nextSong}
                  className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-transform hover:scale-110"
                >
                  <SkipForward size={24} className="md:w-7 md:h-7" fill="currentColor" />
                </button>

                {/* 音量控制 */}
                <div className="flex items-center" onMouseLeave={() => setShowVolumeSlider(false)}>
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 80, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="hidden md:flex overflow-hidden items-center mr-2 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume || 0}
                          onChange={(e) => setVolume && setVolume(Number(e.target.value))}
                          className="w-16 h-1 appearance-none rounded-full cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #4f46e5 ${(volume || 0) * 100}%, rgba(148, 163, 184, 0.3) ${(volume || 0) * 100}%)`,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    onDoubleClick={toggleMute}
                    className={`p-2 rounded-full transition-all ${
                      showVolumeSlider
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'text-slate-500 hover:text-indigo-500'
                    }`}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={18} className="md:w-5 md:h-5" />
                    ) : (
                      <Volume2 size={18} className="md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              右侧：歌词 / 歌单 面板（占 5 列）
          ============================================================ */}
          <div className="md:col-span-5 flex flex-col bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-[32px] shadow-2xl relative transition-colors duration-700 overflow-hidden h-[450px] md:h-auto shrink-0">
            {/* Tab 切换 */}
            <div className="flex items-center justify-center gap-1 p-1 mt-4 md:mt-6 mx-auto bg-white/50 dark:bg-slate-900/50 rounded-full shadow-inner border border-white/40 w-48 md:w-56 z-20 shrink-0">
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex-1 py-1.5 md:py-2 rounded-full font-black text-xs md:text-sm transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-indigo-500'
                }`}
              >
                歌词
              </button>
              <button
                onClick={() => setActiveTab('playlist')}
                className={`flex-1 py-1.5 md:py-2 rounded-full font-black text-xs md:text-sm transition-all ${
                  activeTab === 'playlist'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-indigo-500'
                }`}
              >
                歌单
              </button>
            </div>

            <div className="flex-1 relative mt-2 flex flex-col overflow-hidden">
              {/* ======== 歌词 Tab ======== */}
              {activeTab === 'lyrics' && (
                <div className="absolute inset-0 flex flex-col h-full animate-in fade-in duration-300">
                  <div className="absolute top-0 left-0 right-0 h-20 md:h-28 bg-gradient-to-b from-white/30 dark:from-slate-800/40 to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-20 md:h-28 bg-gradient-to-t from-white/30 dark:from-slate-800/40 to-transparent z-10 pointer-events-none" />

                  <div
                    ref={lyricContainerRef}
                    className="h-full overflow-y-auto no-scrollbar scroll-smooth relative px-4 md:px-6 lyric-mask-container"
                  >
                    <div className="py-[20vh] md:py-[25vh] flex flex-col gap-3 md:gap-4 text-center lg:px-6">
                      {parsedLyrics.length > 0 ? (
                        parsedLyrics.map((line, index) => {
                          const isActive = index === activeLyricIndex;
                          return (
                            <div
                              key={index}
                              ref={isActive ? activeLyricRef : null}
                              className={`transition-all duration-700 cursor-pointer px-2 md:px-3 rounded-xl ${
                                isActive
                                  ? 'opacity-100 scale-105 py-1.5 md:py-2 bg-white/10'
                                  : 'opacity-30 hover:opacity-60'
                              }`}
                              onClick={() =>
                                duration > 0 &&
                                handleSeek({
                                  target: {
                                    value: String((line.time / duration) * 100),
                                  },
                                } as React.ChangeEvent<HTMLInputElement>)
                              }
                            >
                              <p
                                className={`font-medium tracking-wide leading-relaxed transition-all duration-700 ${
                                  isActive
                                    ? 'text-base md:text-lg text-indigo-600 dark:text-indigo-400 font-bold'
                                    : 'text-sm md:text-base text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {line.text}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="flex flex-col items-center gap-3 md:gap-4">
                            <Disc3 className="animate-spin text-indigo-500/40" size={32} />
                            <p className="text-base md:text-lg font-medium text-indigo-500 animate-pulse">
                              {currentLyric || '正在加载歌词...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======== 歌单 Tab ======== */}
              {activeTab === 'playlist' && (
                <div className="absolute inset-0 px-4 md:px-6 pb-4 md:pb-6 pt-2 md:pt-3 animate-in fade-in duration-300 flex flex-col">
                  {/* 搜索框 */}
                  <div className="relative w-full max-w-xs mx-auto group mb-3 md:mb-4 shrink-0">
                    <Search className="w-4 h-4 md:w-4 md:h-4 absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="搜索歌曲..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 md:h-10 pl-9 md:pl-9 pr-8 md:pr-8 bg-white/30 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-inner transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
                      >
                        <X size={14} className="text-slate-500" />
                      </button>
                    )}
                  </div>

                  {/* 歌单列表 */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1.5 md:gap-2">
                    <AnimatePresence mode="popLayout">
                      {filteredPlaylist.map((song, index) => {
                        const isPlayingThis = song.id === currentSong.id;
                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={song.id || index}
                            onClick={() => playSong(index)}
                            className={`group flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all ${
                              isPlayingThis
                                ? 'bg-indigo-500/20 dark:bg-indigo-500/30 border-l-4 border-indigo-500'
                                : 'hover:bg-white/30 dark:hover:bg-slate-700/40 border-l-4 border-transparent'
                            }`}
                          >
                            {/* 封面缩略图 */}
                            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-lg md:rounded-xl overflow-hidden shadow-sm bg-slate-200 dark:bg-slate-700">
                              <img
                                src={song.cover}
                                alt="cover"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm md:text-[15px] font-medium truncate ${
                                  isPlayingThis
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {song.title}
                              </p>
                              <p className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {song.artist}
                              </p>
                            </div>
                            {isPlayingThis && isPlaying && (
                              <div className="flex items-end gap-[2px] h-3 md:h-4">
                                <span className="w-0.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]" style={{ height: '60%' }} />
                                <span className="w-0.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '100%' }} />
                                <span className="w-0.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_400ms]" style={{ height: '40%' }} />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==============================================================
            播放信息（歌曲信息卡片底部）
        ============================================================== */}
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">播放信息</span>
            <span>演唱 : {currentSong.artist}</span>
            <span>作曲 : {currentSong.artist}</span>
            <span>编曲 : {currentSong.artist}</span>
          </div>
        </div>
      </div>

      {/* ================================================================
          全局样式
      ================================================================ */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .lyric-mask-container {
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
        }

        @keyframes bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
    /* eslint-enable @next/next/no-img-element */
  );
}