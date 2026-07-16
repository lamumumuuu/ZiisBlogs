// components/Sakura.tsx
// =====================================================================
// 功能描述：樱花飘落特效组件
//          40 片粉色花瓣从屏幕顶部随机位置飘落，
//          带有旋转、倾斜和随机速度，循环往复。
//          是 XH 大佬网站的标志性视觉元素之一。
// =====================================================================

"use client";

import { useState } from 'react';

// =====================================================================
// 花瓣类型定义
// =====================================================================
interface Petal {
  id: number;
  left: string;      // 水平起始位置 (0-100%)
  size: number;      // 花瓣大小 (8-20px)
  duration: number;  // 飘落动画时长 (6-14秒)
  delay: number;     // 动画延迟 (-15秒 到 0秒，错开起始位置)
}

// =====================================================================
// Sakura 组件 - 樱花飘落特效
// =====================================================================
export default function Sakura() {
  // ✅ 使用惰性初始化，在组件首次渲染时直接生成花瓣数据
  // 完全避免 useEffect 中的 setState 警告
  const [petals] = useState<Petal[]>(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 8 + Math.random() * 12, // 8px 到 20px
      duration: 6 + Math.random() * 8, // 6s 到 14s
      delay: Math.random() * -15, // -15s 到 0s
    }))
  );

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      {/* ================================================================
          飘落动画关键帧
          - 从屏幕外顶部 (-10vh) 飘到屏幕外底部 (110vh)
          - 水平偏移 15vw，旋转 360°
          - 透明度 0 → 1 → 0
      ================================================================ */}
      <style>{`
        @keyframes sakuraFall {
          0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(15vw, 110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* 渲染每片花瓣 */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 bg-pink-300/70 shadow-[0_0_5px_rgba(255,182,193,0.6)]"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size * 1.2}px`,
            borderRadius: '100% 0 100% 0', // 樱花特有的圆角形状
            animation: `sakuraFall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}