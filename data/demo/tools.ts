// data/demo/tools.ts
// =====================================================================
// 性质：硬编码演示数据（工具收藏）
// 使用方：工具视图已移除，数据暂存保留，后续可复用
// =====================================================================
// 数据格式示例：
// {
//   id: '唯一标识',
//   name: '工具名称',
//   description: '工具描述',
//   url: 'https://example.com',
//   icon: '可选图标（降级备用）',
//   cover: '可选封面图 URL',
// }
// =====================================================================

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon?: string;      // 可选图标（降级备用）
  cover?: string;     // 👈 新增：封面图 URL
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'SVG 图标库',
    description: '开源免费的 SVG 图标集合',
    url: 'https://icones.js.org/',
    cover: 'https://icones.js.org/og-image.png',
  },
  {
    id: '2',
    name: 'Tailwind CSS',
    description: '实用优先的 CSS 框架',
    url: 'https://tailwindcss.com/',
    cover: 'https://tailwindcss.com/_next/static/media/twitter-card.4e6b3e3f.jpg',
  },
  {
    id: '3',
    name: 'Next.js 文档',
    description: 'React 框架的官方文档',
    url: 'https://nextjs.org/docs',
    cover: 'https://nextjs.org/static/twitter-cards/home.jpg',
  },
  {
    id: '4',
    name: 'Unsplash',
    description: '免费高清图片素材库',
    url: 'https://unsplash.com/',
    cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=630&fit=crop',
  },
  {
    id: '5',
    name: 'Framer Motion',
    description: 'React 动画库',
    url: 'https://www.framer.com/motion/',
    cover: 'https://www.framer.com/images/og/motion.png',
  },
];