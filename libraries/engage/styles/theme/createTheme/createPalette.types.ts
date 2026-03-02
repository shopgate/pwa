type ColorPartialKeys =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  | 'A100' | 'A200' | 'A400' | 'A700';

type ColorPartial = Record<ColorPartialKeys, string>;

/**
 * Represents a color with variants that are derived from the main color. Also includes a contrast
 * text color that can be used for text on top of the main color.
 */
export type AugmentedPaletteColor = {
  /**
   * The main shade of the color
   */
  main: string;
  /**
   * A lighter shade of `main`
   */
  light?: string;
  /**
   * A darker shade of `main`
   */
  dark?: string;
  /**
   * Text color, intended to contrast with `main`
   */
  contrastText?: string;
};

/**
 * Variant of the augmented palette color type where all properties are required.
 *  Used for the final theme palette that can be used via `const { palette } = useTheme();`
 */
type AugmentedPaletteColorForTheme = Required<AugmentedPaletteColor>

type Leaf = string | number | boolean | null | undefined;

/**
 * Derives the **resolved** palette type from `paletteSchema`.
 *
 * Represents the palette after theme creation, where all color variants
 * are guaranteed to exist.
 *
 * Rules:
 * - Leaf values become `string`.
 * - Objects containing `main` become `AugmentedPaletteColorForTheme`
 *   (all variants required).
 * - Other objects are recursively mapped.
 *
 */
type PaletteFromSchema<T> =
  T extends Leaf ? string
  : T extends readonly (infer U)[] ? readonly PaletteFromSchema<U>[]
  : T extends object
    ? ('main' extends keyof T
        ? AugmentedPaletteColorForTheme
        : { [K in keyof T]: PaletteFromSchema<T[K]> })
    : string;

/**
 * Derives the **input** palette type from `paletteSchema`.
 *
 * Represents what needs to be provided to `createTheme`.
 *
 * Rules:
 * - Leaf values become `string`.
 * - Objects containing `main` require `main` and allow optional
 *   `light`, `dark`, and `contrastText`.
 * - Other objects are recursively mapped.
 */
type PaletteInputFromSchema<T> =
  T extends Leaf ? string
  : T extends readonly (infer U)[] ? readonly PaletteInputFromSchema<U>[]
  : T extends object
    ? ('main' extends keyof T
        ? { main: string; light?: string; dark?: string; contrastText?: string }
        : { [K in keyof T]: PaletteInputFromSchema<T[K]> })
    : string;

const grey = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161',
} as const;

/**
 * Schema that defines the shape of the palette object.
 *
 * Every new color added to the palette should be added here to get proper typings for the
 * theme palette.
 */
export const paletteSchema = {
  primary: { main: '' },
  secondary: { main: '' },
  error: { main: '' },
  warning: { main: '' },
  success: { main: '' },
  background: {
    default: '',
  },
  text: {
    primary: '',
    secondary: '',
    tertiary: '',
    contrastLight: '',
    contrastDark: '',
  },
  grey,
} as const;

/**
 * Interface to extend the palette type with documentation comments.
 *
 * When a documentation of a specific palette color seems to be useful, it can be added here.
 */
interface PaletteDocs {
  /**
   * Color scheme for primary interface elements
   */
  primary: AugmentedPaletteColor;
  /**
   * Color scheme for secondary interface elements
   */
  secondary: AugmentedPaletteColor;
  /**
   * Color scheme for elements that the user should be made aware of
   */
  error: AugmentedPaletteColor;
  /**
   * Color scheme for potentially dangerous actions or important messages
   */
  warning: AugmentedPaletteColor;
  /**
   * Color scheme for the successful completion of an action that the user triggered
   */
  success: AugmentedPaletteColor;
  text: {
    /**
     * Text color to be used on a light background
     */
    contrastLight: string;
    /**
     * Text color to be used on a dark background
     */
    contrastDark: string;
  }
  /**
   * Colors to be used for the background of various elements
   */
  background: {
    /**
     * The color used for the background of the application
     */
    default: string;
  },
  /**
   * Palette with grey colors, intended for backgrounds, borders, and dividers.
   * The numbers represent the lightness of the color,
   */
  grey: ColorPartial;
}

/**
 * Additional settings for the palette
 */
interface PaletteOptionsExtensions {
  /**
   * The tonal offset is used to calculate the light and dark variants of a color if they are not provided.
   * @default 0.2
   */
  tonalOffset?: number;
  /**
   * The contrast threshold is used to determine which contrast text color to use for a given background
   * @default 3
   */
  contrastThreshold?: number;
}

// The palette options type represents the palette input that can be provided to createTheme
export type PaletteOptions = PaletteInputFromSchema<typeof paletteSchema>
  & PaletteDocs
  & PaletteOptionsExtensions;

// The final palette type represents the palette after theme creation
export type Palette = PaletteFromSchema<typeof paletteSchema>
  & PaletteDocs;
