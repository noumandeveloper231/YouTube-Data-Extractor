'use client';

import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={theme !== "light"}
        onChange={toggleTheme}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-primary rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-500 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  );
};

export default ThemeToggle;