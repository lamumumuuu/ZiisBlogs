"use client";

import { useEffect, useRef } from "react";

// =====================================================================
// 粒子类型定义
// =====================================================================
interface Particle {
  x: number;
  y: number;
  waterDropX: number;
  waterDropY: number;
  shipX: number;
  shipY: number;
  size: number;
  speed: number;
  alpha: number;
  hue: number;
}

// =====================================================================
// 三体粒子特效组件
// =====================================================================
// 功能说明：
//   1. 默认状态：粒子组成"水滴"形态（三体强互作用力探测器）
//   2. 鼠标悬停：粒子平滑重组为"自然选择号"星舰形态
//   3. 使用 Canvas 2D 渲染，性能良好
//
// 设计思路：
//   - 每个粒子存储水滴形态和星舰形态的目标位置
//   - 使用线性插值(lerp)实现两种形态间的平滑过渡
//   - 粒子有微小的随机漂浮效果增加生命感
//   - 颜色使用蓝青色系，符合科幻主题
// =====================================================================
export default function ThreeBodyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const isHoveringRef = useRef(false);
  const progressRef = useRef(0);
  const timeRef = useRef(0);

  // ===================================================================
  // 生成水滴形态的粒子目标位置
  // 水滴形状：上部圆润，下部收窄为尖点（泪珠形）
  // ===================================================================
  const generateWaterDropShape = (
    count: number,
    centerX: number,
    centerY: number,
    scale: number
  ): Array<{ x: number; y: number }> => {
    const points: Array<{ x: number; y: number }> = [];
    const baseRadius = scale * 0.35;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6);

      // 泪珠参数方程：上圆下尖
      const radialScale = 1 + 0.12 * Math.sin(t);
      const verticalSkew = Math.max(0, Math.cos(t)) * 0.2 * r * r;

      const x = centerX + Math.sin(t) * baseRadius * r * radialScale;
      const y =
        centerY +
        Math.cos(t) * baseRadius * r * 1.05 -
        baseRadius * verticalSkew +
        baseRadius * 0.15;

      points.push({ x, y });
    }

    return points;
  };

  // ===================================================================
  // 生成自然选择号（星舰）形态的粒子目标位置
  // 简化造型：细长主体 + 前端尖 + 尾部引擎尾焰
  // ===================================================================
  const generateShipShape = (
    count: number,
    centerX: number,
    centerY: number,
    scale: number
  ): Array<{ x: number; y: number }> => {
    const points: Array<{ x: number; y: number }> = [];

    const bodyCount = Math.floor(count * 0.6);
    const engineCount = count - bodyCount;

    // 星舰主体：细长椭圆，头部（左侧）更尖
    const bodyWidth = scale * 0.65;
    const bodyHeight = scale * 0.2;

    for (let i = 0; i < bodyCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());

      // 左侧（cos < 0）为舰首，更尖锐
      const noseFactor = Math.max(0, -Math.cos(t));
      const widthScale = 1 + noseFactor * 0.35;
      const heightScale = 1 - noseFactor * 0.5;

      const x = centerX + Math.cos(t) * bodyWidth * r * widthScale;
      const y = centerY + Math.sin(t) * bodyHeight * r * heightScale;

      points.push({ x, y });
    }

    // 引擎尾焰：从舰尾（右侧）发散
    for (let i = 0; i < engineCount; i++) {
      const flameLen = Math.random() * scale * 0.45;
      const flameProgress = flameLen / (scale * 0.45);
      const spread = (Math.random() - 0.5) * scale * 0.15 * flameProgress;

      const x = centerX + bodyWidth * 0.9 + flameLen;
      const y = centerY + spread;

      points.push({ x, y });
    }

    return points;
  };

  // ===================================================================
  // 初始化粒子系统
  // ===================================================================
  const initParticles = (canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const particleCount = 350;
    const scale = Math.min(width, height) * 0.8;

    const waterDropPoints = generateWaterDropShape(
      particleCount,
      centerX,
      centerY,
      scale
    );
    const shipPoints = generateShipShape(
      particleCount,
      centerX,
      centerY,
      scale
    );

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: waterDropPoints[i].x + (Math.random() - 0.5) * 2,
        y: waterDropPoints[i].y + (Math.random() - 0.5) * 2,
        waterDropX: waterDropPoints[i].x,
        waterDropY: waterDropPoints[i].y,
        shipX: shipPoints[i].x,
        shipY: shipPoints[i].y,
        size: Math.random() * 1.8 + 0.8,
        speed: Math.random() * 0.04 + 0.025,
        alpha: Math.random() * 0.4 + 0.6,
        hue: 185 + Math.random() * 40,
      });
    }

    particlesRef.current = particles;
  };

  // ===================================================================
  // 线性插值工具函数
  // ===================================================================
  const lerp = (start: number, end: number, t: number): number => {
    return start + (end - start) * t;
  };

  // ===================================================================
  // 动画主循环
  // ===================================================================
  const animate = (canvas: HTMLCanvasElement, ctx: CanvasRendering2DContext) => {
    const width = canvas.width;
    const height = canvas.height;
    const particles = particlesRef.current;
    const scale = Math.min(width, height) * 0.8;

    timeRef.current += 0.016;

    // 平滑更新过渡进度（悬停 -> 1，离开 -> 0）
    const targetProgress = isHoveringRef.current ? 1 : 0;
    progressRef.current = lerp(progressRef.current, targetProgress, 0.035);

    const progress = progressRef.current;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 背景径向光晕
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.min(width, height) * 0.55
    );
    bgGradient.addColorStop(0, `rgba(56, 189, 248, ${0.08 + progress * 0.1})`);
    bgGradient.addColorStop(0.5, `rgba(99, 102, 241, ${0.04 + progress * 0.05})`);
    bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 更新并绘制每个粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 目标位置 = 水滴位置 与 星舰位置 的插值
      const targetX = lerp(p.waterDropX, p.shipX, progress);
      const targetY = lerp(p.waterDropY, p.shipY, progress);

      // 微小漂浮偏移（呼吸效果）
      const driftX = Math.sin(timeRef.current * 1.2 + i * 0.15) * 0.8;
      const driftY = Math.cos(timeRef.current * 0.9 + i * 0.12) * 0.8;

      // 粒子向目标位置缓动
      p.x = lerp(p.x, targetX + driftX, p.speed);
      p.y = lerp(p.y, targetY + driftY, p.speed);

      // 颜色随进度变化（水滴偏青，星舰偏蓝紫）
      const hue = lerp(p.hue, p.hue - 20, progress);
      const saturation = lerp(75, 90, progress);
      const lightness = lerp(65, 70, progress);
      const alpha = p.alpha * (0.7 + progress * 0.3);

      // 粒子光晕
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.15})`;
      ctx.fill();

      // 粒子本体
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.fill();
    }

    // 引擎尾焰光晕（悬停时出现）
    if (progress > 0.1) {
      const bodyWidth = scale * 0.65;
      const flameX = width / 2 + bodyWidth * 0.9;
      const flameY = height / 2;

      const flameGradient = ctx.createRadialGradient(
        flameX,
        flameY,
        0,
        flameX + scale * 0.25,
        flameY,
        scale * 0.35
      );
      flameGradient.addColorStop(0, `rgba(147, 197, 253, ${progress * 0.18})`);
      flameGradient.addColorStop(0.5, `rgba(99, 102, 241, ${progress * 0.08})`);
      flameGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = flameGradient;
      ctx.fillRect(
        flameX - scale * 0.1,
        flameY - scale * 0.25,
        scale * 0.55,
        scale * 0.5
      );
    }

    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx));
  };

  // ===================================================================
  // 处理画布尺寸变化（响应式 + 高DPI适配）
  // ===================================================================
  const handleResize = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initParticles(canvas);
  };

  // ===================================================================
  // 主 useEffect：初始化 Canvas 和动画
  // ===================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    handleResize(canvas);
    animate(canvas, ctx);

    // 监听尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(animationRef.current);
      handleResize(canvas);
      animate(canvas, ctx);
    });
    resizeObserver.observe(canvas);

    // 鼠标进入：切换到自然选择号形态
    const handleMouseEnter = () => {
      isHoveringRef.current = true;
    };

    // 鼠标离开：恢复水滴形态
    const handleMouseLeave = () => {
      isHoveringRef.current = false;
    };

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <div className="w-full h-[320px] md:h-[400px] lg:h-[480px] relative rounded-3xl overflow-hidden border border-white/40 dark:border-white/10 bg-gradient-to-br from-slate-900/40 via-indigo-900/30 to-slate-900/40 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />

      {/* 底部提示文字 */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs md:text-sm font-bold text-cyan-300/70 dark:text-cyan-200/60 tracking-widest">
          鼠标悬停 · 形态转换
        </p>
      </div>

      {/* 左上角标 */}
      <div className="absolute top-3 left-4 text-[10px] font-black text-cyan-400/60 tracking-widest">
        TRISOLARIS
      </div>

      {/* 右上角标 */}
      <div className="absolute top-3 right-4 text-[10px] font-black text-cyan-400/60 tracking-widest">
        水滴 / 自然选择号
      </div>
    </div>
  );
}
