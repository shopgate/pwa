import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { routeWillEnter } from '@shopgate/pwa-common/action-creators/router';
import cookieSettings from '../reducers/cookieSettings';
import {
  getIsCookieConsentHandled,
} from '../selectors/cookieConsent';
import {
  updateCookieConsent,
  handleCookieConsent,
} from '../action-creators';
import {
  PRIVACY_SETTINGS_PATTERN,
} from '../constants';
import {
  cookieConsentSet$,
  cookieConsentInitialized$,
  cookieConsentUpdated$,
  comfortCookiesAccepted$,
  statisticsCookiesAccepted$,
  comfortCookiesDeclined$,
  statisticsCookiesDeclined$,
  cookieConsentModalShouldToggle$,
} from './cookieConsent';

const MOCKED_PRIVACY_POLICY_PAGE = '/privacy/policy';

jest.mock('@shopgate/engage/page/selectors', () => ({
  makeGetPrivacyPolicyLink: jest.fn(() => () => MOCKED_PRIVACY_POLICY_PAGE),
}));
jest.mock('../selectors/cookieConsent', () => ({
  getIsCookieConsentHandled: jest.fn(() => true),
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

  describe('cookieConsentModalShouldToggle$', () => {
    beforeEach(() => {
      subscription = cookieConsentModalShouldToggle$.subscribe(subscriber);
    });

    /**
     * Creates an object for a subscriber call check.
     * @param {Object} expected Object with relevant properties to be checked
     * @returns {Object}
     */
    const getSubscriberCall = expected => ({
      action: expect.any(Object),
      dispatch: expect.any(Function),
      events: expect.any(Object),
      getState: expect.any(Function),
      prevState: expect.any(Object),
      ...expected,
    });

    it('should emit with "showConsentModal === true" when cookie consent is not handled yet and a random route is opened', () => {
      getIsCookieConsentHandled.mockReturnValueOnce(false);

      dispatch(routeWillEnter({
        pathname: '/some/route',
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(getSubscriberCall({
        showConsentModal: true,
      }));
    });

    it('should emit with "showConsentModal === false" when cookie consent is not handled yet and a whitelisted route is opened', () => {
      getIsCookieConsentHandled.mockReturnValueOnce(false);

      dispatch(routeWillEnter({
        pathname: PRIVACY_SETTINGS_PATTERN,
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenLastCalledWith(getSubscriberCall({
        showConsentModal: false,
      }));

      dispatch(routeWillEnter({
        pathname: MOCKED_PRIVACY_POLICY_PAGE,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenLastCalledWith(getSubscriberCall({
        showConsentModal: false,
      }));
    });

    it('should emit with "showConsentModal === false" when cookie consent is already handled', () => {
      getIsCookieConsentHandled.mockReturnValueOnce(true);

      dispatch(routeWillEnter({
        pathname: '/some/route',
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(getSubscriberCall({
        showConsentModal: false,
      }));

      dispatch(routeWillEnter({
        pathname: PRIVACY_SETTINGS_PATTERN,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledWith(getSubscriberCall({
        showConsentModal: false,
      }));

      dispatch(routeWillEnter({
        pathname: MOCKED_PRIVACY_POLICY_PAGE,
      }));

      expect(subscriber).toHaveBeenCalledTimes(3);
      expect(subscriber).toHaveBeenCalledWith(getSubscriberCall({
        showConsentModal: false,
      }));
    });

    it('should stop emitting after cookie consent is "handled"', () => {
      getIsCookieConsentHandled.mockReturnValueOnce(false);

      dispatch(routeWillEnter({
        pathname: '/some/route',
      }));

      expect(subscriber).toHaveBeenCalledTimes(1);

      dispatch(routeWillEnter({
        pathname: PRIVACY_SETTINGS_PATTERN,
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);

      // Should now stop emitting
      dispatch(handleCookieConsent({}));

      dispatch(routeWillEnter({
        pathname: '/some/route',
      }));

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });
});
