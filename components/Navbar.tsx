"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '../siteConfig';

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // ✅ 修正：使用 navItems，并提供空数组作为后备
  const navLinks = siteConfig.navItems || [];
  const mobileNavLinks = navLinks.filter(link => link.href !== '/lingjing');

  return (
    <>
      <header className={`hidden md:block w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${showNav ? 'translate-y-0' : '-translate-y-full'} bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-white/5 shadow-sm`}>
        <div className="w-[90%] max-w-6xl mx-auto h-16 flex items-center justify-between px-4 sm:px-[30px] box-border">
          <Link href="/" className="text-xl font-black text-slate-800 dark:text-white tracking-tighter hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300">
            {siteConfig.navTitle || siteConfig.authorName}
            <span className="text-indigo-500 mx-1">{siteConfig.navSuffix || 'の'}</span>
            {siteConfig.navAfter || '宝藏之地'}
          </Link>
          <nav className="flex gap-8 text-sm font-bold">
            {navLinks.map((link: { name: string; href: string }) => {
              const isActive = pathname === link.href || pathname === `${link.href}/`;
              return (
                <Link key={link.href} href={link.href} className={`relative py-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600'}`}>
                  {link.name}
                  {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`fixed top-4 right-4 w-12 h-12 bg-indigo-500/80 backdrop-blur-xl rounded-full shadow-lg z-[60] flex flex-col items-center justify-center gap-1.5 ${isMobileMenuOpen ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
        >
          <div className="w-5 h-0.5 bg-white rounded"></div>
          <div className="w-5 h-0.5 bg-white rounded"></div>
          <div className="w-5 h-0.5 bg-white rounded"></div>
        </button>

        {isMobileMenuOpen && (
          <>
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[65]"
            />
            <div className="fixed top-0 left-0 right-0 bottom-0 z-[70] bg-slate-900/90 backdrop-blur-xl pt-12 px-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl"
              >
                ✕
              </button>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link: { name: string; href: string }) => {
                  const isActive = pathname === link.href || pathname === `${link.href}/`;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3 px-4 rounded-xl font-bold text-lg transition-all ${isActive ? 'bg-indigo-500/30 text-indigo-400' : 'text-white hover:bg-white/10'}`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  );
}