// Theme Context providing dynamic Dark & Light Mode across FINORA
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import localStorage, { StorageKeys } from '../storage/localStorage';
import { darkTheme, lightTheme } from './themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState('dark'); // 'dark' | 'light'
  const [isLoaded, setIsLoaded] = useState(false);

  // Load stored theme mode on launch
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await localStorage.getItem(StorageKeys.THEME_MODE);
        if (savedMode === 'light' || savedMode === 'dark') {
          setThemeModeState(savedMode);
        }
      } catch (err) {
        console.warn('Failed to load theme preference:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemePreference();
  }, []);

  const setThemeMode = async (mode) => {
    const targetMode = mode === 'light' ? 'light' : 'dark';
    setThemeModeState(targetMode);
    await localStorage.setItem(StorageKeys.THEME_MODE, targetMode);
  };

  const toggleTheme = async () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    await setThemeMode(nextMode);
  };

  const theme = useMemo(() => {
    return themeMode === 'light' ? lightTheme : darkTheme;
  }, [themeMode]);

  const value = useMemo(
    () => ({
      theme,
      isDark: themeMode === 'dark',
      themeMode,
      toggleTheme,
      setThemeMode,
      navTheme: theme.navTheme,
      isLoaded,
    }),
    [theme, themeMode, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
