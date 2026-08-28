import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@shopgate/engage/styles';
import { createDefaultThemeOptions } from '@shopgate/engage/styles/theme/createDefaultThemeOptions';
import IconButton from './IconButton';

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
 * Renders a button and collects the rules that target its generated root class.
 * @param props The props the button is rendered with.
 * @returns The matching rules, each prefixed with the scheme it belongs to.
 */
const rootRules = (props: Record<string, unknown> = {}) => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IconButton aria-label="Add" {...props}>★</IconButton>
      </ThemeProvider>
    </Provider>
  );

  const emotionClass = Array.from(screen.getByRole('button').classList)
    .find(name => name.startsWith('sg-'));

  return Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
    .filter(rule => rule.includes(`.${emotionClass}`))
    .map(rule => `${rule.includes('color-scheme="dark"') ? 'dark' : 'light'} ${rule}`);
};

describe('<IconButton /> hover overlay color schemes', () => {
  // The overlay takes the color of the icon, so a light tint over a dark surface reads as a far
  // smaller change than a dark tint over a light one. Both schemes need their own opacity.
  it('should tint itself more strongly in the dark scheme', () => {
    const hoverRules = rootRules({ color: 'primary' })
      .filter(rule => rule.includes(':hover') && rule.includes('background-color'));

    const light = hoverRules.filter(rule => rule.startsWith('light'));
    const dark = hoverRules.filter(rule => rule.startsWith('dark'));

    expect(light.length).toBeGreaterThan(0);
    expect(dark.length).toBeGreaterThan(0);
    expect(light[0].replace(/^light /, '')).not.toBe(dark[0].replace(/^dark /, ''));
  });
});

describe('<IconButton /> surface background', () => {
  it('should take its surface from the iconButton token, which each scheme defines', () => {
    const rules = rootRules({ variant: 'surface' }).join('\n');

    expect(rules).toContain('var(--sg-components-iconButton-background)');
  });
});
