'use client';

import { siteConfig } from "../../siteConfig";
import Image from "next/image";
import { Mail, MessageCircle, Heart } from "lucide-react";
import Comments from '../../components/Comments';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export default function AboutPage() {
  const { about, avatarUrl, author, social } = siteConfig;

  const socialLinks = [
    { href: social.github, icon: <GithubIcon size={20} />, name: "GitHub" },
    { href: `mailto:${social.email}`, icon: <Mail size={20} />, name: "Email" },
    { href: `tencent://message/?uin=${social.qq}`, icon: <MessageCircle size={20} />, name: "QQ" },
  ].filter((item) => item.href);

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold text-indigo-600 dark:text-indigo-300">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700 relative">
        
        <div className="w-full h-32 md:h-40 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          
          <div className="absolute top-4 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="px-5 sm:px-8 md:px-12 pb-8 relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden -mt-10 md:-mt-12 relative z-20 bg-white mx-auto">
            <Image
              src={avatarUrl}
              alt={author}
              width={100}
              height={100}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-700">关于我</h1>
            <p className="text-sm md:text-base text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase">Hello World, I&apos;m {author}</p>
            {/* 因为 ' 在 JSX 中可能被误解为属性值的结束或字符串的边界。虽然大多数情况下 React 能正确渲染，但 ESLint 会建议使用对应的 HTML 实体：&apos; */}
          </div>

          <div className="mt-5 flex justify-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 backdrop-blur-md border border-white/30 hover:scale-110 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <div className="w-full h-px bg-slate-300/50 dark:bg-slate-700 mt-6 mb-6"></div>

          <article className="space-y-6">
            <section>
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Heart size={18} className="text-red-400" /> 个人简介
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300 text-sm md:text-base">
                你好，我是 {author}。{renderBold(about.intro)}
              </p>
            </section>

            {about.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white">
                  {section.icon} {section.title}
                </h2>
                <ul className="mt-2 space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label} className="flex gap-2 text-slate-600 dark:text-slate-300 text-sm md:text-base">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>
                        <strong className="font-semibold text-slate-800 dark:text-white">{item.label}：</strong>
                        {renderBold(item.desc)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <p className="mt-6 text-center text-slate-500 dark:text-slate-400 italic text-sm md:text-base">
              {about.closing}
            </p>

            <Comments />
          </article>
        </div>
      </div>
    </div>
  );
}