// components/ThreeBodyParticlesThree.tsx
// =====================================================================
// 功能描述：三体水滴/自然选择号 3D 粒子特效（Three.js 实现）
//          默认形态：水滴（强互作用力探测器）
//          悬停形态：自然选择号（恒星级战舰）
//          粒子数量：2000，形态平滑插值，带发光和星空背景
// =====================================================================

"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// =====================================================================
// 生成水滴形态粒子位置
// =====================================================================
function generateWaterDrop(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const theta = Math.random() * Math.PI * 2;

    // 泪珠形：上圆下尖
    const radius = 0.6 + 0.4 * Math.sin(u * Math.PI);
    const y = (u - 0.5) * 1.6;
    const r = radius * (0.4 + 0.6 * (1 - Math.abs(u - 0.5) * 1.5));

    // 压缩底部，拉伸顶部
    const stretch = 1 + 0.3 * (1 - u);
    positions[i * 3] = Math.cos(theta) * r * stretch;
    positions[i * 3 + 1] = y * 0.9;
    positions[i * 3 + 2] = Math.sin(theta) * r * stretch;
  }
  return positions;
}

// =====================================================================
// 生成自然选择号星舰形态粒子位置
// =====================================================================
function generateShip(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const bodyCount = Math.floor(count * 0.7);
  const engineCount = count - bodyCount;

  let idx = 0;
  // 星舰主体：细长梭形
  for (let i = 0; i < bodyCount; i++) {
    const t = Math.random();
    const u = Math.random() * Math.PI * 2;
    const radius = 0.25 + 0.35 * Math.sin(t * Math.PI) * (1 - t * 0.3);
    const x = (t - 0.5) * 2.0;
    const r = radius * (0.5 + 0.5 * (1 - Math.abs(t - 0.5) * 1.2));
    positions[idx * 3] = x * 0.7;
    positions[idx * 3 + 1] = Math.cos(u) * r * 0.8;
    positions[idx * 3 + 2] = Math.sin(u) * r * 0.8;
    idx++;
  }

  // 引擎尾焰
  for (let i = 0; i < engineCount; i++) {
    const t = Math.random();
    const spread = 0.2 + t * 0.4;
    const angle = Math.random() * Math.PI * 2;
    const x = 0.7 + t * 0.5;
    positions[idx * 3] = x;
    positions[idx * 3 + 1] = Math.cos(angle) * spread * 0.2;
    positions[idx * 3 + 2] = Math.sin(angle) * spread * 0.2;
    idx++;
  }

  return positions;
}

// =====================================================================
// 主组件
// =====================================================================
export default function ThreeBodyParticlesThree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ===== 场景 =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a1a);

    // ===== 相机 =====
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.5);
    camera.lookAt(0, 0, 0);

    // ===== 渲染器 =====
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050a1a, 1);
    container.appendChild(renderer.domElement);

    // ===== 粒子数量 =====
    const particleCount = 2000;

    // ===== 生成目标位置 =====
    const waterDropPos = generateWaterDrop(particleCount);
    const shipPos = generateShip(particleCount);

    // ===== 当前粒子位置（实时插值） =====
    const currentPositions = new Float32Array(particleCount * 3);
    currentPositions.set(waterDropPos);

    // ===== 粒子几何体 =====
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    // ===== 颜色属性（每个粒子独立颜色） =====
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const hue = 0.55 + 0.2 * t;
      const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + 0.3 * (1 - t));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // ===== 粒子材质 =====
    const texture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 0.045,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      sizeAttenuation: true,
    });

    // ===== 粒子系统 =====
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ===== 辅助：中心光晕 =====
    const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f8cf7,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere);

    // ===== 背景星空 =====
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 30;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x88aaff,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ===== 创建粒子纹理（发光圆点） =====
    function createParticleTexture(): THREE.Texture {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    }

    // ===== 交互状态 =====
    let targetProgress = 0;
    let currentProgress = 0;
    let clock = new THREE.Clock();

    // ===== 动画循环 =====
    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const speed = 2.0;
      if (isHovering) {
        targetProgress = 1;
      } else {
        targetProgress = 0;
      }
      currentProgress += (targetProgress - currentProgress) * Math.min(delta * speed, 1);

      // 更新粒子位置（插值）
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i++) {
        const start = waterDropPos[i];
        const end = shipPos[i];
        positions[i] = start + (end - start) * currentProgress;
      }
      geometry.attributes.position.needsUpdate = true;

      // 粒子大小随形态变化
      const size = 0.04 + 0.02 * (1 - currentProgress);
      material.size = size;

      // 光晕脉冲
      const pulse = 0.08 + 0.04 * Math.sin(elapsed * 0.5);
      glowSphere.material.opacity = pulse * (0.8 + 0.2 * currentProgress);

      // 场景旋转
      particles.rotation.y = elapsed * 0.06;
      particles.rotation.x = Math.sin(elapsed * 0.02) * 0.02;
      stars.rotation.y = elapsed * 0.005;
      glowSphere.position.x = Math.sin(elapsed * 0.1) * 0.02;
      glowSphere.position.y = Math.sin(elapsed * 0.08 + 1) * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // ===== 响应式 =====
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ===== 鼠标悬停 =====
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const canvas = renderer.domElement;
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // ===== 清理 =====
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted, isHovering]);

  // ===================================================================
  // 渲染
  // ===================================================================
  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative rounded-3xl overflow-hidden border border-white/40 dark:border-white/10 bg-slate-950"
    >
      {/* 提示文字 */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <p className="text-xs md:text-sm font-bold text-cyan-400/80 tracking-widest drop-shadow-lg">
          鼠标悬停 · 形态转换
        </p>
      </div>

      {/* 左上角标 */}
      <div className="absolute top-3 left-4 text-[10px] font-black text-cyan-400/70 tracking-widest z-10">
        TRISOLARIS
      </div>

      {/* 右上角标 */}
      <div className="absolute top-3 right-4 text-[10px] font-black text-cyan-400/70 tracking-widest z-10">
        {isHovering ? '⚡ 自然选择号' : '💧 水滴'}
      </div>

      {/* 加载状态 */}
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20">
          <span className="text-cyan-400/60">加载中...</span>
        </div>
      )}
    </div>
  );
}