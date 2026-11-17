// data/demo/friends.ts
// =====================================================================
// 性质：硬编码演示数据（友链）
// 使用方：components/pages/link/LinkClient.tsx
// =====================================================================
// 数据格式示例：
// {
//   id: '唯一标识',
//   name: '站点名称',
//   description: '站点描述',
//   url: 'https://example.com',
//   avatar: 'https://example.com/avatar.jpg',
// }
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