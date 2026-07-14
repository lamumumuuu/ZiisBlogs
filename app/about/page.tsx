// app/about/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

// 引入高亮主题
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';

import AboutClient from '../../components/AboutClient';  // ✅ 去掉 .tsx
import { siteConfig } from '../../siteConfig';
import { Suspense } from 'react';

export default async function AboutPage() {
  const fullPath = path.join(process.cwd(), 'app', 'about', 'about.md');
  let contentHtml = '<p>博主很懒，还没有写自我介绍哦...</p>';
  let coverImage = siteConfig.aboutCoverImage || 'https://bu.dusays.com/2026/03/24/69c23dc278c78.jpg';

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
const parsed = matter(fileContents);
const { data } = parsed;
let content = parsed.content;    if (data.cover) coverImage = data.cover;

    // 文本预清洗
    content = content.replace(/^```\s*$/gm, '```cpp');
    content = content.replace(/^(\s*\d+)\.([^ \n])/gm, '$1. $2');

    content = content.replace(/\r\n/g, '\n').replace(/^[ \t]+$/gm, '');
    const blocks = content.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g);
    content = blocks.map((block, index) => {
      if (index % 2 === 1) return block;
      return block.replace(/\n{3,}/g, (match) => {
        const brCount = match.length - 2;
        return '\n\n' + '<br>'.repeat(brCount) + '\n\n';
      });
    }).join('');

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight, {
        detect: true,
        ignoreMissing: true,
        subset: ['cpp', 'c', 'python', 'java', 'javascript', 'typescript', 'go', 'rust', 'bash', 'json', 'html', 'css', 'sql', 'xml']
      })
      .use(rehypeKatex)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);

    contentHtml = processedContent.toString();
  } catch (e) {
    console.error('读取 about.md 失败', e);
  }

  return (
    <div className="min-h-screen relative pb-20">
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500 font-bold animate-pulse">正在载入档案...</div>}>
        <AboutClient
          contentHtml={contentHtml}
          coverImage={coverImage}
          author={siteConfig.author}
          avatarUrl={siteConfig.avatarUrl}
          social={siteConfig.social}
        />
      </Suspense>
    </div>
  );
}