"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticleField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i += 1) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * 190;
      positions[index + 1] = (Math.random() - 0.5) * 100;
      positions[index + 2] = (Math.random() - 0.5) * 120;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.05,
      transparent: true,
      opacity: 0.36,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    let frame = 0;
    let rafId = 0;

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      frame += 0.0035;
      pointer.lerp(target, 0.035);
      points.rotation.y = frame + pointer.x * 0.08;
      points.rotation.x = pointer.y * 0.035;
      camera.position.x = pointer.x * 4;
      camera.position.y = pointer.y * 3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    resize();
    animate();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="particle-field" aria-hidden="true" />;
}
