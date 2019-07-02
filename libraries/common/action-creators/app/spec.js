import {
  APP_WILL_START,
  APP_DID_START,
  PWA_DID_APPEAR,
  PWA_DID_DISAPPEAR,
  WILL_REGISTER_LINK_EVENTS,
  DID_REGISTER_LINK_EVENTS,
  OPEN_DEEP_LINK,
  OPEN_PUSH_NOTIFICATION,
  OPEN_UNIVERSAL_LINK,
} from '../../constants/ActionTypes';
import {
  appWillStart,
  appDidStart,
  pwaDidAppear,
  pwaDidDisappear,
  willRegisterLinkEvents,
  didRegisterLinkEvents,
  openDeepLink,
  openPushNotification,
  openUniversalLink,
} from './index';

const dataMock = { some: 'data' };

describe('Action Creators: app', () => {
  describe('appWillStart()', () => {
    it('should work as expected', () => {
      const expected = {
        type: APP_WILL_START,
        location: dataMock,
      };
      expect(appWillStart(dataMock)).toEqual(expected);
    });
  });

  describe('appDidStart()', () => {
    it('should work as expected', () => {
      const expected = { type: APP_DID_START };
      expect(appDidStart()).toEqual(expected);
    });
  });

  describe('pwaDidAppear()', () => {
    it('should work as expected', () => {
      const expected = { type: PWA_DID_APPEAR };
      expect(pwaDidAppear()).toEqual(expected);
    });
  });

  describe('pwaDidDisappear()', () => {
    it('should work as expected', () => {
      const expected = { type: PWA_DID_DISAPPEAR };
      expect(pwaDidDisappear()).toEqual(expected);
    });
  });

  describe('willRegisterLinkEvents()', () => {
    it('should work as expected', () => {
      const expected = { type: WILL_REGISTER_LINK_EVENTS };
      expect(willRegisterLinkEvents()).toEqual(expected);
    });
  });

  describe('didRegisterLinkEvents()', () => {
    it('should work as expected', () => {
      const expected = { type: DID_REGISTER_LINK_EVENTS };
      expect(didRegisterLinkEvents()).toEqual(expected);
    });
  });

  describe('openDeepLink()', () => {
    it('should work as expected', () => {
      const expected = {
        type: OPEN_DEEP_LINK,
        payload: dataMock,
      };
      expect(openDeepLink(dataMock)).toEqual(expected);
    });
  });

  describe('openPushNotification()', () => {
    const notificationId = 'abc123';
    const link = '/link/to/somewhere';

    it('should work as expected', () => {
      const expected = {
        type: OPEN_PUSH_NOTIFICATION,
        notificationId,
        link,
      };
      expect(openPushNotification(notificationId, link)).toEqual(expected);
    });

    it('should work as expected when the link is empty', () => {
      const expected = {
        type: OPEN_PUSH_NOTIFICATION,
        notificationId,
        link: '',
      };
      expect(openPushNotification(notificationId)).toEqual(expected);
    });
  });

  describe('openUniversalLink()', () => {
    const expected = {
      type: OPEN_UNIVERSAL_LINK,
      payload: {
        link: 'https://testshop.shopgate.com/item/313131313132',
        wasOpenedFromSearchIndex: true,
        linkSerial: 1003,
      },
    };

    expect(openUniversalLink(expected.payload)).toEqual(expected);
  });
});
