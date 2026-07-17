// app/lingjing/page.tsx
// =====================================================================
// 功能描述：灵境 · 三体水滴飞行模拟
//          水滴作为全屏背景，标题浮在表面
// =====================================================================

import WaterDrop from "../../components/WaterDrop";
import { siteConfig } from "../../siteConfig";

export default function LingjingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* 水滴作为背景层 */}
      <div className="absolute inset-0 z-0">
        <WaterDrop className="w-full h-full" />
      </div>

      {/* 内容浮在背景之上 */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* 标题 */}
        <h1 className="text-4xl md:text-6xl font-black text-white/90 drop-shadow-lg tracking-widest">
          灵境
        </h1>
        <p className="mt-3 text-sm md:text-base text-white/60 font-medium tracking-wider">
          三体 · 强互作用力宇宙探测器
        </p>
        <p className="mt-6 text-xs text-white/30 font-mono tracking-widest">
         拖拽旋转 · 滚轮缩放
        </p>
        
        {/* 底部信息 */}
        <p className="absolute bottom-6 text-xs text-white/20 font-mono tracking-widest">
          {siteConfig.footerText || `© ${new Date().getFullYear()} ${siteConfig.author}`}
        </p>
      </div>
    </div>
  );
}