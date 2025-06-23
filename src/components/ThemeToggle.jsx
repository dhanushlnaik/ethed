"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import ThemeBackgroundWrapper from "@/components/ThemeBackgroundWrapper";


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <button onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
