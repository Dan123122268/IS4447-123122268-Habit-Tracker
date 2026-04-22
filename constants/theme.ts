/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0F766E';
const tintColorDark = '#5EEAD4';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeName = 'light' | 'dark';

export const Colors = {
  light: {
    text: '#111827',
    mutedText: '#64748B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceStrong: '#F1F5F9',
    surfaceAlt: '#ECFDF5',
    border: '#CBD5E1',
    tint: tintColorLight,
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    icon: '#475569',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F8FAFC',
    mutedText: '#CBD5E1',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceStrong: '#0B1220',
    surfaceAlt: '#134E4A',
    border: '#334155',
    tint: tintColorDark,
    success: '#22C55E',
    warning: '#FBBF24',
    danger: '#F87171',
    icon: '#CBD5E1',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorDark,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const Radius = {
  sm: 6,
  md: 8,
  lg: 8,
  pill: 999,
};

export const Palette = {
  teal: { name: 'Teal', value: '#0F766E' },
  blue: { name: 'Blue', value: '#2563EB' },
  orange: { name: 'Orange', value: '#C2410C' },
  violet: { name: 'Violet', value: '#7C3AED' },
  rose: { name: 'Rose', value: '#BE123C' },
  green: { name: 'Green', value: '#15803D' },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
