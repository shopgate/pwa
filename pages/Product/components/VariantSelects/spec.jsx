import React from 'react';
import { shallow, mount } from 'enzyme';
import { selection, selectionWithWarning, selectionWithAlert } from './mock';
import { Unwrapped as VariantSelects } from './index';
import styles from './style';

window.requestAnimationFrame = () => {
};

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
jest.mock('@shopgate/pwa-ui-shared/Sheet', () => ({ children }) => children);

// Mock the redux connect() method instead of providing a fake store.
jest.mock('@shopgate/pwa-common/components/Router/components/RouteGuard', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    currentRoute: '',
  };

  return newObj;
});

describe('<VariantSelects />', () => {
  it('should render with variants', () => {
    const wrapper = shallow(<VariantSelects selection={selection} />);
    expect(wrapper).toMatchSnapshot();
  });

  it.skip('should call the handleSelectionUpdate callback', () => {
    const spy = jest.fn();
    const wrapper = mount(<VariantSelects selection={selection} handleSelectionUpdate={spy} />);

    // Trigger onChange callback
    wrapper.find('Picker').first().prop('onChange')('1');

    // Check if handleSelectionUpdate callback was called
    expect(spy).toHaveBeenCalledWith('1', '1');
  });

  describe.skip('given availability', () => {
    const warningCssClass = `.${styles.availabilities.warning.split(' ').join('.')}`;
    const alertCssClass = `.${styles.availabilities.alert.split(' ').join('.')}`;

    it('should not render availability text if available', () => {
      const wrapper = shallow(<VariantSelects selection={selection} />);

      expect(wrapper.find(warningCssClass).exists()).toBeFalsy();
      expect(wrapper.find(alertCssClass).exists()).toBeFalsy();

      expect(wrapper).toMatchSnapshot();
    });

    it('should render a warning', () => {
      const wrapper = mount(<VariantSelects selection={selectionWithWarning} />);

      expect(wrapper.find(warningCssClass).length).toBe(3);
      expect(wrapper.find(alertCssClass).exists()).toBeFalsy();
      expect(wrapper.html().indexOf('Only 1 left')).toBeGreaterThan(-1);
      expect(wrapper.html().indexOf('Only 2 left')).toBeGreaterThan(-1);
      expect(wrapper.html().indexOf('Only 3 left')).toBeGreaterThan(-1);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render an alert', () => {
      const wrapper = mount(<VariantSelects selection={selectionWithAlert} />);

      expect(wrapper.find(warningCssClass).exists()).toBeFalsy();
      expect(wrapper.find(alertCssClass).length).toBe(2);
      expect(wrapper.html().indexOf('Out of stock')).toBeGreaterThan(-1);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
