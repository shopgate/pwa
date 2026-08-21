import { render } from '@testing-library/react';
import { event } from '@shopgate/engage/core/classes';
import {
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
  APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND,
} from '@shopgate/engage/core/constants';
import {
  useAppEvent,
  useAppEventOnDidEnterBackground,
  useAppEventOnEnterForeground,
  useAppEventOnReturnFromBackground,
} from './appEvents';
import type { AppEventOptions, ReturnFromBackgroundOptions } from './appEvents';

jest.mock('@shopgate/engage/core/classes', () => ({
  event: { addCallback: jest.fn(), removeCallback: jest.fn() },
}));

const mockedAddCallback = event.addCallback as jest.Mock;
const mockedRemoveCallback = event.removeCallback as jest.Mock;

/**
 * Fires every handler currently registered for an event name.
 * @param name The event to fire.
 */
const emit = (name: string) => {
  mockedAddCallback.mock.calls
    .filter(([registered]) => registered === name)
    .filter(([, handler]) => !mockedRemoveCallback.mock.calls
      .some(([, removed]) => removed === handler))
    .forEach(([, handler]) => handler());
};

describe('engage > core > hooks > events > appEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAppEvent', () => {
    // Renders the hook and returns a handle to unmount it again.
    const renderHook = (callback: () => void, options?: AppEventOptions) => {
      const Consumer = () => {
        useAppEvent('someEvent', callback, options);
        return null;
      };

      return render(<Consumer />);
    };

    it('should invoke the callback whenever the event fires', () => {
      const callback = jest.fn();
      renderHook(callback);

      emit('someEvent');
      emit('someEvent');

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should unsubscribe on unmount', () => {
      const { unmount } = renderHook(jest.fn());
      const [[, handler]] = mockedAddCallback.mock.calls;

      unmount();

      expect(mockedRemoveCallback).toHaveBeenCalledWith('someEvent', handler);
    });

    it('should register nothing while it is disabled', () => {
      renderHook(jest.fn(), { enabled: false });

      expect(mockedAddCallback).not.toHaveBeenCalled();
    });

    it('should unsubscribe itself after the first call when once is set', () => {
      const callback = jest.fn();
      renderHook(callback, { once: true });

      emit('someEvent');
      emit('someEvent');

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe.each([
    ['useAppEventOnEnterForeground', useAppEventOnEnterForeground,
      APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND],
    ['useAppEventOnDidEnterBackground', useAppEventOnDidEnterBackground,
      APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND],
  ])('%s', (_, hook, expectedEvent) => {
    it('should subscribe to its app event', () => {
      const callback = jest.fn();

      const Consumer = () => {
        hook(callback);
        return null;
      };
      render(<Consumer />);

      expect(mockedAddCallback).toHaveBeenCalledWith(expectedEvent, expect.any(Function));

      emit(expectedEvent);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('useAppEventOnReturnFromBackground', () => {
    // Renders the hook, which subscribes to both the background and the foreground event.
    const renderHook = (callback: () => void, options?: ReturnFromBackgroundOptions) => {
      const Consumer = () => {
        useAppEventOnReturnFromBackground(callback, options);
        return null;
      };

      return render(<Consumer />);
    };

    it('should fire after a complete background to foreground cycle', () => {
      const callback = jest.fn();
      renderHook(callback);

      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    // Coming to the foreground without having been backgrounded first is not a cycle.
    it('should not fire on a foreground it was never armed for', () => {
      const callback = jest.fn();
      renderHook(callback);

      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should require a new background event before firing again', () => {
      const callback = jest.fn();
      renderHook(callback);

      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).toHaveBeenCalledTimes(1);

      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    // With resetAfterFire off the hook stays armed, so every later foreground fires again.
    it('should stay armed when resetAfterFire is off', () => {
      const callback = jest.fn();
      renderHook(callback, { resetAfterFire: false });

      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should fire only for the first cycle when once is set', () => {
      const callback = jest.fn();
      renderHook(callback, { once: true });

      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);
      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should do nothing while it is disabled', () => {
      const callback = jest.fn();
      renderHook(callback, { enabled: false });

      emit(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND);
      emit(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
