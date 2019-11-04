import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { UIEvents } from '@shopgate/pwa-core';
import LoadingContext from './context';
import LoadingProvider from './index';

jest.unmock('@shopgate/pwa-core');

const MOCKED_PATH = 'some/path';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const MockComponent = ({ isLoading, path }) => (isLoading(path) ? <div /> : null);

MockComponent.propTypes = {
  isLoading: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

/**
 * @param {string} path A mocked path.
 * @return {JSX}
 */
const createWrapper = (path = '/') => {
  const wrapper = mount((
    <LoadingProvider>
      <LoadingContext.Consumer>
        {props => (
          <MockComponent {...props} path={path} />
        )}
      </LoadingContext.Consumer>
    </LoadingProvider>
  ));

  return wrapper;
};

describe('LoadingProvider', () => {
  beforeAll(() => {
    jest.resetAllMocks();
    jest.spyOn(UIEvents, 'addListener');
    jest.spyOn(UIEvents, 'removeListener');
    jest.spyOn(UIEvents, 'emit');
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render the child component when the current path is not loading', () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state('loading')).toEqual(new Map());
    expect(wrapper.find('MockComponent > div').exists()).toBe(false);
  });

  it('should render the child component when the current path is loading', () => {
    const wrapper = createWrapper(MOCKED_PATH);
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().setLoading(MOCKED_PATH);
    wrapper.update();
    expect(wrapper.find('MockComponent > div').exists()).toBe(true);
    wrapper.instance().unsetLoading(MOCKED_PATH);
    wrapper.update();
    expect(wrapper.find('MockComponent > div').exists()).toBe(false);
  });

  it('should populate internal methods its children', () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
    const child = wrapper.find('MockComponent');
    expect(child.prop('setLoading')).toEqual(wrapper.instance().setLoading);
    expect(child.prop('unsetLoading')).toEqual(wrapper.instance().unsetLoading);
    expect(child.prop('isLoading')).toEqual(wrapper.instance().isLoading);
    expect(child.prop('loading')).toEqual(wrapper.state('loading'));
  });

  it('should register event listeners within the constructor', () => {
    const wrapper = createWrapper();
    expect(UIEvents.addListener).toHaveBeenCalledTimes(3);
    expect(UIEvents.addListener)
      .toHaveBeenCalledWith(LoadingProvider.SET, wrapper.instance().setLoading);
    expect(UIEvents.addListener)
      .toHaveBeenCalledWith(LoadingProvider.RESET, wrapper.instance().resetLoading);
    expect(UIEvents.addListener)
      .toHaveBeenCalledWith(LoadingProvider.UNSET, wrapper.instance().unsetLoading);
  });

  it('should remove event listeners within componentWillUnmount', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
    expect(UIEvents.removeListener).toHaveBeenCalledTimes(3);
    expect(UIEvents.removeListener)
      .toHaveBeenCalledWith(LoadingProvider.SET, expect.any(Function));
    expect(UIEvents.removeListener)
      .toHaveBeenCalledWith(LoadingProvider.RESET, expect.any(Function));
    expect(UIEvents.removeListener)
      .toHaveBeenCalledWith(LoadingProvider.UNSET, expect.any(Function));
  });

  describe('LoadingProvider.setLoading()', () => {
    it('should emit the SET event', () => {
      LoadingProvider.setLoading(MOCKED_PATH);
      expect(UIEvents.emit).toHaveBeenCalledTimes(1);
      expect(UIEvents.emit).toHaveBeenCalledWith(LoadingProvider.SET, MOCKED_PATH);
    });
  });

  describe('LoadingProvider.resetLoading()', () => {
    it('should emit the RESET event', () => {
      LoadingProvider.resetLoading(MOCKED_PATH);
      expect(UIEvents.emit).toHaveBeenCalledTimes(1);
      expect(UIEvents.emit).toHaveBeenCalledWith(LoadingProvider.RESET, MOCKED_PATH);
    });
  });

  describe('LoadingProvider.unsetLoading()', () => {
    it('should emit the UNSET event', () => {
      LoadingProvider.unsetLoading(MOCKED_PATH);
      expect(UIEvents.emit).toHaveBeenCalledTimes(1);
      expect(UIEvents.emit).toHaveBeenCalledWith(LoadingProvider.UNSET, MOCKED_PATH);
    });
  });

  describe('.setLoading()', () => {
    it('should increase the loading counter for a path', () => {
      const instance = createWrapper().instance();
      const { loading } = instance.state;
      expect(loading.has(MOCKED_PATH)).toBe(false);

      instance.setLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(true);
      expect(loading.get(MOCKED_PATH)).toBe(1);

      instance.setLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(true);
      expect(loading.get(MOCKED_PATH)).toBe(2);
    });
  });

  describe('.resetLoading()', () => {
    it('should resets the loading counter for a path', () => {
      const instance = createWrapper().instance();
      const { loading } = instance.state;
      expect(loading.has(MOCKED_PATH)).toBe(false);

      instance.resetLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(false);

      instance.setLoading(MOCKED_PATH);
      instance.setLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(true);
      expect(loading.get(MOCKED_PATH)).toBe(2);

      instance.resetLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(false);
    });
  });

  describe('.unsetLoading()', () => {
    it('should decrease the loading counter for a path', () => {
      const instance = createWrapper().instance();
      const { loading } = instance.state;
      instance.setLoading(MOCKED_PATH);
      instance.setLoading(MOCKED_PATH);

      instance.unsetLoading(MOCKED_PATH);
      expect(loading.get(MOCKED_PATH)).toBe(1);

      instance.unsetLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(false);

      instance.unsetLoading(MOCKED_PATH);
      expect(loading.has(MOCKED_PATH)).toBe(false);
    });
  });

  describe('.isLoading()', () => {
    it('should work as expected', () => {
      const ANOTHER_PATH = '/some/other/path';
      const instance = createWrapper().instance();

      expect(instance.isLoading(MOCKED_PATH)).toBe(false);
      expect(instance.isLoading(ANOTHER_PATH)).toBe(false);

      instance.setLoading(MOCKED_PATH);
      expect(instance.isLoading(MOCKED_PATH)).toBe(true);
      expect(instance.isLoading(ANOTHER_PATH)).toBe(false);

      instance.setLoading(ANOTHER_PATH);
      expect(instance.isLoading(MOCKED_PATH)).toBe(true);
      expect(instance.isLoading(ANOTHER_PATH)).toBe(true);

      instance.unsetLoading(MOCKED_PATH);
      instance.unsetLoading(MOCKED_PATH);
      instance.unsetLoading(ANOTHER_PATH);
      instance.unsetLoading(ANOTHER_PATH);
      expect(instance.isLoading(MOCKED_PATH)).toBe(false);
      expect(instance.isLoading(ANOTHER_PATH)).toBe(false);
    });
  });
});
