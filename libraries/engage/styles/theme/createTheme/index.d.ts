import { type Breakpoints } from './createBreakpoints';
import { type Spacing } from './createSpacing';
import { Transitions } from './transitions';

export { type Breakpoint } from './createBreakpoints'

export interface ThemeOptions {

}

export interface Theme {
  breakpoints: Breakpoints;
  spacing: Spacing;
  transitions: Transitions;
}

export function createTheme(): Theme;
