import React from 'react';
import { shallow } from 'enzyme';
import appConfig from '@shopgate/pwa-common/helpers/config';
import event from '@shopgate/pwa-core/classes/Event';
import {
  APP_EVENT_VIEW_WILL_APPEAR,
  APP_EVENT_VIEW_WILL_DISAPPEAR,
} from '@shopgate/pwa-core/constants/AppEvents';
import AppProvider from '../AppProvider';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  some: 'prop',
}));

jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  addCallback: jest.fn(),
  removeCallback: jest.fn(),
}));

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

describe('engage > core > providers > AppProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize as expected', () => {
    const wrapper = shallow((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const instance = wrapper.instance();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).length).toEqual(1);
    expect(wrapper.prop('value')).toEqual({
      appConfig,
      isVisible: true,
      setIsVisible: instance.setIsVisible,
    });
    expect(event.addCallback).toHaveBeenCalledTimes(2);
    expect(event.addCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_APPEAR,
      instance.setVisible
    );
    expect(event.addCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_DISAPPEAR,
      instance.setHidden
    );
  });

  it('should handle calls of setIsVisible() as expected', () => {
    const wrapper = shallow((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const instance = wrapper.instance();
    let { isVisible } = wrapper.prop('value');
    expect(isVisible).toBe(true);

    instance.setIsVisible(false);
    ({ isVisible } = wrapper.prop('value'));
    expect(isVisible).toBe(false);

    instance.setIsVisible(true);
    ({ isVisible } = wrapper.prop('value'));
    expect(isVisible).toBe(true);
  });

  it('should handle event calls as expected', () => {
    const wrapper = shallow((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const [[, setVisible], [, setHidden]] = event.addCallback.mock.calls;
    let { isVisible } = wrapper.prop('value');
    expect(isVisible).toBe(true);

    setHidden();
    ({ isVisible } = wrapper.prop('value'));
    expect(isVisible).toBe(false);

    setVisible();
    ({ isVisible } = wrapper.prop('value'));
    expect(isVisible).toBe(true);
  });

  it('should remove the event listeners on unmount', () => {
    const wrapper = shallow((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const instance = wrapper.instance();
    wrapper.unmount();

    expect(event.removeCallback).toHaveBeenCalledTimes(2);
    expect(event.removeCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_APPEAR,
      instance.setVisible
    );
    expect(event.removeCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_DISAPPEAR,
      instance.setHidden
    );
  });
});
