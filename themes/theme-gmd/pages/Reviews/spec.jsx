import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockedStateWithAll } from '@shopgate/pwa-common-commerce/reviews/mock';
import { UnwrappedReviews as Reviews } from './index';

const mockedStore = configureStore();
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/reviews/components/Reviews/components/Header', () => () => 'div');
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => null,
}));

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

describe('<Reviews> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component).toMatchSnapshot();
    expect(component.find('Reviews').exists()).toBe(true);
    expect(component.find('RatingStars').exists()).toBe(true);
    expect(component.find('LoadMore').exists()).toBe(true);
    expect(component.find('List li').length).toEqual(4);
  });
});
