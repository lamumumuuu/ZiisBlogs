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
  icon?: string; // 可选图标
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'SVG 图标库',
    description: '开源免费的 SVG 图标集合',
    url: 'https://icones.js.org/',
  },
  {
    id: '2',
    name: 'Tailwind CSS',
    description: '实用优先的 CSS 框架',
    url: 'https://tailwindcss.com/',
  },
  {
    id: '3',
    name: 'Next.js 文档',
    description: 'React 框架的官方文档',
    url: 'https://nextjs.org/docs',
  },
  {
    id: '4',
    name: 'Unsplash',
    description: '免费高清图片素材库',
    url: 'https://unsplash.com/',
  },
  {
    id: '5',
    name: 'Framer Motion',
    description: 'React 动画库',
    url: 'https://www.framer.com/motion/',
  },
  // 在这里添加更多工具链接
];