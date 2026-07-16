// components/FriendsClient.tsx
// =====================================================================
// 功能描述：友链页面 - 客户端组件
//          包含"友链/工具"切换视图，展示友链卡片或工具链接卡片。
//          友链卡片显示"在线"状态，工具卡片不显示。
// =====================================================================

"use client";

import { useState } from 'react';
import { friends, Friend } from '../data/friends';
import { tools, Tool } from '../data/tools';
import Image from 'next/image';

// =====================================================================
// 友链卡片子组件（带"在线"状态）
// =====================================================================
function FriendCard({ friend }: { friend: Friend }) {
  return (
    <a
      href={friend.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/60 dark:hover:bg-slate-700/50"
    >
      <div className="flex items-center gap-4">
        {/* 圆形头像 */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/60 dark:border-slate-700/60 shadow-sm bg-white dark:bg-slate-700">
          {friend.avatar ? (
            <Image
              src={friend.avatar}
              alt={friend.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500">
              {friend.name.charAt(0)}
            </div>
          )}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {friend.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {friend.description}
          </p>
        </div>
      </div>

      {/* ===== 底部：在线状态 ===== */}
      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-600 dark:text-green-400">在线</span>
      </div>
    </a>
  );
}

// =====================================================================
// 工具卡片子组件（无"在线"状态）
// =====================================================================
function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/60 dark:hover:bg-slate-700/50"
    >
      <div className="flex items-center gap-4">
        {/* 图标 */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl shadow-inner">
          {tool.icon || '🔧'}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {tool.description}
          </p>
        </div>
      </div>
    </a>
  );
}

// =====================================================================
// FriendsClient 组件
// =====================================================================
export default function FriendsClient() {
  const [activeTab, setActiveTab] = useState<'friends' | 'tools'>('friends');

  const isFriendsTab = activeTab === 'friends';

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      
      {/* ===== 主卡片容器 ===== */}
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700 relative">
        
        {/* ===== 顶部装饰 ===== */}
        <div className="w-full h-32 md:h-40 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
          <div className="absolute top-4 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
          
          {/* ===== 标题 + 页面描述 ===== */}
          <div className="absolute bottom-4 left-6 md:left-10">
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">
              云端引力
            </h1>
            <p className="text-sm md:text-base text-white/80 font-medium mt-1 drop-shadow-md">
              那些散落在赛博宇宙各处的有趣灵魂与神经节点。
            </p>
          </div>
        </div>

        {/* ===== 内容区域 ===== */}
        <div className="px-5 sm:px-8 md:px-12 pb-10 relative">

          {/* ===== 左上角切换按钮 ===== */}
          <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full p-1 border border-white/30 dark:border-white/10 shadow-sm mt-6 mb-6">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'friends'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/30'
              }`}
            >
              友链
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'tools'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/30'
              }`}
            >
              工具
            </button>
          </div>

          {/* ===== 卡片网格 ===== */}
          {isFriendsTab ? (
            // ----- 友链视图：移动端1列，桌面端3列 -----
            friends.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <p className="text-lg font-medium">暂无友链</p>
                <p className="text-sm mt-1">在 data/friends.ts 中添加友链数据</p>
              </div>
            )
          ) : (
            // ----- 工具视图：移动端1列，桌面端3列 -----
            tools.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <p className="text-lg font-medium">暂无工具收藏</p>
                <p className="text-sm mt-1">在 data/tools.ts 中添加工具链接</p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}