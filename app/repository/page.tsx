// app/repository/page.tsx
// =====================================================================
// 功能描述：仓库占位页
//          用于后续集中展示项目、代码与作品。
// =====================================================================

import { siteConfig } from '../../siteConfig';

export const metadata = {
  title: '仓库 | ' + siteConfig.title,
  description: '项目与作品的存放点',
};

export default function RepositoryPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <main className="w-[95%] md:w-[90%] max-w-4xl mx-auto mt-24 md:mt-28 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest drop-shadow-sm">
          仓库
        </h1>
        <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-400 font-serif">
          项目、代码与作品的存放点。
        </p>

        <div className="mt-10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-3xl border border-white/30 dark:border-white/10 shadow-lg p-10 md:p-16 text-center">
          <p className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200">
            这里暂时还是空的
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            后续会在这里整理项目、代码与作品。
          </p>
        </div>
      </main>
    </div>
  );
}
