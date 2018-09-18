import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Drawer from '../Drawer';
import Toast from './index';
import configureStore from '../../store';
import toastReducer from '../../reducers/toast';
import createToast from '../../actions/toast/createToast';
import removeToast from '../../actions/toast/removeToast';
import dismissToasts from '../../action-creators/toast/dismissToasts';
import { getToast } from '../../selectors/toast';
import mockRenderOptions from '../../helpers/mocks/mockRenderOptions';

const mockedStore = configureStore({ toast: toastReducer });

/* eslint-disable react/prop-types */
/**
 * Container Mock
 * @param {Object} props Props
 * @returns {JSX}
 */
const MockContainer = props => (<div>{props.children}</div>);

/**
 * Message Mock
 * @param {string} text Message text
 * @returns {JSX}
 */
const MockMessage = ({ text }) => (<span>{text}</span>);

/**
 * Action Button.
 * @param {string} text Action text.
 * @param {function} onClick OnClick callback.
 * @returns {JSX}
 */
const MockActionButton = ({ text, onClick }) => (<button onClick={onClick} >{text}</button>);
/* eslint-enable react/prop-types */

/**
 * Creates the component
 * @param {function} onClose Close callback
 * @return {*} ReactWrapper
 */
const createComponent = (onClose) => {
  /* eslint-disable global-require */
  const Toast = require('./index').default; // eslint-disable-line no-shadow
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore}>
      <Toast
        container={MockContainer}
        message={MockMessage}
        actionButton={MockActionButton}
        toast={getToast}
        onClose={onClose}
      />
    </Provider>,
    mockRenderOptions
  );
};

jest.mock('redux-logger', () => ({
  /**
   * Create logger
   * @returns {*} action
   */
  createLogger: () => () => next => action => next(action),
}));

describe('<Toast />', () => {
  const { dispatch, getState } = mockedStore;

  beforeEach(() => {
    // Reset the toasts state before each test.
    getState().toast = {
      dismissed: false,
      toasts: [],
    };
  });

  it('should dispatch a toast message', (done) => {
    const wrapper = createComponent();
    dispatch(createToast({
      duration: 0,
      message: 'Toast Message',
    }));
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockMessage).exists()).toBe(true);
    expect(wrapper.find(MockContainer).exists()).toBe(true);
    expect(wrapper.find(MockMessage).prop('text')).toEqual('Toast Message');
    wrapper.unmount();
    setTimeout(() => done(), 0);
  });

  it('should remove after timeout', (done) => {
    const wrapperWithTimeout = createComponent(() => {
      const drawerCallback = wrapperWithTimeout.find(Drawer).prop('onDidClose');
      drawerCallback();
      expect(wrapperWithTimeout.find(MockMessage).prop('text')).toEqual('Timeout Message');
      expect(getState().toast.toasts.length).toBe(0);
      wrapperWithTimeout.unmount();
      done();
    });
    dispatch(createToast({
      duration: 10,
      message: 'Timeout Message',
    }));
    wrapperWithTimeout.update();
  });

  it('should dispatch multiple toast messages', (done) => {
    const wrapper = createComponent();
    const messages = ['Toast Message 2', 'Toast Message 3'];
    const getNextToast = wrapper.find(Toast).prop('toast');

    messages.forEach((message) => {
      dispatch(createToast({
        duration: 0,
        message,
      }));
    });
    wrapper.update();

    const msg1 = getNextToast(getState());
    expect(wrapper.find(MockMessage).prop('text')).toEqual(msg1.message);
    dispatch(removeToast(msg1.id));
    wrapper.update();

    const msg2 = getNextToast(getState());
    expect(wrapper.find(MockMessage).prop('text')).toEqual(msg2.message);
    wrapper.unmount();
    setTimeout(() => done(), 0);
  });
  it('should call actionOnClick on action click', (done) => {
    const mockedOnClose = jest.fn();
    const wrapper = createComponent(mockedOnClose);
    const mockedActionOnClick = jest.fn();
    dispatch(createToast({
      message: 'hello world',
      action: 'click me',
      actionOnClick: mockedActionOnClick,
      duration: 2,
    }));
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockMessage).exists()).toBe(true);
    expect(wrapper.find(MockActionButton).exists()).toBe(true);
    wrapper.find(MockActionButton).simulate('click');
    wrapper.update();
    expect(typeof mockedActionOnClick.mock.calls[0][0] === 'function').toBe(true);
    expect(typeof mockedActionOnClick.mock.calls[0][1] === 'function').toBe(true);
    wrapper.update();
    setTimeout(() => {
      wrapper.update();
      expect(mockedOnClose).toBeCalled();
      expect(wrapper).toMatchSnapshot();
      wrapper.unmount();
      setTimeout(() => done(), 0);
    }, 0);
  });
  it('should remove replaceable toast when next is incoming', (done) => {
    const mockedOnClose = jest.fn();
    const wrapper = createComponent(mockedOnClose);
    const messages = ['Toast Message 2', 'Toast Message 3'];
    const getNextToast = wrapper.find(Toast).prop('toast');

    messages.forEach((message) => {
      dispatch(createToast({
        duration: 10,
        message,
        replaceable: true,
      }));
    });
    wrapper.update();

    const msg1 = getNextToast(getState());
    expect(wrapper.find(MockMessage).prop('text')).toEqual(msg1.message);
    wrapper.update();

    const msg2 = getNextToast(getState());
    expect(wrapper.find(MockMessage).prop('text')).toEqual(msg2.message);
    wrapper.unmount();
    setTimeout(() => done(), 0);
  });

  it('should handle dismiss', (done) => {
    createComponent();
    dispatch(createToast({
      duration: 0,
      message: 'Toast Message',
    }));

    expect(mockedStore.getState().toast.dismissed).toBe(false);
    expect(mockedStore.getState().toast.toasts.length).toEqual(1);

    mockedStore.dispatch(dismissToasts());
    // Flush toasts and flag as dismissed
    expect(mockedStore.getState().toast.dismissed).toBe(true);
    expect(mockedStore.getState().toast.toasts.length).toEqual(0);

    // Keep blocking after dismiss
    dispatch(createToast({
      duration: 0,
      message: 'Toast Message',
    }));
    expect(mockedStore.getState().toast.toasts.length).toEqual(0);

    setTimeout(() => {
      // Check unblocking
      expect(mockedStore.getState().toast.dismissed).toBe(false);
      expect(mockedStore.getState().toast.toasts.length).toEqual(0);

      done();
    }, 0);
  });
});
