import { type DefaultColorScheme } from '../createTheme'

type ColorPartialKeys =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  | 'A100' | 'A200' | 'A400' | 'A700';

type ColorPartial = Record<ColorPartialKeys, string>;


interface TypeText {
  primary: string;
  secondary: string;
  tertiary: string;
}

interface BasePaletteColor {
  main: string;
}

interface PaletteColorWithContrast extends PaletteColor {
  contrastText: string;
}

type PaletteColor<WithContrast extends boolean = false> =
  BasePaletteColor & (WithContrast extends true ? { contrastText: string } : {});
export interface Palette {
  mode: 'light' | 'dark';
  primary: PaletteColor<true>;
  secondary: PaletteColor<true>;
  error: PaletteColor;
  warning: PaletteColor;
  success: PaletteColor;
  cta: PaletteColor<true>;
  text: TypeText;
  grey: ColorPartial;
  getContrastText: (background: string) => string;
}

export type PaletteOptions = Partial<Omit<Palette, 'getContrastText'>> & {
  /**
   * The tonal offset is used to calculate the light and dark variants of a color if they are not provided.
   */
  tonalOffset?: number;
  /**
   * The contrast threshold is used to determine which contrast text color to use for a given background
   */
  contrastThreshold?: number;
}

export default function createPalette(paletteOptions: PaletteOptions): Palette;
