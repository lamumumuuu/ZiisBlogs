// app/music/MusicClient.tsx
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

interface LyricLine {
  time: number;
  text: string;
}

function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = 12;
  return (
    <div className="flex items-center justify-center gap-1 h-10 w-full max-w-[200px] mx-auto">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.08;
        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'}`}
            style={{
              height: isPlaying ? '24px' : '6px',
              animation: isPlaying ? `wave ${0.6 + i * 0.05}s ease-in-out ${delay}s infinite alternate` : 'none',
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

  const lyricContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null); // 音量控制区引用
  const [activeTab, setActiveTab] = useState<'lyrics' | 'playlist'>('lyrics');
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 原生事件监听：鼠标悬停调节音量并阻止页面滚动
  useEffect(() => {
    const el = volumeControlRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!setVolume) return;

      const step = 0.05;
      const currentVol = isMuted ? 0 : (volume || 0);
      const newVol = e.deltaY < 0 
        ? Math.min(1, currentVol + step) 
        : Math.max(0, currentVol - step);

      setVolume(newVol);

      if (isMuted && newVol > 0) {
        toggleMute();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [volume, isMuted, setVolume, toggleMute]);

  const parsedLyrics = useMemo((): LyricLine[] => {
    if (!currentSong) return [];
    if (Array.isArray(currentSong.lyrics) && currentSong.lyrics.length > 0) {
      return currentSong.lyrics as LyricLine[];
    }
    return [];
  }, [currentSong]);

  const activeLyricIndex = useMemo(() => {
    if (!parsedLyrics.length) return -1;
    let idx = parsedLyrics.findIndex((l) => l.time > currentTime) - 1;
    if (idx === -2) idx = parsedLyrics.length - 1;
    return Math.max(0, idx);
  }, [currentTime, parsedLyrics]);

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

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const filteredPlaylist = useMemo(() => {
    if (!searchQuery.trim()) return playlist;
    const lowerQuery = searchQuery.toLowerCase();
    return playlist.filter((song) => {
      const title = (song.title || '').toLowerCase();
      const artist = (song.artist || '').toLowerCase();
      return title.includes(lowerQuery) || artist.includes(lowerQuery);
    });
  }, [playlist, searchQuery]);

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

  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="min-h-screen relative pb-10 flex flex-col">
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-20 px-4 sm:px-6 md:px-10 relative z-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6 md:mb-10">
          <div>
            <p className="mb-2 text-sm font-bold text-indigo-600 dark:text-indigo-300">音乐</p>
            <h1 className="text-3xl font-black sm:text-4xl md:text-5xl text-slate-900 dark:text-white transition-colors duration-700">正在播放</h1>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/45 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-200">
            <span className={`h-2.5 w-2.5 rounded-full ${isPlaying ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />
            {isPlaying ? "播放中" : "已暂停"}
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="relative isolate min-h-[640px] overflow-hidden rounded-3xl border border-white/40 bg-white/45 shadow-xl backdrop-blur-xl transition-colors duration-700 dark:border-white/10 dark:bg-slate-800/50">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 saturate-125 dark:opacity-15"
              style={{ backgroundImage: `url(${songCover})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-indigo-100/30 dark:from-slate-900/85 dark:via-slate-900/75 dark:to-indigo-950/45" />

            <div className="relative z-10 flex h-full min-h-[640px] flex-col justify-between p-5 sm:p-7 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  {getPlayModeIcon()}
                  <span>{getPlayModeLabel()}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  {currentIndex} / {totalSongs}
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-8">
                <div className="relative aspect-square w-[min(70vw,340px)]">
                  <motion.div
                    className="relative h-full w-full overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-xl dark:border-white/10 dark:bg-slate-950/40"
                    animate={{ rotateY: isPlaying ? 0 : -5, scale: isPlaying ? 1 : 0.97 }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  >
                    <img src={songCover} alt="cover" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/10" />
                  </motion.div>
                </div>

                <div className="mt-8 w-full text-center">
                  <h2 className="mx-auto max-w-3xl text-balance text-3xl font-black text-slate-900 dark:text-white sm:text-4xl md:text-5xl">{currentSong.title}</h2>
                  <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">{currentSong.artist}</p>
                </div>

                <div className="mt-8 w-full flex justify-center">
                  <AudioVisualizer isPlaying={isPlaying} />
                </div>
              </div>

              <div className="w-full mt-auto relative z-20">
                <div className="w-full flex flex-col gap-1.5 mb-6 md:mb-8 px-1 md:px-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleSeek}
                    className="w-full h-1 md:h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 ${progress}%, rgba(0, 0, 0, 0.15) 0)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between px-1 md:px-2 lg:px-4">
                  <button
                    onClick={togglePlayMode}
                    className="p-2 transition-transform hover:scale-110"
                    title={getPlayModeLabel()}
                  >
                    {getPlayModeIcon()}
                  </button>

                  <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                    <button
                      onClick={prevSong}
                      className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-transform hover:scale-110"
                    >
                      <SkipBack size={24} className="md:w-7 md:h-7" fill="currentColor" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center bg-indigo-500 text-white rounded-full hover:scale-105 shadow-xl shadow-indigo-500/40"
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
                  </div>

                  {/* 音量控制区域（应用了 ref 监听原生 wheel 事件） */}
                  <div 
                    ref={volumeControlRef}
                    className="flex items-center" 
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
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
                              background: `linear-gradient(to right, #4f46e5 ${(volume || 0) * 100}%, rgba(0, 0, 0, 0.15) 0)`,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      onDoubleClick={toggleMute}
                      className={`p-2 rounded-full transition-all ${showVolumeSlider
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
          </article>

          <aside className="flex min-h-[560px] flex-col rounded-3xl border border-white/40 bg-white/45 shadow-xl backdrop-blur-xl transition-colors duration-700 dark:border-white/10 dark:bg-slate-800/50">
            <div className="flex items-center justify-between p-4 md:p-5 pb-0">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">播放信息</span>
              <div className="flex gap-1 bg-white/50 dark:bg-slate-900/50 rounded-full p-0.5 border border-white/30 dark:border-white/10">
                <button
                  onClick={() => setActiveTab('lyrics')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeTab === 'lyrics'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-indigo-500'
                    }`}
                >
                  歌词
                </button>
                <button
                  onClick={() => setActiveTab('playlist')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeTab === 'playlist'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-indigo-500'
                    }`}
                >
                  歌单
                </button>
              </div>
            </div>

            <div className="flex-1 relative mt-2 flex flex-col overflow-hidden px-4 pb-4">
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
                              className={`transition-all duration-700 cursor-pointer px-2 rounded-xl ${isActive
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
                                className={`font-medium leading-relaxed transition-all duration-700 ${isActive
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

              {activeTab === 'playlist' && (
                <div className="absolute inset-0 px-2 pb-4 pt-2 animate-in fade-in duration-300 flex flex-col">
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
                            className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${isPlayingThis
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
                                className={`text-sm font-medium truncate ${isPlayingThis
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
          </aside>
        </section>
      </div>

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