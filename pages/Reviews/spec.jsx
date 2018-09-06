import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockedStateWithAll } from '@shopgate/pwa-common-commerce/reviews/mock';

const mockedStore = configureStore();
const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
jest.mock('Components/Reviews/components/Header', () => () => 'div');

/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => {
  /* eslint-disable global-require */
  const { UnwrappedReviews } = require('./index');
  /* eslint-enable global-require */

  return mount(
    <Provider store={mockedStore(mockedStateWithAll)}>
      <UnwrappedReviews id="foo" />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Reviews> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component).toMatchSnapshot();
    expect(component.find('Reviews').exists()).toBe(true);
    expect(component.find('RatingStars').exists()).toBe(true);
    expect(component.find('LoadMore').exists()).toBe(true);
    expect(component.find('Review').length).toEqual(4);
  });
});
