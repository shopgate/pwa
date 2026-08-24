// `transitions` is the only thing in this module graph that needs the core helpers barrel, and
// importing the real one pulls `withTheme` back in through the providers - a cycle that leaves
// `createTheme` undefined when this spec is the entry point. Same workaround as cssVarPrefix.
jest.mock('@shopgate/engage/core/helpers', () => ({ isDev: false }));

// eslint-disable-next-line import/first
import { createTheme } from '.';

/**
 * Reads the generated style sheets as selector / declaration pairs.
 * @param theme The theme to read from.
 * @returns The generated rules.
 */
const rules = (theme: ReturnType<typeof createTheme>) =>
  (theme.generateStyleSheets() as Array<Record<string, Record<string, string>>>)
    .flatMap(sheet => Object.entries(sheet));

describe('theme => createCssVarsForColorSchemeThemes', () => {
  // Without this the browser treats the app as a light page it may darken itself. Forced dark then
  // repaints the palette's own colors, which turns explicitly light surfaces into dark ones while
  // the computed styles still report the authored color.
  it.each([
    ['light', ':root, [data-sg-color-scheme="light"]', 'only light'],
    ['dark', '[data-sg-color-scheme="dark"]', 'only dark'],
  ])('declares the %s scheme as the one the browser must not adjust', (
    _,
    selector,
    colorScheme
  ) => {
    const theme = createTheme({
      colorSchemes: {
        light: {},
        dark: {},
      },
    });

    const declarations = rules(theme).find(([key]) => key === selector)?.[1];

    expect(declarations).toHaveProperty('colorScheme', colorScheme);
  });
});
