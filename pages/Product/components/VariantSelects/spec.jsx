/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import { selection, selectionWithWarning, selectionWithAlert } from './mock';
import styles from './style';

window.requestAnimationFrame = () => {};

/**
 + * Mock <Portal>
 + * When @shopgate/pwa-common is linked, it won't work.
 + * This is why we need to try..catch second mock. Since `jest.mock` is hoisted, there's need
 + * to use `jest.doMock`, therefore the VariantSelects component must be required from the test
 + * body.
 + */
jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));
try {
  jest.doMock('@shopgate/pwa-common/node_modules/react-portal', () => (
    ({ isOpened, children }) => (
      isOpened ? children : null
    )
  ));
} catch (e) {
  // Do nothing.
}

jest.mock('Components/Sheet', () => ({ children }) => children);

const mockedStore = configureStore();
const mockedState = {
  history: {
    pathname: '',
  },
};

/**
 * Renders a mocked component
 * @param {Array} selectionValue A selection array
 * @param {Function} spy A spy for the selection update callback
 * @return {JSX}
 */
const renderComponent = (selectionValue, spy) => {
  // eslint-disable-next-line global-require
  const VariantSelects = require('./index.jsx').Unwrapped;
  return (
    <Provider store={mockedStore(mockedState)}>
      <VariantSelects selection={selectionValue} handleSelectionUpdate={spy} />
    </Provider>
  );
};

describe('<VariantSelects />', () => {
  it('should render with variants', () => {
    const wrapper = mount(renderComponent(selection));

    expect(wrapper).toMatchSnapshot();
  });

  it('should call the handleSelectionUpdate callback', () => {
    const spy = jest.fn();

    const wrapper = mount(renderComponent(selection, spy));

    // Trigger onChange callback
    wrapper.find('Picker').first().prop('onChange')('1');

    // Check if handleSelectionUpdate callback was called
    expect(spy).toHaveBeenCalledWith('1', '1');
  });

  /**
   * The following tests are skipped right now, since the mocking of <Portal> doesn't work as
   * expected anymore. Using the styles to determine the presence of the availability texts will
   * not work anymore, since the defaults of the Availability component are now used to colorize.
   */
  describe.skip('given availability', () => {
    const warningCssClass = `.${styles.availabilities.warning.split(' ').join('.')}`;
    const alertCssClass = `.${styles.availabilities.alert.split(' ').join('.')}`;

    it('should not render availability text if available', () => {
      const wrapper = shallow(renderComponent(selection));

      expect(wrapper.find(warningCssClass).exists()).toBeFalsy();
      expect(wrapper.find(alertCssClass).exists()).toBeFalsy();

      expect(wrapper).toMatchSnapshot();
    });

    it('should render a warning', () => {
      const wrapper = mount(renderComponent(selectionWithWarning));

      expect(wrapper.find(warningCssClass).length).toBe(3);
      expect(wrapper.find(alertCssClass).exists()).toBeFalsy();
      expect(wrapper.html().indexOf('Only 1 left')).toBeGreaterThan(-1);
      expect(wrapper.html().indexOf('Only 2 left')).toBeGreaterThan(-1);
      expect(wrapper.html().indexOf('Only 3 left')).toBeGreaterThan(-1);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render an alert', () => {
      const wrapper = mount(renderComponent(selectionWithAlert));

      expect(wrapper.find(warningCssClass).exists()).toBeFalsy();
      expect(wrapper.find(alertCssClass).length).toBe(2);
      expect(wrapper.html().indexOf('Out of stock')).toBeGreaterThan(-1);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
