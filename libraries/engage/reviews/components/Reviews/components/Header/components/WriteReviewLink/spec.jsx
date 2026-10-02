import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WriteReviewLink from './index';

const mockPush = jest.fn();

jest.mock('@shopgate/engage/core/hooks/useNavigation', () => ({
  useNavigation: () => ({ push: mockPush, replace: jest.fn() }),
}));

/* eslint-disable react/prop-types */

jest.mock('@shopgate/engage/components', () => ({
  I18n: {
    Text: ({ string }) => <span>{string}</span>,
  },
}));

/**
 * Creates component.
 * @return {void}
 */
const createComponent = () => render(<WriteReviewLink productId="foo" />);

describe('<WriteReviewLink>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render when current product is set', () => {
    createComponent();

    expect(screen.getByText('reviews.button_add')).toBeTruthy();
  });

  // The button renders as an anchor on web builds only, so the navigation itself is the contract.
  it('should navigate to the write review route when pressed', () => {
    createComponent();

    fireEvent.click(screen.getByRole('button', { name: 'reviews.button_add' }));
    jest.runAllTimers();

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/item/666f6f/write_review' });
  });

  it('should render a regular width button by default', () => {
    const { container } = createComponent();

    expect(container.querySelector('.engage__reviews__write-review-link'))
      .not.toHaveAttribute('data-full-width');
    expect(screen.getByRole('button')).not.toHaveAttribute('data-full-width');
  });

  it('should render a full width button', () => {
    const { container } = render(<WriteReviewLink productId="foo" fullWidth />);

    expect(container.querySelector('.engage__reviews__write-review-link'))
      .toHaveAttribute('data-full-width', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('data-full-width');
  });
});

/* eslint-enable react/prop-types */
