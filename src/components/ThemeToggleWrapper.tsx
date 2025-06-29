"use client";
import ThemeToggle from "./ThemeToggle";

export default function ThemeToggleWrapper() {
  return (
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
  );
}