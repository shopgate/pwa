export { default as ThemeProvider } from './providers/ThemeProvider';
export { createTheme } from './createTheme';
export { default as transitions } from './createTheme/transitions';
export type { Theme, Breakpoint, PaletteColorsWithMain } from './createTheme';
export {
  useActiveBreakpoint,
  useMediaQuery,
  useResponsiveValue,
  useTheme,
  useColorScheme,
} from './hooks';
export { withTheme, type WithThemeProps } from './hocs';
