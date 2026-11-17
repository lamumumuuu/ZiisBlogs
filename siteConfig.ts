// siteConfig.ts
// =====================================================================
// 全站基础配置：仅保留网站属性与全局配置（标题、作者、导航、主题、
// 社交、评论、页脚等）。
// 内容数据与演示数据统一放在 data/ 目录：
//   - data/demo/*：开发阶段的模拟/硬编码演示数据（友链、工具、歌单、弹幕、每日一言）
//   - data/temp/*：喜欢但暂时不用的页面/动画文件
// =====================================================================
export const siteConfig = {
  // ==================== 基础信息 ====================
  title: "Ziis",
  description: "这是我用 Next.js 搭建的 Ziis 个人空间，记录开发，代码与技术成长",
  author: "Ziis",
  authorName: "Ziis",
  avatarUrl: "/avatar.jpg",
  bio: "一个在代码和数字之间穿梭的臭咸鱼。正在给开发的BUG修修补补，喜欢折腾感兴趣的技术，偶尔记录下自己的成长。",
  faviconUrl: "/favicon.ico",
  navLogo: "Ziis",
  navTitle: "Ziis",
  navSuffix: "の",
  navAfter: "空间",

  // ==================== 导航菜单 ====================
  navItems: [
    { name: '首页', href: '/' },
    { name: '项目', href: '/projects' },
    { name: '仓库', href: '/repository' },
    // { name: '归档', href: '/timeline' },
    // { name: '照片墙', href: '/photowall' },
    { name: '音乐', href: '/music' },
    { name: '灵境', href: '/lingjing' },
    { name: '说说', href: '/moments' },
    // { name: '杂谈', href: '/chatter' },
    { name: '互联', href: '/link' },
    { name: '关于', href: '/about' },
  ],

  // ==================== 社交链接 ====================
  social: {
    github: "https://github.com/lamumumuuu",
    email: "2563808918@qq.com",
    qq: "2563808918",
  },

  // ==================== 外观配置 ====================
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
  bgImages: [
    "https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg",
    "https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg",
    "https://bu.dusays.com/2026/03/24/69c26fe4d9486.jpg",
  ],

  // ==================== 关于页面封面图 ====================
  aboutCoverImage: "/aboutbackground.jpg",

  // ==================== Gitalk 评论配置 ====================
  gitalkConfig: {
    clientID: "Ov23likzwzy8EZNhhhot",
    clientSecret: "c7724261e5092063c0080b577daa68cc24ae96ef",
    repo: "ZiisBlogs",
    owner: "lamumumuuu",
    admin: ["lamumumuuu"],
  },

  // ==================== 页脚 ====================
  footerText: "© 2026 Ziis Next.js 构建",
};