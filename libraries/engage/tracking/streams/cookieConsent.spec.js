import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import cookieSettings from '../reducers/cookieSettings';
import {
  updateCookieConsent,
  handleCookieConsent,
} from '../action-creators';
import {
  cookieConsentSet$,
  cookieConsentInitialized$,
  cookieConsentUpdated$,
  comfortCookiesActivated$,
  statisticsCookiesActivated$,
  comfortCookiesDeactivated$,
  statisticsCookiesDeactivated$,
} from './cookieConsent';

describe('Cookie Consent Streams', () => {
  let subscriber;
  let subscription;
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    ({ dispatch } = createMockStore(combineReducers({ cookieSettings })));
    subscriber = jest.fn();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  describe('cookieConsentSet$', () => {
    beforeEach(() => {
      subscription = cookieConsentSet$.subscribe(subscriber);
    });

    it('should emit after updateCookieConsent action was dispatched', () => {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after updateCookieConsent action was dispatched with different parameters', () => {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(3);
    });

    it('should emit after handleCookieConsent action was dispatched', () => {
      dispatch(handleCookieConsent({
        areComfortCookiesActive: true,
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after handleCookieConsent action was dispatched with different parameters', () => {
      dispatch(handleCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      dispatch(handleCookieConsent({
        areComfortCookiesActive: true,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      dispatch(handleCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(3);
    });
  });

  describe('cookieConsentInitialized$', () => {
    beforeEach(() => {
      subscription = cookieConsentInitialized$.subscribe(subscriber);
    });

    it('should only emit once per session', () => {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
      }));

      dispatch(handleCookieConsent({
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe('cookieConsentUpdated$', () => {
    beforeEach(() => {
      subscription = cookieConsentUpdated$.subscribe(subscriber);
    });

    it('should emit when action payload of cookieConsentSet$ stream changes ', () => {
      // Initial call
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();

      // 2nd call -> no change
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();

      // 3rd call -> areComfortCookiesActive and areStatisticsCookiesActive changed
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // 4rth call -> no change
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // 5rth call -> areStatisticsCookiesActive changed
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      // 6th call -> no change
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });

  describe('comfortCookiesActivated$', () => {
    beforeEach(() => {
      subscription = comfortCookiesActivated$.subscribe(subscriber);
    });

    it('should emit after updateCookieConsent was dispatched with active comfort cookies', () => {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after updateCookieConsent was dispatched with inactive comfort cookies', () => {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();
    });

    it('should emit after handleCookieConsent was dispatched with active comfort cookies', () => {
      dispatch(handleCookieConsent({
        areComfortCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after handleCookieConsent was dispatched with inactive comfort cookies', () => {
      dispatch(handleCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();
    });
  });

  describe('statisticsCookiesActivated$', () => {
    beforeEach(() => {
      subscription = statisticsCookiesActivated$.subscribe(subscriber);
    });

    it('should emit after updateCookieConsent was dispatched with active comfort cookies', () => {
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after updateCookieConsent was dispatched with inactive comfort cookies', () => {
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();
    });

    it('should emit after handleCookieConsent was dispatched with active comfort cookies', () => {
      dispatch(handleCookieConsent({
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after handleCookieConsent was dispatched with inactive comfort cookies', () => {
      dispatch(handleCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();
    });
  });

  describe('comfortCookiesDeactivated$', () => {
    beforeEach(() => {
      subscription = comfortCookiesDeactivated$.subscribe(subscriber);
    });

    it('should emit when comfort cookies where activated and deactivated afterwards during a session', () => {
      // activate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should only emit when there was an activation before the deactivation', () => {
      // deactivate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();

      // activate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // activate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        areComfortCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });

  describe('statisticsCookiesDeactivated$', () => {
    beforeEach(() => {
      subscription = statisticsCookiesDeactivated$.subscribe(subscriber);
    });

    it('should emit when comfort cookies where activated and deactivated afterwards during a session', () => {
      // activate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should only emit when there was an activation before the deactivation', () => {
      // deactivate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).not.toBeCalled();

      // activate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // activate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        areStatisticsCookiesActive: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });
});
