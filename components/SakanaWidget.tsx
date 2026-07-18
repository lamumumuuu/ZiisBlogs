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

  const getCharacterName = (char: Character): string => {
    switch (char) {
      case 'chisato': return '千束';
      case 'takina': return '泷奈';
      case 'my-char': return '自定义';
      default: return char;
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="fixed bottom-4 left-4 z-50"
        style={{ width: 180, height: 230 }}
      />

      {/* ✅ 透明线条风格按钮 */}
      <button
        onClick={switchCharacter}
        className="fixed bottom-36 left-4 z-50 px-3 py-1.5 text-xs font-bold rounded-full 
          bg-transparent 
          border border-white/30 
          text-white/70 
          hover:border-indigo-400 hover:text-indigo-300 
          backdrop-blur-sm 
          transition-all duration-300 hover:scale-105"
      >
        🔄 {getCharacterName(currentChar)}
      </button>
    </>
  );
}