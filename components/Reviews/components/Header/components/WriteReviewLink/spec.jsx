import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { mockedStateWithAll } from '@shopgate/pwa-common-commerce/reviews/mock';
import WriteReviewLink from './index';

const mockedStore = configureStore();

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState) => {
  const Component = (
    <Provider store={mockedStore(mockedState)}>
      <WriteReviewLink productId="foo" />
    </Provider>
  );
  return mount(Component);
};

describe('<WriteReviewLink>', () => {
  let component = null;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render when current product is set', () => {
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('span').exists()).toBe(true);
  });
});
