import React from 'react';
import { render } from '@testing-library/react';
import { ReviewsPage } from '@shopgate/engage/reviews';
import { BackBar } from 'Components/AppBar/presets';
import { UnwrappedReviews as Reviews } from './index';

jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }) => children,
}));
jest.mock('@shopgate/engage/reviews', () => ({
  ReviewsPage: jest.fn(() => null),
}));
jest.mock('Components/AppBar/presets', () => ({
  BackBar: jest.fn(() => null),
}));

describe('<Reviews> page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the app bar and the review page for the route product', () => {
    render(<Reviews id="foo" />);

    expect(BackBar).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'titles.reviews' }),
      expect.anything()
    );
    expect(ReviewsPage).toHaveBeenCalledWith({ productId: 'foo' }, expect.anything());
  });

  it('should render nothing without a product id', () => {
    render(<Reviews />);

    expect(BackBar).not.toHaveBeenCalled();
    expect(ReviewsPage).not.toHaveBeenCalled();
  });
});
