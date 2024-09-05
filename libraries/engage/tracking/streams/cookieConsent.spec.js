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
  cookieConsentInitializedByUserInternal$,
  privacySettingsConfirmedWithoutChangeInternal$,
  cookieConsentUpdated$,
  comfortCookiesAccepted$,
  statisticsCookiesAccepted$,
  comfortCookiesDeclined$,
  statisticsCookiesDeclined$,
} from './cookieConsent';

jest.mock('@shopgate/engage', () => ({
  appConfig: {
    cookieConsent: {
      showComfortCookiesToggle: true,
      isCookieConsentActivated: true,
    },
  },
}));

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
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after updateCookieConsent action was dispatched with different parameters', () => {
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(3);
    });

    it('should emit after handleCookieConsent action was dispatched', () => {
      dispatch(handleCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after handleCookieConsent action was dispatched with different parameters', () => {
      dispatch(handleCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      dispatch(handleCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      dispatch(handleCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
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
        comfortCookiesAccepted: true,
      }));

      dispatch(handleCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe('cookieConsentInitializedByUserInternal$', () => {
    beforeEach(() => {
      subscription = cookieConsentInitializedByUserInternal$.subscribe(subscriber);
    });

    it('should emit when cookie consent was initially handled by user', () => {
      dispatch(updateCookieConsent({}));
      expect(subscriber).toHaveBeenCalledTimes(1);
      dispatch(updateCookieConsent({}));
      expect(subscriber).toHaveBeenCalledTimes(1);
      dispatch(handleCookieConsent({}));
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when cookie consent was initially handled by system', () => {
      dispatch(handleCookieConsent({}));
      expect(subscriber).not.toBeCalled();
      dispatch(handleCookieConsent({}));
      expect(subscriber).not.toBeCalled();
      dispatch(updateCookieConsent({}));
      expect(subscriber).not.toBeCalled();
    });
  });

  describe('privacySettingsConfirmedWithoutChangeInternal$', () => {
    beforeEach(() => {
      subscription = privacySettingsConfirmedWithoutChangeInternal$.subscribe(subscriber);
    });

    it('should only emit when privacy settings where confirmed without change', () => {
      // Initial call - invoked by consent modal or when app started and consent was already given
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();

      // Next call -> settings changed
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).not.toBeCalled();

      // Next call -> settings changed
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).not.toBeCalled();

      // Next call -> nothing changed - should emit
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // Next call -> nothing changed - should emit
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      // Next call -> settings changed
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      // Next call ->  nothing changed - should emit
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(3);
    });
  });

  describe('cookieConsentUpdated$', () => {
    beforeEach(() => {
      subscription = cookieConsentUpdated$.subscribe(subscriber);
    });

    it('should emit when action payload of cookieConsentSet$ stream changes ', () => {
      // Initial call
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();

      // 2nd call -> no change
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();

      // 3rd call -> comfortCookiesAccepted and statisticsCookiesAccepted changed
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // 4rth call -> no change
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // 5rth call -> statisticsCookiesAccepted changed
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      // 6th call -> no change
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });

  describe('comfortCookiesAccepted$', () => {
    beforeEach(() => {
      subscription = comfortCookiesAccepted$.subscribe(subscriber);
    });

    it('should emit after updateCookieConsent was dispatched with accepted comfort cookies', () => {
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after updateCookieConsent was dispatched with declined comfort cookies', () => {
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();
    });

    it('should emit after handleCookieConsent was dispatched with accepted comfort cookies', () => {
      dispatch(handleCookieConsent({
        comfortCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after handleCookieConsent was dispatched with declined comfort cookies', () => {
      dispatch(handleCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();
    });
  });

  describe('statisticsCookiesAccepted$', () => {
    beforeEach(() => {
      subscription = statisticsCookiesAccepted$.subscribe(subscriber);
    });

    it('should emit after updateCookieConsent was dispatched with accepted comfort cookies', () => {
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after updateCookieConsent was dispatched with declined comfort cookies', () => {
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();
    });

    it('should emit after handleCookieConsent was dispatched with accepted comfort cookies', () => {
      dispatch(handleCookieConsent({
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit after handleCookieConsent was dispatched with declined comfort cookies', () => {
      dispatch(handleCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();
    });
  });

  describe('comfortCookiesDeclined$', () => {
    beforeEach(() => {
      subscription = comfortCookiesDeclined$.subscribe(subscriber);
    });

    it('should emit when comfort cookies where accepted and declined afterwards during a session', () => {
      // activate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should only emit when there was an acceptance before the decline', () => {
      // deactivate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();

      // activate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // activate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        comfortCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });

  describe('statisticsCookiesDeclined$', () => {
    beforeEach(() => {
      subscription = statisticsCookiesDeclined$.subscribe(subscriber);
    });

    it('should emit when comfort cookies where accepted and declined afterwards during a session', () => {
      // activate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should only emit when there was an acceptance before the decline', () => {
      // deactivate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).not.toBeCalled();

      // activate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).not.toBeCalled();

      // deactivate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // activate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: true,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      // deactivate
      dispatch(updateCookieConsent({
        statisticsCookiesAccepted: false,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });
});
