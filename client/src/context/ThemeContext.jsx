import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, default to system
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    const applyTheme = (themeValue) => {
      if (themeValue === 'system') {
        // Detect system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
      } else {
        document.documentElement.setAttribute('data-theme', themeValue);
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes when theme is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    // Toggle between light and dark only (for header button)
    setTheme((prev) => {
      if (prev === 'system') {
        // If system, switch to opposite of current system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        return systemTheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  const setSpecificTheme = (newTheme) => {
    // For settings page to set specific theme
    setTheme(newTheme);
  };

  // Get current effective theme (resolves 'system' to actual theme)
  const getCurrentTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSpecificTheme, getCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
