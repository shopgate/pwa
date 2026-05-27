import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import WriteReviewLink from './index';

/* eslint-disable react/prop-types */

jest.mock('@shopgate/engage/components', () => ({
  I18n: {
    Text: ({ string }) => <span>{string}</span>,
  },
}));

jest.mock('@shopgate/pwa-ui-shared/ButtonLink', () => {
  function ButtonLink(props) {
    const {
      children,
      href,
      noGap,
      ...rest
    } = props;

    return (
      <a href={href} {...rest} data-no-gap={String(noGap)}>
        {children}
      </a>
    );
  }

  return ButtonLink;
});

/**
 * Creates component.
 * @return {void}
 */
const createComponent = () => render(<WriteReviewLink productId="foo" />);

describe('<WriteReviewLink>', () => {
  it('should render when current product is set', () => {
    createComponent();

    const link = screen.getByRole('link', { name: 'reviews.button_add' });
    expect(link).toHaveAttribute('href', '/item/666f6f/write_review');
    expect(screen.getByText('reviews.button_add')).toBeTruthy();
  });
});

/* eslint-enable react/prop-types */
