import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  mockProductId,
  mockedStateWithoutReview,
  mockedStateWithAll,
} from '@shopgate/pwa-common-commerce/reviews/mock';
import Header from './index';

const mockedStore = configureStore();

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @param {Object|null} props Rating prop.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState, props = {}) => mount(
  <Provider store={mockedStore(mockedState)}>
    <Header {...props} />
  </Provider>,
  mockRenderOptions
);

describe('<Header />', () => {
  let header = null;

  it('should render empty', () => {
    const productId = mockProductId;
    const { rating } = mockedStateWithoutReview.product.productsById[productId].productData;
    header = createComponent(mockedStateWithoutReview, { productId, rating });

    expect(header.find('Header').exists()).toBe(true);
    expect(header).toMatchSnapshot();
    expect(header.find('RatingStars').prop('value')).toEqual(0);
    expect(header.find('RatingCount').html()).toBe(null);
  });

  it('should render rating summary', () => {
    const productId = mockProductId;
    const { rating } = mockedStateWithAll.product.productsById[productId].productData;
    header = createComponent(mockedStateWithAll, { productId, rating });
    expect(header.find('Header').exists()).toBe(true);
    expect(header).toMatchSnapshot();
    expect(header.find('RatingStars').prop('value')).toEqual(rating.average);
    expect(header.find('RatingCount').prop('count')).toEqual(rating.count);
  });

  it('should render null when no review is provided', () => {
    header = createComponent(mockedStateWithAll);
    expect(header.html()).toBe(null);
  });
});
