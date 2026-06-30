import type { BaseTheme } from '..';
import type { CssVarsParserReturnValue } from './cssVarsParser';
import cssVarsParser from './cssVarsParser';

/**
 * Builds lookup keys for CSS variables that are injected by addAugmentationToVars.
 *
 * For each augmentable palette entry this returns keys for `dark`, `light`, and
 * `contrastText`, e.g. `--sg-palette-primary-dark`.
 * @param vars Theme vars object to inspect.
 * @param cssVarsPrefix Optional CSS variable prefix.
 * @returns Flat list of CSS variable lookup keys.
 */
function getAugmentedPaletteLookupKeys(
  vars: BaseTheme,
  cssVarsPrefix = 'sg'
): string[] {
  if (!vars.palette) return [];

  const prefix = cssVarsPrefix ? `${cssVarsPrefix}-` : '';
  const keys: string[] = [];

  Object.keys(vars.palette).forEach((key) => {
    // @ts-expect-error - We are sure about the type here
    const paletteEntry = vars.palette[key];

    if (paletteEntry && typeof paletteEntry === 'object' && paletteEntry.main) {
      const base = `--${prefix}palette-${key}`;

      keys.push(
        `${base}-dark`,
        `${base}-light`,
        `${base}-contrastText`
      );
    }
  });

  return keys;
}

/**
 * Merges refreshed augmented palette CSS variables into the original CSS map.
 *
 * The original `cssInput` was generated before palette augmentation, so `dark`,
 * `light`, and `contrastText` entries derived from augmented vars must be
 * regenerated and merged back in.
 * @param cssInput Original CSS variables map from the parser result.
 * @param varsInput Original vars object, used to determine which palette keys are augmentable.
 * @param vars Augmented vars object containing the updated palette values.
 * @param cssVarsPrefix Prefix used to build CSS variable names.
 * @returns CSS map with augmented palette keys overwritten by fresh values.
 */
function addAugmentationToCss(
  cssInput: Record<string, string | number>,
  varsInput: BaseTheme,
  vars: BaseTheme,
  cssVarsPrefix: string
): Record<string, string | number> {
  // Re-parse the augmented vars so we can derive up-to-date css variable values.
  const { css: augmentedCss } = cssVarsParser(vars, { prefix: cssVarsPrefix });

  // Only copy keys that are introduced/overwritten by color augmentation.
  // This keeps all non-augmented entries from the original parser result untouched.
  const augmentedPaletteLookupKeys = getAugmentedPaletteLookupKeys(varsInput, cssVarsPrefix);
  const augmentedPaletteCss = augmentedPaletteLookupKeys.reduce((acc, key) => {
    if (key in augmentedCss) {
      acc[key] = augmentedCss[key];
    }

    return acc;
  }, {} as Record<string, string | number>);

  return {
    ...cssInput,
    ...augmentedPaletteCss,
  };
}

/**
 * Extends palette entries that provide a `main` color with derived variants.
 *
 * For each matching palette entry, this injects `light`, `dark`, and
 * `contrastText` so downstream theme consumers can rely on a complete color set.
 * @param vars Theme vars object to augment.
 * @param theme Base theme utilities used to derive color variants.
 * @returns A new vars object with augmented palette entries.
 */
function addAugmentationToVars(
  vars: BaseTheme,
  theme: BaseTheme
): BaseTheme {
  if (!vars.palette) return vars;

  const augmentedPalette = { ...vars.palette };

  Object.keys(augmentedPalette).forEach((key) => {
    // @ts-expect-error - We are sure about the type here
    const paletteEntry = augmentedPalette[key];

    if (paletteEntry && typeof paletteEntry === 'object' && paletteEntry.main) {
      // @ts-expect-error - We are sure about the type here
      augmentedPalette[key] = {
        ...paletteEntry,
        // Inject css color-mix function to create light and dark variants of the main color
        light: theme.lighten(paletteEntry.main),
        dark: theme.darken(paletteEntry.main),
        // Inject contrast text color based on the main color
        contrastText: theme.contrastColor(paletteEntry.main),
      };
    }
  });

  return {
    ...vars,
    palette: augmentedPalette,
  };
}

/**
 * Augments the CSS variables for the color palette by adding light and dark variants for each color.
 * @param cssParserReturn The result from the CSS variables parser.
 * @param theme The base theme object, which includes the palette and the lighten/darken functions.
 * @param cssVarsPrefix Prefix used for CSS variable names.
 * @returns An object containing the augmented CSS variables.
 */
export default function cssVarsColorAugmentation(
  cssParserReturn: CssVarsParserReturnValue<BaseTheme>,
  theme: BaseTheme,
  cssVarsPrefix: string
): CssVarsParserReturnValue<BaseTheme> {
  const {
    vars: varsInput,
    varsWithDefaults: varsWithDefaultsInput,
    css: cssInput,
    ...rest
  } = cssParserReturn;

  // vars and varsWithDefaults need augmentation because both are consumed by the theme layer.
  const vars = addAugmentationToVars(varsInput, theme);
  const varsWithDefaults = addAugmentationToVars(varsWithDefaultsInput, theme);

  // cssInput was produced before augmentation, so merge refreshed augmented keys back in.
  const css = addAugmentationToCss(cssInput, varsInput, vars, cssVarsPrefix);

  return {
    ...rest,
    css,
    vars,
    varsWithDefaults,
  };
}
