// components/SakanaWidget.tsx
"use client";

import { useEffect, useRef } from 'react';
import SakanaWidget from 'sakana-widget';

// 角色类型：系统内置 + 自定义
type Character = 'chisato' | 'takina' | '酒寄彩叶3';

// 默认初始角色为千束
const DEFAULT_CHARACTER: Character = 'chisato';

// 双击切换的角色列表
const CHARACTERS: Character[] = ['chisato', 'takina', '酒寄彩叶3'];

export default function SakanaWidgetComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 创建非 React 管理的挂载点，防止卸载时 removeChild 报错
    const mountPoint = document.createElement('div');
    mountPoint.style.width = '100%';
    mountPoint.style.height = '100%';
    container.appendChild(mountPoint);

    let widget: InstanceType<typeof SakanaWidget> | null = null;

    try {
      // 仅注册保留的自定义角色（酒寄彩叶3）
      const template = SakanaWidget.getCharacter('chisato');
      if (template) {
        const char3 = { ...template, image: '/酒寄彩叶3.webp' };
        SakanaWidget.registerCharacter('酒寄彩叶3', char3);
      }
    } catch (e) {
      // 忽略注册失败
    }

    try {
      // 从缓存读取角色，若无则使用默认千束
      const savedCharacter = localStorage.getItem('sakana-character') as Character;
      const initialChar = CHARACTERS.includes(savedCharacter) ? savedCharacter : DEFAULT_CHARACTER;

      widget = new SakanaWidget({
        character: initialChar,
        size: 500,
        controls: false,
        rod: true,
        draggable: true,
        autoFit: false,
      });
      widget.mount(mountPoint);

      let currentIndex = CHARACTERS.indexOf(initialChar);
      
      const handleDoubleClick = () => {
        if (!widget) return;
        currentIndex = (currentIndex + 1) % CHARACTERS.length;
        const nextChar = CHARACTERS[currentIndex];
        
        widget.setCharacter(nextChar);
        localStorage.setItem('sakana-character', nextChar);
      };

      container.addEventListener('dblclick', handleDoubleClick);

      return () => {
        container.removeEventListener('dblclick', handleDoubleClick);
        try {
          widget?.unmount();
        } catch (e) {
          // 忽略卸载失败
        }
        container.replaceChildren();
      };

    } catch (e) {
      widget = null;
      return () => container.replaceChildren();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 z-50 cursor-pointer"
      title="双击切换角色"
      style={{ width: 180, height: 500 }}
    />
  );
}