import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import Description from '../index';

jest.mock('../connector', () => obj => obj);

/* eslint-disable react/prop-types */
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: (props) => {
    const { children } = props;
    return children;
  },
  PlaceholderParagraph: (props) => {
    const { children, ready } = props;
    return (
      <div data-testid="placeholder-paragraph" data-ready={String(ready)}>
        {children}
      </div>
    );
  },
  HtmlSanitizer: (props) => {
    const { children } = props;
    return children;
  },
  I18n: {
    Text: (props) => {
      const { string } = props;
      return <span>{string}</span>;
    },
  },
}));
/* eslint-enable react/prop-types */
jest.mock('@shopgate/engage/product', () => ({
  PRODUCT_DESCRIPTION: 'PRODUCT_DESCRIPTION',
}));

describe('<Description />', () => {
  const html = '<h1>foo</h1>';

  it('should render heading and empty content when html is null', () => {
    render(<Description html={null} />);

    expect(screen.getByText('product.description_heading')).toBeTruthy();
    expect(screen.getByTestId('placeholder-paragraph')).toHaveAttribute('data-ready', 'false');
    expect(screen.queryByText(html)).toBeNull();
  });

  it('should render description if data is available', () => {
    render(<Description html={html} />);

    expect(screen.getByText('product.description_heading')).toBeTruthy();
    expect(screen.getByTestId('placeholder-paragraph')).toHaveAttribute('data-ready', 'true');
    expect(screen.getByText(html)).toBeTruthy();
  });

  it('should not render component when html is an empty string', () => {
    render(<Description html="" />);

    expect(screen.queryByText('product.description_heading')).toBeNull();
    expect(screen.queryByTestId('placeholder-paragraph')).toBeNull();
  });
});
