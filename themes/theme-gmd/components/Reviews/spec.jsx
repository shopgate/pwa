import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  mockedStateWithAll,
  mockedStateWithoutReview,
  mockedStateWithTwoReviews,
  setMocks,
} from '@shopgate/pwa-common-commerce/reviews/mock';

const mockedStore = configureStore();

/**
 * @returns {JSX}
 */
const Header = () => <div />;
const mock = Header;
jest.mock('Components/Reviews/components/Header', () => mock);

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState) => {
  /* eslint-disable global-require */
  const Reviews = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(mockedState)}>
      <Reviews productId="foo" />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Reviews />', () => {
  let component = null;

  it('should render when no reviews and rating given', () => {
    setMocks();
    component = createComponent(mockedStateWithoutReview);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').exists()).toBe(true);
  });

  it('should render reviews, header and all reviews link', () => {
    setMocks();
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').find('div').exists()).toBe(true);
  });

  it('should render reviews, header, but no all reviews link', () => {
    setMocks();
    component = createComponent(mockedStateWithTwoReviews);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').find('div').exists()).toBe(false);
  });

  it('should not render when feature flag is off', () => {
    setMocks(false);
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(false);
    expect(component.find('List').exists()).toBe(false);
    expect(component.find('AllReviewsLink').exists()).toBe(false);
  });
});
