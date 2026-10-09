import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { fireEvent, render } from '@testing-library/react';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  setMocks,
  mockedStateWithTwoReviews,
  mockedStateWithoutReview,
} from '@shopgate/pwa-common-commerce/reviews/mock';
import Rating from './index';
import { getElementById } from './mock';

setMocks();
jest.mock('@shopgate/engage/components');

describe('Rating (product header)', () => {
  const mockedStore = configureStore();

  /**
   * Makes component.
   * @param {Object} state State
   * @returns {Object}
   */
  const getComponent = state => render(
    <Provider store={mockedStore(state)}>
      <Rating productId="foo" />
    </Provider>,
    mockRenderOptions
  );
  describe('Rendering', () => {
    it('should render rating when data is available', () => {
      const component = getComponent(mockedStateWithTwoReviews);
      expect(component.container.firstChild).toMatchSnapshot();
    });

    it('should render nothing when data is not available', () => {
      const component = getComponent(mockedStateWithoutReview);
      expect(component.container.firstChild).toBeNull();
    });
  });

  describe('Provider summary', () => {
    /**
     * @param {Object} reviews Overrides for the reviews slice.
     * @returns {Object} A state of a provider that delivers rating summaries.
     */
    const getProviderState = reviews => ({
      ...mockedStateWithTwoReviews,
      reviews: {
        ...mockedStateWithTwoReviews.reviews,
        reviewSettings: { features: ['ratingSummary'] },
        ...reviews,
      },
    });

    it('should render the provider summary instead of the product rating', () => {
      const { container } = getComponent({
        ...mockedStateWithoutReview,
        reviews: {
          ...mockedStateWithoutReview.reviews,
          reviewSettings: { features: ['ratingSummary'] },
          reviewSummariesByProductId: {
            foo: {
              average: 80,
              count: 7,
            },
          },
        },
      });

      expect(container.querySelector('.engage__reviews__rating-count')).toBeInTheDocument();
      expect(container.querySelector('.engage__product__rating__placeholder'))
        .not.toBeInTheDocument();
    });

    it('should render nothing when the provider delivered no summary', () => {
      const { container } = getComponent(getProviderState());

      expect(container.firstChild).toBeNull();
    });

    it('should render a placeholder while the first preview response is pending', () => {
      const { container } = getComponent(getProviderState({
        reviewsByProductId: {
          foo: {
            isFetching: true,
            expires: 0,
            requestId: 1,
          },
        },
      }));

      expect(container.querySelector('.engage__product__rating__placeholder'))
        .toBeInTheDocument();
      expect(container.querySelector('[role="presentation"]')).not.toBeInTheDocument();
    });

    it('should render no placeholder before the preview was requested', () => {
      const { container } = getComponent(getProviderState({ reviewsByProductId: {} }));

      expect(container.firstChild).toBeNull();
    });

    it('should render no placeholder without a provider summary capability', () => {
      const { container } = getComponent({
        ...mockedStateWithoutReview,
        product: { productsById: { foo: { productData: { id: 'foo' } } } },
        reviews: {
          ...mockedStateWithoutReview.reviews,
          reviewsByProductId: {
            foo: {
              isFetching: true,
              expires: 0,
              requestId: 1,
            },
          },
        },
      });

      expect(container.querySelector('.engage__product__rating__placeholder'))
        .not.toBeInTheDocument();
    });
  });

  describe('Scroll on click', () => {
    it('should scroll to reviews when clicked', () => {
      const scrollSpy = jest.fn();
      jest.spyOn(document, 'getElementById').mockImplementation(getElementById(scrollSpy));
      const component = getComponent(mockedStateWithTwoReviews);

      fireEvent.click(component.container.querySelector('[role="presentation"]'));

      expect(scrollSpy.mock.calls[0][0]).toBe(0);
      expect(scrollSpy.mock.calls[0][1]).toBe(70);
      expect(scrollSpy).toHaveBeenCalled();
      document.getElementById.mockReset();
      document.getElementById.mockRestore();
    });

    it('should do nothing when clicked but no reviews excerpt element', () => {
      const scrollSpy = jest.fn();
      jest.spyOn(document, 'getElementById').mockImplementation(() => null);
      const component = getComponent(mockedStateWithTwoReviews);

      fireEvent.click(component.container.querySelector('[role="presentation"]'));

      expect(scrollSpy).not.toHaveBeenCalled();
      document.getElementById.mockReset();
      document.getElementById.mockRestore();
    });
  });
});

