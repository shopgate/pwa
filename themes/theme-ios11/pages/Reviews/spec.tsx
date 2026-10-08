import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { UnwrappedReviews as Reviews } from './index';

jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }: { children: ReactNode }) => children,
}));
jest.mock('@shopgate/engage/reviews', () => ({
  ReviewsPage: ({ productId }: { productId: string }) => (
    <div data-testid="reviews-page" data-product-id={productId} />
  ),
}));
jest.mock('Components/AppBar/presets', () => ({
  BackBar: ({ title }: { title: string }) => <div data-testid="back-bar" data-title={title} />,
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
