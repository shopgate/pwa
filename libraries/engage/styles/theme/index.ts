export { default as ThemeProvider } from './providers/ThemeProvider';
export { createTheme } from './createTheme';
export type { Theme, Breakpoint, PaletteColorsWithMain } from './createTheme';
export {
  useActiveBreakpoint,
  useMediaQuery,
  useResponsiveValue,
  useTheme,
  useColorScheme,
} from './hooks';
