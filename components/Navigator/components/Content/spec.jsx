import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import NavigatorContent from './index';
import { defaultState } from '../../mock';

const mockedStore = configureStore();
// Mock the redux connect() method instead of providing a fake store.
jest.mock('../../context');

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} props Mocked props.
 * @return {ReactWrapper}
 */
const createComponent = (props) => {
  const store = mockedStore({
    ...defaultState,
    ui: {
      general: {
        title: 'test',
      },
    },
  });
  return mount((
    <Provider store={store}>
      <NavigatorContent {...props} />
    </Provider>, mockRenderOptions
  ));
};

describe('<NavigatorContent />', () => {
  it('should render the logo', () => {
    const wrapper = createComponent({ routePattern: '/' });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Logo').exists()).toBe(true);
  });

  it('should render the title', () => {
    const wrapper = createComponent({ routePattern: 'some/other/path' });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Title').exists()).toBe(true);
  });
});
