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
    description: '在代码、学术与分子动力学模拟间穿梭的普通人。近期正埋头于 GROMACS 模拟研究与神经网络计算。',
    url: 'https://www.xinghuisama.top/',
    avatar: 'https://bu.dusays.com/2026/03/24/69c1e38ac1846.jpg',
  },


  // 在这里添加更多友链
];