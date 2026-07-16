// data/friends.ts
// =====================================================================
// 功能描述：友链数据，包含网站名称、描述、链接和头像。
//          可在此添加或删除友链。
// =====================================================================

export interface Friend {
  id: string;
  name: string;
  description: string;
  url: string;
  avatar: string;
}

export const friends: Friend[] = [
  {
    id: '1',
    name: 'XingHuiSama',
    description: '在代码和数字之间穿梭的臭咸鱼',
    url: 'https://www.xinghuisama.top/',
    avatar: 'https://www.xinghuisama.top/avatar.jpg',
  },
  {
    id: '2',
    name: '示例友链A',
    description: '一个有趣的技术博客',
    url: 'https://example-a.com/',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=a',
  },
  {
    id: '3',
    name: '示例友链B',
    description: '分享创意与灵感',
    url: 'https://example-b.com/',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b',
  },
  // 在这里添加更多友链
];