# data/demo —— 开发演示数据目录（Agent 开发指南）

## 一、目录用途

`data/demo` 专门存放**开发阶段的模拟数据与硬编码数据**，用于在真实接口、数据库或内容尚未接入时，让页面可以正常渲染和调试。

典型内容：

- 假播放列表、假评论、假文章、假用户等模拟动态数据
- 从旧版本迁移过来的硬编码文案、ID、配置项
- 用于演示 UI 状态的占位数据（空状态、加载态、长列表等）

**不要**把以下内容放在这里：

- 全站基础属性与全局配置（标题、作者、导航、主题、社交、Gitalk、页脚）→ 放在根目录 `siteConfig.ts`
- 已接入真实接口/数据库的正式数据 → 放在 `data/` 根目录
- 密钥、Token、真实用户隐私数据 → 禁止入库
- React 组件、业务逻辑、工具函数 → 放在 `components/` 或对应模块（仅暂存作品例外，见 `data/temp`）

## 二、当前文件

| 文件 | 导出 | 用途 | 使用方 |
| --- | --- | --- | --- |
| `music.ts` | `cloudMusicIds` | 网易云歌单 ID，演示音乐播放列表 | `components/music/MusicProvider.tsx` |
| `danmaku.ts` | `danmakuList`、`fallbackDanmakuTexts` | 桌面端背景弹幕文案及空列表兜底 | `components/background/DanmakuBackground.tsx` |
| `quotes.ts` | `dailyQuotes`、`DailyQuote` | 首页「每日一言」随机文案 | `components/pages/home/HeroBanner.tsx` |
| `friends.ts` | `friends`、`Friend` | 硬编码友链数据 | `components/pages/link/LinkClient.tsx` |
| `tools.ts` | `tools`、`Tool` | 硬编码工具收藏数据 | 工具视图已移除，数据暂存保留 |

### 相关暂存目录：`data/temp`

`data/temp` 用于存放喜欢但暂时不用的页面/动画文件（例如 `WaterDrop.tsx`）。这些文件不参与站点运行，也不被任何页面引用；需要复用时再移回 `components/` 并补充引用。

## 三、组织与命名规则

1. 一个业务主题一个文件，文件名使用小驼峰，例如 `blogPosts.ts`、`guestbook.ts`。
2. 数据量变大或需要多种模拟场景时，在本目录下建立**子文件夹**，例如：
   ```
   data/demo/
   ├── blog/
   │   ├── posts.ts
   │   └── tags.ts
   └── moments/
       └── list.ts
   ```
3. 每个文件必须导出**带类型**的常量，禁止 `export default`，便于统一检索和重构：
   ```ts
   export interface DemoPost {
     id: string;
     title: string;
   }

   export const demoPosts: DemoPost[] = [
     { id: '1', title: '示例文章' },
   ];
   ```
4. 文件顶部保留一段注释，说明：数据性质（模拟/硬编码）、使用位置、何时应删除或替换。
5. 只存放数据与类型，不要写 `fetch`、`useEffect` 或组件逻辑。

## 四、引用方式

在组件中引用演示数据（优先使用 `@/*` 别名）：

```ts
import { cloudMusicIds } from '@/data/demo/music';
import { dailyQuotes } from '@/data/demo/quotes';
```

也可根据文件层级使用相对路径，例如从 `components/pages/home/` 引用：

```ts
import { dailyQuotes } from '../../../data/demo/quotes';
```

## 五、AI 辅助开发规范

新增或修改演示数据时，按以下流程执行：

1. **先检索引用**：用关键词搜索 `data/demo` 及要修改的导出名，确认所有使用方。
2. **判断归属**：
   - 全站基础配置 → `siteConfig.ts`
   - 硬编码数据、模拟数据、暂未接入真实来源的内容 → `data/demo`（必要时建子文件夹）
   - 后续接入真实接口/数据库的正式数据 → `data/` 根目录
   - 喜欢但暂时不用的页面/动画文件 → `data/temp`
3. **保持类型完整**：新增数据结构时同步导出 `interface` 或 `type`，禁止使用 `any`。
4. **同步更新本文件**：在「当前文件」表格中登记新增文件及其使用方。
5. **真实数据接入后清理**：当接口或数据库已提供真实数据时，删除对应的 demo 数据文件，并删除所有引用，避免出现两份数据源。
6. **清理时保留白名单**：`app/about/简历.md`、`app/about/about.md`、`gitpush.py` 以及 `data/` 目录属于保留内容，不得删除。
7. **验证**：修改后运行以下命令，确保没有类型错误和构建错误：
   ```bash
   npx tsc --noEmit
   npm run build
   ```

## 六、与 siteConfig 的边界

`siteConfig.ts` 只保留网站的「基本属性与全局配置」：

- 站点标题、描述、作者、头像、简介、favicon
- 导航菜单、社交链接、主题色、背景图
- 关于页封面、Gitalk 评论配置、页脚文案

任何会随内容更新、可被接口替换、或仅用于开发演示的数据，都不应再写回 `siteConfig.ts`。
