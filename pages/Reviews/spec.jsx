import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockedStateWithAll } from '@shopgate/pwa-common-commerce/reviews/mock';
import { UnwrappedReviews as Reviews } from './index';

const mockedStore = configureStore();
jest.mock('@shopgate/engage/components');
jest.mock('Components/Reviews/components/Header', () => () => 'div');

/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => mount(
  <Provider store={mockedStore(mockedStateWithAll)}>
    <Reviews id="foo" />
  </Provider>,
  mockRenderOptions
);

describe.skip('<Reviews> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component).toMatchSnapshot();
    expect(component.find('Reviews').exists()).toBe(true);
    expect(component.find('RatingStars').exists()).toBe(true);
    expect(component.find('LoadMore').exists()).toBe(true);
    expect(component.find('List > div').length).toEqual(4);
  });
});
