import merge from 'lodash/merge';
import type { CSSInterpolation } from 'tss-react';
import { cssVarsParser, cssVarsColorAugmentation } from './helpers';
import type { GetColorSchemeSelector } from './helpers';
import { resolveComponentsValues, flattenComponentVars } from './createComponents';
import type {
  ColorSchemeThemes, BaseTheme, ColorSchemeName, ThemeOptions,
} from './types';

type CreateCssVarsForColorSchemeThemesOptions = {
  getColorSchemeSelector: GetColorSchemeSelector;
} & Pick<ThemeOptions, 'cssVarPrefix'>;

export type CreateCssVarsForColorSchemeThemesReturnValue = {
  /**
   * A theme object that has the shape of the color schemes, but references CSS variables instead
   * of actual color values.
   */
  cssVarsTheme: BaseTheme & { vars: BaseTheme };
  /**
   * Generates the style sheets for the color schemes of the theme.
   * @returns An array of style sheet objects. Contains one entry per color scheme plus
   * global styles.
   */
  generateStyleSheets: () => CSSInterpolation;
}

/**
 * Generates CSS variables for each color scheme theme, to be used in the CSS of the application.
 * This allows for dynamic theming based on the active color scheme.
 * @param colorSchemes The default themes by each color scheme.
 * @param options Options for generating CSS variables, such as prefix and skip function.
 * @returns The generated CSS variables theme and a function to generate the corresponding style sheets.
 */
export default function createCssVarsForColorSchemeThemes(
  colorSchemes: ColorSchemeThemes,
  options: CreateCssVarsForColorSchemeThemesOptions
): CreateCssVarsForColorSchemeThemesReturnValue {
  const {
    getColorSchemeSelector,
    cssVarPrefix,
  } = options || {};

  const colorSchemeMap: Record<ColorSchemeName, {
    css: Record<string, string | number>;
    vars: BaseTheme;
    varsWithDefaults: BaseTheme;
    varNames: BaseTheme;
  }> = {} as Record<ColorSchemeName, {
    css: Record<string, string | number>;
    vars: BaseTheme;
    varsWithDefaults: BaseTheme;
    varNames: BaseTheme;
  }>;

  const styleSheets: CSSInterpolation = [];

  // Create CSS variables for each color scheme and generate corresponding style sheets
  // @ts-expect-error - Sure about the type here
  Object.keys(colorSchemes).forEach((schemeName: ColorSchemeName) => {
    const {
      components: componentsInput,
      ...rest
    } = colorSchemes[schemeName];

    // Create CSS variables for the theme - skip components since they contain mappings
    // to the generated CSS variables.
    // Also convert colors with a "main" property to have light and dark variants via css color-mix
    const {
      css, vars, varsWithDefaults, varNames,
    } = cssVarsColorAugmentation(cssVarsParser<BaseTheme>(rest, {
      prefix: cssVarPrefix,
      // @ts-expect-error - We are sure about the type here
    }), rest);

    // Resolve component token values to actual CSS variable references
    const resolvedComponents = flattenComponentVars(resolveComponentsValues(componentsInput, vars));

    const {
      css: componentsCss,
      vars: componentsVars,
      varsWithDefaults: componentsVarsWithDefaults,
      varNames: componentsVarNames,
    } = cssVarsParser<BaseTheme>({
      components: resolvedComponents,
    }, {
      prefix: cssVarPrefix,
    });

    colorSchemeMap[schemeName] = {
      css: merge(css, componentsCss),
      vars: merge(vars, componentsVars),
      varsWithDefaults: merge(varsWithDefaults, componentsVarsWithDefaults),
      varNames: merge(varNames, componentsVarNames),
    };

    if (Array.isArray(styleSheets)) {
      // Create a style sheet selector for the color scheme with the generated CSS variables
      styleSheets.push({
        [`${schemeName === 'light' ? ':root, ' : ''}${getColorSchemeSelector(schemeName)}`]: {
          ...css,
        },
      });
    }
  });

  return {
    cssVarsTheme: merge(
      colorSchemes.light,
      colorSchemeMap.light.vars,
      { vars: colorSchemeMap.light.varNames }
    ),
    generateStyleSheets: () => styleSheets,
  };
}
