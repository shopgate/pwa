import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import Message from './components/Message';
import Container from './components/Container';
import ActionButton from './components/ActionButton';
import { mockedState } from './mock';

const mockedStore = configureStore();

/**
 * @param {Object} state The application state.
 * @returns {JSX}
 */
const createComponent = (state) => {
  /* eslint-disable global-require */
  const SnackBar = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(state)}>
      <SnackBar />
    </Provider>,
    mockRenderOptions
  );
};

describe('<SnackBar />', () => {
  it('should render component without action', () => {
    const wrapper = createComponent(mockedState);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Container).exists()).toBe(true);
  });
  it('should render component with action button', () => {
    const mock = {
      ...mockedState,
      toast: {
        ...mockedState.toast,
        ...{
          toasts: [
            {
              ...mockedState.toast.toasts[0],
              action: 'click me',
            },
          ],
        },
      },
    };
    const wrapper = createComponent(mock);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Container).exists()).toBe(true);
    expect(wrapper.find(ActionButton).exists()).toBe(true);
  });
});
