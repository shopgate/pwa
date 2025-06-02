import createCache from '@emotion/cache';
import { createMakeAndWithStyles, createTss } from 'tss-react';
import { useTheme } from '@shopgate/engage/styles';

export { GlobalStyles } from 'tss-react';

export const emotionCache = createCache({
  // All tss-react styles will be prefixed with `.tss-*` instead of `.css-*`
  key: 'tss',
});

export const { tss } = createTss({
  useContext: useTheme,
});

// Create makeStyles and withStyles functions for tss-react package
export const { makeStyles, withStyles } = createMakeAndWithStyles({
  useTheme,
});
