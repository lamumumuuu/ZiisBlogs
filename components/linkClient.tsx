// components/FriendsClient.tsx
// =====================================================================
// 功能描述：友链页面 - 客户端组件
//          包含"友链/工具"切换视图，展示友链卡片或工具链接卡片。
//          友链卡片显示"在线"状态，工具卡片不显示。
// =====================================================================

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
// 工具卡片子组件（显示封面图 + Favicon 降级）
// =====================================================================
function ToolCard({ tool }: { tool: Tool }) {
  const [coverError, setCoverError] = useState(false);
  const [iconError, setIconError] = useState(false);

  // 从 URL 提取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const domain = getDomain(tool.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      {/* ===== 封面图 ===== */}
      {tool.cover && !coverError ? (
        <div className="w-full h-32 md:h-40 overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
          <img
            src={tool.cover}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setCoverError(true)}
          />
          {/* 底部渐变遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        // ===== 没有封面图时的降级（显示 Favicon） =====
        <div className="w-full h-32 md:h-40 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/80 dark:bg-slate-700/80 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-600">
            {!iconError ? (
              <img
                src={faviconUrl}
                alt={tool.name}
                className="w-7 h-7 md:w-8 md:h-8 object-contain"
                onError={() => setIconError(true)}
              />
            ) : (
              <span className="text-3xl">{tool.icon || '🔧'}</span>
            )}
          </div>
        </div>
      )}

      {/* ===== 底部信息 ===== */}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {tool.description}
        </p>
      </div>
    </a>
  );
}
// =====================================================================
// Framer Motion 动画变体
// =====================================================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1 }
};

// =====================================================================
// FriendsClient 组件
// =====================================================================
export default function FriendsClient() {
  const [activeTab, setActiveTab] = useState<'friends' | 'tools'>('friends');

  // =================================================================
  // 切换动画处理
  // =================================================================
  const handleTabChange = (tab: 'friends' | 'tools') => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 relative z-10">
      
      {/* ===== 顶部标题区域 ===== */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 标题与副标题 */}
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-widest drop-shadow-sm uppercase">
              云端引力
            </h1>
            <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-serif">
              那些散落在赛博宇宙各处的有趣灵魂与神经节点。
            </p>
          </div>

          {/* ===== 右侧透明切换按钮 ===== */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => handleTabChange('friends')}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'friends'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              友链
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('tools')}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'tools'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              工具
            </motion.button>
          </div>
        </div>
      </div>

      {/* ===== 卡片网格区域（带动画切换） ===== */}
      <AnimatePresence>
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 20 }}
          className="w-full"
        >
          {activeTab === 'friends' ? (
            // ----- 友链视图：移动端2列，桌面端3列 -----
            friends.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.1 }}
                  >
                    <FriendCard friend={friend} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="empty-friends"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-slate-500 dark:text-slate-400"
              >
                <p className="text-lg font-medium">暂无友链</p>
                <p className="text-sm mt-1">在 data/friends.ts 中添加友链数据</p>
              </motion.div>
            )
          ) : (
            // ----- 工具视图：移动端2列，桌面端3列 -----
            tools.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.1 }}
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="empty-tools"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-slate-500 dark:text-slate-400"
              >
                <p className="text-lg font-medium">暂无工具收藏</p>
                <p className="text-sm mt-1">在 data/tools.ts 中添加工具链接</p>
              </motion.div>
            )
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}