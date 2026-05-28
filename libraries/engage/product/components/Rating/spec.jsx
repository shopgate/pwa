import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { fireEvent, render } from '@shopgate/pwa-unit-test/rtlUtils';
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

