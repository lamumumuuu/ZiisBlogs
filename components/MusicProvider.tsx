// =====================================================================
// 文件位置注释
// =====================================================================
// 主文件夹路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs
// 当前文件路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs\components\MusicProvider.tsx
// 文件类型：React Context Provider 组件（客户端组件）
// 功能描述：全局音乐播放器状态管理，通过 React Context 提供
//          播放列表、当前歌曲、播放状态、进度控制等功能。
//          放置在根 layout 中，实现跨页面音乐播放不中断。
// =====================================================================

"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { siteConfig } from '../siteConfig';

// =====================================================================
// 类型定义区域
// =====================================================================

// 播放模式：列表循环 / 单曲循环 / 随机播放
type PlayMode = 'loop' | 'single' | 'random';

// 歌曲信息接口
interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  src: string;
  lrcUrl?: string | null;
  lyrics: { time: number; text: string }[];
}

// Music Context 类型定义
interface MusicContextType {
  // ---- 状态 ----
  playlist: Song[];           // 播放列表
  currentIndex: number;       // 当前歌曲索引
  currentSong: Song | null;   // 当前播放的歌曲
  isPlaying: boolean;         // 是否正在播放
  progress: number;           // 播放进度（百分比 0-100）
  currentTime: number;        // 当前播放时间（秒）
  duration: number;           // 歌曲总时长（秒）
  currentLyric: string;       // 当前歌词
  isLoading: boolean;         // 是否正在加载
  volume: number;             // 音量（0-1）
  isMuted: boolean;           // 是否静音
  playMode: PlayMode;         // 播放模式

  // ---- 方法 ----
  togglePlay: () => void;     // 播放/暂停切换
  nextSong: () => void;       // 下一首
  prevSong: () => void;       // 上一首
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void; // 进度拖动
  playSong: (index: number) => void;     // 播放指定索引的歌曲
  setVolume: (value: number) => void;    // 设置音量
  toggleMute: () => void;                // 静音切换
  togglePlayMode: () => void;            // 切换播放模式
}

// API 返回的原始歌曲数据类型
interface RawSong {
  id: string;
  name: string;
  artist?: string;
  author?: string;
  cover?: string;
  pic?: string;
  url: string;
  lrc?: string;
  error?: string;
}

// =====================================================================
// LRC 歌词解析函数
// =====================================================================
// 功能：将 LRC 格式的歌词文本解析为 { time, text } 数组
// 算法：
//   1. 按行分割歌词
//   2. 用正则匹配时间标签 [mm:ss.xx]
//   3. 将时间转换为秒数
//   4. 按时间排序
// 参数：lrcText - LRC 格式的歌词字符串
// 返回值：{ time: number; text: string }[] 按时间升序排列的歌词数组
// =====================================================================
function parseLrc(lrcText: string): { time: number; text: string }[] {
  if (!lrcText || lrcText.length > 30000) return [];

  const lines = lrcText.split(/\r?\n/);
  const result: { time: number; text: string }[] = [];

  for (const line of lines) {
    // 匹配时间标签，支持 [mm:ss] 和 [mm:ss.xx] 格式
    const matches = [...line.matchAll(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g)];
    if (matches.length > 0) {
      // 移除所有时间标签，获取纯文本
      const text = line.replace(/\[\d{2,}:\d{2}(?:\.\d{2,3})?\]/g, '').trim();
      // 清除控制字符和零宽字符
      const cleanText = text.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "");

      if (cleanText) {
        // 支持同一行多个时间标签（如 [00:12.00][00:25.00]重复歌词）
        for (const match of matches) {
          const min = parseInt(match[1]);
          const sec = parseInt(match[2]);
          const ms = match[3] ? parseInt(match[3]) : 0;
          // 毫秒位数可能是 2 位或 3 位
          const divisor = match[3] && match[3].length === 3 ? 1000 : 100;
          const time = min * 60 + sec + ms / divisor;
          result.push({ time, text: cleanText });
        }
      }
    }
  }

  // 按时间升序排序
  return result.sort((a, b) => a.time - b.time);
}

// =====================================================================
// 创建 Music Context
// =====================================================================
const MusicContext = createContext<MusicContextType | null>(null);

// =====================================================================
// MusicProvider 组件 - 全局音乐状态提供者
// =====================================================================
// 设计思路：
//   - 使用 React Context 管理全局音乐状态
//   - audio 元素放在 Provider 最外层，跨页面导航时不会销毁
//   - 所有页面共享同一个播放状态
//   - 支持播放/暂停、切歌、进度控制、音量控制、播放模式切换
//
// 注意：必须放在根 layout 中包裹所有页面，才能实现跨页面播放不中断
// =====================================================================
export function MusicProvider({ children }: { children: ReactNode }) {
  // ===================================================================
  // 状态定义
  // ===================================================================
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [currentLyric, setCurrentLyric] = useState("正在连接高可用神经云端...");
  // 根据是否配置音乐 ID 来设置初始加载状态，避免在 effect 中直接设置
  const [isLoading, setIsLoading] = useState(() => (siteConfig.cloudMusicIds?.length ?? 0) > 0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('loop');

  // audio 元素引用
  const audioRef = useRef<HTMLAudioElement>(null);

  // ===================================================================
  // 1. 初始化：获取播放列表数据
  // ===================================================================
  // 设计：在组件挂载时从 /api/music 获取音乐数据
  // 使用 isMounted 标志防止组件卸载后更新状态导致内存泄漏
  // ===================================================================
  useEffect(() => {
    let isMounted = true;

    const fetchMusicData = async () => {
      try {
        // 调用音乐 API 获取歌单详情
        const res = await fetch(`/api/music?ids=${siteConfig.cloudMusicIds.join(',')}`);
        const rawResults = await res.json();

        // 数据清洗和格式化
        const mergedPlaylist = rawResults
          .filter((song: RawSong) => song && song.url && !song.error)
          .map((song: RawSong) => ({
            id: song.id || Math.random().toString(),
            title: song.name || '未知歌曲',
            artist: song.artist || song.author || '未知歌手',
            cover: song.cover || song.pic || 'https://bu.dusays.com/2026/03/24/69c24230a5ff8.jpg',
            src: song.url,
            lrcUrl: null,
            lyrics: song.lrc ? parseLrc(song.lrc) : []
          }));

        if (isMounted) {
          if (mergedPlaylist.length > 0) {
            setPlaylist(mergedPlaylist);
          } else {
            setCurrentLyric("云端链路受阻");
          }
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setCurrentLyric("网络初始化失败");
          setIsLoading(false);
        }
      }
    };

    // 只有配置了音乐 ID 才请求
    if (siteConfig.cloudMusicIds?.length > 0) {
      fetchMusicData();
    }
    // 否则保持 isLoading 为 false（已在 useState 初始化时设置）

    return () => { isMounted = false; };
  }, []);

  // ===================================================================
  // 2. 歌曲切换时的处理
  // ===================================================================
  // 功能：
  //   - 重置歌词状态
  //   - 加载新歌曲的歌词
  //   - 如果正在播放，自动播放新歌曲
  // 依赖：currentIndex 和 playlist（避免无限循环）
  // ===================================================================
  useEffect(() => {
    if (playlist.length === 0) return;

    let isMounted = true;
    const currentSong = playlist[currentIndex];

    // 重置歌词（必要的状态重置，使用 eslint 忽略）
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLyrics([]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentLyric("♪ 正在缓冲 ♪");

    // 加载歌词
    if (currentSong.lyrics && currentSong.lyrics.length > 0) {
      if (isMounted) {
        setLyrics(currentSong.lyrics);
        setCurrentLyric(currentSong.lyrics[0]?.text || "♪ 纯享音乐 ♪");
      }
    } else if (currentSong.lrcUrl) {
      // 如果有 lrcUrl，动态获取
      fetch(currentSong.lrcUrl)
        .then(res => res.text())
        .then(text => {
          if (isMounted) {
            const parsed = parseLrc(text);
            setLyrics(parsed);
            // 缓存歌词到 playlist，避免重复请求
            setPlaylist(prev => {
              const newPlaylist = [...prev];
              newPlaylist[currentIndex].lyrics = parsed;
              return newPlaylist;
            });
          }
        })
        .catch(() => {
          if (isMounted) setCurrentLyric("♪ 纯享音乐 ♪");
        });
    }

    // 自动播放（如果之前在播放）
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    }

    return () => { isMounted = false; };
    // 注意：这里故意不包含 isPlaying，因为它由用户操作触发，不应在切换歌曲时被覆盖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, playlist]);

  // ===================================================================
  // 3. 音量同步
  // ===================================================================
  // 当音量或静音状态改变时，同步到 audio 元素
  // ===================================================================
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // ===================================================================
  // 播放控制方法
  // ===================================================================

  // 播放/暂停切换
  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // 下一首
  const nextSong = useCallback(() => {
    if (playMode === 'random') {
      // 随机播放：随机选择一首
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
    } else {
      // 列表循环：索引 +1，到末尾回到开头
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
  }, [playMode, playlist.length]);

  // 上一首
  const prevSong = useCallback(() => {
    if (playMode === 'random') {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
    } else {
      // 列表循环：索引 -1，到开头回到末尾
      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  }, [playMode, playlist.length]);

  // 播放指定索引的歌曲
  const playSong = useCallback((index: number) => {
    setCurrentIndex(index);
    if (!isPlaying) setIsPlaying(true);
  }, [isPlaying]);

  // ===================================================================
  // 进度更新和歌词同步
  // ===================================================================
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime: ct, duration: dur } = audioRef.current;
      setCurrentTime(ct);
      setDuration(dur || 0);
      setProgress((ct / (dur || 1)) * 100);

      // 歌词同步：找到当前时间对应的最新一句歌词
      if (lyrics.length > 0) {
        const activeLyric = lyrics.slice().reverse().find(l => ct >= l.time);
        if (activeLyric && activeLyric.text !== currentLyric) {
          setCurrentLyric(activeLyric.text);
        }
      }
    }
  };

  // ===================================================================
  // 歌曲结束处理
  // ===================================================================
  // 根据播放模式决定下一首行为：
  //   - single：单曲循环，重头播放
  //   - loop/random：调用 nextSong
  // ===================================================================
  const handleEnded = () => {
    if (playMode === 'single' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextSong();
    }
  };

  // 进度拖动处理
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  // 音量设置
  const setVolume = (val: number) => {
    setVolumeState(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  // 静音切换
  const toggleMute = () => setIsMuted(!isMuted);

  // 播放模式切换：loop → single → random → loop
  const togglePlayMode = () => {
    setPlayMode(prev => {
      if (prev === 'loop') return 'single';
      if (prev === 'single') return 'random';
      return 'loop';
    });
  };

  // 当前歌曲
  const currentSong = playlist[currentIndex] || null;

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <MusicContext.Provider value={{
      // 状态
      playlist, currentIndex, currentSong, isPlaying, progress,
      currentTime, duration, currentLyric, isLoading,
      volume, isMuted, playMode,
      // 方法
      togglePlay, nextSong, prevSong, handleSeek,
      playSong, setVolume, toggleMute, togglePlayMode
    }}>
      {children}
      {/*
        关键：audio 元素放在 Provider 最外层
        跨页面导航时，Provider 不会卸载，所以音频播放不会中断
      */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
        />
      )}
    </MusicContext.Provider>
  );
}

// =====================================================================
// useMusic Hook - 便捷访问 Music Context
// =====================================================================
// 使用方式：
//   const { currentSong, isPlaying, togglePlay } = useMusic();
// 注意：只能在 MusicProvider 包裹的组件中使用
// =====================================================================
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};