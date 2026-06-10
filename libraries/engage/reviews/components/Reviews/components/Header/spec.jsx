import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  mockProductId,
  mockedStateWithoutReview,
  mockedStateWithAll,
} from '@shopgate/pwa-common-commerce/reviews/mock';
import Header from './index';

const mockNoReviews = jest.fn(props => (
  <div data-testid="no-reviews" data-product-id={props.productId} />
));

const mockReviewsExcerpt = jest.fn(props => (
  <div
    data-testid="reviews-excerpt"
    data-product-id={props.productId}
    data-average={String(props.average)}
    data-count={String(props.count)}
    data-with-top-gap={String(props.withTopGap)}
  />
));

jest.mock('./connector', () => component => component);
jest.mock('./components/NoReviews', () => props => mockNoReviews(props));
jest.mock('./components/ReviewsExcerpt', () => props => mockReviewsExcerpt(props));

/**
 * Creates component with provided props.
 * @param {Object} props Header props.
 * @returns {object} Render result.
 */
const createComponent = (props = {}) => render(<Header {...props} />);

describe('<Header />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty', () => {
    const productId = mockProductId;
    const { rating } = mockedStateWithoutReview.product.productsById[productId].productData;
    createComponent({
      productId,
      rating,
    });

    expect(screen.getByTestId('no-reviews')).toHaveAttribute('data-product-id', productId);
    expect(mockNoReviews).toHaveBeenCalledWith(expect.objectContaining({ productId }));
    expect(screen.queryByTestId('reviews-excerpt')).toBeNull();
  });

  it('should render rating summary', () => {
    const productId = mockProductId;
    const { rating } = mockedStateWithAll.product.productsById[productId].productData;
    createComponent({
      productId,
      rating,
    });

    expect(screen.getByTestId('reviews-excerpt')).toHaveAttribute('data-product-id', productId);
    expect(screen.getByTestId('reviews-excerpt')).toHaveAttribute('data-average', String(rating.average));
    expect(screen.getByTestId('reviews-excerpt')).toHaveAttribute('data-count', String(rating.count));
    expect(mockReviewsExcerpt).toHaveBeenCalledWith(expect.objectContaining({
      productId,
      average: rating.average,
      count: rating.count,
      withTopGap: false,
    }));
    expect(screen.queryByTestId('no-reviews')).toBeNull();
  });

  it('should render null when no review is provided', () => {
    const { container } = createComponent({ productId: 'some-id' });

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('no-reviews')).toBeNull();
    expect(screen.queryByTestId('reviews-excerpt')).toBeNull();
  });
});
