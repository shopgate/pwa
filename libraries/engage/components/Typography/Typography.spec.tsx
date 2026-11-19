import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Typography from './Typography';

const styleTextFor = (element: Element) => Array.from(document.styleSheets)
  .flatMap((sheet) => {
    try {
      return Array.from(sheet.cssRules);
    } catch {
      return [];
    }
  })
  .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule
    && element.matches(rule.selectorText))
  .map(rule => rule.cssText)
  .join('');

const renderTypography = (ui: React.ReactElement) => {
  render(ui);
  return styleTextFor(screen.getByTestId('typography'));
};

describe('<Typography />', () => {
  it('uses the merchant weight of a heading, with the theme weight as fallback', () => {
    const css = renderTypography(<Typography variant="h3" data-testid="typography">x</Typography>);

    expect(css).toContain('var(--sg-typography-h3-fontWeight, var(--sg-typography-fontWeightMedium, 500))');
  });

  it('lets the merchant weight of a heading win over the fontWeight prop', () => {
    const css = renderTypography(
      <Typography variant="h3" fontWeight="bold" data-testid="typography">x</Typography>
    );

    expect(css).toContain('var(--sg-typography-h3-fontWeight, var(--sg-typography-fontWeightBold))');
  });

  it('keeps the fontWeight prop on variants that are no headings', () => {
    const css = renderTypography(
      <Typography variant="body2" fontWeight="bold" data-testid="typography">x</Typography>
    );

    expect(css).toContain('var(--sg-typography-fontWeightBold)');
    expect(css).not.toContain('-fontWeight, ');
  });
});
