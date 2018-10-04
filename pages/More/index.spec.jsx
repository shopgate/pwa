import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MockedView } from 'Components/View/mock';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  getLoggedInStore,
  getLoggedOutStore,
} from './mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);

/**
 * Creates component
 * @param {Object} store State that would be used for store.
 * @return {Object}
 */
const createComponent = (store) => {
  /* eslint-disable global-require */
  const More = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={store}>
      <More />
    </Provider>,
    mockRenderOptions
  );
};

describe('More', () => {
  it('should render for logged out user', () => {
    const component = createComponent(getLoggedOutStore());
    expect(component.html().includes('login.button')).toBe(true);
    expect(component.html().includes('navigation.welcome_message')).toBe(false);
    expect(component.html().includes('navigation.logout')).toBe(false);
    expect(component).toMatchSnapshot();
  });
  it('should render for logged in user', () => {
    const component = createComponent(getLoggedInStore());
    expect(component.html().includes('login.button')).toBe(false);
    expect(component.html().includes('navigation.welcome_message')).toBe(true);
    expect(component.html().includes('navigation.logout')).toBe(true);
    expect(component).toMatchSnapshot();
  });
});
