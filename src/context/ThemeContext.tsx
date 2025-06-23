"use client";

import React, { createContext, useEffect, useState, useContext } from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to light

  // On mount, check localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored && stored !== theme) {
      setTheme(stored);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};