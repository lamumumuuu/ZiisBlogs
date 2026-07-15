// =====================================================================
// 文件位置注释
// =====================================================================
// 主文件夹路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs
// 当前文件路径：c:\Users\admin\Desktop\新建文件夹\Ziis3.0\ZiisBlogs\app\music\page.tsx
// 文件类型：Next.js App Router 页面组件（音乐页面）
// 功能描述：音乐页面，展示播放列表和播放器控制。
//          与首页 CloudPlayer 共享播放状态（通过 MusicProvider），
//          跨页面导航时音乐播放不中断。
// =====================================================================

"use client";

import { useMusic } from '../../components/MusicProvider';
import { useState } from 'react';
import Image from 'next/image';

// =====================================================================
// 时间格式化工具函数
// =====================================================================
const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "00:00";
  const m = Math.floor(time / 60).toString().padStart(2, '0');
  const s = Math.floor(time % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// =====================================================================
// MusicPage 组件 - 音乐页面
// =====================================================================
// 功能说明：
//   1. 显示当前播放歌曲的大封面和详细信息
//   2. 完整的播放控制（播放/暂停、上一首/下一首、进度条、音量）
//   3. 播放模式切换（列表循环/单曲循环/随机播放）
//   4. 播放列表展示，点击切换歌曲
//   5. 与首页共享播放状态，跨页面不中断
//
// 设计思路：
//   - 使用 useMusic() Hook 获取全局音乐状态
//   - 所有状态与首页 CloudPlayer 同步
//   - 大封面旋转效果，播放时旋转
//   - 播放列表支持滚动，当前播放歌曲高亮
//   - 音量控制和静音切换
// =====================================================================
export default function MusicPage() {
  const {
    playlist,
    currentIndex,
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentLyric,
    isLoading,
    volume,
    isMuted,
    playMode,
    togglePlay,
    nextSong,
    prevSong,
    handleSeek,
    playSong,
    setVolume,
    toggleMute,
    togglePlayMode,
  } = useMusic();

  const [showPlaylist, setShowPlaylist] = useState(true);

  // 播放模式图标和文字
  const getPlayModeInfo = () => {
    switch (playMode) {
      case 'loop':
        return { icon: '🔁', label: '列表循环' };
      case 'single':
        return { icon: '🔂', label: '单曲循环' };
      case 'random':
        return { icon: '🔀', label: '随机播放' };
      default:
        return { icon: '🔁', label: '列表循环' };
    }
  };

  const playModeInfo = getPlayModeInfo();

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      {/* 自定义滑块样式 */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>

      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700 relative">
        
        {/* 顶部装饰 */}
        <div className="w-full h-48 md:h-64 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          <div className="absolute top-4 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          
          {/* 标题 */}
          <div className="absolute bottom-6 left-6 md:left-10">
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">
              🎵 音乐
            </h1>
            <p className="text-sm md:text-base text-white/80 font-bold mt-1">
              {playlist.length} 首歌曲 · {playModeInfo.label}
            </p>
          </div>
        </div>

        <div className="px-5 sm:px-8 md:px-12 pb-10 relative">
          
          {/* 加载状态 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-slate-500 font-bold">正在连接云端音乐...</span>
            </div>
          )}

          {/* 无音乐状态 */}
          {!isLoading && playlist.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">暂无音乐</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">请在 siteConfig.ts 中配置 cloudMusicIds</p>
            </div>
          )}

          {/* 播放器主体 */}
          {!isLoading && playlist.length > 0 && currentSong && (
            <div className="flex flex-col lg:flex-row gap-8 -mt-16 relative z-10">
              
              {/* ============================================================= */}
              {/* 左侧：大封面 + 控制                                             */}
              {/* ============================================================= */}
              <div className="flex-shrink-0 w-full lg:w-72 flex flex-col items-center">
                {/* 旋转大封面 */}
                <div
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-white/50 shadow-2xl overflow-hidden relative"
                  style={{
                    animation: `spin 10s linear infinite`,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                >
                  <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full border-2 border-gray-300 shadow-inner"></div>
                </div>

                {/* 歌曲信息 */}
                <div className="text-center mt-6 w-full">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate">
                    {currentSong.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    {currentSong.artist}
                  </p>
                </div>

                {/* 当前歌词 */}
                <div className="mt-4 h-6 text-center">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-xs">
                    {currentLyric}
                  </p>
                </div>

                {/* 进度条 */}
                <div className="w-full mt-4">
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="flex-1 h-1.5 bg-white/40 dark:bg-slate-700/50 rounded-full appearance-none outline-none cursor-pointer shadow-inner"
                      style={{
                        background: `linear-gradient(to right, #818cf8 ${progress}%, rgba(148,163,184,0.4) ${progress}%)`,
                      }}
                    />
                    <span className="w-10">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* 控制按钮 */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  {/* 播放模式 */}
                  <button
                    onClick={togglePlayMode}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors text-lg"
                    title={playModeInfo.label}
                  >
                    {playModeInfo.icon}
                  </button>

                  {/* 上一首 */}
                  <button
                    onClick={prevSong}
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>

                  {/* 播放/暂停 */}
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all border-4 border-white/50 dark:border-slate-600"
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  {/* 下一首 */}
                  <button
                    onClick={nextSong}
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                  </button>

                  {/* 音量 */}
                  <button
                    onClick={toggleMute}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors text-lg"
                    title={isMuted ? '取消静音' : '静音'}
                  >
                    {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </button>
                </div>

                {/* 音量滑块 */}
                <div className="w-full mt-4 flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-8">音量</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume * 100}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    className="flex-1 h-1 bg-white/40 dark:bg-slate-700/50 rounded-full appearance-none outline-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #818cf8 ${isMuted ? 0 : volume * 100}%, rgba(148,163,184,0.4) ${isMuted ? 0 : volume * 100}%)`,
                    }}
                  />
                </div>
              </div>

              {/* ============================================================= */}
              {/* 右侧：播放列表                                                   */}
              {/* ============================================================= */}
              <div className="flex-1 min-h-0">
                {/* 播放列表标题 */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">
                    播放列表
                  </h3>
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="text-sm text-indigo-500 font-bold hover:text-indigo-600 transition-colors"
                  >
                    {showPlaylist ? '收起' : '展开'}
                  </button>
                </div>

                {/* 歌曲列表 */}
                {showPlaylist && (
                  <div className="bg-white/30 dark:bg-slate-900/30 rounded-2xl border border-white/40 dark:border-white/5 overflow-hidden max-h-80 overflow-y-auto">
                    {playlist.map((song, index) => {
                      const isActive = index === currentIndex;
                      return (
                        <div
                          key={song.id}
                          onClick={() => playSong(index)}
                          className={`
                            flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors
                            ${isActive
                              ? 'bg-indigo-500/20 dark:bg-indigo-500/30 border-l-4 border-indigo-500'
                              : 'hover:bg-white/40 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
                            }
                            ${index !== playlist.length - 1 ? 'border-b border-white/30 dark:border-white/5' : ''}
                          `}
                        >
                          {/* 序号/播放动画 */}
                          <div className="w-6 text-center">
                            {isActive && isPlaying ? (
                              <div className="flex items-end justify-center gap-[2px] h-4">
                                <div className="w-[3px] bg-indigo-500 rounded-t animate-pulse" style={{ height: '60%' }}></div>
                                <div className="w-[3px] bg-indigo-500 rounded-t animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }}></div>
                                <div className="w-[3px] bg-indigo-500 rounded-t animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }}></div>
                              </div>
                            ) : (
                              <span className={`text-sm font-bold ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* 封面 */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            <img
                              src={song.cover}
                              alt={song.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* 歌曲信息 */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold truncate text-sm ${
                              isActive
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {song.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {song.artist}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
