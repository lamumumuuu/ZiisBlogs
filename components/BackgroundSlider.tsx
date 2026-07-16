// components/BackgroundSlider.tsx
// =====================================================================
// 功能描述：背景图片轮播组件
//          支持多张图片自动切换，带淡入淡出过渡效果。
//          使用 transform-gpu 启用 GPU 加速，提升动画性能。
//          使用 visibility 控制不可见图层的渲染，减少浏览器开销。
// =====================================================================

"use client";

import { useState, useEffect } from 'react';
import { siteConfig } from '../siteConfig';

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = siteConfig.bgImages || [];

  // ===================================================================
  // 自动轮播：每 10 秒切换一张图片
  // ===================================================================
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [images.length]);

  // 如果没有图片，不渲染
  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {images.map((img, index) => {
        // 判断当前图片是否应该可见：
        // - 当前索引的图片：可见
        // - 相邻的图片（前一张或后一张）：可见（为了过渡平滑）
        // - 其他图片：隐藏（减少渲染压力）
        const isVisible = Math.abs(index - currentIndex) <= 1;
        // 处理边界情况：最后一张和第一张相邻（循环轮播）
        const isVisibleLoop =
          images.length > 2 &&
          ((currentIndex === 0 && index === images.length - 1) ||
           (currentIndex === images.length - 1 && index === 0));

        return (
          <div
            key={img}
            // =============================================================
            // 优化点说明：
            // 1. transform-gpu：启用 GPU 加速，让过渡动画更流畅
            // 2. transition-opacity duration-[2000ms]：2 秒淡入淡出过渡
            // 3. visibility：隐藏不可见的图片，减少浏览器合成层开销
            // =============================================================
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out transform-gpu"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              // 当前图片透明度为 1，其他为 0
              opacity: index === currentIndex ? 1 : 0,
              // 只有当前图片和相邻图片可见，其他隐藏以提升性能
              visibility: isVisible || isVisibleLoop ? 'visible' : 'hidden',
            }}
          />
        );
      })}
    </div>
  );
}