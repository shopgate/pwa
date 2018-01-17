/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Drawer from '../Drawer';
import Toast from './index';
import configureStore from '../../store';
import toastReducer from '../../reducers/toast';
import createToast from '../../actions/toast/createToast';
import removeToast from '../../actions/toast/removeToast';
import { getToast } from '../../selectors/toast';
import mockRenderOptions from '../../helpers/mocks/mockRenderOptions';

const mockedStore = configureStore({ toast: toastReducer });
const MockContainer = (props) => (<div>{props.children}</div>);
const MockMessage = ({ text }) => (<span>{text}</span>);

const createComponent = (onClose = () => {}) => {
  /* eslint-disable global-require */
  const Toast = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore}>
      <Toast
        container={MockContainer}
        message={MockMessage}
        toast={getToast}
        onClose={onClose}
      />
    </Provider>,
    mockRenderOptions
  );
};

jest.mock('redux-logger', () => ({
  createLogger: () => () => next => action => next(action),
}));

describe('<Toast />', () => {
  const { dispatch, getState } = mockedStore;
  let wrapper;

  beforeEach(() => {
    // Reset the toasts state before each test.
    getState().toast = [];
    wrapper = createComponent();
  });

  it('should dispatch a toast message', () => {
    dispatch(createToast({ message: 'Toast Message', duration: 0 }));
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockMessage).exists()).toBe(true);
    expect(wrapper.find(MockContainer).exists()).toBe(true);
  });

  it('should remove after timeout', (done) => {
    const wrapper = createComponent(() => {
      const drawerCallback = wrapper.find(Drawer).prop('onDidClose');
      drawerCallback();
      expect(getState().toast.length).toBe(0);
      done();
    });
    dispatch(createToast({ message: 'Timeout Message', duration: 10 }));
    wrapper.update();
  });

  it('should dispatch multiple toast messages', () => {
    const messages = ['Toast Message 2', 'Toast Message 3'];
    const getNextToast = wrapper.find(Toast).prop('toast');

    messages.forEach((message) => {
      dispatch(createToast({ message, duration: 0 }));
    });
    wrapper.update();

    const msg1 = getNextToast(getState());
    expect(wrapper.find(MockMessage).prop('text')).toEqual(msg1.message);
    dispatch(removeToast(msg1.id));
    wrapper.update();

    const msg2 = getNextToast(getState());
    expect(wrapper.find(MockMessage).prop('text')).toEqual(msg2.message);
  });
});
