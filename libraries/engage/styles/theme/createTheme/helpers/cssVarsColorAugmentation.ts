import type { BaseTheme } from '..';
import type { CssVarsParserReturnValue } from './cssVarsParser';

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
 * @returns An object containing the augmented CSS variables.
 */
export default function cssVarsColorAugmentation(
  cssParserReturn: CssVarsParserReturnValue<BaseTheme>,
  theme: BaseTheme
): CssVarsParserReturnValue<BaseTheme> {
  const {
    vars: varsInput,
    varsWithDefaults: varsWithDefaultsInput,
    ...rest
  } = cssParserReturn;

  const vars = addAugmentationToVars(varsInput, theme);
  const varsWithDefaults = addAugmentationToVars(varsWithDefaultsInput, theme);

  return {
    ...rest,
    vars,
    varsWithDefaults,
  };
}
