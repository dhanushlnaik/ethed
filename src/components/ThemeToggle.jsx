"use client";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 bg-white/10 rounded-full p-2 border border-white/20 hover:bg-blue-400/20 transition"
    >
      {theme === "light" ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-blue-300" />}
    </button>
  );
}
