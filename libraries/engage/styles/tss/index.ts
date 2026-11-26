import createCache, { type EmotionCache } from '@emotion/cache';
import {
  serializeStyles,
  type CSSProperties,
  type Interpolation,
} from '@emotion/serialize';
import type { SerializedStyles } from '@emotion/utils';
import { createMakeAndWithStyles, createTss } from 'tss-react';
import { createCssAndCx } from 'tss-react/cssAndCx';
import { useTheme } from '@shopgate/engage/styles';

export { GlobalStyles, keyframes } from 'tss-react';

const insertionPoint = document.querySelector(
  'meta[name="emotion-insertion-point"]'
) as HTMLMetaElement;

export const CLASS_PREFIX = 'sg';

export const emotionCache = createCache({
  // All tss-react styles will be prefixed with `.tss-*` instead of `.css-*`
  key: CLASS_PREFIX,
  /**
   * We define a custom Emotion insertion point to control the order in which
   * TSS (Emotion-based) styles are injected into the document.
   *
   * This is required because the application is in a transition phase from
   * glamor to tss-react. Both libraries generate CSS classes with equal
   * specificity (single class selectors), so the final applied styles depend
   * on stylesheet injection order.
   *
   * By inserting Emotion styles at a deterministic position (typically before
   * glamor styles), we ensure that legacy glamor className overrides continue
   * to work as expected during the migration.
   *
   * Without this, TSS styles may be injected later and unintentionally override
   * existing glamor-based styles, leading to visual regressions.
   */
  insertionPoint,
});

// eslint-disable-next-line consistent-return
function insertWithoutScoping(
  cache: EmotionCache,
  serialized: SerializedStyles
) {
  if (cache.inserted[serialized.name] === undefined) {
    return cache.insert('', serialized, cache.sheet, true);
  }
}

/**
 * A CSS value, also with `!important` behind it.
 */
type GlobalCSSValue<V> = V | (V extends string ? `${V} !important` : never);

/**
 * CSS declarations whose values may end with `!important`.
 */
type GlobalCSSProperties = {
  [K in keyof CSSProperties]?: GlobalCSSValue<CSSProperties[K]>;
};

/**
 * Global CSS rules for `injectGlobal`: selectors with their declarations, also nested. Other
 * than the style objects of emotion, values may end with `!important`.
 */
interface GlobalCSSObject extends GlobalCSSProperties {
  [selector: string]: GlobalCSSObject | string | number | readonly (string | number)[] | undefined;
}

/**
 * Injects global CSS rules into the application.
 *
 * This is a programmatic alternative to the `GlobalStyles` component from `@shopgate/engage/styles`,
 * allowing global styles to be defined outside of React components.
 * It should be avoided when possible in favor of `GlobalStyles` for better integration with React's
 * rendering lifecycle.
 *
 * Styles are applied as written (e.g. `body`, `*`, `.class`).
 *
 * @param args Styles to apply globally
 * @example
 * injectGlobal({
 *   body: { margin: 0 }
 * });
 */
export const injectGlobal = (
  ...args: (TemplateStringsArray | Interpolation<unknown> | GlobalCSSObject)[]
) => {
  const serialized = serializeStyles(args as Interpolation<unknown>[], emotionCache.registered);
  insertWithoutScoping(emotionCache, serialized);
};

export const { tss } = createTss({
  // @ts-expect-error - We are sure about the type here
  useContext: useTheme,
  cache: emotionCache,
});

/**
 * The style helpers of tss-react, referenced by name so that the declaration doesn't contain
 * paths into tss-react that its package exports don't allow.
 */
type MakeAndWithStyles = ReturnType<typeof createMakeAndWithStyles<ReturnType<typeof useTheme>>>;

// Create makeStyles and withStyles functions for tss-react package
const makeAndWithStyles: MakeAndWithStyles = createMakeAndWithStyles({
  useTheme,
  cache: emotionCache,
});

/* eslint-disable prefer-destructuring */
export const makeStyles: MakeAndWithStyles['makeStyles'] = makeAndWithStyles.makeStyles;
export const withStyles: MakeAndWithStyles['withStyles'] = makeAndWithStyles.withStyles;
export const useStyles: MakeAndWithStyles['useStyles'] = makeAndWithStyles.useStyles;
/* eslint-enable prefer-destructuring */

export const { cx, css } = createCssAndCx({
  cache: emotionCache,
});
