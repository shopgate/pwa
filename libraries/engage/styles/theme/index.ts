export { default as ThemeProvider } from './providers/ThemeProvider';
export { createTheme } from './createTheme';
export { type ShadowSize } from './createTheme/shadows';
export type { Variant as TypographyVariant } from './createTheme/createTypography';
export type {
  Theme, Breakpoint, PaletteColorsWithMain, ColorSchemeName, ColorSchemeMode,
} from './createTheme';
export {
  useActiveBreakpoint,
  useMediaQuery,
  useResponsiveValue,
  useTheme,
  useColorScheme,
} from './hooks';
export { withTheme, type WithThemeProps } from './hocs';
export type { ColorSchemeContextValue } from './providers/ColorSchemeContext';
