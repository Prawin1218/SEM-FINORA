// FINORA Semantic Theme System - Dark and Light Modes
import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { palette } from './colors';

export const darkTheme = {
  isDark: true,
  name: 'dark',

  // Surfaces & Backgrounds
  background: palette.darkBg, // #0B0B0B
  surface: palette.darkSurface, // #1C1C1C
  surfaceSecondary: palette.darkSurfaceSecondary, // #262626
  surfaceElevated: palette.darkSurfaceElevated, // #202020
  surfaceHighlight: '#2A2A2A',
  surfaceGlass: 'rgba(28, 28, 28, 0.9)',

  // Primary Brand
  primary: palette.primaryYellow, // #FFD600
  primaryBright: palette.brightYellow, // #FFEA00
  primaryText: palette.deepBlack, // #121212
  primaryMuted: palette.yellowMuted,
  primaryGlow: palette.yellowGlow,
  primaryBorder: palette.yellowBorder,

  // Text Hierarchy
  textPrimary: palette.darkTextPrimary, // #FFFFFF
  textSecondary: palette.darkTextSecondary, // #B3B3B3
  textMuted: palette.darkTextMuted, // #757575
  textInverse: palette.deepBlack,

  // Borders & Dividers
  border: palette.darkBorder, // #333333
  borderLight: palette.darkBorderLight, // #444444
  borderActive: palette.primaryYellow,

  // Controls & Inputs
  inputBackground: '#181818',
  inputBorder: palette.darkBorder,
  tabBackground: '#121212',
  tabActive: palette.primaryYellow,
  tabInactive: '#888888',
  cardShadow: '#000000',

  // Financial Indicators
  income: palette.income,
  incomeBg: palette.incomeBg,
  expense: palette.expense,
  expenseBg: palette.expenseBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  info: palette.info,
  infoBg: palette.infoBg,

  categories: palette.categories,

  // React Navigation Theme Object
  navTheme: {
    ...NavDarkTheme,
    dark: true,
    colors: {
      ...NavDarkTheme.colors,
      primary: palette.primaryYellow,
      background: palette.darkBg,
      card: palette.darkSurface,
      text: palette.darkTextPrimary,
      border: palette.darkBorder,
      notification: palette.primaryYellow,
    },
  },
};

export const lightTheme = {
  isDark: false,
  name: 'light',

  // Surfaces & Backgrounds
  background: palette.lightBg, // #FFFDF5
  surface: palette.lightSurface, // #FFFFFF
  surfaceSecondary: palette.lightSurfaceSecondary, // #F5F5F0
  surfaceElevated: palette.lightSurface, // #FFFFFF
  surfaceHighlight: '#F2F0E6',
  surfaceGlass: 'rgba(255, 255, 255, 0.95)',

  // Primary Brand
  primary: palette.primaryYellow, // #FFD600
  primaryBright: palette.brightYellow, // #FFEA00
  primaryText: palette.deepBlack, // #121212
  primaryMuted: 'rgba(255, 214, 0, 0.22)',
  primaryGlow: 'rgba(255, 214, 0, 0.25)',
  primaryBorder: 'rgba(255, 214, 0, 0.6)',

  // Text Hierarchy
  textPrimary: palette.lightTextPrimary, // #171717
  textSecondary: palette.lightTextSecondary, // #666666
  textMuted: palette.lightTextMuted, // #999999
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: palette.lightBorder, // #E5E5E5
  borderLight: palette.lightBorderLight,
  borderActive: palette.primaryYellow,

  // Controls & Inputs
  inputBackground: '#F7F7F2',
  inputBorder: palette.lightBorder,
  tabBackground: '#FFFFFF',
  tabActive: '#121212', // Black active text / yellow accent on light
  tabInactive: '#757575',
  cardShadow: 'rgba(0,0,0,0.06)',

  // Financial Indicators
  income: palette.income,
  incomeBg: palette.incomeBg,
  expense: palette.expense,
  expenseBg: palette.expenseBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  info: palette.info,
  infoBg: palette.infoBg,

  categories: palette.categories,

  // React Navigation Theme Object
  navTheme: {
    ...NavDefaultTheme,
    dark: false,
    colors: {
      ...NavDefaultTheme.colors,
      primary: palette.primaryYellow,
      background: palette.lightBg,
      card: palette.lightSurface,
      text: palette.lightTextPrimary,
      border: palette.lightBorder,
      notification: palette.primaryYellow,
    },
  },
};

export default { darkTheme, lightTheme };
