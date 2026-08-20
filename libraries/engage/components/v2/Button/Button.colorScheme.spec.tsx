import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@shopgate/engage/styles';
import { createDefaultThemeOptions } from '@shopgate/engage/styles/theme/createDefaultThemeOptions';
import Button from './Button';

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
 * Renders a button within the real theme and collects the rules that set its button color. Emotion
 * keeps every rule it inserted for the whole file, so the lookup is narrowed to the classes this
 * button actually carries.
 * @param scheme Whether to collect the dark scheme rules or the unscoped ones.
 * @param props The button props.
 * @returns The matching rule texts.
 */
const renderAndCollect = (scheme: 'light' | 'dark', props: Record<string, unknown> = {}) => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Button {...props}>label</Button>
      </ThemeProvider>
    </Provider>
  );

  const classNames = Array.from(screen.getByRole('button').classList);

  return Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
    .filter(rule => rule.includes('--button-color:'))
    .filter(rule => classNames.some(className => rule.includes(`.${className} `)
      || rule.includes(`.${className}{`)))
    .filter(rule => (scheme === 'dark'
      ? rule.includes('data-sg-color-scheme="dark"')
      : !rule.includes('data-sg-color-scheme')));
};

describe('<Button /> color schemes', () => {
  it('should keep the light scheme on the absolute grey it always used', () => {
    const rules = renderAndCollect('light');

    expect(rules.length).toBeGreaterThan(0);
    rules.forEach((rule) => {
      expect(rule).toContain('var(--sg-palette-grey-200)');
    });
  });

  // The numeric grey scale holds the same light value in every scheme, so without this the inherit
  // button paints a near white surface in dark mode and its inherited text becomes unreadable.
  it('should swap to a dark surface for the dark scheme', () => {
    const rules = renderAndCollect('dark');

    expect(rules.length).toBeGreaterThan(0);
    rules.forEach((rule) => {
      expect(rule).toContain('var(--sg-palette-background-emphasized)');
    });
  });

  it('should not add a dark scheme rule for a button that carries a palette color', () => {
    expect(renderAndCollect('dark', { color: 'primary' })).toHaveLength(0);
  });

  // Fading toward a dark backdrop cuts the brightness of the border, where fading toward a light
  // one mostly cuts its saturation, so the same opacity leaves far less of it visible in dark.
  it('should keep more of the outlined border in the dark scheme', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}><Button variant="outlined">label</Button></ThemeProvider>
      </Provider>
    );

    const classNames = Array.from(screen.getByRole('button').classList);
    const borderRules = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(rule => classNames.some(className => rule.includes(`.${className}`)))
      .filter(rule => rule.includes('--variant-outlinedBorder: oklch'));

    const light = borderRules.filter(rule => !rule.includes('data-sg-color-scheme="dark"'));
    const dark = borderRules.filter(rule => rule.includes('data-sg-color-scheme="dark"'));

    expect(light).toHaveLength(1);
    expect(light[0]).toContain('/ 0.5)');

    expect(dark).toHaveLength(1);
    expect(dark[0]).toContain('/ 0.7)');

    // The dark rule has to come last, both selectors weigh the same.
    expect(borderRules.indexOf(dark[0])).toBeGreaterThan(borderRules.indexOf(light[0]));
  });

  // The overlay takes the color of the label, so a light tint over a dark surface reads as a much
  // smaller change than a dark tint over a light one. The dark scheme compensates with more of it.
  it('should tint the hover overlay more strongly in the dark scheme', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}><Button variant="text">label</Button></ThemeProvider>
      </Provider>
    );

    const classNames = Array.from(screen.getByRole('button').classList);
    const overlayRules = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(rule => classNames.some(className => rule.includes(`.${className}:hover`)))
      .filter(rule => rule.includes('--variant-textBg'));

    const light = overlayRules.filter(rule => !rule.includes('data-sg-color-scheme="dark"'));
    const dark = overlayRules.filter(rule => rule.includes('data-sg-color-scheme="dark"'));

    expect(light).toHaveLength(1);
    expect(light[0]).toContain('/ 0.1)');

    expect(dark).toHaveLength(1);
    expect(dark[0]).toContain('/ 0.28)');

    // The dark rule has to come last, both selectors weigh the same.
    expect(overlayRules.indexOf(dark[0])).toBeGreaterThan(overlayRules.indexOf(light[0]));
  });

  it('should keep the contained hover feedback darkening in both schemes', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}><Button>label</Button></ThemeProvider>
      </Provider>
    );

    const classNames = Array.from(screen.getByRole('button').classList);
    const hoverRules = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(rule => classNames.some(className => rule.includes(`.${className}:hover`)))
      .filter(rule => rule.includes('color-mix'));

    expect(hoverRules).toHaveLength(1);
    expect(hoverRules[0]).toContain('#000 20%');
    expect(hoverRules[0]).not.toContain('data-sg-color-scheme="dark"');
  });
});
