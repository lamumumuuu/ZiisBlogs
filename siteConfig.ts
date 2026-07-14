// siteConfig.ts
export const siteConfig = {
  // ==================== 基础信息 ====================
  title: "领域展开のZiis",
  description: "这是我用 Next.js 搭建的个人小站，施工中...",
  author: "Ziis",
  authorName: "Ziis",
  avatarUrl: "/avatar.jpg",
  faviconUrl: "/favicon.ico",
  navLogo: "Ziis",
  navTitle: "Ziis",
  navSuffix: "の",
  navAfter: "领域",

  // ==================== 导航菜单 ====================
  navItems: [
    { name: "首页", href: "/" },
    { name: "音乐", href: "/music" },
    { name: "灵境", href: "/lingjing" },
    { name: "友链", href: "/friends" },
    { name: "关于", href: "/about" },
  ],

  // ==================== 社交链接 ====================
  social: {
    github: "https://github.com/lamumumuuu",
    email: "2563808918@qq.com",
    qq: "2563808918",
  },


  // ==================== 关于页面配置 ====================
  aboutCoverImage: "https://bu.dusays.com/2026/03/24/69c23dc278c78.jpg", // 关于页面封面图

  
  // ==================== 外观配置 ====================
  useGradient: false,
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
  bgImages: [
    "https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg",
    "https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg",
    "https://bu.dusays.com/2026/03/24/69c26fe4d9486.jpg",
  ],

  // ==================== 音乐配置 ====================
  cloudMusicIds: ["1809646618", "3361076230", "1859390262"],

  // ==================== Gitalk 评论配置 ====================
  gitalkConfig: {
    clientID: "Ov23likzwzy8EZNhhhot",
    clientSecret: "c7724261e5092063c0080b577daa68cc24ae96ef",
    repo: "ZiisBlogs",
    owner: "lamumumuuu",
    admin: ["lamumumuuu"],
  },

  // ==================== 页脚 ====================
  footerText: "© 2026 Ziis. 用 ❤️ 和 Next.js 构建",
};
