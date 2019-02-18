import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { pwaDidAppear } from '../action-creators';
import { APP_EVENT_VIEW_DID_APPEAR, APP_EVENT_VIEW_DID_DISAPPEAR } from '../constants';
import subscription from './setup';

jest.mock('@shopgate/pwa-core/classes/Event');
jest.mock('@shopgate/pwa-common/streams/app', () => ({
  appWillStart$: jest.fn(),
  appDidStart$: jest.fn(),
}));
jest.mock('@shopgate/pwa-core/commands/registerEvents', () => jest.fn());

describe('setup subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    event.removeAllListeners();
    subscription(subscribe);
  });

  it('should call subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(2);
  });

  describe('appWillStart$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(appWillStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should call the expected commands', () => {
      callback({ dispatch });

      expect(registerEvents).toHaveBeenCalledTimes(1);
      expect(registerEvents).toHaveBeenCalledWith([
        APP_EVENT_VIEW_DID_APPEAR,
        APP_EVENT_VIEW_DID_DISAPPEAR,
      ]);
      expect(event.addCallbackSpy).toHaveBeenCalledTimes(2);
      expect(event.addCallbackSpy).toHaveBeenCalledWith(
        APP_EVENT_VIEW_DID_APPEAR,
        expect.any(Function)
      );
      expect(event.addCallbackSpy).toHaveBeenCalledWith(
        APP_EVENT_VIEW_DID_DISAPPEAR,
        expect.any(Function)
      );
    });

    it('should dispatch pwaDidAppear when the app event is triggered', () => {
      callback({ dispatch });
      event.call(APP_EVENT_VIEW_DID_APPEAR);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(pwaDidAppear());
    });
  });
});
