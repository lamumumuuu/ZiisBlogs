// data/tools.ts
// =====================================================================
// 功能描述：收藏的工具/网站链接，在"工具"视图中展示。
//          可在此添加或删除工具链接。
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