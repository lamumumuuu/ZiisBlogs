"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import 'gitalk/dist/gitalk.css';
import Gitalk from 'gitalk';
import { MessageCircleOff } from 'lucide-react';

import { siteConfig } from '../siteConfig';

// 检查 Gitalk 配置是否有效（排除占位符和空值）
const isGitalkConfigValid = () => {
  const { clientID, clientSecret } = siteConfig.gitalkConfig;
  const placeholderPattern = /你的|请填写|placeholder|todo|xxx|example/i;
  return (
    clientID &&
    clientSecret &&
    !placeholderPattern.test(clientID) &&
    !placeholderPattern.test(clientSecret) &&
    clientID.length > 10 &&
    clientSecret.length > 10
  );
};

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const configValid = isGitalkConfigValid();

  useEffect(() => {
    if (!containerRef.current || !configValid) return;

    containerRef.current.innerHTML = '';

    const gitalk = new Gitalk({
      clientID: siteConfig.gitalkConfig.clientID,
      clientSecret: siteConfig.gitalkConfig.clientSecret,
      repo: siteConfig.gitalkConfig.repo,
      owner: siteConfig.gitalkConfig.owner,
      admin: siteConfig.gitalkConfig.admin,
      proxy: '/api/github',
      id: encodeURIComponent(pathname.replace(/\/$/, '') || '/').substring(0, 49),
      title: document.title || 'Comments',
      distractionFreeMode: false,
    });

    gitalk.render(containerRef.current);

    // 移除 URL 中的 code 参数（GitHub OAuth 回调后）
    const url = new URL(window.location.href);
    if (url.searchParams.has('code')) {
      url.searchParams.delete('code');
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [pathname, configValid]);

  return (
    <div className="w-full mt-16 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>

      {!configValid ? (
        <div className="relative z-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/30 dark:border-white/10">
            <MessageCircleOff size={40} className="text-slate-400 dark:text-slate-500 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium text-center">
              评论功能暂未启用
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 text-center">
              请在 siteConfig.ts 中配置 Gitalk 的 clientID 和 clientSecret
            </p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="relative z-10 custom-gitalk-glass pt-6 border-t border-slate-200/50 dark:border-slate-700/50" />
      )}

      <style jsx global>{`
        .custom-gitalk-glass .gt-container .gt-header-textarea {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 16px !important;
          color: inherit !important;
          transition: all 0.3s ease;
        }
        .custom-gitalk-glass .gt-container .gt-header-textarea:focus {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: #6366f1 !important;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3) !important;
        }
        .custom-gitalk-glass .gt-container .gt-header-preview {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 16px !important;
        }
        .custom-gitalk-glass .gt-container .gt-btn {
          background: #6366f1 !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
          transition: transform 0.2s, box-shadow 0.2s;
          color: white !important;
        }
        .custom-gitalk-glass .gt-container .gt-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6) !important;
        }
        .custom-gitalk-glass .gt-container .gt-comment-content {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
        }
        .custom-gitalk-glass .gt-container .gt-comment-admin .gt-comment-content {
          border-color: rgba(99, 102, 241, 0.3) !important;
        }
        .custom-gitalk-glass .gt-container .gt-avatar {
          border-radius: 50% !important;
          overflow: hidden;
        }
        .custom-gitalk-glass .gt-container .gt-comment-body {
          color: inherit !important;
        }
        .custom-gitalk-glass .gt-container a {
          color: #6366f1 !important;
        }
      `}</style>
    </div>
  );
}