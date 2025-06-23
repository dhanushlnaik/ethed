"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

declare global {
  interface Window {
    _blendCube?: number;
  }
}

const CUBE_GRID = 8;
const COLORS = [
  "#222222", "#444444", "#666666", "#888888",
  "#aaaaaa", "#cccccc", "#eeeeee", "#bbbbbb"
];

interface CubeData {
  mesh: THREE.Mesh;
  baseRadius: number;
  phi: number;
  theta: number;
  progress: number;
}

const AnimatedWeb3Background: React.FC<{ theme?: string }> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 0, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor("#1a1a1a", 1);
    renderer.setSize(width, height);

    if (mountRef.current && mountRef.current.childNodes.length === 0) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0x444444, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    // Cubes
    const cubes: CubeData[] = [];
    for (let i = 0; i < CUBE_GRID ** 3; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const baseRadius = 22 + Math.random() * 12;

      const color = COLORS[i % COLORS.length];
      const sizeJitter = 1.9 + Math.random() * 0.7;
      const geometry = new THREE.BoxGeometry(sizeJitter, sizeJitter, sizeJitter, 8, 8, 8);

      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.08,
        roughness: 0.85,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.06,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      cubes.push({ mesh, baseRadius, phi, theta, progress: Math.random() * 0.3 });
    }

    // Shape targets
    const shapeTargets = cubes.map((cubeData, idx) => {
      const sphere = () => {
        const r = cubeData.baseRadius;
        const phi = cubeData.phi;
        const theta = cubeData.theta;
        return [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ];
      };
      const cubeSize = 32;
      const perAxis = Math.cbrt(cubes.length);
      const i = idx % perAxis;
      const j = Math.floor(idx / perAxis) % perAxis;
      const k = Math.floor(idx / (perAxis * perAxis));
      const cube = () => [
        ((i / (perAxis - 1)) - 0.5) * cubeSize,
        ((j / (perAxis - 1)) - 0.5) * cubeSize,
        ((k / (perAxis - 1)) - 0.5) * cubeSize,
      ];
      return { sphere, cube };
    });

    // Mouse
    const mouse = { x: 0, y: 0 };
    const smoothedMouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / width) * 2 - 1;
      mouse.y = -(e.clientY / height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation
    let t = 0;
    const animate = () => {
      t += 0.018;
      camera.position.x = Math.sin(t * 0.2) * 60 + mouse.x * 8;
      camera.position.y = Math.cos(t * 0.15) * 40 + mouse.y * 8;
      camera.lookAt(0, 0, 0);

      // Morphing: only between cube and sphere
      const morphSpeed = 0.02;
      let targetBlendCube = 1 - Math.abs(smoothedMouse.x);
      targetBlendCube = Math.max(0, Math.min(1, targetBlendCube));
      if (typeof window !== "undefined") {
        if (!window._blendCube) window._blendCube = targetBlendCube;
        window._blendCube += (targetBlendCube - window._blendCube) * morphSpeed;
      }
      const blendCube = typeof window !== "undefined" && typeof window._blendCube === "number" ? window._blendCube : targetBlendCube;
      const blendSphere = 1 - blendCube;

      cubes.forEach((cubeData, idx) => {
        const s = shapeTargets[idx].sphere();
        const c = shapeTargets[idx].cube();
        const p = [
          c[0] * blendCube + s[0] * blendSphere,
          c[1] * blendCube + s[1] * blendSphere,
          c[2] * blendCube + s[2] * blendSphere,
        ];

        // Move toward mouse and shrink when not in a definite shape
        const definiteness = Math.max(blendCube, blendSphere);

        if (definiteness < 0.85) {
          const mouse3D = new THREE.Vector3(smoothedMouse.x, smoothedMouse.y, 0.5).unproject(camera);
          const towardMouseStrength = (1 - definiteness) * 0.45;
          p[0] = p[0] * (1 - towardMouseStrength) + mouse3D.x * towardMouseStrength;
          p[1] = p[1] * (1 - towardMouseStrength) + mouse3D.y * towardMouseStrength;
          p[2] = p[2] * (1 - towardMouseStrength) + mouse3D.z * towardMouseStrength;

          const scale = 1 - 0.6 * (1 - definiteness);
          const bounce = 1 + Math.sin(t * 2 + idx) * 0.07 * (1 - definiteness);
          cubeData.mesh.scale.set(
            scale * bounce,
            scale * (1 - 0.04 * (1 - definiteness) * Math.sin(t * 2.2 + idx)),
            scale * bounce
          );
        } else {
          cubeData.mesh.scale.set(1, 1, 1);
        }

        // Wobble
        const wobbleStrength = 1.7 * (1 - blendCube);
        p[0] += Math.sin(t * 0.7 + idx) * wobbleStrength;
        p[1] += Math.cos(t * 0.6 + idx * 1.1) * wobbleStrength;
        p[2] += Math.sin(t * 0.5 + idx * 0.7) * wobbleStrength;

        // Joining animation
        cubeData.progress = Math.min(1, cubeData.progress + 0.012);
        const fromVec = new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          camera.position.z - 40 - Math.random() * 40
        );
        const toVec = new THREE.Vector3(p[0], p[1], p[2]);
        const currentPos = fromVec.clone().lerp(toVec, cubeData.progress);
        cubeData.mesh.position.copy(currentPos);

        // Animate scale: large when close, normal when joined
        const scale = 1 + (1 - cubeData.progress) * 2.5;
        cubeData.mesh.scale.set(scale, scale, scale);

        // Animate opacity: invisible when close, fades in as it joins
        let opacity;
        if (cubeData.progress < 0.5) {
          opacity = Math.max(0.05, cubeData.progress * 1.2);
        } else {
          opacity = Math.min(1, 0.2 + (cubeData.progress - 0.5) * 1.6);
        }
        const mat = cubeData.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity;
        mat.transparent = opacity < 1;

        // Once joined, let the cube morph as usual
        if (cubeData.progress >= 1) {
          const baseColor = new THREE.Color(COLORS[idx % COLORS.length]);
          const hsl = baseColor.getHSL({ h: 0, s: 0, l: 0 });
          const targetHue = theme === "dark" ? 0.6 : 0.58; // blue for dark, gold for light, tweak as you like
          baseColor.setHSL(targetHue, hsl.s, hsl.l);
          mat.color = baseColor;
          mat.emissive = baseColor;
        }
      });

      // Smooth the mouse movement
      smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.08;
      smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.08;

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (mountRef.current)
        while (mountRef.current.firstChild)
          mountRef.current.removeChild(mountRef.current.firstChild);
    };
  }, [mounted]);

  if (!mounted) return null;

  const bgGradient =
    theme === "dark"
      ? "repeating-radial-gradient(circle at 50% 60%, #23253a 0%, #415485 80%, #23253a 100%)"
      : "repeating-radial-gradient(circle at 50% 60%, #e0e7ef 0%, #b6c6e3 80%, #e0e7ef 100%)";

  return (
    <>
      <div
        style={{
          position: "fixed",
          zIndex: -2,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <style>
          {`
            .wave-bg {
              position: absolute;
              width: 100vw;
              height: 100vh;
              top: 0;
              left: 0;
              z-index: -2;
              pointer-events: none;
              background: ${bgGradient};
              opacity: 0.95;
              animation: waveMove 8s linear infinite;
              background-size: 200% 200%;
              background-position: 0% 50%;
            }
            @keyframes waveMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
        <div className="wave-bg" />
      </div>
      <div
        ref={mountRef}
        style={{
          position: "fixed",
          zIndex: -1,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default AnimatedWeb3Background;