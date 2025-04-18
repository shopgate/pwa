import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
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
  const getComponent = state => mount(
    <Provider store={mockedStore(state)}>
      <Rating productId="foo" />
    </Provider>,
    mockRenderOptions
  );
  describe('Rendering', () => {
    it('should render rating when data is available', () => {
      const component = getComponent(mockedStateWithTwoReviews);
      expect(component).toMatchSnapshot();
    });
    it('should render nothing when data is not available', () => {
      const component = getComponent(mockedStateWithoutReview);
      expect(component.isEmptyRender()).toBe(true);
    });
  });
  describe('Scroll on click', () => {
    const scrollSpy = jest.fn();
    it('should scroll to reviews when clicked', () => {
      jest.spyOn(document, 'getElementById').mockImplementation(getElementById(scrollSpy));
      const component = getComponent(mockedStateWithTwoReviews);
      component.simulate('click');
      expect(scrollSpy.mock.calls[0][0]).toBe(0);
      expect(scrollSpy.mock.calls[0][1]).toBe(70);
      expect(scrollSpy).toHaveBeenCalled();
      document.getElementById.mockReset();
      document.getElementById.mockRestore();
    });
    it('should do nothing when clicked but no reviews excerpt element', () => {
      jest.spyOn(document, 'getElementById').mockImplementation(() => null);
      const component = getComponent(mockedStateWithTwoReviews);
      component.simulate('click');
      expect(scrollSpy.mock.calls.length).toBe(1);
      document.getElementById.mockReset();
      document.getElementById.mockRestore();
    });
  });
});

