// app/music/MusicClient.tsx
// =====================================================================
// 修改内容：
// 1. 标题上移（mt-16 md:mt-20）
// 2. 右上角添加播放状态指示器（灰点/绿点 + 已暂停/播放中）
// 3. 左右卡片比例调整为 8:4（1:2）
// 4. 左侧卡片背景使用封面图片（模糊透明）
// 5. 左侧卡片左上角显示播放模式，右上角显示 第X首/共Y首
// 6. 封面居中放大，下方歌名，再下方作者，再下方音频波浪
// 7. 删除底部播放信息区块
// 8. 右侧卡片左上角显示"播放信息"，右上角为歌词/歌单切换按钮
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
// 音频可视化组件（纯 CSS 动画，无 impure 调用）
// =====================================================================
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = 12;
  return (
    <div className="flex items-center justify-center gap-1 h-10 w-full max-w-[200px] mx-auto">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.08;
        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'
            }`}
            style={{
              height: isPlaying ? '24px' : '6px',
              animation: isPlaying ? `wave ${0.6 + i * 0.05}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes wave {
          0% { height: 8px; }
          100% { height: 32px; }
        }
      `}</style>
    </div>
  );
}

// =====================================================================
// MusicClient 组件
// =====================================================================
export default function MusicClient() {
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
  // 播放模式图标和文字
  // ===================================================================
  const getPlayModeLabel = () => {
    switch (playMode) {
      case 'loop': return '列表循环';
      case 'single': return '单曲循环';
      case 'random': return '随机播放';
      default: return '列表循环';
    }
  };
  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'loop': return <Repeat size={16} />;
      case 'single': return <RefreshCcw size={16} />;
      case 'random': return <Shuffle size={16} />;
      default: return <Repeat size={16} />;
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
  const currentIndex = playlist.findIndex(s => s.id === currentSong.id) + 1;
  const totalSongs = playlist.length;

  // ===================================================================
  // 主渲染
  // ===================================================================
  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="min-h-screen relative pb-10 flex flex-col">
      {/* ================================================================
          背景层：使用当前歌曲封面，若隐若现
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
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-20 px-4 sm:px-6 md:px-10 relative z-10">
        {/* 标题区 + 状态指示器 */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest transition-colors duration-700">
              音乐
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-slate-600 dark:text-slate-300">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span>{isPlaying ? '播放中' : '已暂停'}</span>
          </div>
        </div>

        {/* ==============================================================
            主布局：左侧播放器（8列） + 右侧面板（4列）
        ============================================================== */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 w-full md:items-stretch md:min-h-[500px]">

          {/* ============================================================
              左侧：播放器（占 8 列，更大）
          ============================================================ */}
          <div
            className="md:col-span-8 flex flex-col backdrop-blur-md border border-white/40 dark:border-white/10 rounded-[32px] shadow-2xl p-6 md:p-10 relative overflow-hidden transition-all duration-500"
            style={{
              background: `url(${songCover}) center/cover`,
            }}
          >
            {/* 背景遮罩（让内容可读） */}
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm z-0" />

            {/* 内容（z-10） */}
            <div className="relative z-10 flex-1 flex flex-col">

              {/* 左上角：播放模式，右上角：序号 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  {getPlayModeIcon()}
                  <span>{getPlayModeLabel()}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  {currentIndex} / {totalSongs}
                </div>
              </div>

              {/* 封面居中 */}
              <div className="flex flex-col items-center justify-center flex-1 py-4">
                <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-700">
                  <img
                    src={songCover}
                    alt="cover"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 歌名 */}
                <h2 className="mt-4 text-xl md:text-2xl font-black text-slate-900 dark:text-white text-center truncate max-w-full">
                  {currentSong.title}
                </h2>
                {/* 作者 */}
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 text-center truncate max-w-full">
                  {currentSong.artist}
                </p>

                {/* 音频波浪可视化 */}
                <div className="mt-4 w-full flex justify-center">
                  <AudioVisualizer isPlaying={isPlaying} />
                </div>
              </div>

              {/* 进度条 + 控制（底部） */}
              <div className="mt-auto pt-4">
                <div className="w-full flex flex-col gap-1.5 mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 ${progress}%, rgba(148, 163, 184, 0.3) ${progress}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="w-full flex items-center justify-center gap-4 md:gap-6">
                  <button
                    onClick={togglePlayMode}
                    className="p-2 transition-transform hover:scale-110"
                    title={getPlayModeLabel()}
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
          </div>

          {/* ============================================================
              右侧：歌词 / 歌单 面板（占 4 列）
          ============================================================ */}
          <div className="md:col-span-4 flex flex-col bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-[32px] shadow-2xl relative transition-colors duration-700 overflow-hidden h-[450px] md:h-auto shrink-0">
            {/* 面板头部：左上角“播放信息”，右上角切换按钮 */}
            <div className="flex items-center justify-between p-4 md:p-5 pb-0">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">播放信息</span>
              <div className="flex gap-1 bg-white/50 dark:bg-slate-900/50 rounded-full p-0.5 border border-white/30 dark:border-white/10">
                <button
                  onClick={() => setActiveTab('lyrics')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'lyrics'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-slate-500 hover:text-indigo-500'
                  }`}
                >
                  歌词
                </button>
                <button
                  onClick={() => setActiveTab('playlist')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'playlist'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-slate-500 hover:text-indigo-500'
                  }`}
                >
                  歌单
                </button>
              </div>
            </div>

            <div className="flex-1 relative mt-2 flex flex-col overflow-hidden px-4 pb-4">
              {/* ======== 歌词 Tab ======== */}
              {activeTab === 'lyrics' && (
                <div className="absolute inset-0 flex flex-col h-full animate-in fade-in duration-300 px-4 pt-2 pb-4">
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 dark:from-slate-800/40 to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 dark:from-slate-800/40 to-transparent z-10 pointer-events-none" />

                  <div
                    ref={lyricContainerRef}
                    className="h-full overflow-y-auto no-scrollbar scroll-smooth relative px-2 lyric-mask-container"
                  >
                    <div className="py-[15vh] flex flex-col gap-2 md:gap-3 text-center">
                      {parsedLyrics.length > 0 ? (
                        parsedLyrics.map((line, index) => {
                          const isActive = index === activeLyricIndex;
                          return (
                            <div
                              key={index}
                              ref={isActive ? activeLyricRef : null}
                              className={`transition-all duration-700 cursor-pointer px-2 rounded-xl ${
                                isActive
                                  ? 'opacity-100 scale-105 py-1 bg-white/10'
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
                                className={`font-medium leading-relaxed transition-all duration-700 ${
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
                          <div className="flex flex-col items-center gap-3">
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
                <div className="absolute inset-0 px-2 pb-4 pt-2 animate-in fade-in duration-300 flex flex-col">
                  {/* 搜索框 */}
                  <div className="relative w-full max-w-xs mx-auto group mb-3 shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="搜索歌曲..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-8 bg-white/30 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-inner transition-all"
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

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1.5">
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
                            className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                              isPlayingThis
                                ? 'bg-indigo-500/20 dark:bg-indigo-500/30 border-l-4 border-indigo-500'
                                : 'hover:bg-white/30 dark:hover:bg-slate-700/40 border-l-4 border-transparent'
                            }`}
                          >
                            <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden shadow-sm bg-slate-200 dark:bg-slate-700">
                              <img
                                src={song.cover}
                                alt="cover"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isPlayingThis
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {song.title}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {song.artist}
                              </p>
                            </div>
                            {isPlayingThis && isPlaying && (
                              <div className="flex items-end gap-[2px] h-3">
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