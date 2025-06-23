"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000, // High z-index to be above other content
      }}
    >
      <button onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}