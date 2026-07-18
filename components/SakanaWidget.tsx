// components/SakanaWidget.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import SakanaWidget from 'sakana-widget';

type Character = 'chisato' | 'takina' | '酒寄彩叶';

export default function SakanaWidgetComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<InstanceType<typeof SakanaWidget> | null>(null);
  const [currentChar, setCurrentChar] = useState<Character>('takina');

  const characterList: Character[] = ['chisato', 'takina', '酒寄彩叶'];

  const getNextCharacter = (current: Character): Character => {
    const index = characterList.indexOf(current);
    return characterList[(index + 1) % characterList.length];
  };

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const chisato = SakanaWidget.getCharacter('chisato');
      if (chisato) {
        chisato.image = '/酒寄彩叶.webp';
        SakanaWidget.registerCharacter('酒寄彩叶', chisato);
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
    </>
  );
}