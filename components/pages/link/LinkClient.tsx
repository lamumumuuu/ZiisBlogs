// 区域：互联页
// 功能：友链列表展示，读取 data/demo/friends.ts
// 路径：根目录/com/pages/link/此文件
// =====================================================================
// 文件类型：React 客户端组件
// 功能描述：友链页面客户端组件，展示友链卡片与在线状态。
//          工具视图已移除，仅保留友链展示。
// =====================================================================

"use client";

import { motion } from 'framer-motion';
import { friends, Friend } from '../../../data/demo/friends';
import Image from 'next/image';

// =====================================================================
// 友链卡片子组件（带“在线”状态）
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
// LinkClient 组件
// =====================================================================
export default function LinkClient() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 relative z-10">

      {/* ===== 顶部标题区域 ===== */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-widest drop-shadow-sm uppercase">
          云端引力
        </h1>
        <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-serif">
          那些散落在赛博宇宙各处的有趣灵魂与神经节点。
        </p>
      </div>

      {/* ===== 友链卡片网格 ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        {friends.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: index * 0.1 }}
              >
                <FriendCard friend={friend} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium">暂无友链</p>
            <p className="text-sm mt-1">在 data/demo/friends.ts 中添加友链数据</p>
          </div>
        )}
      </motion.div>

    </div>
  );
}
