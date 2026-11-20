import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HTML from './HTML';

jest.mock('./hooks', () => ({
  useHtmlWidget: () => ({ html: '<h3>Title</h3><h5>Subtitle</h5><p>Text</p>' }),
}));

jest.mock('@shopgate/engage/components', () => ({
  // eslint-disable-next-line react/prop-types
  HtmlSanitizer: ({ children, className }) => (
    // eslint-disable-next-line react/no-danger
    <div className={className} dangerouslySetInnerHTML={{ __html: children }} />
  ),
}));

const styleTextFor = element => Array.from(document.styleSheets)
  .flatMap((sheet) => {
    try {
      return Array.from(sheet.cssRules);
    } catch {
      return [];
    }
  })
  .filter(rule => rule instanceof CSSStyleRule && element.matches(rule.selectorText))
  .map(rule => rule.cssText)
  .join('');

describe('<HTML />', () => {
  it('gives headings the merchant weight of their level, with bold as fallback', async () => {
    render(<HTML />);

    expect(styleTextFor(await screen.findByText('Title')))
      .toContain('var(--sg-typography-h3-fontWeight, var(--sg-typography-fontWeightBold))');
    expect(styleTextFor(await screen.findByText('Subtitle')))
      .toContain('var(--sg-typography-h5-fontWeight, var(--sg-typography-fontWeightBold))');
  });

  it('keeps the font sizes of the headings', async () => {
    render(<HTML />);

    expect(styleTextFor(await screen.findByText('Title'))).toContain('font-size: 1.1rem');
  });
});
