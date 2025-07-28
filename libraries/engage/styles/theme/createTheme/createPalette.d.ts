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
  contrast: string;
}

type PaletteColor<WithContrast extends boolean = false> =
  BasePaletteColor & (WithContrast extends true ? { contrast: string } : {});

export interface Palette {
  primary: PaletteColor<true>;
  secondary: PaletteColor<true>;
  error: PaletteColor;
  warning: PaletteColor;
  success: PaletteColor;
  cta: PaletteColor<true>;
  text: TypeText;
  grey: ColorPartial;
}

export default function createPalette(): Palette;
