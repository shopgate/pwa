import { render, screen } from '@testing-library/react';
import { UnwrappedReviews as Reviews } from './index';

jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }) => children,
}));
jest.mock('@shopgate/engage/reviews', () => ({
  // eslint-disable-next-line react/prop-types
  ReviewsPage: ({ productId }) => <div data-testid="reviews-page" data-product-id={productId} />,
}));
jest.mock('Components/AppBar/presets', () => ({
  // eslint-disable-next-line react/prop-types
  BackBar: ({ title }) => <div data-testid="back-bar" data-title={title} />,
}));

describe('<Reviews> page', () => {
  it('should render the app bar and the review page for the route product', () => {
    render(<Reviews id="foo" />);

    expect(screen.getByTestId('back-bar')).toHaveAttribute('data-title', 'titles.reviews');
    expect(screen.getByTestId('reviews-page')).toHaveAttribute('data-product-id', 'foo');
  });

  it('should render nothing without a product id', () => {
    render(<Reviews />);

    expect(screen.queryByTestId('back-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reviews-page')).not.toBeInTheDocument();
  });
});
