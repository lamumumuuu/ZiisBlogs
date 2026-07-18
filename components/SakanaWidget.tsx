// components/SakanaWidget.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import SakanaWidget from 'sakana-widget';

type Character = 'chisato' | 'takina' | 'my-char';

export default function SakanaWidgetComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<InstanceType<typeof SakanaWidget> | null>(null);
  const [currentChar, setCurrentChar] = useState<Character>('takina');

  const characterList: Character[] = ['chisato', 'takina', 'my-char'];

  const getNextCharacter = (current: Character): Character => {
    const index = characterList.indexOf(current);
    return characterList[(index + 1) % characterList.length];
  };

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const chisato = SakanaWidget.getCharacter('chisato');
      if (chisato) {
        chisato.image = '/images/超时空辉夜姬酒寄彩叶.webp';
        SakanaWidget.registerCharacter('my-char', chisato);
      }
    } catch (e) {
      console.warn('自定义角色注册失败', e);
    }

    widgetRef.current = new SakanaWidget({
      character: currentChar,
      size: 180,
      controls: true,
      rod: true,
      draggable: true,
      autoFit: false,
    });

    widgetRef.current.mount(containerRef.current);

    return () => {
      widgetRef.current?.unmount();
    };
  }, [currentChar]);

  const switchCharacter = () => {
    const nextChar = getNextCharacter(currentChar);
    setCurrentChar(nextChar);
  };

  return (
    <>
      {/* 看板娘 - 紧贴底部，没有任何间距 */}
      <div
        ref={containerRef}
        className="fixed bottom-0 left-4 z-50"
        style={{ width: 180, height: 230 }}
      />

      {/* 切换按钮 - 位于看板娘正上方 */}
      <button
        onClick={switchCharacter}
        className="fixed left-4 z-50 p-2 rounded-full 
          bg-transparent 
          border border-white/25 
          text-white/50 
          hover:border-white/60 hover:text-white/80 
          backdrop-blur-sm 
          transition-all duration-300 hover:scale-110"
        style={{ bottom: '230px' }}
        aria-label="切换角色"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/>
        </svg>
      </button>
    </>
  );
}