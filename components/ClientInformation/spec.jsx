/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Unwrapped as ClientInformation } from './index';

describe('<ClientInformation />', () => {
  const mockData = {
    isFetching: false,
    appVersion: '1.2.3',
    libVersion: '4.5.6',
    codebaseVersion: '7.8.9',
    deviceId: 'my-awesome-device-id',
  };

  it('should not render if no data is available', () => {
    const wrapper = shallow(<ClientInformation client={{}} enableDebugLogging={() => {}} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('should not render if the data is still being fetched', () => {
    const wrapper = shallow(
      <ClientInformation client={{ isFetching: true }} enableDebugLogging={() => {}} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').exists()).toBe(false);
  });

  describe('App and lib version, and device ID', () => {
    it('should render the app and lib version', () => {
      const wrapper = shallow(
        <ClientInformation client={mockData} enableDebugLogging={() => {}} />
      );

      expect(wrapper).toMatchSnapshot();

      const html = wrapper.html();
      expect(html.indexOf(mockData.appVersion) > 0).toBe(true);
      expect(html.indexOf(mockData.libVersion) > 0).toBe(true);
      expect(html.indexOf(mockData.codebaseVersion) > 0).toBe(true);
      expect(html.indexOf(mockData.deviceId) > 0).toBe(false);
    });

    it('should show the device ID', () => {
      const wrapper = shallow(
        <ClientInformation client={mockData} enableDebugLogging={() => {}} />
      );

      wrapper.setState({ isDeviceIdVisible: true });
      wrapper.render();

      expect(wrapper).toMatchSnapshot();

      const html = wrapper.html();
      expect(html.indexOf(mockData.appVersion) > 0).toBe(true);
      expect(html.indexOf(mockData.libVersion) > 0).toBe(true);
      expect(html.indexOf(mockData.codebaseVersion) > 0).toBe(true);
      expect(html.indexOf(mockData.deviceId) > 0).toBe(true);
    });
  });

  describe('User interaction', () => {
    jest.useFakeTimers();

    it('should start the timer if touched', () => {
      const wrapper = mount(<ClientInformation client={mockData} enableDebugLogging={() => {}} />);
      const instance = wrapper.instance();

      instance.showDeviceId = jest.fn();

      wrapper.find('div').simulate('touchstart');
      jest.runAllTimers();

      expect(wrapper.instance().showDeviceId).toHaveBeenCalled();
    });

    it('should abort the timer if touch ends under 5 seconds', () => {
      const wrapper = mount(<ClientInformation client={mockData} enableDebugLogging={() => {}} />);
      const instance = wrapper.instance();

      instance.showDeviceId = jest.fn();

      wrapper.find('div').simulate('touchstart');
      instance.cancelTimer();
      jest.runAllTimers();

      expect(wrapper.instance().showDeviceId).not.toHaveBeenCalled();
    });
  });
});
