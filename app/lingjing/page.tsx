// app/lingjing/page.tsx
import { siteConfig } from "../../siteConfig";
import ThreeBodyParticles from "../../components/ThreeBodyParticles";

export default function LingjingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700 relative">
        
        {/* ===== 顶部装饰区域 ===== */}
        <div className="w-full h-32 md:h-40 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          <div className="absolute top-4 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* ===== 内容区域 ===== */}
        <div className="px-5 sm:px-8 md:px-12 pb-8 relative">
          
          {/* ===== 标题 ===== */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              ✨ 灵境
            </h1>
            <p className="text-sm md:text-base text-indigo-600 dark:text-indigo-400 font-bold tracking-wider">
              三体粒子特效展示
            </p>
          </div>

          {/* ===== 分隔线 ===== */}
          <div className="w-full h-px bg-slate-300/50 dark:bg-slate-700 mt-6 mb-6"></div>

          {/* ===== 三体粒子特效展示 ===== */}
          <div className="mb-6">
            <ThreeBodyParticles />
          </div>

          {/* ===== 说明文字 ===== */}
          <div className="text-center text-slate-500 dark:text-slate-400 text-sm space-y-1">
            <p>默认形态：水滴 · 强互作用力宇宙探测器</p>
            <p>悬停形态：自然选择号 · 恒星级战舰</p>
          </div>

          {/* ===== 页脚信息 ===== */}
          <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            {siteConfig.footerText || `© ${new Date().getFullYear()} ${siteConfig.author}. 用 ❤️ 和 Next.js 构建`}
          </p>
        </div>
      </div>
    </div>
  );
}