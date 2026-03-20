import createCache from '@emotion/cache';
import { createMakeAndWithStyles, createTss } from 'tss-react';
import { createCssAndCx } from 'tss-react/cssAndCx';
import { useTheme } from '@shopgate/engage/styles';

export { GlobalStyles, keyframes } from 'tss-react';

const insertionPoint = document.querySelector(
  'meta[name="emotion-insertion-point"]'
) as HTMLMetaElement;

export const emotionCache = createCache({
  // All tss-react styles will be prefixed with `.tss-*` instead of `.css-*`
  key: 'tss',
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

export const { tss } = createTss({
  // @ts-expect-error - We are sure about the type here
  useContext: useTheme,
  cache: emotionCache,
});

// Create makeStyles and withStyles functions for tss-react package
export const { makeStyles, withStyles, useStyles } = createMakeAndWithStyles({
  useTheme,
  cache: emotionCache,
});

export const { cx, css } = createCssAndCx({
  cache: emotionCache,
});
