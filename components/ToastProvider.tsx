//components\ToastProvider.tsx
// 文件类型：React Context Provider 组件（客户端组件）
// 功能描述：全局 Toast 提示组件，通过 React Context 提供
//          showToast 方法，用于在页面任何位置显示消息提示。
//          支持成功、错误、信息三种类型，自动消失。
// =====================================================================

"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// =====================================================================
// 类型定义区域
// =====================================================================

// Toast 类型：成功 / 错误 / 信息
type ToastType = 'success' | 'error' | 'info';

// 单条 Toast 数据
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Toast Context 类型
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

// =====================================================================
// 创建 Toast Context
// =====================================================================
const ToastContext = createContext<ToastContextType | null>(null);

// =====================================================================
// ToastProvider 组件 - 全局 Toast 提供者
// =====================================================================
// 设计思路：
//   - 使用 React Context 管理全局 Toast 队列
//   - 支持多条 Toast 同时显示，自动从上到下排列
//   - 每条 Toast 3 秒后自动消失
//   - 支持 success / error / info 三种类型，对应不同颜色
//
// 使用方式：
//   const { showToast } = useToast();
//   showToast('操作成功', 'success');
// =====================================================================
export function ToastProvider({ children }: { children: ReactNode }) {
  // Toast 队列
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ===================================================================
  // 显示 Toast
  // ===================================================================
  // 参数：
  //   - message: 提示消息内容
  //   - type: 类型（success / error / info），默认为 info
  // 逻辑：
  //   1. 生成唯一 ID
  //   2. 添加到 Toast 队列末尾
  //   3. 3 秒后自动移除
  // ===================================================================
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);

    // 添加到队列
    setToasts(prev => [...prev, { id, message, type }]);

    // 3 秒后自动移除
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // ===================================================================
  // 根据类型获取样式
  // ===================================================================
  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-400';
      case 'error':
        return 'bg-red-500/90 text-white border-red-400';
      case 'info':
      default:
        return 'bg-indigo-500/90 text-white border-indigo-400';
    }
  };

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/*
        Toast 容器：
        - 固定在页面顶部居中
        - z-index 设置很高，确保在最上层
        - 支持多条 Toast 垂直排列
      */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md
              border border-white/30 font-bold text-sm
              animate-[slideDown_0.3s_ease-out]
              pointer-events-auto
              ${getTypeStyles(toast.type)}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* 动画关键帧：从上向下滑入 */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// =====================================================================
// useToast Hook - 便捷访问 Toast Context
// =====================================================================
// 使用方式：
//   const { showToast } = useToast();
// 注意：只能在 ToastProvider 包裹的组件中使用
// =====================================================================
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
