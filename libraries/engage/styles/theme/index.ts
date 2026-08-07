export { default as ThemeProvider } from './providers/ThemeProvider';
export { createTheme } from './createTheme';
export { SHADOW_COLOR_VAR, type ShadowSize } from './createTheme/shadows';
export type {
  Theme, Breakpoint, PaletteColorsWithMain, ColorSchemeName,
} from './createTheme';
export {
  useActiveBreakpoint,
  useMediaQuery,
  useResponsiveValue,
  useTheme,
  useColorScheme,
} from './hooks';
export { withTheme, type WithThemeProps } from './hocs';
