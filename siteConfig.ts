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

  // ==================== 关于页面 ====================
  about: {
    greeting: "👋 你好，欢迎来到我的小世界！",
    intro: "我是 **Ziis**，一个在代码和数字之间穿梭的臭咸鱼。近期正埋头于 **Web 项目的基础学习**，喜欢折腾各种有趣的技术，偶尔也会写写博客记录自己的成长。",
    sections: [
      {
        title: "💻 技术栈",
        icon: "💻",
        items: [
          { label: "前端", desc: "Next.js, Html, CSS" },
          { label: "后端", desc: "Node.js, Cpp" },
          { label: "工具", desc: "VSCode, Git, Trae" },
        ],
      },
      {
        title: "🎮 兴趣与日常",
        icon: "🎮",
        items: [
          { label: "游戏", desc: "喜欢 **开放世界** 和 **RPG** 游戏" },
          { label: "动漫", desc: "日常追番，喜欢 **日常** 和 **治愈** 类型" },
          { label: "学习", desc: "正在努力提升 **全栈开发** 能力" },
        ],
      },
      {
        title: "📫 联系方式",
        icon: "📫",
        items: [
          { label: "GitHub", desc: "[lamumumuuu](https://github.com/lamumumuuu)" },
          { label: "邮箱", desc: "2563808918@qq.com" },
          { label: "QQ", desc: "2563808918" },
        ],
      },
    ],
    closing: '"路漫漫其修远兮，吾将上下而求索。" —— 让我们一起在代码的世界里成长吧！',
  },

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
