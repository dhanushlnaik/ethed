"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

const CUBE_GRID = 8; // or 10 for more density
const COLORS = [
  "#00bcd4", // cyan
  "#8bc34a", // light green
  "#ffeb3b", // yellow
  "#ff9800", // orange
  "#e91e63", // pink
  "#3f51b5", // indigo
  "#00e676", // vivid green
  "#ffd600", // gold
  "#536dfe", // soft blue
  "#ff6f00", // deep orange
];

interface CubeData {
  mesh: THREE.Mesh;
  baseRadius: number;
  phi: number;
  theta: number;
  progress: number; // New property for join progress
}

const AnimatedWeb3Background: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 0, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);

    // Prevent duplicate canvas
    if (mountRef.current && mountRef.current.childNodes.length === 0) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0x4444ff, 0.7));
    const dirLight = new THREE.DirectionalLight(0x70eafd, 0.6);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    // Cube geometry/material
    const sizeJitter = 1.9 + Math.random() * 0.7;
    const geometry = new THREE.BoxGeometry(sizeJitter, sizeJitter, sizeJitter, 8, 8, 8);

    // Texture loader for normal map
    const fabricNormal = new TextureLoader().load("/textures/fabric-normal.jpg");

    // Store each cube's spherical coordinates for morphing
    const cubes: CubeData[] = [];
    for (let i = 0; i < CUBE_GRID ** 3; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const baseRadius = 22 + Math.random() * 12;

      const color = COLORS[i % COLORS.length];
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.08, // low for cloth
        roughness: 0.85, // high for cloth
        normalMap: fabricNormal,
        normalScale: new THREE.Vector2(0.7, 0.7), // adjust for effect strength
        // No opacity or transparent!
        // No clearcoat for cloth
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.06,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Outline/glow (optional, can be removed for a more mature look)
      const outlineMaterial = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.04,
        side: THREE.BackSide,
      });
      const outline = new THREE.Mesh(geometry, outlineMaterial);
      outline.scale.multiplyScalar(1.12);
      mesh.add(outline);

      scene.add(mesh);
      cubes.push({ mesh, baseRadius, phi, theta, progress: Math.random() * 0.3 }); // randomize start
    }

    // Precompute target positions for each shape
    const shapeTargets = cubes.map((cubeData, idx) => {
      // Sphere (already have phi, theta, baseRadius)
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

      // Cube: distribute evenly in a cube grid
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

      // Spiral: helix in 3D
      const spiral = () => {
        const angle = idx * 0.35;
        const y = (idx - cubes.length / 2) * 0.7;
        const r = 18 + 6 * Math.sin(angle * 0.3);
        return [
          r * Math.cos(angle),
          y,
          r * Math.sin(angle),
        ];
      };

      return { sphere, cube, spiral };
    });

    // Mouse movement for morphing
    const mouse = { x: 0, y: 0 };
    const smoothedMouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / width) * 2 - 1;
      mouse.y = -(e.clientY / height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Responsive resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    let t = 0;
    const animate = () => {
      t += 0.018; // Increase time speed (was 0.008)

      // Camera slow orbit
      camera.position.x = Math.sin(t * 0.2) * 60 + mouse.x * 8;
      camera.position.y = Math.cos(t * 0.15) * 40 + mouse.y * 8;
      camera.lookAt(0, 0, 0);

      // Calculate mouse distance from center (0 = center, 1 = far edge)
      const mouseDist = Math.sqrt(smoothedMouse.x * smoothedMouse.x + smoothedMouse.y * smoothedMouse.y);

      // Use smoothstep for a softer transition
      function smoothstep(edge0: number, edge1: number, x: number) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
      }

      // Blending: center = cube, left/top = sphere, right = spiral
      let blendCube = 1 - smoothstep(0.07, 0.25, mouseDist); // 1 at center, fades out smoothly
      let blendSpiral = smoothstep(0.6, 1, mouse.x);         // 0 until mouse.x > 0.6, then fades in
      let blendSphere = 1 - blendCube - blendSpiral;

      // Clamp blends to [0,1] and normalize so sum is 1
      blendCube = Math.max(0, Math.min(1, blendCube));
      blendSpiral = Math.max(0, Math.min(1, blendSpiral));
      blendSphere = Math.max(0, Math.min(1, blendSphere));
      const blendSum = blendCube + blendSphere + blendSpiral;
      if (blendSum > 0) {
        blendCube /= blendSum;
        blendSphere /= blendSum;
        blendSpiral /= blendSum;
      }

      cubes.forEach((cubeData, idx) => {
        const s = shapeTargets[idx].sphere();
        const c = shapeTargets[idx].cube();
        const sp = shapeTargets[idx].spiral();

        // Weighted blend: cube at center, sphere/spiral at edges
        const p = [
          c[0] * blendCube + s[0] * blendSphere + sp[0] * blendSpiral,
          c[1] * blendCube + s[1] * blendSphere + sp[1] * blendSpiral,
          c[2] * blendCube + s[2] * blendSphere + sp[2] * blendSpiral,
        ];

        // --- New: Move toward mouse and shrink when not in a definite shape ---
        // "Definiteness" is max of blendCube, blendSphere, blendSpiral
        const definiteness = Math.max(blendCube, blendSphere, blendSpiral);

        if (definiteness < 0.85) {
          // Project mouse to a 3D point in front of the camera
          const mouse3D = new THREE.Vector3(smoothedMouse.x, smoothedMouse.y, 0.5).unproject(camera);
          // Interpolate position toward mouse3D
          const towardMouseStrength = (1 - definiteness) * 0.45; // how much to move toward mouse
          p[0] = p[0] * (1 - towardMouseStrength) + mouse3D.x * towardMouseStrength;
          p[1] = p[1] * (1 - towardMouseStrength) + mouse3D.y * towardMouseStrength;
          p[2] = p[2] * (1 - towardMouseStrength) + mouse3D.z * towardMouseStrength;

          // Shrink cubes
          const scale = 1 - 0.6 * (1 - definiteness); // scale down as definiteness decreases
          const bounce = 1 + Math.sin(t * 2 + idx) * 0.07 * (1 - definiteness);
          cubeData.mesh.scale.set(
            scale * bounce,
            scale * (1 - 0.04 * (1 - definiteness) * Math.sin(t * 2.2 + idx)),
            scale * bounce
          );
        } else {
          // Restore normal size when in a definite shape
          cubeData.mesh.scale.set(1, 1, 1);
        }
        // ----------------------------------------------------------------------

        // Add smooth, subtle random motion (wobble)
        const wobbleStrength = 1.7 * (1 - blendCube);
        p[0] += Math.sin(t * 0.7 + idx) * wobbleStrength;
        p[1] += Math.cos(t * 0.6 + idx * 1.1) * wobbleStrength;
        p[2] += Math.sin(t * 0.5 + idx * 0.7) * wobbleStrength;

        // --- New: Joining animation ---
        cubeData.progress = Math.min(1, cubeData.progress + 0.012); // speed of joining

        // Calculate the "from" position (e.g., from camera or random point near camera)
        const fromVec = new THREE.Vector3(
          (Math.random() - 0.5) * 40, // random X offset
          (Math.random() - 0.5) * 40, // random Y offset
          camera.position.z - 40 - Math.random() * 40 // in front of camera
        );

        // Target position (the shape morph position)
        const toVec = new THREE.Vector3(p[0], p[1], p[2]);

        // Interpolate position based on progress
        const currentPos = fromVec.clone().lerp(toVec, cubeData.progress);

        // Set mesh position
        cubeData.mesh.position.copy(currentPos);

        // Animate scale: large when close, normal when joined
        const scale = 1 + (1 - cubeData.progress) * 2.5; // starts big, shrinks to 1
        cubeData.mesh.scale.set(scale, scale, scale);

        // Animate opacity: invisible when close, fades in as it joins
        let opacity;
        if (cubeData.progress < 0.5) {
          // Fade in slowly at first, then faster as it approaches
          opacity = Math.max(0.05, cubeData.progress * 1.2);
        } else {
          // Fade in faster after halfway
          opacity = Math.min(1, 0.2 + (cubeData.progress - 0.5) * 1.6);
        }
        const mat = cubeData.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity;
        mat.transparent = opacity < 1;

        // Once joined, let the cube morph as usual
        if (cubeData.progress >= 1) {
          // --- New: Color shift over time ---
          const baseColor = new THREE.Color(COLORS[idx % COLORS.length]);
          const timeShift = Math.sin(t * 0.15 + idx) * 0.08;
          const hsl = baseColor.getHSL({ h: 0, s: 0, l: 0 });
          baseColor.setHSL(hsl.h + timeShift, hsl.s, hsl.l);
          (cubeData.mesh.material as THREE.MeshStandardMaterial).color = baseColor;
          (cubeData.mesh.material as THREE.MeshStandardMaterial).emissive = baseColor;
        }
      });

      // Smooth the mouse movement (0.08 is the smoothing factor, lower = smoother)
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
  }, []);

  return (
    <>
      <div
        ref={mountRef}
        style={{
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          zIndex: 1,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(30,32,40,0.25) 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default AnimatedWeb3Background;