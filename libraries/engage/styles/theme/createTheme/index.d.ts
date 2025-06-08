import { type Breakpoints } from './createBreakpoints';
import { type Spacing } from './createSpacing';

export { type Breakpoint } from './createBreakpoints'

export interface ThemeOptions {

}

export interface Theme {
  breakpoints: Breakpoints;
  spacing: Spacing;
}

export function createTheme(): Theme;
