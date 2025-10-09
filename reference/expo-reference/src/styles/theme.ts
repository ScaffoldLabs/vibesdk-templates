import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import type { StatusBarStyle } from 'expo-status-bar';

import type { ColorScheme } from '@/types/theme';

export type ThemeBundle = {
  navigationTheme: Theme;
  statusBarStyle: StatusBarStyle;
  colors: {
    background: string;
    card: string;
    primary: string;
    primaryText: string;
    secondaryText: string;
    surface: string;
    border: string;
  };
};

const basePalette = {
  cobalt: '#2563eb',
  midnight: '#0f172a',
  slate: '#1f2937',
  powder: '#f1f5f9',
  white: '#ffffff',
};

const lightTheme: ThemeBundle = {
  navigationTheme: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: basePalette.cobalt,
      background: basePalette.powder,
      card: basePalette.white,
      border: '#e2e8f0',
      text: basePalette.midnight,
    },
  },
  statusBarStyle: 'dark',
  colors: {
    background: basePalette.powder,
    card: basePalette.white,
    primary: basePalette.cobalt,
    primaryText: basePalette.white,
    secondaryText: '#475569',
    surface: basePalette.white,
    border: '#e2e8f0',
  },
};

const darkTheme: ThemeBundle = {
  navigationTheme: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#60a5fa',
      background: basePalette.midnight,
      card: '#111827',
      border: '#1f2937',
      text: basePalette.white,
    },
  },
  statusBarStyle: 'light',
  colors: {
    background: basePalette.midnight,
    card: '#111827',
    primary: '#60a5fa',
    primaryText: basePalette.midnight,
    secondaryText: '#cbd5f5',
    surface: '#1e293b',
    border: '#1f2937',
  },
};

export function getNavigationTheme(colorScheme: ColorScheme): ThemeBundle {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
