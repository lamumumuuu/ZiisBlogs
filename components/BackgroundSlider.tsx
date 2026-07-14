// components/BackgroundSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '../siteConfig';

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!siteConfig.bgImages || siteConfig.bgImages.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % siteConfig.bgImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!siteConfig.bgImages || siteConfig.bgImages.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      {siteConfig.bgImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${image})`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}