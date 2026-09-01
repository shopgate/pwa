import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Paper from './Paper';

// tss keeps injected rules in the document across tests, so assertions have to be scoped to the
// element under test — a global sweep would also match rules another test left behind.
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

const renderPaper = (ui: React.ReactElement) => {
  render(ui);
  return styleTextFor(screen.getByTestId('paper'));
};

describe('<Paper />', () => {
  it('renders children and the engage__paper class next to a caller className', () => {
    render(<Paper className="custom" data-testid="paper">content</Paper>);
    const el = screen.getByTestId('paper');

    expect(el).toHaveTextContent('content');
    expect(el).toHaveClass('engage__paper');
    expect(el).toHaveClass('custom');
  });

  it('renders as the given component', () => {
    render(<Paper component="section" data-testid="paper">x</Paper>);

    expect(screen.getByTestId('paper').tagName).toBe('SECTION');
  });

  it('passes data attributes through to the element', () => {
    render(<Paper data-testid="paper" data-foo="bar">x</Paper>);

    expect(screen.getByTestId('paper')).toHaveAttribute('data-foo', 'bar');
  });

  it('draws a shadow reading the shadow color variable for the elevation variant', () => {
    const css = renderPaper(<Paper elevation={4} data-testid="paper">x</Paper>);

    expect(css).toContain('var(--sg-palette-shadow)');
  });

  it('sets the shadow color custom property when shadowColor is given', () => {
    const css = renderPaper(<Paper shadowColor="#7a3cff" data-testid="paper">x</Paper>);

    expect(css).toContain('--sg-palette-shadow: #7a3cff');
  });

  it('draws the default border for the outlined variant', () => {
    const css = renderPaper(<Paper variant="outlined" data-testid="paper">x</Paper>);

    expect(css).toContain('var(--sg-components-border-light)');
  });

  it('lets the border prop override the default outlined border', () => {
    const css = renderPaper(<Paper variant="outlined" border="2px dashed #abc" data-testid="paper">x</Paper>);

    expect(css).toContain('2px dashed #abc');
  });

  it('resolves a palette key to its background color', () => {
    const css = renderPaper(<Paper background="emphasized" data-testid="paper">x</Paper>);

    expect(css).toContain('var(--sg-palette-background-emphasized)');
  });

  it('passes an arbitrary background color through', () => {
    const css = renderPaper(<Paper background="#123456" data-testid="paper">x</Paper>);

    expect(css).toContain('#123456');
  });

  it('applies the given border radius', () => {
    const css = renderPaper(<Paper borderRadius={12} data-testid="paper">x</Paper>);

    expect(css).toContain('border-radius: 12px');
  });

  it('drops the border radius when square', () => {
    const css = renderPaper(<Paper square borderRadius={12} data-testid="paper">x</Paper>);

    expect(css).toContain('border-radius: 0');
  });
});
