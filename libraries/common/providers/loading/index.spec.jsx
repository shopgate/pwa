import React from 'react';
import PropTypes from 'prop-types';
import {
  render,
  waitFor,
} from '@shopgate/pwa-unit-test/rtlUtils';
import { UIEvents } from '@shopgate/pwa-core';
import LoadingContext from './context';
import LoadingProvider from './index';

jest.unmock('@shopgate/pwa-core');

const MOCKED_PATH = 'some/path';
const ANOTHER_PATH = '/some/other/path';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const MockComponent = ({ isLoading, path }) => (isLoading(path) ? <div data-testid="loading-indicator" /> : null);

MockComponent.propTypes = {
  isLoading: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

let latestContext;

const ContextConsumerBridge = ({ path }) => (
  <LoadingContext.Consumer>
    {(props) => {
      latestContext = props;

      return <MockComponent {...props} path={path} />;
    }}
  </LoadingContext.Consumer>
);

ContextConsumerBridge.propTypes = {
  path: PropTypes.string.isRequired,
};

/**
 * @param {string} path A mocked path.
 * @return {Object} RTL render result.
 */
const createWrapper = (path = '/') => {
  latestContext = null;

  return render((
    <LoadingProvider>
      <ContextConsumerBridge path={path} />
    </LoadingProvider>
  ));
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
    const { queryByTestId } = createWrapper();
    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument();
  });

  it('should render the child component when the current path is loading', async () => {
    const { container, getByTestId, queryByTestId } = createWrapper(MOCKED_PATH);

    latestContext.setLoading(MOCKED_PATH);
    await waitFor(() => {
      expect(getByTestId('loading-indicator')).toBeInTheDocument();
    });
    expect(container.firstChild).toMatchSnapshot();

    latestContext.unsetLoading(MOCKED_PATH);
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  it('should provide expected loading API methods in context', () => {
    createWrapper();
    expect(latestContext).toEqual(expect.objectContaining({
      setLoading: expect.any(Function),
      unsetLoading: expect.any(Function),
      isLoading: expect.any(Function),
    }));
  });

  it('should register event listeners within the constructor', () => {
    createWrapper();
    expect(UIEvents.addListener).toHaveBeenCalledTimes(3);
    const addCalls = UIEvents.addListener.mock.calls;
    const getListener = eventName => addCalls.find(([name]) => name === eventName)?.[1];

    expect(UIEvents.addListener)
      .toHaveBeenCalledWith(LoadingProvider.SET, latestContext.setLoading);
    expect(UIEvents.addListener)
      .toHaveBeenCalledWith(LoadingProvider.RESET, expect.any(Function));
    expect(UIEvents.addListener)
      .toHaveBeenCalledWith(LoadingProvider.UNSET, latestContext.unsetLoading);

    expect(getListener(LoadingProvider.SET)).toBe(latestContext.setLoading);
    expect(getListener(LoadingProvider.UNSET)).toBe(latestContext.unsetLoading);
  });

  it('should remove event listeners within componentWillUnmount', () => {
    const { unmount } = createWrapper();
    const addCalls = UIEvents.addListener.mock.calls;
    const listenerByEvent = Object.fromEntries(addCalls.map(([event, fn]) => [event, fn]));

    unmount();

    expect(UIEvents.removeListener).toHaveBeenCalledTimes(3);
    expect(UIEvents.removeListener)
      .toHaveBeenCalledWith(LoadingProvider.SET, listenerByEvent[LoadingProvider.SET]);
    expect(UIEvents.removeListener)
      .toHaveBeenCalledWith(LoadingProvider.RESET, listenerByEvent[LoadingProvider.RESET]);
    expect(UIEvents.removeListener)
      .toHaveBeenCalledWith(LoadingProvider.UNSET, listenerByEvent[LoadingProvider.UNSET]);
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

  describe('.isLoading()', () => {
    it('should work as expected', () => {
      createWrapper();

      expect(latestContext.isLoading(MOCKED_PATH)).toBe(false);
      expect(latestContext.isLoading(ANOTHER_PATH)).toBe(false);

      latestContext.setLoading(MOCKED_PATH);
      expect(latestContext.isLoading(MOCKED_PATH)).toBe(true);
      expect(latestContext.isLoading(ANOTHER_PATH)).toBe(false);

      latestContext.setLoading(ANOTHER_PATH);
      expect(latestContext.isLoading(MOCKED_PATH)).toBe(true);
      expect(latestContext.isLoading(ANOTHER_PATH)).toBe(true);

      latestContext.unsetLoading(MOCKED_PATH);
      latestContext.unsetLoading(MOCKED_PATH);
      latestContext.unsetLoading(ANOTHER_PATH);
      latestContext.unsetLoading(ANOTHER_PATH);
      expect(latestContext.isLoading(MOCKED_PATH)).toBe(false);
      expect(latestContext.isLoading(ANOTHER_PATH)).toBe(false);
    });
  });
});
