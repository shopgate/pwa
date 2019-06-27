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
      isForeground: true,
      setIsForeground: instance.setIsForeground,
    });
    expect(event.addCallback).toHaveBeenCalledTimes(2);
    expect(event.addCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_APPEAR,
      instance.setForeground
    );
    expect(event.addCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_DISAPPEAR,
      instance.setBackground
    );
  });

  it('should handle calls of setIsForeground() as expected', () => {
    const wrapper = shallow((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const instance = wrapper.instance();
    let { isForeground } = wrapper.prop('value');
    expect(isForeground).toBe(true);

    instance.setIsForeground(false);
    ({ isForeground } = wrapper.prop('value'));
    expect(isForeground).toBe(false);

    instance.setIsForeground(true);
    ({ isForeground } = wrapper.prop('value'));
    expect(isForeground).toBe(true);
  });

  it('should handle event calls as expected', () => {
    const wrapper = shallow((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const [[, setForeground], [, setBackground]] = event.addCallback.mock.calls;
    let { isForeground } = wrapper.prop('value');
    expect(isForeground).toBe(true);

    setBackground();
    ({ isForeground } = wrapper.prop('value'));
    expect(isForeground).toBe(false);

    setForeground();
    ({ isForeground } = wrapper.prop('value'));
    expect(isForeground).toBe(true);
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
      instance.setForeground
    );
    expect(event.removeCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_DISAPPEAR,
      instance.setBackground
    );
  });
});
