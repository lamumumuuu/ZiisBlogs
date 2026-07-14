// app/page.tsx
import { siteConfig } from "../siteConfig";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* 头像 */}
      {siteConfig.avatarUrl && (
        <Image
          src={siteConfig.avatarUrl}
          alt={siteConfig.author}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover"
        />
      )}
      
      {/* 标题 */}
      <h1 className="mt-4 text-3xl font-bold">
        {siteConfig.title}
      </h1>
      
      {/* 描述 */}
      <p className="mt-2 text-gray-600">
        {siteConfig.description}
      </p>
    </div>
  );
}