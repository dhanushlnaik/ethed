"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import AnimatedWeb3Background from "./AnimatedWeb3Background";
import ThemeToggle from "./ThemeToggle";

export default function ThemeBackgroundWrapper({ children }: { children: React.ReactNode }) {
  useTheme();
  return (
    <>
      {/* Background animation, pointerEvents: none, zIndex: 0 */}
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <AnimatedWeb3Background />
      </div>
      {/* Theme toggle, high zIndex, pointerEvents: auto */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}