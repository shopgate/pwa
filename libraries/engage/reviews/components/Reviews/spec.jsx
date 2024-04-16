import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
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
jest.mock('./components/Header', () => function Header() { return <div />; });
jest.mock('@shopgate/engage/product', () => ({
  PRODUCT_REVIEWS: 'product.reviews',
  makeIsBaseProductActive: jest.fn(() => () => true),
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
}));

// Mock the getter of the hasReviews key inside the app config, so that we can turn it off later
jest.resetModules();

const hasReviewsGetter = jest.fn().mockReturnValue(true);

Object.defineProperty(appConfig, 'hasReviews', {
  get: hasReviewsGetter,
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = mockedState => mount(
  <Provider store={mockedStore(mockedState)}>
    <Reviews productId="foo" />
  </Provider>,
  mockRenderOptions
);

describe('<Reviews />', () => {
  let component = null;

  it('should render when no reviews and rating given', () => {
    component = createComponent(mockedStateWithoutReview);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').exists()).toBe(true);
  });

  it('should render reviews, header and all reviews link', () => {
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').find('div').exists()).toBe(true);
  });

  it('should render reviews, header, but no all reviews link', () => {
    component = createComponent(mockedStateWithTwoReviews);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').find('div').exists()).toBe(false);
  });

  it('should not render when feature flag is off', () => {
    hasReviewsGetter.mockReturnValueOnce(false);

    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(false);
    expect(component.find('List').exists()).toBe(false);
    expect(component.find('AllReviewsLink').exists()).toBe(false);
  });
});
