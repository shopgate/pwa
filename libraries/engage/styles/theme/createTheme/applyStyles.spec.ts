// `transitions` is the only thing in this module graph that needs the core helpers barrel, and
// importing the real one pulls `withTheme` back in through the providers - a cycle that leaves
// `createTheme` undefined when this spec is the entry point. Same workaround as cssVarPrefix.
jest.mock('@shopgate/engage/core/helpers', () => ({ isDev: false }));

/* eslint-disable import/first */
import { createTheme } from '.';
import applyStyles from './applyStyles';
import type { ColorSchemeName, ThemeInternal } from '.';
/* eslint-enable import/first */

const bothSchemes = {
  light: {},
  dark: {},
};

describe('theme => applyStyles', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-sg-color-scheme');
    document.documentElement.classList.remove('light', 'dark');
  });

  it.each([
    ['light', '*:where([data-sg-color-scheme="light"]) &'],
    ['dark', '*:where([data-sg-color-scheme="dark"]) &'],
  ])('wraps the styles in the %s data attribute selector', (scheme, selector) => {
    const theme = createTheme({ colorSchemes: bothSchemes });

    expect(theme.applyStyles(scheme as ColorSchemeName, { color: 'red' }))
      .toEqual({ [selector]: { color: 'red' } });
  });

  it('wraps the styles in a class selector when the theme uses one', () => {
    const theme = createTheme({
      colorSchemeSelector: 'class',
      colorSchemes: bothSchemes,
    });

    expect(theme.applyStyles('dark', { color: 'red' }))
      .toEqual({
        '*:where(.dark) &': { color: 'red' },
      });
  });

  it('passes nested styles through untouched', () => {
    const theme = createTheme({ colorSchemes: bothSchemes });
    const styles = {
      color: 'red',
      '&:hover': { color: 'blue' },
      '@media (min-width: 600px)': { color: 'green' },
    };

    expect(Object.values(theme.applyStyles('dark', styles))[0]).toEqual(styles);
  });

  it('applies nothing for a scheme the theme does not provide', () => {
    // A bare theme only resolves `light`, so `dark` has no styles and no selector to target.
    const theme = createTheme();

    expect(theme.applyStyles('dark', { color: 'red' })).toEqual({});
  });

  it('applies nothing when the theme cannot build a selector', () => {
    const theme = { colorSchemes: bothSchemes } as unknown as ThemeInternal;

    expect(applyStyles.call(theme, 'dark', { color: 'red' })).toEqual({});
  });

  it.each([
    ['data attributes', 'data'],
    ['classes', 'class'],
  ])('targets the root element that setActiveColorScheme marks via %s', (_, colorSchemeSelector) => {
    const theme = createTheme({
      colorSchemeSelector: colorSchemeSelector as 'data' | 'class',
      colorSchemes: bothSchemes,
    });

    theme.setActiveColorScheme('dark');

    // The generated selector is scoped to a descendant of the marked root, so the assertion drops
    // the emotion wrapper and matches the root against the part that selects it.
    const [selector] = Object.keys(theme.applyStyles('dark', { color: 'red' }));
    const rootSelector = selector.replace('*:where(', '').replace(') &', '');

    expect(document.documentElement.matches(rootSelector)).toBe(true);
  });

  it('stops targeting the root once another scheme is activated', () => {
    const theme = createTheme({ colorSchemes: bothSchemes });

    theme.setActiveColorScheme('dark');
    theme.setActiveColorScheme('light');

    expect(document.documentElement.matches('[data-sg-color-scheme="dark"]')).toBe(false);
    expect(document.documentElement.matches('[data-sg-color-scheme="light"]')).toBe(true);
  });
});
