import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@shopgate/engage/styles';
import { createDefaultThemeOptions } from '@shopgate/engage/styles/theme/createDefaultThemeOptions';
import Button from '../Button';
import ButtonGroup from './ButtonGroup';

// The global test setup mocks useTheme with a theme that only styles the light scheme, which makes
// `theme.applyStyles('dark', ...)` a no-op. The real theme is required to see the dark scheme rule.
jest.unmock('@shopgate/engage/styles/theme/hooks/useTheme');

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

const theme = createTheme(createDefaultThemeOptions());
const store = createStore(() => ({
  settings: { appSettings: { appearance: { defaultColorSchemeMode: 'light' } } },
}));

/**
 * Renders a contained group and collects the declarations of its divider color.
 * @param color The color the group is rendered with.
 * @returns The matching declarations, each prefixed with the scheme it belongs to.
 */
const dividerDeclarations = (color?: string) => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ButtonGroup variant="contained" {...(color ? { color } : {})}>
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      </ThemeProvider>
    </Provider>
  );

  const emotionClass = Array.from(screen.getByRole('group').classList)
    .find(name => name.startsWith('sg-'));

  return Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
    .filter(rule => rule.includes(`.${emotionClass}`))
    .flatMap((rule) => {
      const scheme = rule.includes('color-scheme="dark"') ? 'dark' : 'light';

      return (rule.match(/--button-group-divider: [^;]+;/g) || [])
        .map(declaration => `${scheme} ${declaration}`);
    });
};

describe('<ButtonGroup /> divider color schemes', () => {
  // The divider has to contrast with the button surface it sits on. Darkening does that wherever
  // the surface carries a color, but the dark scheme turns the inherit one near black, where
  // darkening further is not visible at all.
  it('should lighten the divider once the dark scheme darkens the surface', () => {
    const declarations = dividerDeclarations();

    expect(declarations).toEqual([
      'light --button-group-divider: color-mix(in oklch, var(--button-group-color), #000 20%);',
      'dark --button-group-divider: color-mix(in oklch, var(--button-group-color), #fff 20%);',
    ]);
  });

  // A palette color is the same in both schemes, so darkening keeps working and no second rule is
  // needed. Adding one would drop the merchant's color out of the divider.
  it('should keep darkening the divider for a group that carries a palette color', () => {
    const declarations = dividerDeclarations('primary');

    expect(declarations).toEqual([
      'light --button-group-divider: color-mix(in oklch, var(--button-group-color), #000 20%);',
    ]);
  });
});
