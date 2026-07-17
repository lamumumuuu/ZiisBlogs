// components/WaterDrop.tsx
// =====================================================================
// 功能描述：三体水滴飞行模拟组件
//          独立封装，可直接在任意页面使用
// =====================================================================

"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface WaterDropProps {
  className?: string;
  height?: string;
}

export default function WaterDrop({ className = 'w-full h-full', height = '100%' }: WaterDropProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ============================================================
    // 1. 场景 / 相机 / 渲染器
    // ============================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(-7, 5, 7);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 环境贴图
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator
      .fromScene(new RoomEnvironment(), 0.04)
      .texture;

    // ============================================================
    // 2. 星空粒子背景
    // ============================================================
    const starCount = 3000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 400;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      starSpeeds[i] = Math.random() * 3 + 1;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('speed', new THREE.BufferAttribute(starSpeeds, 1));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ============================================================
    // 3. 创建超长细尾的三体水滴
    // ============================================================
    const curve = new THREE.CubicBezierCurve(
      new THREE.Vector2(0, 1.5),
      new THREE.Vector2(1.6, 1.1),
      new THREE.Vector2(1.0, -2.0),
      new THREE.Vector2(0, -6.5)
    );

    const points = curve.getPoints(120);
    const geometry = new THREE.LatheGeometry(points, 64);

    const material = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 1.0,
      roughness: 0.0,
      envMapIntensity: 2.0,
    });

    const waterDrop = new THREE.Mesh(geometry, material);
    waterDrop.rotation.z = -Math.PI / 2;
    waterDrop.scale.set(0.8, 0.8, 0.8);
    waterDrop.position.x = 2.0;
    scene.add(waterDrop);

    // ============================================================
    // 4. 动画循环
    // ============================================================
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 更新星空粒子
      const positions = starGeometry.attributes.position.array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3] -= starSpeeds[i] * delta * 60;
        if (positions[i * 3] < -200) {
          positions[i * 3] = 200;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
      }
      starGeometry.attributes.position.needsUpdate = true;

      // 水滴轻微上下浮动 + 相机高度波动
      waterDrop.position.y = Math.sin(time * 0.5) * 0.5;
      camera.position.y = 3 + Math.sin(time * 3) * 0.3;

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // ============================================================
    // 5. 响应式
    // ============================================================
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ============================================================
    // 6. 清理
    // ============================================================
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      pmremGenerator.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black ${className}`}
      style={{ height }}
    />
  );
}