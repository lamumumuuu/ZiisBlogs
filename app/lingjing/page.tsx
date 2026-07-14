// app/lingjing/page.tsx
import { siteConfig } from "../../siteConfig";

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
              施工中 🚧
            </p>
          </div>

          {/* ===== 分隔线 ===== */}
          <div className="w-full h-px bg-slate-300/50 dark:bg-slate-700 mt-6 mb-6"></div>

          {/* ===== 占位内容 ===== */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">页面正在建设中</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">敬请期待更多精彩内容...</p>
          </div>

          {/* ===== 页脚信息 ===== */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {siteConfig.footerText || `© ${new Date().getFullYear()} ${siteConfig.author}. 用 ❤️ 和 Next.js 构建`}
          </p>
        </div>
      </div>
    </div>
  );
}