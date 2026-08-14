// `transitions` is the only thing in this module graph that needs the core helpers barrel, and
// importing the real one pulls `withTheme` back in through the providers - a cycle that leaves
// `createTheme` undefined when this spec is the entry point. Same workaround as createTypography.
jest.mock('@shopgate/engage/core/helpers', () => ({ isDev: false }));

// eslint-disable-next-line import/first
import { createTheme } from '.';

/**
 * Reads the declarations of the generated `:root` style sheets, merged into one object.
 * @param theme The theme to read from.
 * @returns The generated custom properties.
 */
const rootDeclarations = (theme: ReturnType<typeof createTheme>) =>
  (theme.generateStyleSheets() as Array<Record<string, Record<string, string>>>)
    .reduce((acc, sheet) => Object.assign(acc, ...Object.values(sheet)), {});

describe('theme => cssVarPrefix', () => {
  // The variant font weights reference the shared `fontWeight*` properties by name, and those names
  // are composed from cssVarPrefix. A reference built with a different prefix than the parser emits
  // would silently fall back to its inlined default and break runtime token overrides.
  it.each([
    ['the default prefix', undefined, '--sg-typography'],
    ['a custom prefix', 'brand', '--brand-typography'],
  ])('references the properties it generates with %s', (_, cssVarPrefix, prefix) => {
    const theme = createTheme(cssVarPrefix ? { cssVarPrefix } : {});

    const declarations = rootDeclarations(theme);

    expect(declarations[`${prefix}-fontWeightRegular`]).toBe(400);
    expect(declarations[`${prefix}-body1-fontWeight`])
      .toBe(`var(${prefix}-fontWeightRegular, 400)`);
  });
});
