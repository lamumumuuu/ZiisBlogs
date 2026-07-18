// components/SakanaWidget.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import SakanaWidget from 'sakana-widget';

// 角色类型：两个内置 + 三个自定义
type Character = 'chisato' | 'takina' | '酒寄彩叶1' | '酒寄彩叶2' | '酒寄彩叶3';

export default function SakanaWidgetComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<InstanceType<typeof SakanaWidget> | null>(null);
  const [currentChar, setCurrentChar] = useState<Character>('酒寄彩叶1');

  // 角色循环列表（按顺序切换）
  const characterList: Character[] = ['酒寄彩叶1', '酒寄彩叶2', '酒寄彩叶3', 'chisato', 'takina'];

  const getNextCharacter = (current: Character): Character => {
    const index = characterList.indexOf(current);
    return characterList[(index + 1) % characterList.length];
  };

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // ---------- 注册三个自定义角色，共用千束的物理模板 ----------
      const template = SakanaWidget.getCharacter('chisato');
      if (template) {
        // 酒寄彩叶1
        const char1 = { ...template };
        char1.image = '/酒寄彩叶1.webp';
        SakanaWidget.registerCharacter('酒寄彩叶1', char1);

        // 酒寄彩叶2
        const char2 = { ...template };
        char2.image = '/酒寄彩叶2.jpg';
        SakanaWidget.registerCharacter('酒寄彩叶2', char2);

        // 酒寄彩叶3
        const char3 = { ...template };
        char3.image = '/酒寄彩叶3.webp';
        SakanaWidget.registerCharacter('酒寄彩叶3', char3);
      } else {
        console.warn('千束模板获取失败，无法注册自定义角色');
      }
    } catch (e) {
      console.warn('自定义角色注册失败', e);
    }

    // ---------- 创建 Widget ----------
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

  // ---------- 切换角色 ----------
  const switchCharacter = () => {
    const nextChar = getNextCharacter(currentChar);
    setCurrentChar(nextChar);
  };

  // ---------- 获取角色显示名称（用于按钮） ----------
  const getDisplayName = (char: Character): string => {
    switch (char) {
      case 'chisato': return '千束';
      case 'takina': return '泷奈';
      case '酒寄彩叶1': return '彩叶①';
      case '酒寄彩叶2': return '彩叶②';
      case '酒寄彩叶3': return '彩叶③';
      default: return char;
    }
  };

  return (
    <>
      {/* 看板娘容器 - 紧贴底部 */}
      <div
        ref={containerRef}
        className="fixed bottom-0 left-4 z-50"
        style={{ width: 180, height: 230 }}
      />
    </>
  );
}