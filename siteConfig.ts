// siteConfig.ts
export const siteConfig = {
  // ==================== 基础信息 ====================
  title: "Ziis",
  description: "这是我用 Next.js 搭建的个人小站，施工中...",
  author: "Ziis",
  authorName: "Ziis",
  avatarUrl: "/avatar.jpg",
  bio: "一个在代码和数字之间穿梭的臭咸鱼。近期正埋头于Web 项目的基础学习，喜欢折腾各种有趣的技术，偶尔记录下自己的成长。",
  faviconUrl: "/favicon.ico",
  navLogo: "Ziis",
  navTitle: "Ziis",
  navSuffix: "の",
  navAfter: "领域",

  // ==================== 导航菜单 ====================
  navItems: [
    { name: '首页', href: '/' },
    // { name: '项目', href: '/projects' },
    // { name: '归档', href: '/timeline' },
    // { name: '照片墙', href: '/photowall' },
    { name: '音乐', href: '/music' },
    { name: '灵境', href: '/lingjing' },
    // { name: '说说', href: '/moments' },
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

  // ==================== 音乐配置 ====================
  cloudMusicIds: [
    "3340112781",
    "3340112782",
    "3340113698",
    "3340112784",
    "3340107499",
    "3340105619",
    "3340113701",
    "3340114785",
    "3340114786",
    "3340107497",
    //超时空辉夜姬10首
  ],

  // ==================== 弹幕配置 ====================
  danmakuList: [
    '在干嘛呢？',
    '有笨蛋嘛？',
    '前方高能反应！',
    'Bug 跑起来了吗？',
    '呜呜呜呜呜',
    '熬夜修仙中......',
    'BUG 修复进度 99%',
    '今天背单词了吗？',
    'AI大人再让我跑一下吧！QAQ',
    '写算法中',
    '睡大觉中',
    '到底在干嘛？',
    '代码写完了吗？',
    '摸鱼中...',
    '今天也要加油鸭！',
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