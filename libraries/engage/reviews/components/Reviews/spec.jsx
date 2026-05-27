import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import {
  mockedStateWithAll,
  mockedStateWithoutReview,
  mockedStateWithTwoReviews,
} from '@shopgate/pwa-common-commerce/reviews/mock';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Reviews from './index';

const mockedStore = configureStore();

/**
 * @returns {JSX}
 */
jest.mock('./components/Header', () => function Header() { return <div data-testid="reviews-header" />; });
jest.mock('./components/List', () => function List() { return <div data-testid="reviews-list" />; });
jest.mock('./components/ReviewsInfo', () => function ReviewsInfo() { return <div data-testid="reviews-info" />; });
jest.mock('@shopgate/engage/product', () => ({
  PRODUCT_REVIEWS: 'product.reviews',
  makeIsBaseProductActive: jest.fn(() => () => true),
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
  I18n: {
    Text: () => <span>reviews.button_all</span>,
  },
}));
jest.mock('@shopgate/pwa-ui-shared/ButtonLink', () => 'a');

// Mock the getter of the hasReviews key inside the app config, so that we can turn it off later
jest.resetModules();

const hasReviewsGetter = jest.fn().mockReturnValue(true);

Object.defineProperty(appConfig, 'hasReviews', {
  get: hasReviewsGetter,
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @returns {object} Render result.
 */
const createComponent = mockedState => render(
  <Provider store={mockedStore(mockedState)}>
    <Reviews productId="foo" />
  </Provider>
);

describe('<Reviews />', () => {
  it('should render when no reviews and rating given', () => {
    createComponent(mockedStateWithoutReview);

    expect(screen.getByTestId('reviews-header')).toBeTruthy();
    expect(screen.getByTestId('reviews-list')).toBeTruthy();
    expect(screen.getByTestId('reviews-info')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'reviews.button_all' })).toBeNull();
  });

  it('should render reviews, header and all reviews link', () => {
    createComponent(mockedStateWithAll);

    expect(screen.getByTestId('reviews-header')).toBeTruthy();
    expect(screen.getByTestId('reviews-list')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'reviews.button_all' })).toHaveAttribute('href', '/item/666f6f/reviews');
  });

  it('should render reviews, header, but no all reviews link', () => {
    createComponent(mockedStateWithTwoReviews);

    expect(screen.getByTestId('reviews-header')).toBeTruthy();
    expect(screen.getByTestId('reviews-list')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'reviews.button_all' })).toBeNull();
  });

  it('should not render when feature flag is off', () => {
    hasReviewsGetter.mockReturnValueOnce(false);

    const { container } = createComponent(mockedStateWithAll);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('reviews-header')).toBeNull();
    expect(screen.queryByTestId('reviews-list')).toBeNull();
    expect(screen.queryByRole('link', { name: 'reviews.button_all' })).toBeNull();
  });
});
