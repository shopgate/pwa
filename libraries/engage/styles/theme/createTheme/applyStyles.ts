import type { CSSObject } from 'tss-react';
import type { ThemeInternal, ColorSchemeName } from '.';

export interface ApplyStyles<K extends string> {
  (key: K, styles: CSSObject): CSSObject;
}

/**
 * Applies the given styles only when the specified color scheme is active.
 * @param key The color scheme key to apply the styles for (e.g., 'light' or 'dark').
 * @param styles The styles to apply when the specified color scheme is active.
 * @returns An object containing the styles wrapped in the appropriate selector
 * for the specified color scheme
 */
export default function applyStyles<K extends string>(key: K, styles: CSSObject) {
  // @ts-expect-error this is 'any' type
  const theme = this as ThemeInternal;

  if (!theme.colorSchemes?.[key as ColorSchemeName] || typeof theme.getColorSchemeSelector !== 'function') {
    return {};
  }

  let selector = theme.getColorSchemeSelector(key as ColorSchemeName);
  if (selector.includes('data-') || selector.includes('.')) {
    // '*' is required as a workaround for Emotion issue (https://github.com/emotion-js/emotion/issues/2836)
    selector = `*:where(${selector.replace(/\s*&$/, '')}) &`;
  }
  return {
    [selector]: styles,
  };
}
