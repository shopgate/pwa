import { type Breakpoints } from './createBreakpoints';
import { type Spacing } from './createSpacing';
import { Transitions } from './transitions';
import { type ZIndex } from './zIndex';

export { type Breakpoint } from './createBreakpoints'

export interface ThemeOptions {

}

export interface Theme {
  breakpoints: Breakpoints;
  spacing: Spacing;
  transitions: Transitions;
  zIndex: ZIndex;
}

export function createTheme(): Theme;
